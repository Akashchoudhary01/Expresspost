ExpressPost 📝
A full-stack social media post application built using Node.js, Express, MongoDB, EJS, and Tailwind CSS. Users can create, edit, like, and delete posts while managing their profiles.

🚀 Features
User authentication (Register/Login/Logout)
Create, edit, and delete posts
Like and unlike posts
Profile picture upload
Secure password hashing
Responsive UI with Tailwind CSS
🛠 Tech Stack
Frontend
EJS (Embedded JavaScript for templating)
Tailwind CSS (Styling)
Backend
Node.js & Express.js (Server)
MongoDB & Mongoose (Database)
JWT (Authentication)
Multer (File uploads for profile pictures)
📂 Folder Structure
bash
Copy
Edit
ExpressPost/
│-- public/               # Static files (CSS, Images)
│-- views/                # EJS Templates
│-- models/               # Mongoose Models
│-- config/               # Configuration files (DB & Multer)
│-- routes/               # API routes (if modularized)
│-- app.js                # Main server file
│-- .env                  # Environment variables
│-- package.json          # Dependencies & Scripts
│-- README.md             # Project documentation
🚀 Installation & Setup
1️⃣ Clone the Repository
sh
Copy
Edit
git clone https://github.com/Akashchoudhary01/Expresspost.git
cd Expresspost
2️⃣ Install Dependencies
sh
Copy
Edit
npm install
3️⃣ Set Up Environment Variables
Create a .env file and add:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4️⃣ Start the Server
sh
Copy
Edit
npm start
Server will run at http://localhost:5000

🚀 Deployment

Follow the prompts and copy the deployed URL

💡 Future Enhancements
Comments on posts
User follow/unfollow
Dark mode
API rate limiting
📜 License
This project is open-source and available under the MIT License.

👨‍💻 Developed by Akash Choudhary
