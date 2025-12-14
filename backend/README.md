# Fish-Landings Backend

Flask backend using Firebase Realtime Database + Gemini LLM, served through Uvicorn (ASGI).

## Setup

### 1. Install dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### 2. Create `.env`

```ini
GEMINI_API_KEY=your_google_genai_api_key
DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

### 3. Add Firebase Admin Key

Save your Firebase admin credential:

```bash
backend/serviceAccountKey.json
```

### 4. Run the server

```powershell
python run.py
```

Backend URL: `http://localhost:5000`

## API Endpoints

### POST `/session/create`

Create a new chat session.

Response: `{ session_id, status }`

### POST `/session/list`

List all chat sessions for a user.

### POST `/session/title`

Generate or update a session title using recent messages.

### POST `/chat`

Send a user message and get an AI reply.

Returns: `{ answer, history }`

### POST `/session/history`

Get the chat message history for a session.
