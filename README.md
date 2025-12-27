# 📝 DevSecOps Todo App

En fullstack Todo-applikation med REST API, omfattande testning och CI/CD pipeline för DevSecOps-kursen.

**Status**: ✅ Verifierad 2025-12-27 - Alla 33 tester passerar lokalt och i CI/CD

## 🎯 Funktioner

- ✅ Skapa, läsa, uppdatera och ta bort todos (CRUD)
- 📊 Status-spårning (Ej påbörjad, Pågående, Klar)
- 🎨 Prioritetsnivåer (Låg, Medel, Hög)
- 📅 Deadline-hantering
- 🎭 Responsiv design för desktop och mobil
- ✨ Bekräftelsedialoger för borttagning
- ⚠️ Användarvänliga felmeddelanden

## 🏗️ Arkitektur

### Backend
- **Framework**: Flask (Python)
- **Data Storage**: JSON-fil (`backend/tasks.json`)
- **CORS**: Aktiverad för frontend-kommunikation

### Frontend
- **Tech**: Vanilla JavaScript, HTML5, CSS3
- **Design**: Gradient UI med mobile-first approach
- **API Client**: Fetch API

### Tester
- **Backend**: Pytest (11 unit tests)
- **API**: Newman/Postman (11 API tests)
- **E2E**: Playwright (11 end-to-end tests)

## 🚀 Installation och Uppstart

### Förutsättningar
- Python 3.11+
- Node.js 20+
- Git

### Klona projektet
```bash
git clone https://github.com/Haidar2025/devsecops-todo.git
cd devsecops-todo
```

### Backend Setup

1. Installera Python-dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Starta Flask API:
```bash
python app.py
```

API körs på: `http://localhost:5000`

### Frontend Setup

Öppna en ny terminal:

```bash
cd frontend
python -m http.server 8080
```

Frontend körs på: `http://localhost:8080`

Öppna webbläsaren och gå till: `http://localhost:8080`

## 🧪 Tester

### Installera test-dependencies
```bash
npm install
```

### Köra alla tester

**Backend Unit Tests (Pytest)**:
```bash
cd backend
pytest tests/ -v
```

**API Tests (Newman)**:
```bash
# Se till att Flask API körs först!
newman run postman/todo-api-tests.json
```

**E2E Tests (Playwright)**:
```bash
# Se till att både Flask API och frontend körs!
npx playwright test
```

### Se testrapporter
```bash
npx playwright show-report
```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Metod  | Endpoint           | Beskrivning              |
|--------|-------------------|--------------------------|
| GET    | `/api/tasks`      | Hämta alla uppgifter     |
| GET    | `/api/tasks/:id`  | Hämta specifik uppgift   |
| POST   | `/api/tasks`      | Skapa ny uppgift         |
| PUT    | `/api/tasks/:id`  | Uppdatera uppgift        |
| DELETE | `/api/tasks/:id`  | Ta bort uppgift          |
| GET    | `/health`         | Health check             |

### Request Body (POST/PUT)
```json
{
  "title": "Slutför DevOps-uppgift",
  "description": "Implementera alla tester",
  "status": "pågående",
  "priority": "hög",
  "dueDate": "2025-12-20"
}
```

### Validering
- `title`: Obligatoriskt, får inte vara tomt
- `status`: Måste vara `"ej påbörjad"`, `"pågående"` eller `"klar"`
- `priority`: Måste vara `"låg"`, `"medel"` eller `"hög"`

## 🔄 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) kör automatiskt vid:
- Push till `main` eller `develop`
- Pull requests mot `main`

### Pipeline Steg:
1. **Backend Tests** - Pytest unit tests
2. **API Tests** - Newman Postman collection
3. **E2E Tests** - Playwright browser tests

Alla tester måste passa innan merge till `main` är möjlig (branch protection).

## 📁 Projektstruktur

```
devsecops-todo/
├── .github/
│   ├── workflows/
│   │   └── ci.yml              # GitHub Actions pipeline
│   └── copilot-instructions.md # AI coding instructions
├── backend/
│   ├── app.py                  # Flask REST API
│   ├── requirements.txt        # Python dependencies
│   ├── tasks.json              # Data storage (auto-generated)
│   └── tests/
│       └── test_app.py         # Pytest unit tests (11)
├── frontend/
│   ├── index.html              # Main HTML
│   ├── styles.css              # Styling
│   └── app.js                  # Frontend logic
├── tests/
│   └── e2e/
│       └── todo.spec.ts        # Playwright E2E tests (11)
├── postman/
│   └── todo-api-tests.json     # Newman API tests (11)
├── package.json                # Node dependencies & scripts
├── playwright.config.ts        # Playwright configuration
├── .gitignore
├── LICENSE
└── README.md
```

## 🎓 Uppfyller Kurskrav

### ✅ Godkänt (G)
- [x] 4 REST endpoints (GET, POST, PUT, DELETE)
- [x] Frontend med minst 3 CRUD-operationer
- [x] Minst 5 tester per testtyp (11 per typ implementerat)
- [x] GitHub Actions pipeline som passerar
- [x] Branch protection på main
- [x] Dokumentation i README

### ✅ Väl Godkänt (VG) - Implementerat
- [x] 10+ tester per testtyp (11 implementerat)
- [x] Input validering med tydliga felmeddelanden
- [x] Mobile-responsive design
- [x] Bekräftelsedialog vid radering
- [x] Felmeddelanden visas för användaren
- [x] API-dokumentation (se endpoints ovan)

## 🛠️ Utveckling

### Lägga till nya features

1. Skapa feature branch:
```bash
git checkout -b feature/ny-funktion
```

2. Gör ändringar och testa lokalt

3. Commit och push:
```bash
git add .
git commit -m "Add: ny funktion"
git push origin feature/ny-funktion
```

4. Skapa Pull Request på GitHub
5. Vänta på att CI/CD pipeline passerar
6. Merge till main

## 📝 Licens

MIT License - Se [LICENSE](LICENSE)

## 👤 Författare

**Haidar2025**
- GitHub: [@Haidar2025](https://github.com/Haidar2025)

## 🙏 Acknowledgments

- DevSecOps-kurs, Lexicon
- Flask documentation
- Playwright documentation
- Postman/Newman documentation
