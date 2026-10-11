
  "use client";

  import Image from "next/image";
  import { useRouter } from "next/navigation";
  import { useCallback, useEffect, useState, type FormEvent } from "react";
  import { authClient } from "../lib/auth-client";

  export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;

    const [name, setName] = useState("");
    const [savedName, setSavedName] = useState("");
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
      if (user) {
        const currentName = user.name || "";
        setName(currentName);
        setSavedName(currentName);
      }
    }, [user?.id, user?.name]);

    useEffect(() => {
      if (!isPending && !session) {
        router.replace("/signin");
      }
    }, [isPending, session, router]);

    const closePopup = useCallback(() => {
      setShowPopup(false);
    }, []);

    useEffect(() => {
      if (!showPopup) return;

      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, [showPopup]);

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setError("");
      setShowPopup(false);

      const trimmedName = name.trim();

      if (!trimmedName) {
        setError("আপনার নাম লিখুন।");
        return;
      }

      

      setIsSaving(true);

      try {
        const result = await authClient.updateUser({
          name: trimmedName,
        });

        if (result.error) {
          setError(
            result.error.message || "নাম আপডেট করা যায়নি। আবার চেষ্টা করুন।"
          );
          return;
        }

        setSavedName(trimmedName);
        setName(trimmedName);
        setShowPopup(true);
      } catch {
        setError("নাম আপডেট করা যায়নি। আবার চেষ্টা করুন।");
      } finally {
        setIsSaving(false);
      }
    };

    const handleSignOut = async () => {
      const confirmed = window.confirm(
        "আপনি কি নিশ্চিত যে সাইন আউট করতে চান?"
      );

      if (!confirmed) return;

      setIsSigningOut(true);

      try {
        const result = await authClient.signOut();

        if (result.error) {
          setError("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
          return;
        }

        router.replace("/signin");
        router.refresh();
      } catch {
        setError("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
      } finally {
        setIsSigningOut(false);
      }
    };

    if (isPending || !session) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#f3f8f3]">
          <p className="text-sm text-gray-600">প্রোফাইল লোড হচ্ছে...</p>
        </main>
      );
    }

    const email = user?.email || "";
    const profileImage = user?.image;

    return (
      <main className="min-h-screen bg-[#f3f8f3] px-5 py-6 md:px-10">
        {/* Success Popup */}
        {showPopup && (
          <div
            role="status"
            aria-live="polite"
            className="fixed right-4 top-4 z-[9999] w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:top-6"
          >
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-white p-4 shadow-xl">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="h-6 w-6 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 12 4 4L19 6"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">সফল হয়েছে!</p>
                <p className="mt-0.5 text-sm text-gray-600">
                  আপনার নাম সফলভাবে আপডেট হয়েছে।
                </p>
              </div>

              <button
                type="button"
                onClick={closePopup}
                aria-label="Popup বন্ধ করুন"
                className="rounded-md px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="h-1 overflow-hidden rounded-b-xl bg-green-100">
              <div className="h-full w-full origin-left animate-[shrink_3s_linear_forwards] bg-green-500" />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#202820]">
              আমার প্রোফাইল
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
            </p>
          </div>

          {/* User Card */}
          <section className="rounded-2xl border border-[#dfe8df] bg-white px-5 py-5 shadow-sm md:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#eef2ee]">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile picture"
                      fill
                      sizes="64px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-green-700">
                      {(savedName || email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="break-words text-lg font-semibold text-[#202820]">
                    {savedName || "আপনার নাম"}
                  </h2>
                  <p className="mt-0.5 break-all text-sm text-gray-500">
                    {email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full rounded-lg border border-[#dc7777] px-4 py-2 text-sm font-semibold text-[#d85d5d] transition hover:bg-[#fff5f5] disabled:opacity-60 sm:w-auto"
              >
                {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
              </button>
            </div>
          </section>

          {/* Information Card */}
          <section className="mt-5 rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-sm md:p-7">
            <h2 className="mb-6 text-base font-bold text-[#303630]">
              তথ্য
            </h2>

            <form onSubmit={handleUpdate}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#3c433c]"
                >
                  নাম
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                    setShowPopup(false);
                  }}
                  placeholder="আপনার নাম লিখুন"
                  required
                  maxLength={100}
                  className="h-10 w-full rounded-lg border border-[#dfe5df] bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#079447] focus:ring-2 focus:ring-[#079447]/10"
                />
              </div>

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="mt-5 h-10 w-full rounded-lg bg-[#079447] text-sm font-semibold text-white shadow-sm transition hover:bg-[#067d3d] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
              >
                {isSaving ? "আপডেট হচ্ছে..." : "আপডেট"}
              </button>
            </form>
          </section>
        </div>

        <style jsx global>{`
          @keyframes shrink {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }
        `}</style>
      </main>
    );
  }
