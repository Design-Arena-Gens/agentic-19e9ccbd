import { ModBuilder } from "@/components/ModBuilder";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-sky-100 pb-24 pt-16 font-sans text-zinc-900 dark:from-black dark:via-zinc-950 dark:to-emerald-950 dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 sm:px-10 lg:px-16">
        <header className="space-y-6 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-300 bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 shadow-sm dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            Веб-конструктор · Minecraft Java
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Создайте Minecraft мод-датыпак за пару минут
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-zinc-600 dark:text-zinc-400 sm:mx-0">
            Настройте уникальный предмет, настройте рецепт крафта, добавьте чары и сразу скачайте
            полностью готовый датапак, который можно перекинуть в папку мира и активировать без
            установки Forge или Fabric.
          </p>
          <div className="grid gap-4 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-3">
            <p className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-md shadow-emerald-400/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-black/30">
              🧱 Работает с пак-форматами Minecraft 1.20 — 1.21.10
            </p>
            <p className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-md shadow-emerald-400/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-black/30">
              ⚔️ Добавляйте чары, lore и собственные рецепты
            </p>
            <p className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-md shadow-emerald-400/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-black/30">
              🚀 Инструкции по установке автоматически входят в архив
            </p>
          </div>
        </header>

        <ModBuilder />
      </div>
    </div>
  );
}
