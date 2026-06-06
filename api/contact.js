export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // TODO: brancher un service email (ex: Resend, SendGrid)
  console.log('Nouveau message de contact :', { nom, email, message });

  res.status(200).json({ message: 'Message reçu, merci !' });
}
