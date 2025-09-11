import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.resolve(__dirname, "../dist_electron/win-unpacked/resources");

// rutas esperadas
const frontendIndex = path.join(basePath, "app", "dist", "index.html");
const frontendAssets = path.join(basePath, "app", "dist", "assets");
const backendEntry = path.join(basePath, "backend", "app.js");

console.log("🔎 Verificando build en:", basePath);

let ok = true;

// revisar frontend
if (fs.existsSync(frontendIndex)) {
  console.log("✅ Frontend index.html encontrado:", frontendIndex);
} else {
  console.error("❌ Frontend NO encontrado. Falta:", frontendIndex);
  ok = false;
}

if (fs.existsSync(frontendAssets)) {
  console.log("✅ Carpeta assets encontrada:", frontendAssets);
} else {
  console.error("❌ Carpeta assets NO encontrada:", frontendAssets);
  ok = false;
}

// revisar backend
if (fs.existsSync(backendEntry)) {
  console.log("✅ Backend encontrado:", backendEntry);
} else {
  console.error("❌ Backend NO encontrado. Falta:", backendEntry);
  ok = false;
}

if (!ok) {
  console.error("\n⚠️ Build incompleto. Revisa tu configuración en package.json (files/extraResources).");
  process.exit(1);
} else {
  console.log("\n🎉 Build verificado correctamente. Todo en su sitio.");
}
