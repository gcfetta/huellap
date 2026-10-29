import fs from 'node:fs';
import path from 'node:path';

export const ZONAS = ['Capital', 'Godoy Cruz', 'Guaymallén', 'Las Heras', 'Maipú', 'Luján'];
export const HOY = '2026-10-28';
export const DIR_FOTOS = path.resolve('fotos', 'perdidos');

// Generador pseudoaleatorio con semilla (resultados repetibles)
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function sumarDias(fechaISO, dias) {
  const d = new Date(Date.parse(fechaISO) + dias * 86400000);
  return d.toISOString().slice(0, 10);
}

export function diasEntre(a, b) {
  return Math.round((Date.parse(a) - Date.parse(b)) / 86400000);
}

export function fechaValida(txt) {
  return /^\d{4}-\d{2}-\d{2}$/.test(txt || '') && !Number.isNaN(Date.parse(txt));
}

export function cargarPerdidos() {
  if (!fs.existsSync(DIR_FOTOS)) fs.mkdirSync(DIR_FOTOS, { recursive: true });
  const archivos = fs.readdirSync(DIR_FOTOS)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  if (archivos.length === 0) {
    throw new Error('No hay fotos en fotos/perdidos. Ejecutá "npm run descargar" o copiá tus fotos ahí.');
  }
  const rand = mulberry32(7);
  return archivos.map((archivo, i) => ({
    id: `P${String(i).padStart(3, '0')}`,
    archivo,
    ruta: path.join(DIR_FOTOS, archivo),
    tipo: 'perdido',
    zona: ZONAS[Math.floor(rand() * ZONAS.length)],
    fecha: sumarDias(HOY, -(1 + Math.floor(rand() * 10))),
  }));
}
