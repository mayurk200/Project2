// This is a Node.js environment, so we use 'require'
const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Securely load Firebase credentials from environment variables
// We will set these up in Vercel
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

// Securely load EmailJS credentials
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID;

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// This is the main function Vercel will run
module.exports = async (req, res) => {
  try {
    // Get today's month and day (e.g., '08' and '13')
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    console.log(`Checking for birthdays on: ${month}-${day}`);

    // Query Firestore for reminders where birthMonth and birthDay match today
    const snapshot = await db.collection('reminders')
      .where('birthMonth', '==', month)
      .where('birthDay', '==', day)
      .get();

    if (snapshot.empty) {
      console.log('No birthdays today.');
      return res.status(200).send('No birthdays today.');
    }

    // Prepare to send emails for each birthday found
    const emailPromises = [];
    snapshot.forEach(doc => {
      const reminder = doc.data();
      console.log(`Found birthday for: ${reminder.name}`);

      const emailData = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_USER_ID,
        template_params: {
          'to_name': reminder.name,
          'to_email': reminder.email
        }
      };
      
      // Add the promise for sending the email to an array
      emailPromises.push(
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          body: JSON.stringify(emailData),
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);
    
    console.log(`Successfully sent ${emailPromises.length} birthday emails.`);
    res.status(200).send(`Successfully sent ${emailPromises.length} birthday emails.`);

  } catch (error) {
    console.error('Error in cron function:', error);
    res.status(500).send('Error processing birthday reminders.');
  }
};