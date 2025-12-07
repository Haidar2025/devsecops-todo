# Quick Start Guide

## 🚀 Snabbstart (5 minuter)

### 1. Klona och navigera
```powershell
git clone https://github.com/Haidar2025/devsecops-todo.git
cd devsecops-todo
```

### 2. Starta Backend (Terminal 1)
```powershell
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Starta Frontend (Terminal 2)
```powershell
cd frontend
python -m http.server 8080
```

### 4. Öppna i webbläsare
```
http://localhost:8080
```

## ✅ Testa lokalt

### Backend Tests
```powershell
cd backend
pytest tests/ -v
```

### API Tests (kräver att API körs)
```powershell
npm install -g newman
newman run postman/todo-api-tests.json
```

### E2E Tests (kräver att både API och frontend körs)
```powershell
npm install
npx playwright install chromium
npx playwright test
```

## 📋 Checklista för inlämning

- [ ] Alla tester passar lokalt
- [ ] GitHub Actions workflow är grön
- [ ] Branch protection är aktiverad på main
- [ ] README är uppdaterad med korrekt information
- [ ] Repository är publikt ELLER lärare är inbjuden

## 🐛 Felsökning

**Flask startar inte?**
```powershell
pip install --upgrade flask flask-cors
```

**Port redan används?**
Ändra port i `backend/app.py` (rad sista):
```python
app.run(debug=True, port=5001)  # Byt från 5000
```

Uppdatera sedan `frontend/app.js` API_URL till ny port.

**Playwright fungerar inte?**
```powershell
npx playwright install --with-deps
```
