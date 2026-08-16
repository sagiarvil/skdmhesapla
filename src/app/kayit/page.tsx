"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { MarkaLogo } from "@/components/brand/MarkaLogo";
import { Lock, Mail, Building, User, FileSpreadsheet, AlertCircle, ArrowRight } from "lucide-react";

export default function KayitPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vkn, setVkn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Şifreniz en az 6 karakter olmalıdır.");
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, displayName, companyName, vkn);
      router.push("/hesabim/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kayıt olunamadı.";
      if (msg.includes("email-already-in-use")) {
        setError("Bu e-posta adresi zaten kayıtlı.");
      } else {
        setError("Kayıt oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/hesabim/");
    } catch {
      setError("Google ile kayıt oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7f9f5] py-12 sm:py-20">
      <div className="mx-auto max-w-lg px-5">
        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center">
            <MarkaLogo varyant="header" className="h-16 w-16" />
          </div>
          <h1 className="text-3xl sm:text-[36px] font-extrabold text-ink-900 tracking-tight">
            Firma Hesabı Oluşturun
          </h1>
          <p className="text-base text-ink-700 font-medium">
            Mühürlü SKDM denetime hazırlık dosyalarınızı tek merkezde arşivleyin.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-line bg-white p-7 sm:p-9 shadow-xl space-y-6">
          {error && (
            <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm font-semibold text-rose-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* GOOGLE İLE KAYIT */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
            <span>Google ile Hızlı Kayıt Ol</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-line" />
            <span className="absolute bg-white px-4 text-xs font-bold uppercase tracking-wider text-ink-500">
              veya form ile
            </span>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-ink-900">Yetkili Adı Soyadı</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                <input
                  type="text"
                  required
                  placeholder="Örn: Ahmet Yılmaz"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white pl-12 pr-4 text-base font-semibold text-ink-900 focus:border-brand-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-ink-900">Firma Unvanı</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                  <input
                    type="text"
                    placeholder="Örn: ABC Metal A.Ş."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white pl-12 pr-4 text-base font-semibold text-ink-900 focus:border-brand-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-ink-900">Vergi No (VKN)</label>
                <div className="relative">
                  <FileSpreadsheet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                  <input
                    type="text"
                    placeholder="10 veya 11 hane"
                    value={vkn}
                    onChange={(e) => setVkn(e.target.value)}
                    className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white pl-12 pr-4 font-mono text-base font-semibold text-ink-900 focus:border-brand-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

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
                  className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white pl-12 pr-4 text-base font-semibold text-ink-900 focus:border-brand-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-ink-900">Şifre Belirleyin</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                <input
                  type="password"
                  required
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white pl-12 pr-4 text-base font-semibold text-ink-900 focus:border-brand-800 focus:outline-none"
                />
              </div>
            </div>

            <p className="text-xs text-ink-600 leading-relaxed pt-1">
              Kayıt olarak{" "}
              <Link href="/kullanim-kosullari/" className="text-brand-800 underline font-semibold">
                Kullanım Koşulları
              </Link>{" "}
              ve{" "}
              <Link href="/kvkk-aydinlatma/" className="text-brand-800 underline font-semibold">
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni kabul etmiş olursunuz.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-brand-800 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-brand-900 transition active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? "Hesap Açılıyor..." : "Hesabı Oluştur"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="border-t border-line pt-5 text-center text-sm font-medium text-ink-700">
            Zaten bir hesabınız var mı?{" "}
            <Link href="/giris/" className="font-bold text-brand-800 hover:underline">
              Giriş Yapın
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
