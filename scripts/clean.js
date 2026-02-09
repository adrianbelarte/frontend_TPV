import fs from "node:fs/promises";
import { constants as fsConst } from "node:fs";

async function rmSafe(p) {
  try {
    await fs.rm(p, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch (e) {
    // último intento: verifica acceso y fuerza
    try { await fs.access(p, fsConst.F_OK); } catch { return; }
    throw e;
  }
}

const targets = ["dist", "dist_electron", "build"];
for (const t of targets) {
  await rmSafe(t).catch(err => {
    console.warn(`[clean] no se pudo borrar ${t}: ${err.message}`);
  });
}
console.log("[clean] ok");
