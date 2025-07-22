"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, FormEvent, useRef, KeyboardEvent } from "react";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [resendStatus, setResendStatus] = useState<{loading: boolean; message: string; error: boolean}>({ loading: false, message: '', error: false });

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            setError("Email not found. Please go back to the registration page.");
            return;
        }
        setResendStatus({ loading: true, message: '', error: false });
        try {
            const response = await fetch('/api/auth/resend-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.details || 'Failed to resend code.');
            setResendStatus({ loading: false, message: "A new code has been sent to your email.", error: false });
        } catch (err) {
            if (err instanceof Error) {
                setResendStatus({ loading: false, message: err.message, error: true });
            } else {
                setResendStatus({ loading: false, message: 'An unexpected error occurred.', error: true });
            }
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        const code = otp.join("");

        if (code.length !== 6) {
            setError("Please enter the complete 6-digit code.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.details || 'Verification failed.');
            router.push('/login?verified=true');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[#13151a] p-8 rounded-2xl shadow-lg border border-gray-800 text-white">
            <div className="text-center mb-8">
                <Link href="/" className="text-2xl font-bold flex items-center justify-center space-x-2">
                    <Image src="/logo.png" alt="Wanzami Logo" width={32} height={32} />
                    <span className="font-bold text-xl text-white">Wanzami</span>
                </Link>
                <h1 className="text-2xl font-bold mt-4">Verify Your Email</h1>
                <p className="text-gray-400 mt-2">
                    We&apos;ve sent a 6-digit code to <span className="font-semibold text-theme-orange">{email || 'your email'}</span>.
                </p>
            </div>
            
            {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-md text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <div className="flex justify-center space-x-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                name="otp"
                                maxLength={1}
                                className="w-14 h-16 text-center text-2xl font-bold rounded-lg border border-gray-700 bg-[#0B0C10] text-white focus:border-theme-orange focus:outline-none focus:ring-2 focus:ring-theme-orange"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyUp={e => handleKeyUp(e, index)}
                                onFocus={e => e.target.select()}
                                ref={el => { inputRefs.current[index] = el; }}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-theme-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-orange transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50">
                        {isLoading ? 'Verifying...' : 'Verify Account'}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                {resendStatus.message && (
                    <p className={`mb-2 ${resendStatus.error ? 'text-red-400' : 'text-green-400'}`}>{resendStatus.message}</p>
                )}
                <p>Didn&apos;t receive the code? 
                    <button onClick={handleResendCode} disabled={resendStatus.loading} className="font-medium text-theme-orange hover:underline disabled:opacity-50 disabled:cursor-not-allowed ml-1">
                        {resendStatus.loading ? 'Sending...' : 'Resend Code'}
                    </button>
                </p>
                <p className="mt-2"><Link href="/login" className="font-medium text-gray-400 hover:underline">Back to Login</Link></p>
            </div>
        </div>
    );
}
