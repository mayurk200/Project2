const admin = require('firebase-admin');
const fetch = require('node-fetch');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID;

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

exports.handler = async function() {
  try {
    const today = new Date();
    const month = String(today.getUTCMonth() + 1).padStart(2, '0');
    const day = String(today.getUTCDate()).padStart(2, '0');
    console.log(`Checking for birthdays on: ${month}-${day}`);

    const snapshot = await db.collection('reminders').where('birthMonth', '==', month).where('birthDay', '==', day).get();
    if (snapshot.empty) {
      return { statusCode: 200, body: 'No birthdays scheduled for today.' };
    }

    const emailPromises = snapshot.docs.map(doc => {
      const reminder = doc.data();
      console.log(`Found birthday for: ${reminder.name}`);
      const emailData = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_USER_ID,
        template_params: { 'to_name': reminder.name, 'to_email': reminder.email }
      };
      return fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        body: JSON.stringify(emailData),
        headers: { 'Content-Type': 'application/json' }
      });
    });

    await Promise.all(emailPromises);
    return { statusCode: 200, body: `Successfully sent ${emailPromises.length} birthday emails.` };
  } catch (error) {
    console.error('Error in cron function:', error);
    return { statusCode: 500, body: 'Error processing birthday reminders.' };
  }
};
