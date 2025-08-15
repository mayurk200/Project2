# Birthday Reminder Web App

A full-stack, serverless web application that allows users to set birthday reminders. The application saves reminder details to a Firestore database, sends an instant confirmation email, and automatically dispatches a birthday email on the scheduled day using a daily cron job.

**Live Demo:** [https://your-project-name.netlify.app](https://your-project-name.netlify.app)



---
## ✨ Features

* **Modern & Responsive UI:** A clean, professional user interface built with HTML5 and CSS3.
* **Set Reminders:** An easy-to-use form to submit a name, email, and birthday.
* **Real-time Data:** A live-updating list displays all saved reminders from the database.
* **Instant Confirmation:** Immediately sends a confirmation email to the user upon setting a new reminder.
* **Automated Birthday Emails:** A scheduled background job runs daily to automatically send birthday wishes.

---
## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES Modules)
* **Backend:** Serverless Functions (Node.js)
* **Database:** Google Firestore
* **Hosting & Deployment:** Netlify
* **Email Service:** EmailJS
* **Automation / Cron Job:** GitHub Actions

---
## 🚀 Setup and Installation

To get this project running locally, follow these steps:

### Prerequisites

* [Node.js](https://nodejs.org/en/) installed
* A [Firebase](https://firebase.google.com/) account
* An [EmailJS](https://www.emailjs.com/) account
* A [Netlify](https://www.netlify.com/) account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    cd your-repository-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env` in the root of your project and add the following variables. This file is for local development only and should be listed in your `.gitignore` file.

    ```env
    # Firebase Admin credentials
    FIREBASE_SERVICE_ACCOUNT_JSON='{"type": "service_account", ...}'

    # EmailJS credentials
    EMAILJS_SERVICE_ID="your_service_id_here"
    EMAILJS_USER_ID="your_user_id_here"
    EMAILJS_TEMPLATE_ID="your_birthday_template_id_here"
    EMAILJS_SUBSCRIBE_TEMPLATE_ID="your_subscribe_template_id_here"
    ```

4.  **Add your Firebase Config:**
    Open the `script.js` file and replace the placeholder `firebaseConfig` object with your own from the Firebase console.

5.  **Run the project locally:**
    You can use the Netlify CLI to simulate the entire cloud environment locally.
    ```bash
    # Install the Netlify CLI if you haven't already
    npm install -g netlify-cli

    # Run the local development server
    netlify dev
    ```

---
## ☁️ Deployment

This project is designed for easy deployment on Netlify.

1.  **Push to GitHub:** Push your code to your GitHub repository.
2.  **Connect to Netlify:** Import your GitHub repository into a new Netlify site.
3.  **Configure Environment Variables:** In your Netlify site settings (**Site settings > Build & deploy > Environment**), add the same 5 environment variables from your `.env` file.
4.  **Update Cron Job URL:** In the `.github/workflows/cron.yml` file, replace the placeholder URL with your live Netlify function URL (e.g., `https://your-project-name.netlify.app/.netlify/functions/cron`).

Your site will be deployed, and the GitHub Action will trigger the daily email check automatically.
