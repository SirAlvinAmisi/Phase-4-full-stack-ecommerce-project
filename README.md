# 🛒 E-Commerce Web Application

A full-stack eCommerce platform built with **React** for the frontend and **Flask** for the backend. The platform allows users to browse products, add items to a shopping cart, manage orders, and complete purchases. Admins can manage product inventory and view customer orders via a dashboard.

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Frontend Setup (React)](#-frontend-setup-react)
  - [Backend Setup (Flask)](#-backend-setup-flask)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

### User

- Browse and search products
- View product details
- Add/remove items to/from cart
- Register & login (JWT Auth)
- Checkout and view order history

### Admin

- Add/edit/delete products
- View and manage customer orders

---

## 🛠 Tech Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Frontend        | React, Tailwind CSS, Axios, React Router      |
| Backend         | Python, Flask, Flask-JWT-Extended, SQLAlchemy |
| Database        | PostgreSQL or MySQL                           |
| Testing         | React Testing Library, PyTest                 |
| Deployment      | Docker, Render/Vercel/Heroku                  |
| Version Control | Git & GitHub                                  |

---

## 🧰 Getting Started

### ⚛️ Frontend Setup (React)

```bash
# Clone the repository
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🐍 Backend Setup (Flask)

```bash
# Navigate to backend folder
cd ../backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask app
flask run
```

> Ensure your PostgreSQL/MySQL server is running and connected via `DATABASE_URL`.

---

## 🗂 Project Structure

```
ecommerce-app/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/         # Axios API calls
│   │   └── App.jsx
│   └── tailwind.config.js
│
├── backend/
│   ├── models.py
│   ├── routes/
│   ├── config.py
│   ├── app.py
│   └── database.py
│
└── README.md
```

---

## 🔗 API Endpoints

### Auth

- `POST /auth/register` – Create account
- `POST /auth/login` – Authenticate user

### Products

- `GET /products` – List all products
- `GET /products/<id>` – Get product by ID
- `POST /products` – Create new product (admin)
- `PUT /products/<id>` – Update product (admin)
- `DELETE /products/<id>` – Delete product (admin)

### Cart

- `POST /cart/add` – Add to cart
- `GET /cart` – View cart
- `DELETE /cart/remove/<id>` – Remove item

### Orders

- `POST /orders` – Create order
- `GET /orders` – Get user orders
- `GET /admin/orders` – View all orders (admin)

---

## 🔐 Environment Variables

Create a `.env` file in both `frontend/` and `backend/` folders.

### Frontend

```
VITE_API_BASE_URL=http://localhost:5000
```

### Backend

```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET_KEY=your_jwt_secret
```

---

## 🧪 Testing

### Frontend

```bash
# Inside /frontend
npm run test
```

### Backend

```bash
# Inside /backend
pytest
```

---

## 🚀 Deployment

- Dockerize both frontend and backend
- Use Render, Vercel, Heroku, or AWS to deploy
- Setup PostgreSQL on the cloud (e.g., Supabase or ElephantSQL)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## 📧 Contact

For questions or collaboration, reach out to:

- [Alvin Amisi](alvomakaya@gmail.com)
- GitHub: [https://github.com/SirAlvinAmisi/]
