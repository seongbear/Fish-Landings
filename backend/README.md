# Fish-Landings Backend

Flask-based backend using **Firebase Realtime Database** and **Gemini LLM**, served with **Uvicorn (ASGI)**.

---

## 🐍 Setting up Python Virtual Environment (.venv)

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv .venv
```

This creates an isolated Python environment inside the `.venv` folder.

### 3. Activate virtual environment

**macOS / Linux**

```bash
source .venv/bin/activate
```

**Windows (PowerShell)**

```powershell
.venv\Scripts\Activate.ps1
```

✅ When activated, your terminal will show `(.venv)` at the beginning.

---

## 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

### Create `.env` file in `backend/`

```ini
GEMINI_API_KEY=your_google_genai_api_key
DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
OPENAI_API_KEY=your_open_ai_api_key
```

---

## 🔑 Firebase Admin SDK

Download your Firebase **Service Account Key** and save it as:

```bash
backend/serviceAccountKey.json
```

⚠️ **Do NOT commit this file to GitHub**

Add to `.gitignore`:

```gitignore
serviceAccountKey.json
.env
.venv/
```

---

## 🚀 Run the Server

```bash
python run.py
```

Server will start at:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### POST `/session/create`

Create a new chat session

**Response**

```json
{ "session_id": "string", "status": "created" }
```

---

### POST `/session/list`

List all chat sessions for a user

---

### POST `/session/title`

Generate or update a session title using recent messages

---

### POST `/chat`

Send a user message and receive AI response

**Response**

```json
{ "answer": "string", "history": [] }
```

---

### POST `/session/history`

Retrieve chat message history for a session

---

## 🧠 Tech Stack

- **Flask (ASGI-compatible)**
- **Uvicorn**
- **Firebase Realtime Database**
- **Google Gemini LLM**
- **Python 3.10+**

---

## ✅ Notes

- Ensure `.venv` is activated before running the server
- Firebase Admin SDK is required for database access
- Gemini API key is mandatory for chat functionality

---

Happy coding 🎣🤖
