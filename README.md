# 🔗 Brainly

**Your personal web library.**  
Save links instantly with titles, notes & tags — then find them in seconds.

---

## ✨ What is Brainly?

**Brainly** is a clean, fast, personal link manager built for people who are tired of messy browser bookmarks.

No bloat. No unnecessary features.

Just:

- Save a link
- Add a note
- Tag it
- Find it later instantly

Think of it as your **private version of Raindrop.io — but simpler, faster, and fully yours.**

---

## 🖼️ Features

- 🔖 Save links with **title, URL, description/notes, and tags**
- 🏷️ **Tag-based filtering** — click any tag to filter instantly
- 🔍 **Full-text search** — search by title, URL, or notes
- ✏️ **Edit & delete** saved links
- 🎨 **Color-coded tags** — automatically assigned consistent colors
- 📱 **Fully responsive UI** — works on mobile, tablet, and desktop
- 🔐 **JWT Authentication** — secure and private
- 🚀 **Deployed on Vercel + Render** — accessible from anywhere

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|-------------|
| **Frontend** | React + Vite |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens) |
| **Styling** | Pure CSS with custom properties |
| **Fonts** | Plus Jakarta Sans + Syne |
| **Deployment** | Vercel (Frontend) + Railway (Backend) |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

Make sure you have:

- Node.js **v18+**
- MongoDB Atlas account (Free tier works)
- Git

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/0xdanyal/brainly.git
cd brainly

```

## 🚀 Setup

### 2️⃣ Setup Backend

```bash
cd backend
npm install

Create a .env file inside backend/ and add:

MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/linkstash?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
PORT=3000

Start the backend server:

npm run dev

You should see:

Server running on port 3000
MongoDB connected
3️⃣ Setup Frontend
cd ../frontend
npm install

Create a .env file inside frontend/ and add:

VITE_API_URL=http://localhost:3000/api

Run the frontend:

npm run dev

Open in your browser:

http://localhost:5173
👨‍💻 Author

Muhammad Danyal

Built because existing bookmark managers felt too complicated and bloated.

📄 License

MIT License — free to use, modify, and distribute.
```