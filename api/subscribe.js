const fetch = require('node-fetch');

// Get credentials from Vercel's Environment Variables
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_SUBSCRIBE_TEMPLATE_ID = process.env.EMAILJS_SUBSCRIBE_TEMPLATE_ID;
const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID;

module.exports = async (req, res) => {
  // We only accept POST requests to this function
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).send('Name and email are required.');
    }

    const emailData = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_SUBSCRIBE_TEMPLATE_ID,
      user_id: EMAILJS_USER_ID,
      template_params: {
        'to_name': name,
        'to_email': email,
      }
    };

    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      body: JSON.stringify(emailData),
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(200).send('Confirmation email sent successfully.');

  } catch (error) {
    console.error('Error in subscribe function:', error);
    res.status(500).send('Error sending confirmation email.');
  }
};
