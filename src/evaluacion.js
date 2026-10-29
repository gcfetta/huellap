import fs from 'node:fs';
import sharp from 'sharp';
import { cargarPerdidos } from './datos.js';
import { embed, coseno, embeddingsPerdidos } from './modelo.js';

const rnd = (a, b) => a + Math.random() * (b - a);

// Simula "otra foto del mismo animal": recorte, rotación y cambio de color
async function aumentar(ruta) {
  const { width: w, height: h } = await sharp(ruta).rotate().metadata();
  const f = Math.sqrt(rnd(0.5, 0.9));
  const cw = Math.round(w * f), ch = Math.round(h * f);
  const recorte = await sharp(ruta).rotate()
    .extract({ left: Math.floor(Math.random() * (w - cw + 1)), top: Math.floor(Math.random() * (h - ch + 1)), width: cw, height: ch })
    .toBuffer();
  return sharp(recorte)
    .rotate(rnd(-15, 15), { background: '#000' })
    .modulate({ brightness: rnd(0.6, 1.4), saturation: rnd(0.6, 1.4) })
    .jpeg().toBuffer();
}

const perdidos = cargarPerdidos();
const emb = await embeddingsPerdidos(perdidos);
let aciertos = 0;
for (let i = 0; i < perdidos.length; i++) {
  const buf = await aumentar(perdidos[i].ruta);
  if (i === 0) fs.writeFileSync('demo_encontrado.jpg', buf);
  const q = await embed(buf);
  const top5 = emb.map((e, j) => ({ j, s: coseno(e, q) }))
    .sort((a, b) => b.s - a.s).slice(0, 5).map((x) => x.j);
  if (top5.includes(i)) aciertos++;
}
console.log(`Top-5 correcto: ${aciertos}/${perdidos.length} = ${Math.round((100 * aciertos) / perdidos.length)}%`);
console.log('demo_encontrado.jpg corresponde a:', perdidos[0].id);
