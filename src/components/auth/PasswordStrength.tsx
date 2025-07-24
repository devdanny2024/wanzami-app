"use client";

interface PasswordStrengthProps {
    password?: string;
}

export default function PasswordStrength({ password = '' }: PasswordStrengthProps) {
    const checkPasswordStrength = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        return score;
    };

    const score = checkPasswordStrength();
    const width = (score / 5) * 100;

    const getColor = () => {
        if (score <= 2) return 'bg-red-500'; // Weak
        if (score === 3) return 'bg-yellow-500'; // Medium
        if (score === 4) return 'bg-green-500'; // Strong
        if (score === 5) return 'bg-emerald-500'; // Very Strong
        return 'bg-gray-700';
    };

    const getLabel = () => {
        if (score <= 2) return 'Weak';
        if (score === 3) return 'Medium';
        if (score === 4) return 'Strong';
        if (score === 5) return 'Very Strong';
        return '';
    }

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>
            <p className="text-xs text-right mt-1 text-gray-400">{getLabel()}</p>
        </div>
    );
}
