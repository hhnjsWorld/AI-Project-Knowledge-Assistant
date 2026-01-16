import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('请输入邮箱');
      return;
    }

    setIsSending(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
    });

    setIsSending(false);

    if (error) {
      setErrorMessage(`发送失败：${error.message}`);
      return;
    }

    setStep('otp');
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      setErrorMessage('请输入验证码');
      return;
    }

    if (!/^\d+$/.test(trimmedToken)) {
      setErrorMessage('验证码必须为纯数字');
      return;
    }

    setIsSending(true);
    setErrorMessage('');

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: trimmedToken,
      type: 'email',
    });

    setIsSending(false);

    if (error) {
      // Translate common Supabase auth errors to Chinese
      let msg = error.message;
      if (msg.includes('Token has expired')) msg = '验证码已过期，请重新获取';
      else if (msg.includes('Invalid token')) msg = '验证码错误，请检查输入';
      
      setErrorMessage(`验证失败：${msg}`);
      return;
    }

    router.replace('/dashboard');
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const val = event.target.value;
    if (val && !/^\d*$/.test(val)) return;
    
    setToken(val);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return {
    email,
    token,
    step,
    errorMessage,
    isSending,
    handleSendOtp,
    handleVerifyOtp,
    handleEmailChange,
    handleTokenChange,
  };
}
