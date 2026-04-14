# Radiografía del Negocio del Conocimiento
## Academia EmprendeSer™ · Anita Paniagua

---

## Cómo desplegar en Netlify

### Paso 1 — Subir el proyecto a GitHub

1. Ve a github.com y crea una cuenta si no tienes
2. Crea un repositorio nuevo (llámalo `radiografia-emprendeser`)
3. Sube todos estos archivos al repositorio

### Paso 2 — Conectar con Netlify

1. Ve a netlify.com y crea una cuenta (gratis)
2. Click en **"Add new site" → "Import an existing project"**
3. Conecta tu GitHub y selecciona el repositorio `radiografia-emprendeser`
4. Los ajustes de build ya están configurados en `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **"Deploy site"**

### Paso 3 — Agregar tu API key de Anthropic (⚠️ CRÍTICO)

1. En Netlify, ve a tu sitio → **Site configuration → Environment variables**
2. Click **"Add a variable"**
3. Agrega:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** tu API key de Anthropic (la encuentras en console.anthropic.com)
4. Click **"Save"**
5. Ve a **Deploys → Trigger deploy** para que tome efecto

### Paso 4 — Dominio personalizado (opcional)

En Netlify puedes conectar tu propio dominio desde:
**Site configuration → Domain management → Add custom domain**

---

## Cómo conseguir tu API key de Anthropic

1. Ve a **console.anthropic.com**
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys → Create Key**
4. Copia la key y agrégala en Netlify como se indica arriba

El costo aproximado es **$0.003 por diagnóstico** (muy bajo).
Puedes establecer límites de gasto en el dashboard de Anthropic.

---

## Estructura del proyecto

```
radiografia/
├── netlify/
│   └── functions/
│       └── diagnostico.js    ← Función serverless (proxy seguro al API)
├── src/
│   ├── App.jsx               ← Aplicación React principal
│   └── main.jsx              ← Entry point
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml              ← Configuración de Netlify
```

---

© Anita Paniagua · Academia EmprendeSer™
