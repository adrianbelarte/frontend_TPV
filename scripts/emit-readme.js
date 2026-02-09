// Crea/actualiza frontend/build/README_Cliente.txt con el contenido para el cliente
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, "..", "build");
const outFile = path.join(outDir, "README_Cliente.txt");

const content = `README - TPV Grupo Manhattan

INSTALACIÓN
1) Ejecute el instalador: "TPV Grupo Manhattan Setup.exe".
2) Si Windows muestra advertencia, pulse "Más información" → "Ejecutar de todas formas".
3) Siga el asistente (puede elegir carpeta e instalar accesos directos).

PRIMERA CONFIGURACIÓN
1) Permita el acceso en el Firewall cuando Windows lo pida (redes privadas).
2) En "Administración → Empresa", complete: Nombre, Dirección, Teléfono, Correo, CIF y si desea suba el LOGO.
3) En "Administración → Impresora", configure IP (ej: 192.168.1.150) y puerto (9100). Guarde.

PRUEBA DE IMPRESIÓN
1) En "Administración → Impresora", use "Imprimir ticket de prueba".
2) Si no imprime:
   - Verifique que la impresora está encendida y en la misma red.
   - Haga ping a la IP: ping 192.168.1.150
   - Revise puerto 9100 y el cable/red.

NOTAS TÉCNICAS
- La app inicia automáticamente un backend local (base de datos SQLite).
- Compatibilidad con impresoras térmicas ESC/POS de red.
- Si no hay impresora, puede habilitarse modo simulación.

SOLUCIÓN DE PROBLEMAS
- Pantalla en blanco: cierre y reabra la app.
- No imprime: verifique IP/puerto y que la impresora responda por red.
- Logo no aparece: vuelva a subirlo en "Empresa".
- Timeout impresora: verifique red, IP y puerto 9100.

SOPORTE
Email: adrian.belarte.it@gmail.com
Teléfono: 644551501
Horario: L-V 9:00–18:00
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, content, "utf8");
console.log("[emit-readme] README_Cliente.txt generado en:", outFile);
