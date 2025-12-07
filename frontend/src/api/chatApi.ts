import { useAppStore } from "../store/store";

const API_BASE_URL = process.env.API_BASE;

// Create a new chat session
export const createSessionAPI = async (title: string) => {
  const user = useAppStore.getState().user;
  if (!user) throw new Error("User not signed in");

  const res = await fetch(`${API_BASE_URL}/session/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.uid, title }),
  });

  return res.json();
};

// Get list of chat sessions
export const getSessionsAPI = async () => {
  const user = useAppStore.getState().user;
  if (!user) throw new Error("User not signed in");

  const res = await fetch(`${API_BASE_URL}/session/list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.uid }),
  });

  return res.json();
};

// Send a message to the AI and get a response
export const sendMessageAPI = async (sessionId: string, query: string) => {
  const user = useAppStore.getState().user;
  if (!user) throw new Error("User not signed in");

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.uid, session_id: sessionId, query }),
  });

  return res.json();
};

// Fetch chat history for a session
export const getHistoryAPI = async (sessionId: string) => {
  const user = useAppStore.getState().user;
  if (!user) throw new Error("User not signed in");

  const res = await fetch(`${API_BASE_URL}/session/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.uid, session_id: sessionId }),
  });

  return res.json();
}

// generate a title for a session based on the first user message
export const generateTitleAPI = async (messages: { text: string; isUser: boolean }[]) => {
  const user = useAppStore.getState().user;
  if (!user) throw new Error("User not signed in");

  const res = await fetch(`${API_BASE_URL}/session/title`, {  // <-- use /title
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  return res.json();
};

