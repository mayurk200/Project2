const fetch = require('node-fetch');

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_SUBSCRIBE_TEMPLATE_ID = process.env.EMAILJS_SUBSCRIBE_TEMPLATE_ID;
const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID;

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, email } = JSON.parse(event.body);
    if (!name || !email) {
      return { statusCode: 400, body: 'Name and email are required.' };
    }

    const emailData = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_SUBSCRIBE_TEMPLATE_ID,
      user_id: EMAILJS_USER_ID,
      template_params: { 'to_name': name, 'to_email': email }
    };

    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      body: JSON.stringify(emailData),
      headers: { 'Content-Type': 'application/json' }
    });

    return { statusCode: 200, body: 'Confirmation email sent successfully.' };
  } catch (error) {
    console.error('Error in subscribe function:', error);
    return { statusCode: 500, body: 'Error sending confirmation email.' };
  }
};
