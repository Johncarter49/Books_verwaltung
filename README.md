# 📚 Buchverwaltung Fullstack-Anwendung

Eine moderne Fullstack-Anwendung zur Buchverwaltung mit FastAPI Backend und OpenUI5 Frontend.

## 🚀 Features

- **Vollständige CRUD-Operationen** für Bücher
- **Responsive UI** mit OpenUI5/SAPUI5
- **RESTful API** mit FastAPI
- **PostgreSQL Datenbank** mit SQLAlchemy ORM
- **Docker Containerization**
- **CI/CD Pipeline** mit GitHub Actions
- **Sicherheits-Scans** und Code-Qualitätsprüfungen

## 🏗️ Technologie-Stack

### Backend
- **FastAPI** 0.111.0 - Modern Python Web Framework
- **SQLAlchemy** 2.0.30 - ORM für Datenbankoperationen
- **PostgreSQL** 16 - Relationale Datenbank
- **Pydantic** 2.7.1 - Datenvalidierung
- **Uvicorn** - ASGI Server

### Frontend
- **OpenUI5/SAPUI5** - Enterprise UI Framework
- **TypeScript** - Typisierte JavaScript-Entwicklung
- **JSONModel** - Datenbindung
- **Responsive Design**

### DevOps
- **Docker & Docker Compose**
- **GitHub Actions** - CI/CD Pipeline
- **Trivy** - Sicherheits-Scans
- **Health Checks**

## 📋 Voraussetzungen

- Docker & Docker Compose
- Git
- Node.js 20+ (für lokale Entwicklung)
- Python 3.11+ (für lokale Entwicklung)

## 🚀 Schnellstart

### Mit Docker (Empfohlen)

```bash
# Repository klonen
git clone https://github.com/Johncarter49/Books_verwaltung.git
cd Books_verwaltung

# Anwendung starten
docker compose up --build -d

# Anwendung öffnen
open http://localhost:8081
```

### Lokale Entwicklung

```bash
# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend Setup
cd ../frontend
npm install

# Datenbank starten
docker run -d --name postgres \
  -e POSTGRES_USER=books \
  -e POSTGRES_PASSWORD=books \
  -e POSTGRES_DB=books \
  -p 5432:5432 \
  postgres:16-alpine

# Backend starten
cd ../backend
uvicorn app.main:app --reload --port 8001

# Frontend starten (neues Terminal)
cd ../frontend
npm start
```

## 📖 API Dokumentation

### Endpunkte

- `GET /health` - Health Check
- `GET /books` - Alle Bücher abrufen
- `GET /books/{id}` - Einzelnes Buch abrufen
- `POST /books` - Neues Buch erstellen
- `PUT /books/{id}` - Buch aktualisieren
- `DELETE /books/{id}` - Buch löschen

### Swagger UI
Nach dem Start der Anwendung: http://localhost:8001/docs

### Beispiel Request

```bash
# Neues Buch erstellen
curl -X POST "http://localhost:8001/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Harry Potter",
    "author": "J.K. Rowling",
    "created_by": "admin"
  }'

# Bücher suchen
curl "http://localhost:8001/books?q=harry"
```

## 🐳 Docker

### Container

- **frontend**: Node.js Alpine + Express Server (Port 8081)
- **backend**: Python Alpine + FastAPI (Port 8001)
- **db**: PostgreSQL 16 Alpine (Port 5432)

### Befehle

```bash
# Anwendung starten
docker compose up -d

# Logs anzeigen
docker compose logs -f

# Anwendung stoppen
docker compose down

# Volumes löschen
docker compose down -v
```

## 🔧 Entwicklung

### Projektstruktur

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI Anwendung
│   │   ├── models.py        # SQLAlchemy Modelle
│   │   ├── schemas.py       # Pydantic Schemas
│   │   ├── crud.py          # CRUD Operationen
│   │   ├── database.py      # Datenbank-Konfiguration
│   │   └── seed.py          # Beispieldaten
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── webapp/
│   │   ├── main.ts          # Hauptanwendung
│   │   ├── manifest.json    # UI5 Manifest
│   │   └── index.html       # HTML Template
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/
│   └── ci-cd.yml           # CI/CD Pipeline
├── docker-compose.yml
└── README.md
```

### Tests

```bash
# Backend Tests
cd backend
pytest tests/ -v

# Frontend Tests
cd frontend
npm test

# E2E Tests
npm run test:e2e
```

### Code Quality

```bash
# Python Linting
cd backend
flake8 app/
black app/
isort app/
mypy app/

# TypeScript Linting
cd frontend
npm run lint
```

## 🔒 Sicherheit

- **CORS-Konfiguration** für Cross-Origin Requests
- **Input Validation** mit Pydantic
- **SQL Injection Protection** durch SQLAlchemy
- **Automatische Sicherheits-Scans** mit Trivy
- **Environment-based Configuration**

## 📊 Monitoring

### Health Checks

- Backend: `GET /health`
- Frontend: Static File Serving
- Database: `pg_isready`

### Logs

```bash
# Container Logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Application Logs
docker compose exec backend tail -f /app/logs/app.log
```

## 🚀 CI/CD Pipeline

Die GitHub Actions Pipeline führt folgende Schritte aus:

1. **Backend Tests** - Unit Tests mit pytest
2. **Frontend Tests** - TypeScript Tests
3. **Docker Build** - Container Images erstellen
4. **Security Scan** - Trivy Vulnerability Scanner
5. **Code Quality** - Linting und Formatierung
6. **Deployment** - Automatisches Deployment (optional)

### Pipeline Status

![CI/CD Pipeline](https://github.com/Johncarter49/Books_verwaltung/workflows/CI/CD%20Pipeline/badge.svg)

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📝 Lizenz

Dieses Projekt ist unter der MIT Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 👥 Autoren

- **John Carter** - *Initiale Arbeit* - [Johncarter49](https://github.com/Johncarter49)

## 🙏 Danksagungen

- [FastAPI](https://fastapi.tiangolo.com/) für das großartige Python Framework
- [OpenUI5](https://openui5.org/) für das UI Framework
- [Docker](https://www.docker.com/) für Containerization
- [GitHub Actions](https://github.com/features/actions) für CI/CD

## 📞 Support

Bei Fragen oder Problemen:

1. Überprüfe die [Issues](https://github.com/Johncarter49/Books_verwaltung/issues)
2. Erstelle ein neues Issue mit detaillierter Beschreibung
3. Kontaktiere den Maintainer

---

⭐ Wenn dir dieses Projekt gefällt, gib ihm einen Stern!
