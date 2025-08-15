import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ❗️ PASTE YOUR FIREBASE CONFIG OBJECT HERE
const firebaseConfig = {
  apiKey: "AIzaSyC1LPL3eOKvTu61GUkZ8qhcLcYDDpkxeAQ",
  authDomain: "project1-b1218.firebaseapp.com",
  projectId: "project1-b1218",
  storageBucket: "project1-b1218.appspot.com",
  messagingSenderId: "674758599966",
  appId: "1:674758599966:web:5fc423df781afdcd4ad50f",
  measurementId: "G-DFJG3BWVFP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('birthdayForm');
const statusMessage = document.getElementById('statusMessage');
const reminderCountElement = document.getElementById('reminderCount');
const reminderListElement = document.getElementById('reminderList');
const emptyStateMessage = document.getElementById('emptyStateMessage');

const remindersCollection = collection(db, "reminders");
const remindersQuery = query(remindersCollection, orderBy("name"));

onSnapshot(remindersQuery, (snapshot) => {
  reminderCountElement.textContent = snapshot.size;
  reminderListElement.innerHTML = '';

  if (snapshot.empty) {
    emptyStateMessage.style.display = 'block';
  } else {
    emptyStateMessage.style.display = 'none';
  }

  snapshot.docs.forEach(doc => {
    const reminder = doc.data();
    const listItem = document.createElement('li');
    const date = new Date(reminder.fullBirthDate + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    listItem.innerHTML = `<span>${reminder.name}</span><span class="date">${formattedDate}</span>`;
    reminderListElement.appendChild(listItem);
  });
});

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
        await addDoc(remindersCollection, { name, email, birthMonth: month, birthDay: day, fullBirthDate: birthdate });
        
        // This relative path works when hosting on Netlify
        fetch('/.netlify/functions/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        statusMessage.textContent = 'Reminder set! A confirmation email has been sent.';
        statusMessage.style.color = 'var(--success-color)';
        form.reset();
        setTimeout(() => { statusMessage.textContent = ''; }, 3000);
    } catch (error) {
        console.error("Error adding document: ", error);
        statusMessage.textContent = 'Error setting reminder. Please try again.';
        statusMessage.style.color = 'var(--error-color)';
    }
});
