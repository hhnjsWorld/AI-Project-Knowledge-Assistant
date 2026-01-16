"use client";

import { Settings as SettingsIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { settingsService, UserSettings } from "@/services/settingsService";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State for form fields
  const [aiModel, setAiModel] = useState("GPT-3.5 Turbo");
  const [vectorDb, setVectorDb] = useState("Pinecone");
  const [threshold, setThreshold] = useState(70);

  // Load settings on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await settingsService.getSettings();
        if (data) {
          setAiModel(data.ai_model);
          setVectorDb(data.vector_db);
          setThreshold(data.similarity_threshold);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("无法加载配置");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.saveSettings({
        ai_model: aiModel,
        vector_db: vectorDb,
        similarity_threshold: threshold,
      });
      toast.success("配置已保存");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col py-8 px-8 sm:px-12 w-full max-w-[896px]">
      <div className="mb-14">
        <h1 className="text-[32px] font-bold text-[#101828] leading-8">设置</h1>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <SettingsIcon className="w-5 h-5 text-[#475467]" />
          <h2 className="text-xl font-semibold text-[#101828]">模型配置</h2>
        </div>

        <div className="flex flex-col gap-6 bg-white rounded-xl border border-[#eaecf0] p-6 shadow-sm">
          {/* AI Model Selection */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="ai-model"
              className="text-sm font-medium text-[#344054]"
            >
              AI 模型 (智谱 GLM)
            </label>
            <div className="relative">
              <select
                id="ai-model"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#d0d5dd] bg-white px-3.5 py-2.5 text-base text-[#101828] shadow-sm focus:border-[#0f766e] focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
              >
                <option value="glm-4">GLM-4 (最新最强)</option>
                <option value="glm-4-air">GLM-4 Air (高性价比)</option>
                <option value="glm-4-flash">GLM-4 Flash (极速免费)</option>
                <option value="glm-3-turbo">GLM-3 Turbo</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Vector Database Selection */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="vector-db"
              className="text-sm font-medium text-[#344054]"
            >
              向量数据库
            </label>
            <div className="relative">
              <select
                id="vector-db"
                value={vectorDb}
                onChange={(e) => setVectorDb(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#d0d5dd] bg-white px-3.5 py-2.5 text-base text-[#101828] shadow-sm focus:border-[#0f766e] focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
              >
                <option value="pgvector">Supabase pgvector (默认)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Retrieval Relevance Threshold */}
          <div className="flex flex-col gap-3">
            <label
              htmlFor="relevance-threshold"
              className="text-sm font-medium text-[#344054]"
            >
              检索相关度阈值: {threshold}
            </label>
            <div className="w-full">
              <input
                id="relevance-threshold"
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                aria-label="检索相关度阈值"
                className="w-full h-2 bg-[#eaecf0] rounded-lg appearance-none cursor-pointer accent-[#0f766e]"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs font-medium text-[#475467]">宽松</span>
                <span className="text-xs font-medium text-[#475467]">严格</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#101828] text-white text-base font-normal py-2.5 px-6 rounded-[10px] hover:bg-[#1d2939] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "保存中..." : "保存配置"}
          </button>
        </div>
      </section>
    </div>
  );
}
