    "use client";

    import { useEffect } from "react";

    type ToastProps = {
    message: string;
    onClose: () => void;
    };

    export default function Toast({ message, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed right-5 top-5 z-[9999]">
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-xl text-green-700">
            ✓
            </div>

            <div>
            <p className="font-semibold text-gray-900">
                সফল হয়েছে!
            </p>
            <p className="text-sm text-gray-600">{message}</p>
            </div>

            <button
            onClick={onClose}
            className="ml-3 text-xl text-gray-400 hover:text-gray-700"
            aria-label="বন্ধ করুন"
            >
            ×
            </button>
        </div>
        </div>
    );
    }