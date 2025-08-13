// Paste your Firebase configuration object here
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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get form and status message elements
const form = document.getElementById('birthdayForm');
const statusMessage = document.getElementById('statusMessage');

// Listen for form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from actually submitting

    // Get values from the form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const birthdate = document.getElementById('birthdate').value;

    // A simple validation
    if (!name || !email || !birthdate) {
        statusMessage.textContent = 'Please fill out all fields.';
        statusMessage.style.color = 'red';
        return;
    }
    
    // The birthdate from the form is a string 'YYYY-MM-DD'.
    // We'll extract the month and day.
    const dateParts = birthdate.split('-'); // e.g., ['2025', '08', '13']
    const month = dateParts[1];
    const day = dateParts[2];

    try {
        // Add a new document with a generated ID to the "reminders" collection
        await db.collection("reminders").add({
            name: name,
            email: email,
            birthMonth: month,
            birthDay: day,
            fullBirthDate: birthdate // Storing the full date is also useful
        });

        // Show success message and reset the form
        statusMessage.textContent = 'Reminder set successfully!';
        statusMessage.style.color = 'green';
        form.reset();

    } catch (error) {
        console.error("Error adding document: ", error);
        statusMessage.textContent = 'Error setting reminder. Please try again.';
        statusMessage.style.color = 'red';
    }
});