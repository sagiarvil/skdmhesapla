"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  Database,
  Factory,
  FileCheck2,
  Globe2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";
import { MarkaLogo } from "@/components/brand/MarkaLogo";

const orbitItems = [
  { label: "GTİP", icon: Globe2, className: "left-[48%] top-[4%] bg-sky-100 text-sky-700 border-sky-200" },
  { label: "Tesis", icon: Factory, className: "right-[7%] top-[28%] bg-violet-100 text-violet-700 border-violet-200" },
  { label: "Hesap", icon: Calculator, className: "right-[14%] bottom-[16%] bg-amber-100 text-amber-700 border-amber-200" },
  { label: "Kanıt", icon: FileCheck2, className: "left-[12%] bottom-[15%] bg-emerald-100 text-emerald-700 border-emerald-200" },
  { label: "Veri", icon: Database, className: "left-[5%] top-[30%] bg-cyan-100 text-cyan-700 border-cyan-200" },
  { label: "Mühür", icon: ShieldCheck, className: "left-[44%] bottom-[2%] bg-rose-100 text-rose-700 border-rose-200" },
] as const;

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

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
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

  const handleForgotSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
    <main className="min-h-screen bg-[#f5f8f4] text-ink-900 lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-emerald-950/10 bg-[#071812] lg:flex lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(52,211,153,0.16),transparent_32%),radial-gradient(circle_at_75%_70%,rgba(56,189,248,0.12),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative z-10 flex w-full max-w-[640px] flex-col items-center px-10">
          <div className="relative flex h-[540px] w-[540px] items-center justify-center">
            <div className="absolute h-[470px] w-[470px] rounded-full border border-emerald-300/10" />
            <div className="absolute h-[360px] w-[360px] rounded-full border border-sky-300/10" />
            <div className="absolute h-[250px] w-[250px] rounded-full border border-white/10" />

            <div className="absolute h-[470px] w-[470px] animate-spin rounded-full border border-transparent border-t-emerald-300/35 [animation-duration:24s]" />
            <div className="absolute h-[360px] w-[360px] animate-spin rounded-full border border-transparent border-r-sky-300/35 [animation-duration:18s] [animation-direction:reverse]" />
            <div className="absolute h-[250px] w-[250px] animate-spin rounded-full border border-transparent border-b-amber-300/35 [animation-duration:14s]" />

            {orbitItems.map(({ label, icon: Icon, className }) => (
              <div key={label} className={`absolute ${className} flex h-16 w-16 flex-col items-center justify-center rounded-2xl border shadow-2xl backdrop-blur-sm`}>
                <Icon className="h-5 w-5" />
                <span className="mt-1 text-[10px] font-black uppercase tracking-wide">{label}</span>
              </div>
            ))}

            <div className="relative flex h-40 w-40 items-center justify-center rounded-[36px] border border-white/15 bg-white/[0.07] shadow-[0_30px_90px_rgba(0,0,0,.45)] backdrop-blur-xl">
              <div className="absolute inset-3 rounded-[28px] border border-emerald-300/15" />
              <MarkaLogo varyant="header" className="h-24 w-24" />
            </div>
          </div>

          <div className="-mt-5 max-w-xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" /> SKDM çalışma alanınız
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white">Hesap, kanıt ve mühürlü dosyalarınız tek yerde.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm font-medium leading-6 text-slate-300">
              GTİP kapsam kontrolünden tesis verisine, gömülü emisyon hesabından doğrulamaya hazırlık paketine kadar çalışmalarınıza güvenli hesabınızdan erişin.
            </p>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.08),transparent_28%)]" />
        <div className="relative w-full max-w-[480px]">
          <div className="mb-7 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <MarkaLogo varyant="header" className="h-11 w-11" />
              <span className="text-sm font-black text-brand-900">SKDMHesapla</span>
            </Link>
          </div>

          <div className="mb-7">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Üye girişi</span>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">Tekrar hoş geldiniz</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-ink-600 sm:text-base">
              Hesaplama geçmişinize, mühürlü dosyalarınıza ve raporlarınıza erişin.
            </p>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-8">
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                {successMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-ink-900 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:translate-y-0 disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google ile devam et
            </button>

            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-4 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">veya e-posta</span>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-black text-ink-800">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="adiniz@sirketiniz.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-sm font-bold text-ink-900 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand-700 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="login-password" className="text-sm font-black text-ink-800">Şifre</label>
                  <button type="button" onClick={() => setForgotOpen(true)} className="text-xs font-black text-brand-800 hover:underline">Şifremi unuttum</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-sm font-bold text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-700 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#0b3d2e] px-6 py-3 text-sm font-black text-white shadow-[0_14px_35px_rgba(11,61,46,.22)] transition hover:-translate-y-0.5 hover:bg-[#0f513c] hover:shadow-[0_18px_45px_rgba(11,61,46,.28)] active:translate-y-0 disabled:opacity-50"
              >
                <span>{loading ? "Giriş yapılıyor..." : "Hesabıma giriş yap"}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm font-medium text-ink-600">
              Henüz hesabınız yok mu?{" "}
              <Link href="/kayit/" className="font-black text-brand-800 hover:underline">Ücretsiz hesap oluşturun</Link>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-700" /> Firebase Authentication ile güvenli oturum
          </div>
        </div>
      </section>

      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06120e]/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[28px] border border-white/20 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-xl font-black text-ink-900">Şifrenizi yenileyin</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-ink-600">Kayıtlı e-posta adresinizi girin. Şifre yenileme bağlantısını size gönderelim.</p>
            <form onSubmit={handleForgotSubmit} className="mt-5 space-y-4">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="adiniz@sirketiniz.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="min-h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-ink-900 outline-none transition focus:border-brand-700 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
              />
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setForgotOpen(false)} className="rounded-2xl border border-slate-200 py-3 text-sm font-black text-ink-700 hover:bg-slate-50">Vazgeç</button>
                <button type="submit" className="rounded-2xl bg-brand-800 py-3 text-sm font-black text-white hover:bg-brand-900">Bağlantı gönder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
