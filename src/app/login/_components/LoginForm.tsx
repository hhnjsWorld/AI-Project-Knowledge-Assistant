"use client";

import { Mail, Sparkles, KeyRound } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

export default function LoginForm() {
  const {
    email,
    token,
    step,
    errorMessage,
    isSending,
    handleSendOtp,
    handleVerifyOtp,
    handleEmailChange,
    handleTokenChange,
  } = useLogin();

  return (
    <div className="max-w-md w-full bg-white p-12 border border-grey-500 shadow-sm">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 mb-6 rounded-none">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
          KnowledgeHub2333
        </h1>
        <p className="text-sm text-gray-500">面向团队的项目知识智能体</p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              电子邮箱
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 text-sm font-medium rounded-none hover:bg-black transition-all disabled:opacity-50"
            disabled={isSending}
          >
            {isSending ? "正在发送..." : "获取验证码"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">验证码已发送至 {email}</p>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              验证码
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={token}
                onChange={handleTokenChange}
                placeholder="请输入验证码"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 text-sm font-medium rounded-none hover:bg-black transition-all disabled:opacity-50"
            disabled={isSending}
          >
            {isSending ? "正在验证..." : "登录系统"}
          </button>
        </form>
      )}

      {errorMessage && (
        <p className="text-xs text-red-500 mt-4 text-center">{errorMessage}</p>
      )}

      <div className="mt-12 pt-6 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-[0.2em]">
          您的团队知识数据受到企业级安全保护
        </p>
      </div>
    </div>
  );
}
