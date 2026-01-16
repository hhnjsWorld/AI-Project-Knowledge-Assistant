"use client";

import { Send, FileText, ExternalLink, Paperclip, Loader2 } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useRef } from "react";
import { toast } from "sonner";

interface ChatInterfaceProps {
  projectId: string;
}

export default function ChatInterface({ projectId }: ChatInterfaceProps) {
  const {
    messages,
    input,
    setInput,
    loading,
    selectedCitation,
    setSelectedCitation,
    handleSend,
    messagesEndRef,
  } = useChat(projectId);

  // We don't need a callback here since the chat uses RAG which queries the DB directly.
  // Once uploaded and indexed, the next query will pick it up.
  // Maybe show a toast on completion.
  const { uploadFiles, isUploading } = useDocumentUpload(projectId, () => {
    // Optional: Refresh some state if needed.
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="h-full flex flex-col gap-0 lg:flex-row bg-white/50">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scroll-smooth">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] lg:max-w-2xl rounded-2xl p-5 shadow-sm transition-all ${
                  message.type === "user"
                    ? "bg-teal-600 text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-md"
                }`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>

                {message.citations && message.citations.length > 0 && (
                  <div
                    className={`mt-4 pt-3 border-t space-y-2 ${
                      message.type === "user"
                        ? "border-teal-500/30"
                        : "border-slate-100"
                    }`}
                  >
                    {message.citations.map((citation, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCitation(citation)}
                        className={`flex items-start gap-2 text-xs transition-colors w-full text-left ${
                          message.type === "user"
                            ? "text-teal-100 hover:text-white"
                            : "text-slate-500 hover:text-teal-600"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-70" />
                        <span className="flex-1">
                          {citation.documentName}
                          {citation.page && ` · 第 ${citation.page} 页`}
                        </span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white/40 border-t border-white/60">
          {/* File Upload Input (Hidden) */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            // accept=".pdf,.txt,.md"
          />

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500/50 transition-all">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || loading}
              className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50"
              title="上传文档"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
              ) : (
                <Paperclip className="w-5 h-5" />
              )}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                isUploading
                  ? "正在上传并索引..."
                  : "问点什么关于这个项目的问题..."
              }
              className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-base"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          {isUploading && (
            <p className="text-xs text-teal-600 mt-2 px-1 animate-pulse">
              正在将文件加入知识库，AI 稍后即可读取...
            </p>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-80 flex-col bg-slate-50/50 border-l border-white/60 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" />
          引用来源
        </h3>

        {selectedCitation ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <FileText className="w-4 h-4 text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-900 leading-snug truncate">
                  {selectedCitation.documentName}
                </h4>
                {selectedCitation.page && (
                  <p className="text-xs text-slate-500 mt-1">
                    第 {selectedCitation.page} 页
                  </p>
                )}
              </div>
            </div>
            <div className="text-sm text-slate-600 relative pl-4 border-l-2 border-teal-200 bg-slate-50/50 p-3 rounded-r-lg">
              "{selectedCitation.snippet}"
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-slate-200/60 bg-slate-50/30">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 max-w-[160px]">
              点击对话中的引用链接
              <br />
              在此处查看详细内容
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
