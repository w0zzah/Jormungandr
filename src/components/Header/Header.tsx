import Image from "next/image";
import {Skranji} from "next/font/google";

const skranji = Skranji({
    weight: "400",
    subsets: ["latin"],
});

export default function Header() {
    return (
        <header className="flex flex-col items-center pt-10 gap-2">
            <div className="relative grid place-items-center">
                <Image
                    className="pointer-events-none col-start-1 row-start-1 animate-[spin_10s_linear_infinite] motion-reduce:animate-none opacity-30 dark:invert"
                    src="/ouraborus1.svg"
                    alt=""
                    width={200}
                    height={200}
                    priority
                />
                <div
                    aria-hidden
                    className="relative z-[5] pointer-events-none col-start-1 row-start-1 h-32 w-[130%] justify-self-center bg-[radial-gradient(ellipse_at_center,var(--color-blue-200)_35%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,#000_35%,transparent_70%)]"
                />
                <h1 className={`${skranji.className} relative z-10 col-start-1 row-start-1 text-7xl`}>
                    JORMUNGANDR
                </h1>
            </div>
        </header>
    );
}