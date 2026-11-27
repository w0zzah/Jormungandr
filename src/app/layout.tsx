import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "@/styles/globals.css";
import Header from "../components/Header/Header";

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
                <div className="flex min-h-dvh flex-col bg-blue-200 font-sans text-blue-950 dark:bg-black dark:text-zinc-100">
                    <Header/>
                    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 pt-5">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
