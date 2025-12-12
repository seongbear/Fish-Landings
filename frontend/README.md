# Fish-Landings Frontend

React Native mobile app built with Expo, TypeScript, and Firebase for fishing assistance with AI chat, weather data, and knowledge resources.

## Tech Stack

- **Framework**: React Native (Expo ~54.0)
- **Language**: TypeScript
- **Navigation**: React Navigation (bottom tabs + native stack)
- **State**: Zustand
- **Auth & Data**: Firebase (Auth + Firestore)
- **APIs**: Backend chat API, Open-Meteo weather & marine APIs
- **UI**: Lucide icons, LinearGradient

## Setup

### 1. Install dependencies

```powershell
cd frontend
npm install
```

### 2. Configure environment variables

Create a `.env` file in `frontend/`:

```env
# Firebase config
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Backend API
API_BASE=http://localhost:5000
```

### 3. Run the app

```powershell
npm start
```

Then:

- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web
- Scan QR code with Expo Go app on physical device

### 4. Connect physical phone on same WiFi network

To test on a physical device using the same WiFi as your laptop:

1. **Find your laptop's IP address**:

```powershell
ipconfig
```

Look for `IPv4 Address` under your WiFi adapter (e.g., `192.168.1.100`)

2. **Update backend API URL in `.env`**:

```env
API_BASE=http://192.168.1.100:5000
```

Replace `192.168.1.100` with your actual laptop IP address.

3. **Ensure backend allows external connections**:
   Backend `run.py` already listens on `0.0.0.0:5000`, which accepts connections from any device on the network.

4. **Connect your phone**:
   - Ensure phone and laptop are on the **same WiFi network**
   - Open **Expo Go** app on your phone
   - Scan the QR code from terminal or Metro bundler
   - App will load and connect to backend via your laptop's IP

**Note**: If your phone can't connect, check:

- Windows Firewall allows incoming connections on port 5000
- Both devices on same WiFi (not guest network)
- Backend server is running (`python run.py`)

## Project Structure

```
src/
├── api/                    # API clients
│   ├── chatApi.ts         # Backend chat endpoints
│   ├── weatherApi.ts      # Weather & marine data
│   └── articleApi.ts      # Knowledge articles
├── screens/
│   ├── Auth/              # Authentication flow
│   └── (tabs)/            # Main app tabs
│       ├── home/          # Home tab (weather, records, knowledge)
│       ├── ai_help/       # AI chat assistant
│       └── profile/       # User profile & achievements
├── navigators/            # Navigation configuration
├── components/            # Reusable UI components
├── store/                 # Zustand state management
├── utils/                 # Helper functions
├── types/                 # TypeScript type definitions
├── assets/                # Images, icons
└── firebaseConfig.ts      # Firebase initialization
```

## Features

### Home Tab

- **Weather**: Real-time conditions, hourly/daily forecast, marine data
- **Records**: Fishing catch tracking
- **Knowledge**: Articles and guides for fishing

### AI Help Tab

- Chat with AI fishing assistant powered by backend Gemini API
- Session management (create, list, persist history)
- Smart title generation

### Profile Tab

- User information
- Achievements and activity tracking

## API Integration

### Backend (Chat)

Base URL: `process.env.API_BASE`

- `POST /session/create`: Create chat session
- `POST /session/list`: List user sessions
- `POST /chat`: Send message, receive AI reply
- `POST /session/history`: Fetch message history

### External APIs

- **Open-Meteo**: Weather forecast (`api.open-meteo.com`)
- **Marine API**: Wave height, ocean conditions (`marine-api.open-meteo.com`)

## State Management

Using Zustand (`src/store/store.ts`):

- User authentication state
- Session management
- App-wide data sharing

## Scripts

- `npm start`: Start Expo dev server
- `npm run android`: Launch on Android
- `npm run ios`: Launch on iOS
- `npm run web`: Launch web version

## Development Notes

- Entry point: `index.ts` → `src/screens/Auth/App.tsx`
- Firebase config uses `.env` variables (see `firebaseConfig.ts`)
- Backend chat requires running Flask server (see `backend/README.md`)
- Location permissions required for weather features (`expo-location`)

## Dependencies

Key packages:

- `expo`: ~54.0.25
- `react`: 19.1.0
- `react-native`: 0.81.5
- `@react-navigation/native`: ^7.1.21
- `firebase`: ^12.6.0
- `zustand`: ^5.0.8
- `expo-location`: ^19.0.7
- `lucide-react-native`: ^0.554.0

See `package.json` for full list.

## Troubleshooting

- **Firebase errors**: Check `.env` variables match Firebase Console config
- **Backend connection**: Ensure backend server running on `API_BASE` URL
- **Location not working**: Grant location permissions in device settings
- **Expo errors**: Clear cache with `expo start -c`
