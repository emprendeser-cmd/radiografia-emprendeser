import { useState } from "react";

const preguntas = [
  {
    id: 1,
    numero: "01",
    pregunta: "¿Cuál es tu profesión o área de expertise principal?",
    placeholder: "Ej: Soy coach de liderazgo, consultora financiera, nutricionista, abogada...",
    ayuda: "No importa si tienes varios roles — cuéntame el que más define tu trabajo.",
  },
  {
    id: 2,
    numero: "02",
    pregunta: "¿Qué problema específico resuelves para las personas con las que trabajas?",
    placeholder: "Ej: Ayudo a mujeres emprendedoras a salir de deudas sin sacrificar su calidad de vida...",
    ayuda: "Piensa en la transformación que produces — ¿qué cambia en la vida de alguien después de trabajar contigo?",
  },
  {
    id: 3,
    numero: "03",
    pregunta: "¿Qué resultados concretos has logrado — ya sea en tu propio negocio o con tus clientes?",
    placeholder: "Ej: Ayudé a 3 clientes a duplicar sus ingresos. Publiqué un libro. Desarrollé una metodología...",
    ayuda: "Resultados, logros, casos de éxito — cualquier evidencia de que tu conocimiento funciona.",
  },
  {
    id: 4,
    numero: "04",
    pregunta: "¿Tienes algún producto, servicio o contenido ya creado? (libro, curso, taller, consultoría, podcast...)",
    placeholder: "Ej: Tengo un libro publicado y doy consultoría 1:1. O todavía no tengo nada estructurado...",
    ayuda: "Si aún no tienes nada, también está bien — esa información me ayuda a orientarte mejor.",
  },
  {
    id: 5,
    numero: "05",
    pregunta: "¿Cuál es tu mayor obstáculo para convertir tu conocimiento en un negocio sostenible?",
    placeholder: "Ej: No sé por dónde empezar. No tengo tiempo. No sé cómo mercadearme. Me falta claridad...",
    ayuda: "Sé honesta — cuanto más específica seas, más útil será tu diagnóstico.",
  },
];

const COLORS = {
  teal: "#0F6E56",
  tealMid: "#1D9E75",
  tealLight: "#E1F5EE",
  amber: "#BA7517",
  amberLight: "#FAEEDA",
  text: "#1C1C1A",
  textMuted: "#5F5E5A",
  bg: "#FAFAF8",
  border: "rgba(44,44,42,0.10)",
  white: "#FFFFFF",
};

