# DevNote - Backend

This is the backend server for the **DevNote** Notes Application, a self-made project developed to demonstrate my backend skills using Node.js, Express, and SQLite. It provides a secure API for handling user authentication and notes management.

## ✨ Features

- User Registration with password hashing (bcrypt)
- Secure User Login
- Create, Read, Update, Delete Notes
- Lightweight SQLite database for easy storage
- CORS and JSON request handling

## 🌐 Deployed API

The backend is deployed on Render:  
[https://devnote-backend-3.onrender.com](https://devnote-backend-3.onrender.com)

Example API Endpoints:  
- `GET /notes` - Fetch all notes  
- `POST /notes` - Add a new note  
- `PUT /notes/:id` - Update an existing note  
- `DELETE /notes/:id` - Delete a note  
- `POST /register` - User Registration  
- `POST /login` - User Login  

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **SQLite3**
- **bcrypt**
- **CORS**

## 📦 Installation (For Local Development)

bash
git clone https://github.com/seherfathima/devnote-backend.git
cd devnote-backend
npm install
node index.js

🙋‍♀️ About the Project

This project is completely self-made as part of my learning journey and portfolio building. It reflects my understanding of full-stack development using modern
technologies.


📄 License

This project is for learning and demonstration purposes
