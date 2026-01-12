"use client";

import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("请输入邮箱1111");
      return;
    }

    setIsSending(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setIsSending(false);

    if (error) {
      setEmailSent(false);
      setErrorMessage(`登录失败：${error.message}`);
      return;
    }

    setEmailSent(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailSent) {
      setEmailSent(false);
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-12 border border-grey-500 shadow-sm">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 mb-6 rounded-none">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
          KnowledgeHub
        </h1>
        <p className="text-sm text-gray-500">面向团队的项目知识智能体</p>
      </div>

      {!emailSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 text-sm font-medium rounded-none hover:bg-black transition-all disabled:opacity-50"
            disabled={isSending}
          >
            {isSending ? "正在发送..." : "获取登录链接"}
          </button>
          {errorMessage && (
            <p className="text-xs text-red-500 mt-2 text-center">
              {errorMessage}
            </p>
          )}
        </form>
      ) : (
        <div className="text-center py-10 border border-gray-100 bg-gray-50 rounded-none">
          <Mail className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-900 mb-1">登录链接已发送</p>
          <p className="text-xs text-gray-500 px-4">请检查您的邮箱 {email}</p>
        </div>
      )}

      <div className="mt-12 pt-6 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-[0.2em]">
          您的团队知识数据受到企业级安全保护
        </p>
      </div>
    </div>
  );
}
