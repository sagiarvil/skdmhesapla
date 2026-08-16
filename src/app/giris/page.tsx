"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { MarkaLogo } from "@/components/brand/MarkaLogo";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function GirisPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push("/hesabim/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Giriş yapılamadı.";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("E-posta adresi veya şifre hatalı.");
      } else {
        setError("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/hesabim/");
    } catch {
      setError("Google ile giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await resetPassword(forgotEmail);
      setSuccessMsg("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
      setForgotOpen(false);
    } catch {
      setError("Şifre sıfırlama e-postası gönderilemedi.");
    }
  };

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7f9f5] py-12 sm:py-20">
      <div className="mx-auto max-w-md px-5">
        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center">
            <MarkaLogo varyant="header" className="h-16 w-16" />
          </div>
          <h1 className="text-3xl sm:text-[36px] font-extrabold text-ink-900 tracking-tight">
            Hesabınıza Giriş Yapın
          </h1>
          <p className="text-base text-ink-700 font-medium">
            Mühürlü dosyalarınıza, hesaplama geçmişinize ve raporlarınıza erişin.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-line bg-white p-7 sm:p-9 shadow-xl space-y-6">
          {error && (
            <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm font-semibold text-rose-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-800">
              {successMsg}
            </div>
          )}

          {/* GOOGLE İLE GİRİŞ */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full min-h-[50px] items-center justify-center gap-3 rounded-2xl border-2 border-line bg-white px-5 py-3 text-base font-bold text-ink-900 shadow-sm hover:bg-neutral-50 transition active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google ile Giriş Yap</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-line" />
            <span className="absolute bg-white px-4 text-xs font-bold uppercase tracking-wider text-ink-500">
              veya e-posta ile
            </span>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-ink-900">E-Posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                <input
                  type="email"
                  required
                  placeholder="adiniz@sirketiniz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white pl-12 pr-4 text-base font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-ink-900">Şifre</label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-xs font-bold text-brand-800 hover:underline"
                >
                  Şifremi Unuttum
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white pl-12 pr-4 text-base font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-brand-800 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-brand-900 transition active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? "Giriş yapılıyor..." : "Giriş Yap"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="border-t border-line pt-5 text-center text-sm font-medium text-ink-700">
            Hesabınız yok mu?{" "}
            <Link href="/kayit/" className="font-bold text-brand-800 hover:underline">
              Hemen Kayıt Olun
            </Link>
          </div>
        </div>

        {/* ŞİFRE SIFIRLAMA MODALI */}
        {forgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl space-y-5">
              <h3 className="text-xl font-bold text-ink-900">Şifrenizi mi unuttunuz?</h3>
              <p className="text-sm text-ink-700">
                Kayıtlı e-posta adresinizi girin, size şifre yenileme bağlantısı gönderelim.
              </p>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="adiniz@sirketiniz.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="min-h-[48px] w-full rounded-2xl border-2 border-line px-4 text-base font-semibold"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(false)}
                    className="flex-1 rounded-2xl border border-line py-3 text-sm font-bold text-ink-700"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-brand-800 py-3 text-sm font-bold text-white"
                  >
                    Bağlantı Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
