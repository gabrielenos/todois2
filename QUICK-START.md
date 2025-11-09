# 🚀 Quick Start Guide

## 📋 Prerequisites

- ✅ Node.js installed
- ✅ Python installed
- ✅ Git installed

---

## 🎯 First Time Setup

### **1. Install Dependencies**

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### **2. Create Environment File**

Create `.env.local` in root:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🏃 Running the App

### **Option 1: Auto Start (EASIEST)**
```bash
# Double-click:
START-SIMPLE.bat
```
This will start both frontend and backend automatically!

### **Option 2: Manual Start**

**Terminal 1 - Backend:**
```bash
# Double-click:
START-BACKEND.bat
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🌐 Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🔄 After Code Changes

### **Backend Changed?**
```bash
# Double-click:
RESTART-BACKEND.bat
```

### **Frontend Changed?**
Frontend auto-reloads (no restart needed)

---

## 🔍 Check Status

```bash
# Check if backend is running:
CHECK-BACKEND.bat
```

---

## ❌ Troubleshooting

**Backend not working?**
```bash
# Read this:
BACKEND-TROUBLESHOOTING.md
```

**Common issues:**
1. Port 8000 already in use → Restart backend
2. Module not found → `pip install -r requirements.txt`
3. Frontend can't connect → Check `.env.local` file

---

## 📚 Useful Scripts

| Script | Purpose |
|--------|---------|
| `START-SIMPLE.bat` | Start everything |
| `START-BACKEND.bat` | Start backend only |
| `RESTART-BACKEND.bat` | Restart backend after code changes |
| `CHECK-BACKEND.bat` | Check backend status |

---

## 🎓 First Time User?

1. Double-click `START-SIMPLE.bat`
2. Wait 10 seconds
3. Open http://localhost:3000
4. Register a new account
5. Start using the app!

---

## 📝 Default Login (After Running START-SIMPLE.bat)

No default login - you need to register first!

---

## 🆘 Need Help?

Read: `BACKEND-TROUBLESHOOTING.md`
