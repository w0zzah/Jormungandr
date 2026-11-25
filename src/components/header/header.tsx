import Image from "next/image";

export default function Header() {
    return (
        <header className="flex flex-col items-center pt-10">
            <h1 className="text-7xl font-semibold tracking-tight">jormungandr</h1>
            <p className="pb-2 text-zinc-600 dark:text-zinc-400">ever growing, ever devouring</p>
            <Image
                className="size-15 animate-[spin_10s_linear_infinite] motion-reduce:animate-none dark:invert"
                src="/ouraborus1.svg"
                alt="Ouroboros"
                width={75}
                height={75}
                priority
            />
        </header>
    );
}