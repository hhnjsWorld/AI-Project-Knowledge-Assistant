"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      alert("登录失败：" + error.message);
    } else {
      alert("登录链接已发送，请查收邮箱");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="请输入邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>发送登录链接</button>
    </div>
  );
}