export default function RadiografiaApp() {
  const [paso, setPaso] = useState("bienvenida");
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState(Array(5).fill(""));
  const [diagnostico, setDiagnostico] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState(null);

  const handleRespuesta = (valor) => {
    const nuevas = [...respuestas];
    nuevas[indice] = valor;
    setRespuestas(nuevas);
  };

  const siguiente = () => {
    if (indice < preguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      generarDiagnostico();
    }
  };

  const anterior = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  const generarDiagnostico = async () => {
    setPaso("cargando");
    setError(null);

    try {
      const response = await fetch("/.netlify/functions/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas }),
      });

      const data = await response.json();
      const texto = data.content.map((i) => i.text || "").join("");
      const clean = texto.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setDiagnostico(parsed);
      setPaso("resultado");

      try {
        await fetch(
          "https://script.google.com/macros/s/AKfycbwEQmd4AtLUpIm5OYFYFFTVZk3Xtwg8CqrLMHt_-57jojxu4nUjHaW45sSIf_v6KGQe0A/exec",
          {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              r1: respuestas[0],
              r2: respuestas[1],
              r3: respuestas[2],
              r4: respuestas[3],
              r5: respuestas[4],
              titular: parsed.titular,
              activo: parsed.activo?.descripcion,
              oportunidad: parsed.oportunidad?.descripcion,
              producto: parsed.producto?.descripcion,
              siguiente: parsed.siguiente?.descripcion,
              reflexion: parsed.reflexion,
            }),
          }
        );
      } catch (sheetErr) {
        console.log("Sheet error (no crítico):", sheetErr);
      }
    } catch (err) {
      setError("Hubo un problema al generar tu diagnóstico. Por favor intenta de nuevo.");
      setPaso("preguntas");
    }
  };

  const enviarEmail = async () => {
    if (!email.trim() || !email.includes("@")) {
      setErrorEmail("Por favor escribe un email válido.");
      return;
    }
    setEnviandoEmail(true);
    setErrorEmail(null);
    try {
      const response = await fetch("/.netlify/functions/enviar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, diagnostico }),
      });
      if (!response.ok) throw new Error("Error al enviar");
      setEmailEnviado(true);
    } catch (err) {
      setErrorEmail("Hubo un problema al enviar. Por favor intenta de nuevo.");
    } finally {
      setEnviandoEmail(false);
    }
  };

  const progreso = ((indice + 1) / preguntas.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, #F0F7F4 100%)`,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      {paso === "bienvenida" && (
        <div
          style={{
            maxWidth: 560,
            width: "100%",
            background: COLORS.white,
            borderRadius: 20,
            padding: "48px 40px",
            boxShadow: "0 8px 40px rgba(15,110,86,0.10)",
            border: `1px solid ${COLORS.border}`,
            textAlign: "center",
          }}
        >
          <div style={{ width: 64, height: 64, background: COLORS.tealLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28 }}>🌿</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, lineHeight: 1.3, marginBottom: 16 }}>Radiografía de tu<br />Negocio del Conocimiento</h1>
          <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 12, fontFamily: "'Arial', sans-serif", fontWeight: 300 }}>En 5 preguntas estratégicas, descubrirás cuál es tu mayor activo de conocimiento y cuál es tu siguiente paso más claro para convertirlo en un negocio sostenible.</p>
          <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 32, fontFamily: "'Arial', sans-serif", fontStyle: "italic" }}>No es un quiz genérico. Es un diagnóstico personalizado creado con inteligencia artificial — diseñado para que llegues a la masterclass con claridad, no con confusión.</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
            {["5 preguntas", "~5 minutos", "Diagnóstico personalizado"].map((tag) => (
              <span key={tag} style={{ background: COLORS.tealLight, color: COLORS.teal, fontSize: 12, fontFamily: "'Arial', sans-serif", fontWeight: 500, padding: "4px 12px", borderRadius: 20 }}>{tag}</span>
            ))}
          </div>
          <button onClick={() => setPaso("preguntas")} style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 10, padding: "16px 40px", fontSize: 15, fontFamily: "'Arial', sans-serif", fontWeight: 600, cursor: "pointer", width: "100%", letterSpacing: "0.02em" }}>Comenzar mi diagnóstico →</button>
          <p style={{ marginTop: 20, fontSize: 11, color: COLORS.textMuted, fontFamily: "'Arial', sans-serif" }}>© Anita Paniagua · Academia EmprendeSer™ · Tus respuestas se usan únicamente para generar tu diagnóstico.</p>
        </div>
      )}

      {paso === "preguntas" && (
        <div style={{ maxWidth: 600, width: "100%" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontFamily: "'Arial', sans-serif", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: COLORS.teal, margin: 0 }}>Pregunta {indice + 1} de {preguntas.length}</p>
              <p style={{ fontSize: 11, fontFamily: "'Arial', sans-serif", color: COLORS.textMuted, margin: 0 }}>{Math.round(progreso)}% completado</p>
            </div>
            <div style={{ height: 4, background: COLORS.tealLight, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progreso}%`, background: COLORS.teal, borderRadius: 4, transition: "width 0.4s ease" }} />
            </div>
          </div>
          <div style={{ background: COLORS.white, borderRadius: 20, padding: "36px 40px 28px", boxShadow: "0 8px 40px rgba(15,110,86,0.08)", border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: 48, fontWeight: 700, color: COLORS.tealLight, margin: "0 0 8px", lineHeight: 1 }}>{preguntas[indice].numero}</p>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: COLORS.text, lineHeight: 1.4, marginBottom: 10 }}>{preguntas[indice].pregunta}</h2>
            <p style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: "'Arial', sans-serif", fontStyle: "italic", marginBottom: 20, lineHeight: 1.5 }}>{preguntas[indice].ayuda}</p>
            <textarea value={respuestas[indice]} onChange={(e) => handleRespuesta(e.target.value)} placeholder={preguntas[indice].placeholder} rows={4} style={{ width: "100%", padding: "14px 16px", fontSize: 14, fontFamily: "'Arial', sans-serif", color: COLORS.text, background: COLORS.bg, border: `1.5px solid ${respuestas[indice] ? COLORS.teal : COLORS.border}`, borderRadius: 10, outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
            {error && <p style={{ color: "#C0392B", fontSize: 13, fontFamily: "'Arial', sans-serif", marginTop: 12 }}>{error}</p>}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {indice > 0 && <button onClick={anterior} style={{ flex: 1, background: "transparent", color: COLORS.textMuted, border: `1.5px solid ${COLORS.border}`, borderRadius: 10, padding: "14px", fontSize: 14, fontFamily: "'Arial', sans-serif", fontWeight: 500, cursor: "pointer" }}>← Anterior</button>}
              <button onClick={siguiente} disabled={!respuestas[indice].trim()} style={{ flex: 2, background: respuestas[indice].trim() ? COLORS.teal : COLORS.border, color: respuestas[indice].trim() ? COLORS.white : COLORS.textMuted, border: "none", borderRadius: 10, padding: "14px", fontSize: 14, fontFamily: "'Arial', sans-serif", fontWeight: 600, cursor: respuestas[indice].trim() ? "pointer" : "not-allowed", letterSpacing: "0.02em" }}>{indice === preguntas.length - 1 ? "Generar mi diagnóstico ✨" : "Siguiente →"}</button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {preguntas.map((_, i) => (<div key={i} style={{ width: i === indice ? 24 : 8, height: 8, borderRadius: 4, background: i <= indice ? COLORS.teal : COLORS.border, transition: "all 0.3s ease" }} />))}
          </div>
        </div>
      )}

      {paso === "cargando" && (
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, background: COLORS.tealLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 36 }}>🌿</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Analizando tu perfil...</h2>
          <p style={{ fontSize: 14, color: COLORS.textMuted, fontFamily: "'Arial', sans-serif", lineHeight: 1.7, maxWidth: 360, margin: "0 auto 28px" }}>Estamos generando tu diagnóstico estratégico personalizado. Esto tomará solo un momento.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {[0, 1, 2].map((i) => (<div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.teal, opacity: 0.6 }} />))}
          </div>
        </div>
      )}

      {paso === "resultado" && diagnostico && (
        <div style={{ maxWidth: 640, width: "100%" }}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealMid} 100%)`, borderRadius: "20px 20px 0 0", padding: "32px 40px", textAlign: "center" }}>
            <p style={{ fontSize: 11, fontFamily: "'Arial', sans-serif", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>Tu diagnóstico personalizado</p>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.white, lineHeight: 1.4, margin: 0 }}>"{diagnostico.titular}"</h1>
          </div>

          <div style={{ background: COLORS.white, borderRadius: "0 0 20px 20px", overflow: "hidden", boxShadow: "0 8px 40px rgba(15,110,86,0.10)" }}>
            {[
              { key: "activo", emoji: "💎", color: COLORS.teal, bg: COLORS.tealLight },
              { key: "oportunidad", emoji: "🚪", color: COLORS.amber, bg: COLORS.amberLight },
              { key: "producto", emoji: "📦", color: COLORS.teal, bg: COLORS.tealLight },
              { key: "siguiente", emoji: "→", color: COLORS.amber, bg: COLORS.amberLight },
            ].map(({ key, emoji, color, bg }, i) => (
              <div key={key} style={{ padding: "24px 40px", borderBottom: i < 3 ? `1px solid ${COLORS.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 38, height: 38, background: bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{emoji}</div>
                  <div>
                    <p style={{ fontSize: 10, fontFamily: "'Arial', sans-serif", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color, marginBottom: 4 }}>{diagnostico[key].titulo}</p>
                    <p style={{ fontSize: 13, fontFamily: "'Arial', sans-serif", color: COLORS.text, lineHeight: 1.7, margin: 0 }}>{diagnostico[key].descripcion}</p>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background: COLORS.tealLight, padding: "24px 40px", borderTop: `1px solid rgba(15,110,86,0.15)` }}>
              <p style={{ fontSize: 14, color: COLORS.teal, lineHeight: 1.7, fontStyle: "italic", margin: "0 0 4px" }}>"{diagnostico.reflexion}"</p>
              <p style={{ fontSize: 12, fontFamily: "'Arial', sans-serif", color: COLORS.teal, fontWeight: 600, margin: 0 }}>— Anita Paniagua 🤍</p>
            </div>

            <div style={{ padding: "28px 40px", textAlign: "center", borderTop: `1px solid ${COLORS.border}` }}>
              {emailEnviado ? (
                <div>
                  <p style={{ fontSize: 22, marginBottom: 8 }}>✅</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.teal, marginBottom: 4 }}>¡Tu diagnóstico está en camino!</p>
                  <p style={{ fontSize: 13, fontFamily: "'Arial', sans-serif", color: COLORS.textMuted }}>Revisa tu bandeja de entrada — y también la carpeta de spam por si acaso.</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>¿Quieres recibir este diagnóstico en tu email?</p>
                  <p style={{ fontSize: 13, fontFamily: "'Arial', sans-serif", color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 20 }}>Te lo enviamos ahora para que lo tengas guardado.</p>
                  <div style={{ display: "flex", gap: 10, maxWidth: 440, margin: "0 auto" }}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" style={{ flex: 1, padding: "13px 16px", fontSize: 14, fontFamily: "'Arial', sans-serif", color: COLORS.text, background: COLORS.bg, border: `1.5px solid ${COLORS.border}`, borderRadius: 10, outline: "none", boxSizing: "border-box" }} />
                    <button onClick={enviarEmail} disabled={enviandoEmail} style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 10, padding: "13px 20px", fontSize: 14, fontFamily: "'Arial', sans-serif", fontWeight: 600, cursor: enviandoEmail ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: enviandoEmail ? 0.7 : 1 }}>{enviandoEmail ? "Enviando..." : "Enviar →"}</button>
                  </div>
                  {errorEmail && <p style={{ color: "#C0392B", fontSize: 12, fontFamily: "'Arial', sans-serif", marginTop: 10 }}>{errorEmail}</p>}
                  <p style={{ marginTop: 12, fontSize: 11, fontFamily: "'Arial', sans-serif", color: COLORS.textMuted }}>Sin spam · Solo tu diagnóstico</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
