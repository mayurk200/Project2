// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Your web app's Firebase configuration
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
const db = getFirestore(app);

// Get DOM elements
const form = document.getElementById('birthdayForm');
const statusMessage = document.getElementById('statusMessage');
const reminderCountElement = document.getElementById('reminderCount');
const reminderListElement = document.getElementById('reminderList');
const emptyStateMessage = document.getElementById('emptyStateMessage'); // Get the empty state element

// Create a reference to the "reminders" collection and a query to sort by name
const remindersCollection = collection(db, "reminders");
const remindersQuery = query(remindersCollection, orderBy("name"));

// Real-time listener to update the count AND display the reminders
onSnapshot(remindersQuery, (snapshot) => {
  // Update the total count
  reminderCountElement.textContent = snapshot.size;

  // Clear the current list of reminders
  reminderListElement.innerHTML = '';

  // Show or hide the empty state message
  if (snapshot.empty) {
    emptyStateMessage.style.display = 'block';
  } else {
    emptyStateMessage.style.display = 'none';
  }

  // Loop through each document in the database and create a list item
  snapshot.docs.forEach(doc => {
    const reminder = doc.data();
    const listItem = document.createElement('li');
    
    const date = new Date(reminder.fullBirthDate + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    listItem.innerHTML = `
        <span>${reminder.name}</span>
        <span class="date">${formattedDate}</span>
    `;

    reminderListElement.appendChild(listItem);
  });
});

// Listen for form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const birthdate = document.getElementById('birthdate').value;

    if (!name || !email || !birthdate) {
      statusMessage.textContent = 'Please fill out all fields.';
      statusMessage.style.color = 'var(--error-color)';
      return;
    }
    
    const dateParts = birthdate.split('-'); 
    const month = dateParts[1];
    const day = dateParts[2];

    try {
        await addDoc(remindersCollection, {
            name: name,
            email: email,
            birthMonth: month,
            birthDay: day,
            fullBirthDate: birthdate
        });

        statusMessage.textContent = 'Reminder set successfully!';
        statusMessage.style.color = 'var(--success-color)';
        form.reset();
        
        setTimeout(() => {
            statusMessage.textContent = '';
        }, 3000);

    } catch (error) {
        console.error("Error adding document: ", error);
        statusMessage.textContent = 'Error setting reminder. Please try again.';
        statusMessage.style.color = 'var(--error-color)';
    }
});
