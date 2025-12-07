import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { User, Bot } from "lucide-react-native";
import { Message } from "../types/message";

interface ChatBubbleProps extends Message {}

/**
 * Helper to parse inline styles: **bold** and `code`
 */
const renderInlineStyles = (text: string, isUser: boolean) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={styles.bold}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <Text key={index} style={styles.inlineCode}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    return <Text key={index} style={isUser ? styles.userText : styles.botText}>{part}</Text>;
  });
};

export default function ChatBubble({ text, time, isUser }: ChatBubbleProps) {
  
  const formattedContent = useMemo(() => {
    if (!text) return null;

    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // --- 1. Handle Code Blocks (```) ---
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          // Close block
          elements.push(
            <View key={`code-${i}`} style={styles.codeBlock}>
              <Text style={styles.codeBlockText}>{codeBlockContent.join("\n")}</Text>
            </View>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // Start block
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      const trimmedLine = line.trim();
      if (!trimmedLine) continue; // Skip empty lines for cleaner look

      // --- 2. Headers ---
      if (trimmedLine.startsWith("### ")) {
        elements.push(
          <Text key={i} style={styles.h3}>
            {renderInlineStyles(trimmedLine.replace("### ", ""), isUser)}
          </Text>
        );
      } else if (trimmedLine.startsWith("## ")) {
        elements.push(
          <Text key={i} style={styles.h2}>
            {renderInlineStyles(trimmedLine.replace("## ", ""), isUser)}
          </Text>
        );
      } else if (trimmedLine.startsWith("# ")) {
        elements.push(
          <Text key={i} style={styles.h1}>
            {renderInlineStyles(trimmedLine.replace("# ", ""), isUser)}
          </Text>
        );
      }
      
      // --- 3. Lists (Bullets & Numbered) ---
      else if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ")) {
        elements.push(
          <View key={i} style={styles.bulletRow}>
            <Text style={isUser ? styles.userText : styles.botText}>• </Text>
            <Text style={[isUser ? styles.userText : styles.botText, { flex: 1 }]}>
               {renderInlineStyles(trimmedLine.replace(/^[\*\-]\s/, ""), isUser)}
            </Text>
          </View>
        );
      }
      else if (/^\d+\.\s/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+\.)\s/);
        const number = match ? match[1] : "";
        elements.push(
          <View key={i} style={styles.bulletRow}>
             <Text style={isUser ? styles.userText : styles.botText}>{number} </Text>
             <Text style={[isUser ? styles.userText : styles.botText, { flex: 1 }]}>
                {renderInlineStyles(trimmedLine.replace(/^\d+\.\s/, ""), isUser)}
             </Text>
          </View>
        );
      }

      // --- 4. Regular Text ---
      else {
        elements.push(
          <Text key={i} style={styles.paragraph}>
            {renderInlineStyles(trimmedLine, isUser)}
          </Text>
        );
      }
    }
    
    // Catch unclosed code blocks
    if (inCodeBlock && codeBlockContent.length > 0) {
       elements.push(
        <View key="code-incomplete" style={styles.codeBlock}>
          <Text style={styles.codeBlockText}>{codeBlockContent.join("\n")}</Text>
        </View>
      );
    }

    return elements;
  }, [text, isUser]);

  return (
    <View style={[styles.container, isUser ? styles.userRow : styles.botRow]}>
      {/* Bot Avatar */}
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Bot size={26} color="#1e40af" />
        </View>
      )}

      {/* Bubble */}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <View style={styles.contentContainer}>
            {formattedContent}
        </View>
        <Text style={[styles.time, isUser ? styles.userTime : styles.botTime]}>{time}</Text>
      </View>

      {/* User Avatar */}
      {isUser && (
        <View style={styles.avatarContainer}>
          <User size={26} color="#4b5563" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-end",
  },
  botRow: { justifyContent: "flex-start" },
  userRow: { justifyContent: "flex-end" },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    borderColor: "#d1d5db",
    borderWidth: 1,
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  botBubble: { backgroundColor: "#f9fafb", borderBottomLeftRadius: 4, borderWidth: 1, borderColor: "#e5e7eb" },
  userBubble: { backgroundColor: "#2563eb", borderBottomRightRadius: 4 },
  
  contentContainer: { gap: 4 }, // Adds spacing between paragraphs/lists

  // Text Styles
  botText: { color: "#1f2937", fontSize: 15, lineHeight: 22 },
  userText: { color: "#ffffff", fontSize: 15, lineHeight: 22 },
  paragraph: { marginBottom: 2 },
  
  // Markdown Styles
  bold: { fontWeight: "bold" },
  inlineCode: {
    fontFamily: "monospace",
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 14,
  },
  codeBlock: {
    backgroundColor: "#1f2937",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  codeBlockText: {
    color: "#f3f4f6",
    fontFamily: "monospace",
    fontSize: 13,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 4,
    marginBottom: 2
  },
  h1: { fontSize: 20, fontWeight: "bold", marginVertical: 4 },
  h2: { fontSize: 18, fontWeight: "bold", marginVertical: 3 },
  h3: { fontSize: 16, fontWeight: "bold", marginVertical: 2 },

  // Time
  time: { fontSize: 11, marginTop: 6, textAlign: "right" },
  botTime: { color: "#6b7280" },
  userTime: { color: "#bfdbfe" },
});