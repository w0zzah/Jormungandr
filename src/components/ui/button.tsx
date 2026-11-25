import type { ButtonHTMLAttributes } from "react";

export default function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`bg-gray-100 p-3 text-black hover:bg-gray-200 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 ${className}`}
            {...props}
        />
    );
}