# PocketCases 🔍🎙️

PocketCases is an AI-native interactive entertainment platform inspired by **Pocket FM**. It features real-time multiplayer story rooms where listeners become detectives, search for clues, interrogate suspects via AI, and make decisions that shape the narrative. 

This repository contains the complete frontend (React/Vite) and backend (FastAPI/Socket.io/SQLite) codebase.

---

## 🏛️ Architecture & Tech Stack

PocketCases is split into a modern decoupled architecture designed to run efficiently either locally or inside a **Databricks Apps** serverless environment.

### 1. Frontend (React + Vite)
- **Framework**: React 18 with Vite as the build tool.
- **Styling**: Modern, premium dark-mode UI built using Vanilla CSS with high-performance CSS animations and glassmorphism.
- **Realtime**: `socket.io-client` for multiplayer room synchronization.

### 2. Backend (FastAPI + Socket.IO)
- **Framework**: FastAPI (Python 3.10+) serving the REST endpoints.
- **Realtime**: `python-socketio` (ASGI) handling websocket lobbies.
- **Database**: SQLite (`pocketcases.sqlite3`) storing room states and curated cases.
- **Validation**: Pydantic v2 schemas for all inputs and state transitions.

### 3. AI Services & Models Used
We utilize advanced OpenAI models for text-to-speech, real-time multiplayer audio chat, story generation, and art production:
- **Text & Case Generation**: `gpt-4.1-mini` (or `gpt-4o-mini`) – Used for generating complex case outlines, clues, motives, suspect biographies, and character responses during interrogations.
- **Realtime Voice Chat (Interrogation)**: `gpt-realtime` (OpenAI Realtime API / `gpt-4o-realtime-preview`) – Enables low-latency, conversational voice interrogations directly with the suspects.
- **Text-to-Speech (TTS) Narration**: `gpt-4o-mini-tts` (or `tts-1`) – Narrates story prefaces and choices aloud to provide a high-fidelity audiobook experience.
- **Cover Art Generation**: `dall-e-3` – Generates cinematic movie-style covers for approved cases. If no key is set or the API fails, it seamlessly falls back to **Pollinations.ai** to ensure artwork is always rendered.

---

## ⚙️ How It Works (Workflow)

```mermaid
graph TD
    A[Admin: Case Forge] -->|Generate AI Draft| B(AI Generates Lobbies/Clues/Suspects)
    B -->|Approve & Publish| C(Save to SQLite DB & Generate Cover Art)
    C -->|Dynamic REST Sync| D[Player Lobbies: Verdicts]
    D -->|Select Case| E(Lobby Socket Room Room Created)
    E -->|Start Game| F(Play: Shared Board & Suspect Interrogations)
```

1. **Admin / Case Forge**: Admins input a theme (e.g. *"A poisoned wine glass at a royal palace"*). The AI generates a fully-detailed murder mystery with suspects, biological motives, and 3 tiers of clues (critical, supporting, red herring).
2. **Dynamic Art & Publishing**: Upon approving the draft, the app automatically generates a custom cinematic cover art poster and publishes the game.
3. **Verdicts Catalog**: The published case instantly syncs and appears in the players' **Verdicts** menu.
4. **Browser Refresh Auto-Reset (Demo Mode)**: To keep the demo environment clean, refreshing your browser window triggers a request that wipes temporary published cases, leaving the default three curated cases.

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.10 or higher installed.
- Node.js (v18+) installed.

### Step 1: Setup Backend
1. Open a terminal in the project root:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```
2. Copy the `.env.example` to `.env` and fill in your keys:
   ```env
   OPENAI_API_KEY=sk-proj-your-actual-api-key
   DATABASE_PATH=./pocketcases.sqlite3
   ```

### Step 2: Setup Frontend
1. Open a new terminal in the `frontend-react` folder:
   ```bash
   cd frontend-react
   npm install
   ```

### Step 3: Run the App
1. **Start the Python Backend**:
   ```bash
   # From root folder
   .\venv\Scripts\python.exe -m app.main
   ```
   *The backend will run on `http://127.0.0.1:8000`.*
   
2. **Start the React Frontend**:
   ```bash
   # From frontend-react folder
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`. Open this URL in your browser.*

---

## ☁️ Deploying to Databricks Apps

PocketCases is configured to build and deploy to **Databricks Apps** out of the box using the configured `app.yaml` file.

### Step 1: Build the Frontend Assets
Since the Python backend serves the static React assets in production, compile the React build locally before deploying:
```bash
cd frontend-react
npm run build
cd ..
```

### Step 2: Authenticate Databricks CLI
If you haven't already:
1. Generate an Access Token in your Databricks workspace (**User Settings -> Developer -> Access tokens**).
2. Run in your terminal:
   ```bash
   databricks configure
   ```
3. Enter your Databricks Workspace URL (e.g. `https://xxx.databricksapps.com`) and paste the generated token.

### Step 3: Deploy
Run the deployment command from the project root:
```bash
databricks apps deploy digitalagentic --source-path .
```
Databricks will automatically spin up the FastAPI service, bind it to the correct internal port, and serve your React app!

---

## 🧪 Quick Verification & Demos

- **API Documentation**: While the backend is running, access the interactive Swagger UI at:
  [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: Verify the status of the server and SQLite database:
  [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Case Forge / Admin Panel**: Click the profile icon in the bottom left of the sidebar, log in with admin, and try typing a custom theme like `"Murder on the Mumbai-Pune Expressway"`. Click "Generate Draft" to watch DALL-E-3 and GPT-4o-mini work in real time.
