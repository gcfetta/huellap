import { cargarPerdidos, diasEntre } from './datos.js';
import { embed, coseno, embeddingsPerdidos } from './modelo.js';

export const estado = { perdidos: [], emb: [] };
export const LOG = []; // respuestas "es / no es": dato para la medida P

export async function iniciar() {
  estado.perdidos = cargarPerdidos();
  estado.emb = await embeddingsPerdidos(estado.perdidos);
  console.log(`${estado.perdidos.length} publicaciones de 'perdido' listas`);
}

// ---------- AGENTE 1: Recepción ----------
export function agente1Validar(pub) {
  const faltan = ['img', 'zona', 'fecha', 'tipo'].filter((c) => !pub[c]);
  if (faltan.length) return { estado: 'incompleta', pedir: faltan }; // mensaje 4 [PEDIR]
  return { estado: 'valida' };                                       // mensajes 2 / 5
}

export function agente1Duplicada(embNueva, zona, umbral = 0.97) {
  for (let j = 0; j < estado.perdidos.length; j++) {
    if (estado.perdidos[j].zona === zona && coseno(estado.emb[j], embNueva) >= umbral) {
      return estado.perdidos[j].id;
    }
  }
  return null;
}

// ---------- AGENTE 2: Matching ----------
export async function agente2Match({ img, zona, fecha, k = 5, soloZona = false, dias = 14, simularFalla = false }) {
  const idx = [];
  estado.perdidos.forEach((p, i) => {
    const d = diasEntre(fecha, p.fecha);
    if (d >= 0 && d <= dias && (!soloZona || p.zona === zona)) idx.push(i);
  });
  if (!idx.length) return { candidatas: [], modo: 'completo' };
  try {                                                // mensajes 6 y 7
    if (simularFalla) throw new Error('modelo caído (simulado)');
    const q = await embed(img);
    const candidatas = idx
      .map((i) => ({ p: estado.perdidos[i], puntaje: coseno(estado.emb[i], q) }))
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, k);
    return { candidatas, modo: 'completo' };
  } catch (e) {                                        // F2.1: modo reducido
    return { candidatas: idx.slice(0, k).map((i) => ({ p: estado.perdidos[i], puntaje: null })), modo: 'reducido' };
  }
}

// ---------- AGENTE 3: Notificación ----------
export function agente3Aviso(c) {
  const s = c.puntaje !== null
    ? ` (similitud ${c.puntaje.toFixed(2)})`
    : ' (sin puntaje: búsqueda limitada)';
  return `Posible coincidencia ${c.p.id} en ${c.p.zona}${s}. ¿Es tu mascota?`;
}

export function agente3Respuesta(id, decision) {
  LOG.push({ id, decision, ts: new Date().toISOString() }); // mensaje 10
  if (decision === 'Es mi mascota') {
    return '✅ Registrado. Se le propone al rescatista abrir un chat interno (★12). El sistema no confirma nada solo.';
  }
  return '❌ Descartada. Se propone la siguiente candidata del ranking.';
}
