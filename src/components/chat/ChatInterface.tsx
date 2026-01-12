import { useState, useRef, useEffect } from "react";
import { Send, FileText, ExternalLink } from "lucide-react";
import { Message, Citation } from "../../types";

interface ChatInterfaceProps {
  projectId: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "ai",
    content:
      "你好！我是项目知识助手。你可以向我询问关于这个项目的任何问题，我会基于项目文档和历史记录为你解答。",
    timestamp: new Date().toISOString(),
  },
];

export default function ChatInterface({ projectId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "基于项目22文档，这个问题涉及前端架构设计。我们在技术选型文档中明确了使用 React 18 作为核心框架，配合 Zustand 进行状态管理。主要原因包括：1) 并发渲染能力提升；2) 自动批处理优化；3) 更好的 TypeScript 支持。",
        timestamp: new Date().toISOString(),
        citations: [
          {
            documentId: "1",
            documentName: "技术选型文档.pdf",
            snippet: "React 18 提供的并发特性能够显著提升大型应用的性能...",
            page: 5,
          },
          {
            documentId: "2",
            documentName: "架构设计方案.md",
            snippet: "状态管理选择 Zustand，因为它更轻量且类型安全...",
          },
        ],
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 lg:flex-row">
      <div className="flex-1 flex flex-col rounded-2xl border border-slate-200/70 bg-white/80 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.45)]">
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 shadow-sm ${
                  message.type === "user"
                    ? "bg-[color:var(--brand)] text-white"
                    : "bg-slate-50/80 text-slate-900 border border-slate-200/70"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-2">
                    {message.citations.map((citation, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCitation(citation)}
                        className="flex items-start gap-2 text-xs text-slate-600 hover:text-slate-900 transition-colors w-full text-left"
                      >
                        <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="flex-1">
                          {citation.documentName}
                          {citation.page && ` · 第 ${citation.page} 页`}
                        </span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-200/70 bg-white/70 p-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入你的问题..."
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--brand)] text-white shadow-[0_10px_20px_-12px_rgba(15,118,110,0.8)] transition hover:bg-[color:var(--brand-strong)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-80 flex-col rounded-2xl border border-slate-200/70 bg-white/75 p-4 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.45)]">
        <h3 className="text-sm text-slate-900 mb-3">引用来源</h3>

        {selectedCitation ? (
          <div className="rounded-xl border border-slate-200/70 bg-white/80 p-4">
            <div className="flex items-start gap-2 mb-2">
              <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm text-slate-900 mb-1">
                  {selectedCitation.documentName}
                </h4>
                {selectedCitation.page && (
                  <p className="text-xs text-slate-500">
                    第 {selectedCitation.page} 页
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3 p-3 bg-slate-50/70 rounded-lg border border-slate-200/70">
              {selectedCitation.snippet}
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-slate-400">
            点击消息中的引用查看详情
          </div>
        )}
      </div>
    </div>
  );
}
