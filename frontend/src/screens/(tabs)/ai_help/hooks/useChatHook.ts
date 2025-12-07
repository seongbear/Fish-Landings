import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { createSessionAPI, sendMessageAPI } from "../../../../store/api";
import { useAppStore } from "../../../../store/store";

export interface Message {
  text: string;
  time: string;
  isUser: boolean;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
}

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

const useChatHook = (): UseChatHookReturn => {
  const user = useAppStore(state => state.user);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Initialize first session
  // -------------------------------
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      setLoading(true);
      try {
        const session = await createSessionAPI("Welcome Session");
        const newSession: Session = {
          id: session.session_id,
          title: "Welcome Session",
          messages: [
            {
              text: "Hello! I'm your AI fishing assistant. How can I help?",
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toLowerCase(),
              isUser: false
            }
          ]
        };
        setSessions([newSession]);
        setCurrentSessionId(session.session_id);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to create session");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  // -------------------------------
  // Send message
  // -------------------------------
  const handleSend = async () => {
    if (!message.trim() || !currentSession || !user) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toLowerCase();
    const userMessage: Message = { text: message, time: timeString, isUser: true };

    // Update local state first
    setSessions(prev =>
      prev.map(s => (s.id === currentSessionId ? { ...s, messages: [...s.messages, userMessage] } : s))
    );
    setMessage("");

    try {
      const resp = await sendMessageAPI(currentSession.id, message);
      const aiMessage: Message = {
        text: resp.answer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toLowerCase(),
        isUser: false
      };
      setSessions(prev =>
        prev.map(s => (s.id === currentSession.id ? { ...s, messages: [...s.messages, aiMessage] } : s))
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send message");
    }
  };

  // -------------------------------
  // Session management
  // -------------------------------
  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsDrawerOpen(false);
  };

  const createNewSession = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const session = await createSessionAPI("New Chat Session");
      const newSession: Session = {
        id: session.session_id,
        title: "New Chat Session",
        messages: [
          {
            text: "New conversation started. How can I assist you?",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toLowerCase(),
            isUser: false
          }
        ]
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(session.session_id);
      setIsDrawerOpen(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create session");
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
    loading
  };
};

export default useChatHook;
