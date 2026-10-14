
"use client";

import { authClient } from "../lib/auth-client";
import Link from "next/link";
import { useState, type FormEvent } from "react";

function GoogleSignInButton({
  onError,
}: {
  onError: (message: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    onError("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/profile`,
        errorCallbackURL: `${window.location.origin}/signin`,
      });

      if (error) {
        onError(error.message || "Google লগইন ব্যর্থ হয়েছে।");
        setLoading(false);
      }
    } catch (err) {
      console.error("Google Sign In Error:", err);

      onError(
        err instanceof Error
          ? err.message
          : "Google লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );

      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#dfe5df] text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.26Z"
        />
        <path
          fill="#34A853"
          d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75Z"
        />
        <path
          fill="#FBBC05"
          d="M6.54 13.83A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.83V7.64H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.36l3.24-2.53Z"
        />
        <path
          fill="#EA4335"
          d="M12 6.14c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.18 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14Z"
        />
      </svg>

      {loading ? "সংযোগ হচ্ছে..." : "Google"}
    </button>
  );
}

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("ইমেইল ও পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || "লগইন করা যায়নি।");
        return;
      }

      setMessage("সফলভাবে সাইন ইন হয়েছে!");
      window.location.assign("/");
    } catch (err) {
      console.error("Email Sign In Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f8f3] px-4 py-8">
      <div className="w-full max-w-[370px]">
        <div className="mb-5 text-center">
          <h1 className="mt-3 text-xl font-bold text-[#202820]">
            সাইন ইন
          </h1>

          <p className="mt-2 text-[13px] leading-6 text-gray-500">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে
            অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <div className="rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-[#303630]"
              >
                ইমেইল
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-10 w-full rounded-lg border border-[#dfe5df] px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#079447] focus:ring-2 focus:ring-[#079447]/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-[#303630]"
              >
                পাসওয়ার্ড
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড"
                  className="h-10 w-full rounded-lg border border-[#dfe5df] px-3 pr-16 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#079447] focus:ring-2 focus:ring-[#079447]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-[#079447]"
                >
                  {showPassword ? "লুকান" : "দেখুন"}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-lg bg-[#079447] text-sm font-semibold text-white shadow-sm transition hover:bg-[#067d3d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e1e6e1]" />
            <span className="text-xs text-gray-500">অথবা</span>
            <div className="h-px flex-1 bg-[#e1e6e1]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <GoogleSignInButton onError={setError} />

            <button
              type="button"
              onClick={() =>
                setError("GitHub লগইন এখনো configure করা হয়নি।")
              }
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dfe5df] text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.13 3.17.76.84 1.22 1.91 1.22 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z" />
              </svg>
              GitHub চালিয়ে যান
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-gray-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#079447] hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
