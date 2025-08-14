// ❗️ PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy5N2hqGPKyigW-jUnBoSybCmqjAhYgCs",
  authDomain: "project1-e2744.firebaseapp.com",
  projectId: "project1-e2744",
  storageBucket: "project1-e2744.firebasestorage.app",
  messagingSenderId: "764586088455",
  appId: "1:764586088455:web:baef2bb16e6d0aab65b2a2",
  measurementId: "G-8E04FLEMH8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


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
