// Startup file for cPanel "Setup Node.js App" (Phusion Passenger) on ahost.
// The Next.js standalone build lives in ./site — kept out of the application
// root because the cPanel Node.js selector reserves a root-level
// `node_modules` for its own virtual environment.
//
// Passenger intercepts listen(), so PORT/HOSTNAME only matter when running
// `node app.js` by hand. HOSTNAME is reset because shared hosts set it to the
// machine name, which Next.js would otherwise try to bind to.
process.env.NODE_ENV = "production";
process.env.HOSTNAME = "0.0.0.0";

require("./site/server.js");
