import { useEffect, useRef, useState } from "react";
import { Message, Citation } from "@/types";
import { aiService } from "@/services/aiService";
import { toast } from "sonner";
import { log } from "node:console";

const initialMessages: Message[] = [
  {
    id: "1",
    type: "ai",
    content:
      "你好！我是项目知识助手。你可以向我询问关于这个项目的任何问题，我会基于项目文档和历史记录为你解答。",
    timestamp: new Date().toISOString(),
  },
];

export function useChat(projectId: string) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userContent = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userContent,
      timestamp: new Date().toISOString(),
    };
    console.log(userMessage, "userMessage");

    setMessages((prev) => [...prev, userMessage]); //

    setInput("");
    setLoading(true);

    try {
      // Convert to chat format expected by generic AI service
      // We only send the last few messages to save tokens if needed, but for now send all
      const contextMessages = messages.concat(userMessage).map((m) => ({
        role: m.type === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      }));

      const response = await aiService.chatCompletion({
        projectId,
        messages: contextMessages,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "AI响应异常");
      }

      // Parse response from n8n (Assuming n8n returns { content: string, citations?: [] })
      // Adjust this based on actual n8n output structure defined in workflow_design
      const data = response.data as any; // Safe cast for now

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.content || data.output || "（收到空回复）",
        timestamp: new Date().toISOString(),
        citations: data.citations || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("发送失败，请检查网络或配置");

      // Optional: Remove user message if failed? Or add error marker.
      // For now, simple error toast.
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    loading,
    selectedCitation,
    setSelectedCitation,
    handleSend,
    messagesEndRef,
  };
}
