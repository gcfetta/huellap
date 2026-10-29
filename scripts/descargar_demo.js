// Baja fotos de prueba gratuitas (dog.ceo y thecatapi) a fotos/perdidos
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('fotos', 'perdidos');
fs.mkdirSync(DIR, { recursive: true });

async function urlsPerros(n) {
  const set = new Set();
  while (set.size < n) {
    const r = await (await fetch('https://dog.ceo/api/breeds/image/random/50')).json();
    r.message.forEach((u) => set.add(u));
  }
  return [...set].slice(0, n);
}

async function urlsGatos(n) {
  const set = new Set();
  try {
    for (let i = 0; i < 6 && set.size < n; i++) {
      const r = await (await fetch('https://api.thecatapi.com/v1/images/search?limit=10')).json();
      r.forEach((x) => set.add(x.url));
    }
  } catch { console.log('No se pudieron bajar gatos; se sigue solo con perros.'); }
  return [...set].slice(0, n);
}

async function bajar(urls, prefijo) {
  let ok = 0;
  for (let i = 0; i < urls.length; i += 10) {
    await Promise.all(urls.slice(i, i + 10).map(async (u, k) => {
      try {
        const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
        const ext = path.extname(new URL(u).pathname) || '.jpg';
        fs.writeFileSync(path.join(DIR, `${prefijo}_${String(i + k).padStart(3, '0')}${ext}`), buf);
        ok++;
      } catch { /* se omite la foto que falle */ }
    }));
    console.log(`${prefijo}: ${Math.min(i + 10, urls.length)}/${urls.length}`);
  }
  return ok;
}

const perros = await bajar(await urlsPerros(110), 'perro');
const gatos = await bajar(await urlsGatos(40), 'gato');
console.log(`Listo: ${perros} perros y ${gatos} gatos en fotos/perdidos`);
