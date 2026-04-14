exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { respuestas } = JSON.parse(event.body);

    const prompt = `Eres Anita Paniagua, mentora estratégica de negocios basados en conocimiento con más de 20 años de experiencia. Tu metodología EmprendeSer™ ayuda a profesionales a convertir su experiencia en modelos de negocio con dirección, impacto y legado.

Una persona acaba de responder 5 preguntas estratégicas. Basándote en sus respuestas, genera una "Radiografía de su Negocio del Conocimiento" personalizada, profunda y estratégica.

RESPUESTAS DE LA PERSONA:
1. Profesión/Expertise: ${respuestas[0]}
2. Problema que resuelve: ${respuestas[1]}
3. Resultados concretos: ${respuestas[2]}
4. Productos/servicios actuales: ${respuestas[3]}
5. Mayor obstáculo: ${respuestas[4]}

Genera el diagnóstico en formato JSON con exactamente esta estructura (sin markdown, solo JSON puro):
{
  "titular": "Una frase poderosa y personalizada que resume su mayor activo (máximo 12 palabras)",
  "activo": {
    "titulo": "Tu activo de conocimiento más valioso",
    "descripcion": "2-3 oraciones específicas sobre cuál es su conocimiento más valioso y por qué. Sé concreta y directa."
  },
  "oportunidad": {
    "titulo": "La oportunidad que estás dejando sobre la mesa",
    "descripcion": "2-3 oraciones sobre la oportunidad específica que tiene esta persona basándote en su expertise y situación actual."
  },
  "producto": {
    "titulo": "El producto o servicio que mejor se alinea contigo",
    "descripcion": "2-3 oraciones recomendando el tipo de producto o servicio concreto que debería crear o desarrollar primero."
  },
  "siguiente": {
    "titulo": "Tu siguiente paso más claro",
    "descripcion": "2-3 oraciones con una acción específica y concreta que puede tomar ahora mismo para avanzar."
  },
  "reflexion": "Una frase final poderosa, personalizada y motivadora que conecte con su situación específica. Máximo 2 oraciones. Que suene a Anita: estratégica, cálida, firme, sin hype."
}

IMPORTANTE: Escribe en segunda persona (tú/tu). Sé específica con lo que la persona compartió — no genérica. Tono estratégico, cálido, maduro. Sin clichés ni hype. Devuelve SOLO el JSON, sin texto adicional.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor" }),
    };
  }
};
