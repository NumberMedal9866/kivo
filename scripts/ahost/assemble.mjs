// Packages a standalone Next.js build (BUILD_STANDALONE=1 pnpm build) into
// the folder uploaded to the ahost application root:
//
//   deploy/
//     app.js            Passenger startup file
//     site/             .next/standalone + public + .next/static
//     tmp/restart.txt   new content every deploy → Passenger restarts the app
//
// Symlinks are dereferenced: FTP can't transfer them.
//
// Every file under site/ gets a modification time derived from its content
// hash. The uploader (lftp mirror) skips files whose size and time match the
// server copy, so unchanged files aren't re-sent on each deploy; a fresh
// build would otherwise give every file a new timestamp.
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "deploy");
const standalone = join(root, ".next", "standalone");

if (!existsSync(join(standalone, "server.js"))) {
  console.error("No standalone build found — run `BUILD_STANDALONE=1 pnpm build` first.");
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "tmp"), { recursive: true });

const copy = (from, to) => cpSync(from, to, { recursive: true, dereference: true });
copy(standalone, join(out, "site"));
copy(join(root, "public"), join(out, "site", "public"));
copy(join(root, ".next", "static"), join(out, "site", ".next", "static"));
copy(join(root, "scripts", "ahost", "app.js"), join(out, "app.js"));

const EPOCH = Date.UTC(2020, 0, 1) / 1000;
let stamped = 0;
for (const entry of readdirSync(join(out, "site"), { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const file = join(entry.parentPath, entry.name);
  const hash = createHash("sha1").update(readFileSync(file)).digest();
  const t = EPOCH + hash.readUIntBE(0, 3); // within ~194 days of the epoch
  utimesSync(file, t, t);
  stamped++;
}

const stamp = `${process.env.GITHUB_SHA ?? "local"} ${new Date().toISOString()}\n`;
writeFileSync(join(out, "tmp", "restart.txt"), stamp);

console.log(`Assembled ${out}: ${stamped} files content-stamped (${stamp.trim()})`);
