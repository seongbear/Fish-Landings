import { useAppStore } from './store';

const API_BASE = "http://192.168.0.247:5000"; // replace with your PC IP

// --------------------- Create session ---------------------
export const createSessionAPI = async (title: string) => {
  const user = useAppStore.getState().user;
  if (!user) throw new Error("User not signed in");

  const res = await fetch(`${API_BASE}/session/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.uid, title }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${text}`);
  }

  const data = await res.json();
  return { session_id: data.session_id };
};

// --------------------- Send message ---------------------
export const sendMessageAPI = async (sessionId: string, query: string) => {
  const user = useAppStore.getState().user;
  if (!user) throw new Error("User not signed in");

  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.uid,
      session_id: sessionId,
      query,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${text}`);
  }

  const data = await res.json();

  // Convert Firebase messages into structured array for your chat
  // Each message: { text, time, isUser }
  const formattedHistory = (data.history || []).map((msg: any) => ({
    text: msg.text,
    time: new Date(msg.ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isUser: msg.role === 'user',
  }));

  return {
    answer: data.answer,
    history: formattedHistory,
  };
};
