import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { nom, email, message } = req.body ?? {};

  if (!nom || !email || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Email invalide.' });
  }

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'evachabert@gmail.com',
      replyTo: email,
      subject: `📩 Nouveau message de ${nom} — Portfolio`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #eee;border-radius:12px">
          <h2 style="color:#F72585;margin:0 0 16px">Nouveau message depuis ton portfolio</h2>
          <p style="margin:0 0 8px"><strong>Nom :</strong> ${nom}</p>
          <p style="margin:0 0 8px"><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
          <p style="white-space:pre-wrap;color:#333">${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Message envoyé, merci !' });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ message: 'Erreur serveur. Réessaie plus tard.' });
  }
}
