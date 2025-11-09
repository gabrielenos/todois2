# 📝 Todo App - Full Stack Task Management

A modern, full-featured todo application built with Next.js and FastAPI. Manage your tasks efficiently with a beautiful, responsive interface supporting both Indonesian and English languages.

## ✨ Features

- 🎯 **Task Management** - Create, edit, delete, and organize tasks
- 📅 **Calendar Integration** - Schedule and track events
- 📊 **Statistics Dashboard** - View productivity metrics
- 📝 **Notes** - Keep important notes organized
- 🌓 **Dark/Light Mode** - Comfortable viewing in any lighting
- 🌍 **Bilingual** - Full support for Indonesian and English
- 🔐 **Authentication** - Secure user registration and login
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Context API** - State management

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.8+ ([Download](https://www.python.org/downloads/))
- Git ([Download](https://git-scm.com/downloads))

### ⚡ Quick Start (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/gabrielenos/todois2.git
cd todois2
```

2. **Install Dependencies**
```bash
npm install
cd backend
pip install -r requirements.txt
cd ..
```

3. **Create Environment File**
Create `.env.local` in root folder:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Run the App (EASIEST WAY)**

**Windows:**
```bash
# Double-click this file:
START-SIMPLE.bat
```

**Or manually:**

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

5. **Open Browser**
```
http://localhost:3000
```

6. **Register New Account**
- No default account
- Click "Daftar" to create new account
- Use your email and password

### 🎯 First Time Setup

**After cloning, just run:**
```bash
# 1. Install frontend
npm install

# 2. Install backend
cd backend
pip install -r requirements.txt
cd ..

# 3. Create .env.local file (copy from above)

# 4. Start app
START-SIMPLE.bat  (Windows)
```

**That's it! App will open automatically in browser!**

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── views/       # Page views
│   │   ├── Login.tsx    # Login component
│   │   ├── Register.tsx # Registration
│   │   └── ...
│   ├── context/         # React context
│   └── lib/             # Utilities & API
├── backend/
│   ├── main.py          # FastAPI app
│   ├── models.py        # Database models
│   ├── routers/         # API routes
│   ├── auth.py          # Authentication
│   └── database.py      # Database config
└── public/              # Static files
```

## 🔧 Available Scripts

### Windows Scripts (Easy to Use)
- `START-SIMPLE.bat` - Start frontend + backend automatically
- `START-BACKEND.bat` - Start backend only
- `RESTART-BACKEND.bat` - Restart backend after code changes
- `CHECK-BACKEND.bat` - Check if backend is running

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Backend
- `python check_users.py` - Check registered users
- `python create_test_user.py` - Create test user
- `python backup_db.py` - Backup database

## ❌ Troubleshooting

### Backend Not Running?

**Problem:** Cannot login/register, error "Cannot connect to backend"

**Solution:**
1. Check if backend is running:
   ```bash
   CHECK-BACKEND.bat
   ```

2. If not running, start it:
   ```bash
   START-BACKEND.bat
   ```

3. Make sure `.env.local` file exists with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Port Already in Use?

**Problem:** Error "Port 8000 already in use"

**Solution:**
```bash
# Find and kill the process
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Then restart backend
START-BACKEND.bat
```

### Module Not Found?

**Problem:** Error "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Need More Help?

Read detailed troubleshooting guide:
- `BACKEND-TROUBLESHOOTING.md`
- `QUICK-START.md`

## 🎨 Features in Detail

### Task Management
- ✅ Create tasks with title, description, category, priority
- ✅ Set due dates and deadlines
- ✅ Mark tasks as complete
- ✅ Filter by status, category, priority
- ✅ Sort by date, priority, deadline
- ✅ Search functionality

### Calendar
- 📅 View monthly calendar
- 📅 Add events with date and time
- 📅 Color-coded events
- 📅 Upcoming events list

### Notes
- 📝 Create colorful notes
- 📝 Categorize notes
- 📝 Rich text support
- 📝 Category statistics

### Statistics
- 📊 Completion rate
- 📊 Weekly productivity chart
- 📊 Category distribution
- 📊 Streak tracking

## 🌍 Internationalization

The app supports two languages:
- 🇮🇩 Bahasa Indonesia
- 🇬🇧 English

Switch languages in Settings.

## 🔐 Security

- JWT-based authentication
- Bcrypt password hashing
- Secure HTTP-only cookies
- CORS protection

## 📱 Responsive Design

Optimized for:
- 💻 Desktop (1920px+)
- 💻 Laptop (1024px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Created with ❤️ by Rosfi

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI for the powerful backend framework
- Tailwind CSS for beautiful styling
