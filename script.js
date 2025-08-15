// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Your web app's Firebase configuration (provided by you)
const firebaseConfig = {
  apiKey: "AIzaSyC1LPL3eOKvTu61GUkZ8qhcLcYDDpkxeAQ",
  authDomain: "project1-b1218.firebaseapp.com",
  projectId: "project1-b1218",
  storageBucket: "project1-b1218.appspot.com",
  messagingSenderId: "674758599966",
  appId: "1:674758599966:web:5fc423df781afdcd4ad50f",
  measurementId: "G-DFJG3BWVFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get a reference to the Firestore database service
const db = getFirestore(app);

// Get DOM elements
const form = document.getElementById('birthdayForm');
const statusMessage = document.getElementById('statusMessage');
const reminderCountElement = document.getElementById('reminderCount');

// Create a reference to the "reminders" collection
const remindersCollection = collection(db, "reminders");

// Real-time listener for the reminder count (new syntax)
onSnapshot(remindersCollection, (snapshot) => {
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
        // Add a new document to the collection (new syntax)
        await addDoc(remindersCollection, {
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
