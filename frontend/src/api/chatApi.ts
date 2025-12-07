import { useAppStore } from "../store/store";

const API_BASE_URL = process.env.API_BASE;
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
