import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAppStore } from "../../../../store/store";
import {
  sendMessageAPI,
  createSessionAPI,
  getSessionsAPI,
  getHistoryAPI,
  generateTitleAPI,
} from "../../../../api/chatApi";
import { Session } from "../types/session";
import { Message } from "../types/message";

interface UseChatHookReturn {
  sessions: Session[];
  currentSession: Session | null;
  currentSessionId: string | null;
  message: string;
  isDrawerOpen: boolean;
  setMessage: (msg: string) => void;
  setIsDrawerOpen: (open: boolean) => void;
  handleSend: () => Promise<void>;
  handleSelectSession: (sessionId: string) => void;
  createNewSession: () => Promise<void>;
  loading: boolean;
}

const welcomeMessage = "Hello! I'm your AI fishing assistant. How can I help you today?";

const useChatHook = (): UseChatHookReturn => {
  const user = useAppStore((state) => state.user);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load all sessions when user logs in
  useEffect(() => {
    if (!user) return;
    fetchSessions();
  }, [user]);

  // Load messages when switching sessions
  useEffect(() => {
    if (!currentSessionId || !user) return;
    if (currentSessionId.startsWith("temp_")) return;
    fetchSessionHistory(currentSessionId);
  }, [currentSessionId, user]);

  // Fetch all sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const resp = await getSessionsAPI();
      const formattedSessions: Session[] = resp.sessions.map((s: any) => ({
        id: s.session_id || s.id,
        title: s.title,
        messages: [], // messages loaded lazily
      }));

      // No sessions? Create a temporary local session with welcome message
      if (formattedSessions.length === 0) {
        const tempSession: Session = {
          id: "temp_welcome",
          title: "Welcome Session",
          messages: [
            {
              text: welcomeMessage,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isUser: false,
            },
          ],
        };
        setSessions([tempSession]);
        setCurrentSessionId("temp_welcome");
      } else {
        setSessions(formattedSessions);
        if (!currentSessionId) setCurrentSessionId(formattedSessions[0].id);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a session
  const fetchSessionHistory = async (sessionId: string) => {
    try {
      const resp = await getHistoryAPI(sessionId);
      const historyMessages: Message[] = resp.history.map((m: any) => ({
        text: m.text,
        time: new Date(m.ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: m.role === "user",
      }));
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: historyMessages } : s))
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to load chat history");
    }
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId) || null;

  // Send message
  const handleSend = async () => {
    if (!message.trim() || !currentSessionId || !user) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage: Message = { text: message, time: now, isUser: true };

    let sessionId = currentSessionId;
    let isTempSession = currentSessionId.startsWith("temp_");
    let messagesToSave: Message[] = [];

    // If session is temporary, persist it first along with initial AI message
    if (isTempSession) {
      setLoading(true);
      try {
        const resp = await createSessionAPI("New Chat");
        sessionId = resp.session_id;

        // Include existing AI greeting + user message
        const tempMessages = currentSession?.messages || [];
        messagesToSave = [...tempMessages, userMessage];

        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId ? { ...s, id: sessionId, messages: messagesToSave } : s
          )
        );
        setCurrentSessionId(sessionId);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to create session");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    } else {
      messagesToSave = [...(currentSession?.messages || []), userMessage];
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: messagesToSave } : s))
      );
    }

    const msgCopy = message;
    setMessage("");

    try {
      const resp = await sendMessageAPI(sessionId, msgCopy);

      const aiMessage: Message = {
        text: resp.answer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: false,
      };

      // Append AI response
      messagesToSave = [...messagesToSave, aiMessage];
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: messagesToSave } : s))
      );

      // Generate session title if session was temporary or short
      if (isTempSession || currentSession?.messages.length! <= 2) {
        await generateTitleAPI(user.uid, sessionId, resp.answer);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send message");
    }
  };

  // --- Switch sessions ---
  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsDrawerOpen(false);

    if (!sessionId.startsWith("temp_")) fetchSessionHistory(sessionId);
  };

  // Create a new session
  const createNewSession = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const resp = await createSessionAPI("New Chat");
      const newSession: Session = { id: resp.session_id, title: "New Chat", messages: [] };
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(resp.session_id);
      setIsDrawerOpen(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create new session");
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    currentSession,
    currentSessionId,
    message,
    isDrawerOpen,
    setMessage,
    setIsDrawerOpen,
    handleSend,
    handleSelectSession,
    createNewSession,
    loading,
  };
};

export default useChatHook;
