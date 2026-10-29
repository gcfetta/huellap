# HuellApp (Node.js)

Sistema multiagente que cruza publicaciones de mascotas perdidas y encontradas por similitud visual (CLIP), zona y fecha. El sistema sugiere; la persona decide.

## Requisitos
- Node.js 18 o superior (recomendado 20 LTS): https://nodejs.org
- Internet la primera vez (baja el modelo CLIP, ~350 MB, queda en caché)

## Pasos
```bash
npm install
npm run descargar     # baja fotos de prueba a fotos/perdidos (o pongan las suyas)
npm run evaluar       # mide el top-5 y genera demo_encontrado.jpg
npm start             # abre http://localhost:3000
```

## Archivos
- src/datos.js: carga fotos de fotos/perdidos con zona y fecha ficticias (Delfina)
- src/modelo.js: CLIP + embeddings + caché (Candela)
- src/agentes.js: Agente 1 y 3 (Carolina), Agente 2 (Candela)
- src/evaluacion.js: medida O2, top-5 (Candela)
- src/servidor.js: API Express (Carolina)
- public/index.html: interfaz con decisión humana (Carolina)
- scripts/descargar_demo.js: descarga fotos de prueba gratuitas

Si cambian las fotos de fotos/perdidos, borren data/emb_cache.json.
