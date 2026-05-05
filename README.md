# 🧶 Hooks & Heart 💛

<div align="center">

![Hooks & Heart](client/public/logo.png)

**Handmade Crochet Products — Made with Love, One Stitch at a Time**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🌐 Live Links

| Page | URL |
|------|-----|
| 🏠 Home | `/` |
| 🛍️ Products | `/products` |
| 📧 Contact | `/contact` |
| 👤 User Login | `/user-login` |
| 📝 User Register | `/user-register` |
| 🔐 Admin Login | `/login` |
| ⚙️ Admin Panel | `/admin` *(requires login)* |

---

## ✨ Features

### 🛒 Customer Features
- Browse & search handmade crochet products
- Filter by category, price range, availability
- Sort by newest, price, name, featured
- Add to cart & checkout
- Multiple payment methods: COD, UPI, Card, Net Banking
- Order tracking & history
- User registration & login

### 🔐 Admin Features
- Secure admin login (hidden URL)
- Add / delete products with images
- Manage & update order status
- **Settings tab** — Change username, email, password with OTP verification
- OTP sent to registered phone numbers via Fast2SMS

### 🎨 Design
- Fully responsive — Mobile, Tablet, Desktop
- Brand colors: Cream, Rust, Coral, Golden, Teal
- Smooth animations & hover effects
- Product collage on homepage
- "By the Artist" section with personal message

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Local / Atlas) |
| Auth | JWT Tokens |
| Images | Local Storage / Cloudinary |
| OTP SMS | Fast2SMS API |

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/aryan45sandilya/HooksndHeart.git
cd HooksndHeart
```

### 2. Install dependencies
```bash
# Root
npm install

# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 3. Configure environment
```bash
# Copy example env
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/hooksnheart
JWT_SECRET=your_secret_key
FAST2SMS_API_KEY=your_fast2sms_key
ADMIN_PHONE_1=your_phone_1
ADMIN_PHONE_2=your_phone_2
```

### 4. Create Admin Account
```bash
cd server
node scripts/createAdmin.js
```

### 5. Run the app
```bash
# From root — runs both server & client
npm run dev
```

Or separately:
```bash
# Server (port 5002)
cd server && node index.js

# Client (port 5173)
cd client && npm run dev
```

---

## 📱 Contact

| | |
|--|--|
| 📱 Phone | +91 88266 28029 |
| 📱 WhatsApp | +91 99716 70277 |
| 📷 Instagram | [@hooksndheart](https://www.instagram.com/hooksndheart?igsh=bjhnbG82Zmg5OWZq) |

---

## 🔐 Admin Access

> Admin panel is intentionally hidden from public navigation.

- **Login URL:** `/login`
- **Panel URL:** `/admin` *(redirects to login if not authenticated)*
- **Default credentials:** Set via `createAdmin.js` script
- **Credential changes:** Admin Panel → Settings tab → OTP verification required

---

<div align="center">

Made with ❤️ and 🧶 by **Hooks & Heart**

*Every stitch is a little piece of my heart*

</div>
