'use client';

import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
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
            <label htmlFor="ai-model" className="text-sm font-medium text-[#344054]">
              AI 模型
            </label>
            <div className="relative">
              <select 
                id="ai-model"
                className="w-full appearance-none rounded-lg border border-[#d0d5dd] bg-white px-3.5 py-2.5 text-base text-[#101828] shadow-sm focus:border-[#0f766e] focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
              >
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
                <option>Claude 3</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Vector Database Selection */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="vector-db" className="text-sm font-medium text-[#344054]">
              向量数据库
            </label>
            <div className="relative">
              <select 
                id="vector-db"
                className="w-full appearance-none rounded-lg border border-[#d0d5dd] bg-white px-3.5 py-2.5 text-base text-[#101828] shadow-sm focus:border-[#0f766e] focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
              >
                <option>Pinecone</option>
                <option>Weaviate</option>
                <option>Qdrant</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Retrieval Relevance Threshold */}
          <div className="flex flex-col gap-3">
            <label htmlFor="relevance-threshold" className="text-sm font-medium text-[#344054]">
              检索相关度阈值
            </label>
            <div className="w-full">
              <input
                id="relevance-threshold"
                type="range"
                min="0"
                max="100"
                defaultValue="70"
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
          <button className="bg-[#101828] text-white text-base font-normal py-2.5 px-6 rounded-[10px] hover:bg-[#1d2939] transition-colors shadow-sm">
            保存配置
          </button>
        </div>
      </section>
    </div>
  );
}
