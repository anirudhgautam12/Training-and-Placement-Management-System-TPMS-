# 🎓 Training and Placement Management System (TPMS)

A full-stack web application built using the MERN stack to streamline the training and placement process for students, companies, and administrators.

🔗 **Live Demo:** https://training-and-placement-management-system-tpms-gufed972y.vercel.app/

---

## 🚀 Features

### 👨‍🎓 Student

* Register and login
* Create and update profile
* Upload resume and profile picture
* View job opportunities
* Apply to jobs
* Track application status

### 🏢 Company / Recruiter

* Register and login
* Add company details and logo
* Post job openings (CTC, eligibility, deadline)
* View student applications
* Shortlist or reject candidates

### 🛠️ Admin

* Approve/reject company registrations
* Manage students and companies
* View all job postings
* Monitor applications
* Access placement analytics dashboard

---

## 🧰 Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Authentication

* JWT (JSON Web Tokens)
* bcrypt for password hashing

### File Storage

* Cloudinary (for images and resumes)

---

## 📁 Project Structure

```
TPMS/
├── Server/        # Backend (Node + Express)
├── client/        # Frontend (React + Vite)
```

---

## 🔐 Environment Variables

### Backend (.env)

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)

```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/your-repo.git
cd TPMS
```

---

### 2️⃣ Setup Backend

```
cd Server
npm install
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

---

## 🌐 Deployment

### 🔹 Frontend

* Hosted on **Vercel**
* Live URL:
  👉 https://training-and-placement-management-system-tpms-gufed972y.vercel.app/

### 🔹 Backend

* Hosted on **Render**

### 🔹 Database

* MongoDB Atlas

---

## 📊 Future Improvements

* Email notifications for job applications
* Advanced analytics dashboard
* Resume parsing
* Role-based notifications
* Pagination & advanced filters

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* MongoDB Atlas
* Cloudinary
* Render
* Vercel

---

## ⭐ Show your support

If you like this project, give it a ⭐ on GitHub!
