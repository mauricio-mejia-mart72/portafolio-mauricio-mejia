// Genera js/galeria.js escaneando las carpetas img/<categoria>/.
// Uso:  node scripts/build-galeria.mjs
// Cada vez que agregues fotos a las carpetas, corre esto y listo.

import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const imgDir = join(root, "img");

// Metadatos de cada categoría (orden = orden en la página).
const META = [
  { id: "retrato", titulo: "Retrato", desc: "Seres y miradas: el gesto, la piel y el instante." },
  { id: "calle",   titulo: "Calle",   desc: "Vida cotidiana, mercados y ciudad en movimiento." },
  { id: "paisaje", titulo: "Paisaje", desc: "Horizontes, niebla y luz sobre la montaña." },
];

// Fotos con título propio (pie visible). Clave = nombre de archivo.
const CAPTIONS = {
  "retrato-01.jpg": "Centinela en Jaula",
  "calle-01.jpg": "Observadora en Silencio",
};

const cats = META.map((m) => {
  const files = readdirSync(join(imgDir, m.id))
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort();
  const fotos = files.map((f) => {
    const foto = {
      src: `img/${m.id}/${f}`,
      alt: CAPTIONS[f] || `Fotografía de ${m.titulo.toLowerCase()} — Mauricio Mejía`,
    };
    if (CAPTIONS[f]) foto.titulo = CAPTIONS[f];
    return foto;
  });
  return { id: m.id, titulo: m.titulo, desc: m.desc, fotos };
});

const out =
  "// Archivo generado por scripts/build-galeria.mjs — no editar a mano.\n" +
  "window.GALERIAS = " +
  JSON.stringify(cats, null, 2) +
  ";\n";

writeFileSync(join(root, "js", "galeria.js"), out);
console.log("js/galeria.js generado:");
console.log(cats.map((c) => `  ${c.titulo}: ${c.fotos.length} fotos`).join("\n"));
