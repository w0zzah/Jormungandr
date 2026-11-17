import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-row flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 flex-col justify-between gap-15 py-10 px-50 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-10 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Jormungandr:
          </h1>
          <h2 className="text-2xl">
            Ever Growing, Ever Devouring
          </h2>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
      <div className="flex items-center justify-center px-75">
        <Image
          className="size-75 dark:invert animate-[spin_10s_linear_infinite] "
          src="/ouraborus1.svg"
          alt="Next.js logo"
          width={75}
          height={75}
          priority
        />
      </div>
    </div>
  );
}
