import type { ButtonHTMLAttributes } from "react";

export default function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`bg-gray-100 p-3 rounded-2xl hover:bg-gray-200 disabled:opacity-50 dark:bg-blue-900 dark:hover:bg-blue-800 ${className}`}
            {...props}
        />
    );
}