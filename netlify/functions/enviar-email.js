exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email, diagnostico } = JSON.parse(event.body);

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FAFAF8;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <div style="text-align:center;margin-bottom:32px;">
      <p style="font-size:13px;color:#5F5E5A;margin:0;">Academia EmprendeSer™ · Anita Paniagua</p>
    </div>

    <div style="background:linear-gradient(135deg,#0F6E56,#1D9E75);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
      <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin:0 0 10px;">Tu diagnóstico personalizado</p>
      <h1 style="font-size:20px;font-weight:700;color:#ffffff;line-height:1.4;margin:0;">"${diagnostico.titular}"</h1>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,110,86,0.10);">

      <div style="padding:24px 40px;border-bottom:1px solid rgba(44,44,42,0.10);">
        <p style="font-size:10px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:#0F6E56;margin:0 0 6px;">💎 ${diagnostico.activo.titulo}</p>
        <p style="font-size:13px;color:#1C1C1A;line-height:1.7;margin:0;">${diagnostico.activo.descripcion}</p>
      </div>

      <div style="padding:24px 40px;border-bottom:1px solid rgba(44,44,42,0.10);">
        <p style="font-size:10px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:#BA7517;margin:0 0 6px;">🚪 ${diagnostico.oportunidad.titulo}</p>
        <p style="font-size:13px;color:#1C1C1A;line-height:1.7;margin:0;">${diagnostico.oportunidad.descripcion}</p>
      </div>

      <div style="padding:24px 40px;border-bottom:1px solid rgba(44,44,42,0.10);">
        <p style="font-size:10px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:#0F6E56;margin:0 0 6px;">📦 ${diagnostico.producto.titulo}</p>
        <p style="font-size:13px;color:#1C1C1A;line-height:1.7;margin:0;">${diagnostico.producto.descripcion}</p>
      </div>

      <div style="padding:24px 40px;border-bottom:1px solid rgba(44,44,42,0.10);">
        <p style="font-size:10px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:#BA7517;margin:0 0 6px;">→ ${diagnostico.siguiente.titulo}</p>
        <p style="font-size:13px;color:#1C1C1A;line-height:1.7;margin:0;">${diagnostico.siguiente.descripcion}</p>
      </div>

      <div style="background:#E1F5EE;padding:24px 40px;border-top:1px solid rgba(15,110,86,0.15);">
        <p style="font-size:14px;color:#0F6E56;line-height:1.7;font-style:italic;margin:0 0 4px;">"${diagnostico.reflexion}"</p>
        <p style="font-size:12px;color:#0F6E56;font-weight:600;margin:0;">— Anita Paniagua 🤍</p>
      </div>

      <div style="padding:28px 40px;text-align:center;">
        <p style="font-size:12px;color:#5F5E5A;margin:0;">© Anita Paniagua · Academia EmprendeSer™</p>
      </div>

    </div>
  </div>
</body>
</html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Anita Paniagua <onboarding@resend.dev>",
        to: [email],
        subject: "Tu Radiografía del Negocio del Conocimiento",
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al enviar email");
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
