import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/header/header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Jormungandr",
    description: "1 Line a day",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <div className="flex min-h-dvh flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
                    <Header/>
                    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 pb-50">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
