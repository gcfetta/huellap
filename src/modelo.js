import fs from 'node:fs';
import path from 'node:path';
import { AutoProcessor, CLIPVisionModelWithProjection, RawImage } from '@huggingface/transformers';

const MODELO = 'Xenova/clip-vit-base-patch32';
const CACHE = path.resolve('data', 'emb_cache.json');
let processor, model;

async function cargar() {
  if (!model) {
    console.log('Cargando modelo CLIP (la primera vez se descarga)...');
    processor = await AutoProcessor.from_pretrained(MODELO);
    model = await CLIPVisionModelWithProjection.from_pretrained(MODELO);
  }
}

// entrada: ruta (string) o Buffer. Devuelve vector normalizado (Float32Array)
export async function embed(entrada) {
  await cargar();
  const img = typeof entrada === 'string'
    ? await RawImage.read(entrada)
    : await RawImage.fromBlob(new Blob([entrada]));
  const inputs = await processor(img);
  const { image_embeds } = await model(inputs);
  const v = Float32Array.from(image_embeds.data);
  let n = 0;
  for (const x of v) n += x * x;
  n = Math.sqrt(n) || 1;
  return v.map((x) => x / n);
}

// Como los vectores están normalizados, el producto punto es la similitud coseno
export function coseno(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export async function embeddingsPerdidos(perdidos) {
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  let nuevos = 0;
  const salida = [];
  for (const p of perdidos) {
    if (!cache[p.archivo]) {
      cache[p.archivo] = Array.from(await embed(p.ruta));
      if (++nuevos % 10 === 0) console.log(`  embeddings: ${nuevos} nuevos...`);
    }
    salida.push(Float32Array.from(cache[p.archivo]));
  }
  if (nuevos) fs.writeFileSync(CACHE, JSON.stringify(cache));
  return salida;
}
