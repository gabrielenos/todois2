# Backend Troubleshooting Guide

## 🔍 Cek Status Backend

### **Cara 1: Pakai Script**
```bash
# Double-click file ini:
CHECK-BACKEND.bat
```

### **Cara 2: Manual**
```bash
# Cek apakah port 8000 dipakai
netstat -ano | findstr :8000

# Test backend
curl http://localhost:8000/health
```

---

## 🚀 Cara Start Backend

### **Opsi 1: Pakai Script (RECOMMENDED)**
```bash
# Double-click file ini:
START-BACKEND.bat
```

### **Opsi 2: Manual**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **Opsi 3: Pakai START-SIMPLE.bat**
```bash
# Start frontend + backend sekaligus:
START-SIMPLE.bat
```

---

## 🔄 Restart Backend (Setelah Update Code)

### **PENTING: Setelah Update Code, Restart Backend!**

**Cara Restart:**
```bash
# Double-click file ini:
RESTART-BACKEND.bat
```

**Atau Manual:**
```bash
# 1. Stop backend lama
netstat -ano | findstr :8000
taskkill /PID <nomor_pid> /F

# 2. Start backend baru
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## ❌ Masalah Umum & Solusi

### **1. Backend Tidak Bisa Start**

**Error: "Port 8000 already in use"**

**Solusi:**
```bash
# Cari process yang pakai port 8000
netstat -ano | findstr :8000

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /PID <nomor_pid> /F
```

---

### **2. Module Not Found**

**Error: "ModuleNotFoundError: No module named 'fastapi'"**

**Solusi:**
```bash
cd backend
pip install -r requirements.txt
```

---

### **3. Database Error**

**Error: "OperationalError: unable to open database file"**

**Solusi:**
```bash
# Hapus database lama dan buat baru
cd backend
del todo_app.db
python -m uvicorn main:app --reload
```

---

### **4. Backend Jalan Tapi Frontend Tidak Connect**

**Cek:**
1. Backend jalan di `http://localhost:8000` ✅
2. File `.env.local` ada dan berisi:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Restart frontend (Ctrl+C, lalu `npm run dev`)

---

## 📝 Checklist Sebelum Kumpul

- [ ] Backend bisa start dengan `START-BACKEND.bat`
- [ ] `http://localhost:8000/health` return `{"status": "healthy"}`
- [ ] `http://localhost:8000/docs` bisa dibuka (Swagger UI)
- [ ] Frontend bisa connect ke backend
- [ ] Login/Register berfungsi
- [ ] CRUD todos berfungsi

---

## 🆘 Masih Error?

**Coba langkah ini:**

1. **Restart semua:**
   ```bash
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C)
   # Tutup semua terminal
   # Buka terminal baru
   # Start backend: START-BACKEND.bat
   # Start frontend: npm run dev
   ```

2. **Reinstall dependencies:**
   ```bash
   cd backend
   pip install --upgrade -r requirements.txt
   ```

3. **Reset database:**
   ```bash
   cd backend
   del todo_app.db
   # Start backend lagi
   ```

---

## ✅ Backend Healthy Jika:

```json
// http://localhost:8000/health
{
  "status": "healthy"
}
```

```json
// http://localhost:8000
{
  "message": "Welcome to Todo List API",
  "docs": "/docs",
  "version": "1.0.0"
}
```
