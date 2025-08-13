// ❗️ PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get DOM elements
const form = document.getElementById('birthdayForm');
const statusMessage = document.getElementById('statusMessage');
const reminderCountElement = document.getElementById('reminderCount');

// Real-time listener for the reminder count
db.collection("reminders").onSnapshot((snapshot) => {
  const count = snapshot.size;
  reminderCountElement.textContent = count;
});

// Listen for form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const birthdate = document.getElementById('birthdate').value;

    if (!name || !email || !birthdate) {
        statusMessage.textContent = 'Please fill out all fields.';
        statusMessage.style.color = 'red';
        return;
    }
    
    const dateParts = birthdate.split('-'); 
    const month = dateParts[1];
    const day = dateParts[2];

    try {
        await db.collection("reminders").add({
            name: name,
            email: email,
            birthMonth: month,
            birthDay: day,
            fullBirthDate: birthdate
        });

        statusMessage.textContent = 'Reminder set successfully!';
        statusMessage.style.color = 'green';
        form.reset();
        
        setTimeout(() => {
            statusMessage.textContent = '';
        }, 3000);

    } catch (error) {
        console.error("Error adding document: ", error);
        statusMessage.textContent = 'Error setting reminder. Please try again.';
        statusMessage.style.color = 'red';
    }
});