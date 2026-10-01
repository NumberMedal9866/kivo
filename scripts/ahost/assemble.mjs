// Packages a standalone Next.js build (BUILD_STANDALONE=1 pnpm build) into
// the folder uploaded to the ahost application root:
//
//   deploy/
//     app.js            Passenger startup file
//     site/             .next/standalone + public + .next/static
//     tmp/restart.txt   new content every deploy → Passenger restarts the app
//
// Symlinks are dereferenced: FTP can't transfer them.
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
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

const stamp = `${process.env.GITHUB_SHA ?? "local"} ${new Date().toISOString()}\n`;
writeFileSync(join(out, "tmp", "restart.txt"), stamp);

console.log(`Assembled ${out} (${stamp.trim()})`);
