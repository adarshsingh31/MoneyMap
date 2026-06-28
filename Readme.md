# 💰 MoneyMap - Personal Finance Tracker

<p align="center">
  <img src="screenshots/banner.png" alt="MoneyMap Banner" width="100%">
</p>

<p align="center">
  <strong>A Modern MERN Stack Personal Finance Management Application</strong>
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-blue?logo=render)

</p>

---

## 📖 About

MoneyMap is a **full-stack MERN application** that helps users efficiently manage their personal finances.

Users can:

* 💰 Track Income & Expenses
* 📊 View Financial Dashboard
* 📈 Analyze Spending Habits
* 📄 Export Reports as PDF & CSV
* 💳 Plan Monthly Budgets
* 🤖 Get AI-Based Financial Insights

---

# 🌐 Live Demo

### 🚀 Frontend

https://money-map-seven-alpha.vercel.app

### ⚙️ Backend API

https://moneymap-backend-7qhb.onrender.com

---

# ✨ Features

## 🔐 Authentication

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes
* Logout

---

## 💰 Transaction Management

* Add Income
* Add Expense
* Edit Transaction
* Delete Transaction
* Search Transactions
* Filter by Category
* Filter by Type
* Filter by Month

---

## 📊 Dashboard

* Current Balance
* Total Income
* Total Expense
* Total Transactions
* Monthly Expense Bar Chart
* Category Expense Pie Chart
* Recent Transactions

---

## 📂 Categories

* Expense Categories
* Income Categories
* Category Summary
* Pie Chart Analytics

---

## 📈 Reports

* Date Range Report
* Monthly Summary
* Income vs Expense
* Category Analysis
* Download PDF
* Download CSV

---

## 💳 Budget Planning

* Monthly Budget
* Spending Tracker
* Budget Progress
* Overspending Alert

---

## 🤖 AI Analytics

* Spending Analysis
* Financial Insights
* Smart Recommendations

---

## ⚙️ Settings

* User Profile
* Theme
* Currency
* Notifications
* Password Update

---

# 🧰 Technologies & Tools Used

## 🎨 Frontend

* React.js
* Vite
* React Router DOM
* Axios
* HTML5
* CSS3
* JavaScript (ES6+)
* HTML2Canvas
* jsPDF

---

## ⚙️ Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcryptjs
* dotenv
* CORS

---

## 🗄 Database

* MongoDB Atlas
* Mongoose ODM

---

## 📊 Data Visualization

* Dashboard Cards
* Bar Charts
* Pie Charts

---

## 📄 Export Features

* PDF Export
* CSV Export

---

## ☁️ Deployment

* Vercel
* Render
* MongoDB Atlas
* GitHub

---

# 🧠 Concepts Used

* CRUD Operations
* REST API Development
* MVC Architecture
* JWT Authentication
* Authorization Middleware
* Password Hashing
* Environment Variables
* Axios API Integration
* React Hooks
* Form Validation
* Search & Filtering
* Category-wise Aggregation
* Monthly Expense Analysis
* Responsive UI Design
* Error Handling
* Async/Await
* Cloud Deployment

---

# 📌 API Endpoints

## Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

## Expenses

* GET `/api/expenses`
* POST `/api/expenses`
* PUT `/api/expenses/:id`
* DELETE `/api/expenses/:id`

## Dashboard

* GET `/api/dashboard`
* GET `/api/dashboard/category-summary`
* GET `/api/dashboard/monthly-summary`

---

# 📸 Screenshots

## 🏠 Landing Page
<img width="1884" height="867" alt="image" src="https://github.com/user-attachments/assets/58426de7-bb87-4b49-bda2-f5d4f90abecb" />


---

## 🔑 Login

<img width="1861" height="856" alt="image" src="https://github.com/user-attachments/assets/1267042f-edf5-46b7-a743-f3fd2e0e056b" />


---

## 📝 Register

<img width="1889" height="831" alt="image" src="https://github.com/user-attachments/assets/a796a38c-e3ab-486a-81bf-4e451986cc19" />


---

## 📊 Dashboard

<img width="1888" height="849" alt="image" src="https://github.com/user-attachments/assets/67bfaeb6-042f-4b4a-bf4e-e4b3e4bc8d1b" />


---

## 💰 Add Transaction

<img width="1905" height="823" alt="image" src="https://github.com/user-attachments/assets/f6ccf284-4bc4-44ea-b7f2-a3d148dcef12" />


---

## 📜 Expense History


<img width="1907" height="836" alt="image" src="https://github.com/user-attachments/assets/ae43a4f7-c594-48c0-9ba8-2649104e9acf" />

---

## 📂 Categories

> Add Screenshot Here

---

## 📈 Reports

<img width="1899" height="864" alt="image" src="https://github.com/user-attachments/assets/d65087ca-4b60-4a3a-87ea-877be0afe87e" />


---

## 💳 Budget Planning

<img width="1893" height="861" alt="image" src="https://github.com/user-attachments/assets/c6babd51-0035-42f7-97ce-058c4ea4ba19" />


---

## 🤖 AI Analytics

<img width="1888" height="858" alt="image" src="https://github.com/user-attachments/assets/3056d878-d2b2-4b1c-814d-df76c1024d6f" />


---

## ⚙️ Settings

<img width="1898" height="844" alt="image" src="https://github.com/user-attachments/assets/f2d37c92-f0aa-4bed-adf1-f078f9471b0f" />


---

# 📁 Project Structure

```text
MoneyMap
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/adarshsingh31/MoneyMap.git
```

```bash
cd MoneyMap
```

---

## Backend

```bash
cd backend
npm install
```

Create a `.env`

```env
MONGO_URI=your_connection_string
JWT_SECRET=your_secret
PORT=5000
```

Run

```bash
npm start
```

---

## Frontend

```bash
cd frontend
npm install
```

Create a `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run

```bash
npm run dev
```

---

# 🚀 Future Improvements

* Email Verification
* Forgot Password
* Google Authentication
* Recurring Transactions
* Expense Reminders
* Multi-Currency Support
* Mobile App
* AI Expense Prediction

---

# 🏆 Skills Demonstrated

* Full Stack MERN Development
* Frontend Development
* Backend API Development
* Database Design
* Authentication & Security
* REST API Integration
* Cloud Deployment
* Git & GitHub
* Data Visualization
* Problem Solving

---

# 👨‍💻 Author

**Adarsh Singh**

GitHub:
https://github.com/adarshsingh31

LinkedIn:
https://www.linkedin.com/in/adarsh-singh-936380341/

---

# ⭐ Support

If you like this project, don't forget to ⭐ the repository.

It helps others discover the project and motivates future improvements.

