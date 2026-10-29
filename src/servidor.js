import express from 'express';
import multer from 'multer';
import { DIR_FOTOS, ZONAS, HOY, fechaValida } from './datos.js';
import { iniciar, agente1Validar, agente2Match, agente3Aviso, agente3Respuesta } from './agentes.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.use(express.json());
app.use('/fotos', express.static(DIR_FOTOS));
app.use(express.static('public'));

app.get('/api/config', (_req, res) => res.json({ zonas: ZONAS, hoy: HOY }));

app.post('/api/buscar', upload.single('foto'), async (req, res) => {
  const { zona, fecha, simularFalla } = req.body;
  const v = agente1Validar({ img: req.file?.buffer, zona, fecha, tipo: 'encontrado' });
  if (v.estado !== 'valida') return res.json({ error: `Faltan datos: ${v.pedir.join(', ')}` });
  if (!fechaValida(fecha)) return res.json({ error: 'Fecha inválida (usá AAAA-MM-DD).' });

  const { candidatas, modo } = await agente2Match({
    img: req.file.buffer, zona, fecha, simularFalla: simularFalla === 'true',
  });
  res.json({
    modo,
    aviso: candidatas.length ? agente3Aviso(candidatas[0]) : 'Sin candidatas en ese rango de fechas.',
    candidatas: candidatas.map((c) => ({
      id: c.p.id, zona: c.p.zona, fecha: c.p.fecha,
      puntaje: c.puntaje, foto: `/fotos/${encodeURIComponent(c.p.archivo)}`,
    })),
  });
});

app.post('/api/decidir', (req, res) => {
  const { id, decision } = req.body;
  if (!['Es mi mascota', 'No es'].includes(decision)) return res.status(400).json({ error: 'Decisión inválida' });
  res.json({ mensaje: agente3Respuesta(id, decision) });
});

await iniciar();
app.listen(3000, () => console.log('HuellApp lista en http://localhost:3000'));
