import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("index.html", "dist/index.html");
await cp("styles.css", "dist/styles.css");
await mkdir("dist/src", { recursive: true });
await cp("src/main.js", "dist/src/main.js");
await cp("src/roadmap.js", "dist/src/roadmap.js");
console.log("Aplicação pronta em dist/");
