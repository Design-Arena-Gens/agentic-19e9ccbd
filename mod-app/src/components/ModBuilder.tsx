'use client';

import { useEffect, useMemo, useState } from "react";
import { buildDataPackArchive, createGiveCommand } from "@/lib/datapack";

type Enchantment = {
  id: string;
  level: number;
};

const PACK_FORMAT_OPTIONS = [
  { label: "1.21.10 – 1.21.9", value: 88 },
  { label: "1.21.5", value: 71 },
  { label: "1.21.4", value: 61 },
  { label: "1.21.2 – 1.21.3", value: 57 },
  { label: "1.21 – 1.21.1", value: 48 },
  { label: "1.20.5 – 1.20.6", value: 41 },
  { label: "1.20.3 – 1.20.4", value: 26 },
  { label: "1.20.2", value: 18 },
  { label: "1.20 – 1.20.1", value: 15 },
];

const INITIAL_NAME = "Легендарный клинок";
const INITIAL_ITEM_ID = "minecraft:diamond_sword";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32) || "datapack";

export function ModBuilder() {
  const [packName, setPackName] = useState(INITIAL_NAME);
  const [packDescription, setPackDescription] = useState(
    "Лёгкий мод, добавляющий уникальный меч со своим рецептом."
  );
  const [packFormat, setPackFormat] = useState<number>(PACK_FORMAT_OPTIONS[4].value);

  const [namespace, setNamespace] = useState(slugify(INITIAL_NAME));
  const [namespaceTouched, setNamespaceTouched] = useState(false);

  const [itemId, setItemId] = useState(INITIAL_ITEM_ID);
  const [itemDisplayName, setItemDisplayName] = useState("Клинок Предков");
  const [itemCount, setItemCount] = useState(1);
  const [loreLines, setLoreLines] = useState([
    "Дар древних кузнецов",
    "Наносит дополнительный урон монстрам",
  ]);
  const [ingredients, setIngredients] = useState([
    "minecraft:nether_star",
    "minecraft:diamond_sword",
    "minecraft:dragon_breath",
  ]);
  const [enchantments, setEnchantments] = useState<Enchantment[]>([
    { id: "minecraft:sharpness", level: 5 },
    { id: "minecraft:unbreaking", level: 3 },
  ]);

  const recipeId = useMemo(() => slugify(itemDisplayName || itemId), [itemDisplayName, itemId]);

  useEffect(() => {
    if (!namespaceTouched) {
      setNamespace(slugify(packName));
    }
  }, [packName, namespaceTouched]);

  const packMcMeta = useMemo(
    () =>
      JSON.stringify(
        {
          pack: {
            pack_format: packFormat,
            description: packDescription,
          },
        },
        null,
        2
      ),
    [packDescription, packFormat]
  );

  const recipePreview = useMemo(
    () =>
      JSON.stringify(
        {
          type: "minecraft:crafting_shapeless",
          ingredients: ingredients
            .filter(Boolean)
            .map((entry) =>
              entry.trim().startsWith("#")
                ? { tag: entry.trim().slice(1) }
                : { item: entry.trim() }
            ),
          result: {
            item: itemId,
            count: itemCount,
          },
        },
        null,
        2
      ),
    [ingredients, itemCount, itemId]
  );

  const giveCommandPreview = useMemo(
    () =>
      createGiveCommand({
        id: itemId,
        displayName: itemDisplayName,
        count: itemCount,
        lore: loreLines,
        enchantments,
      }),
    [enchantments, itemCount, itemDisplayName, itemId, loreLines]
  );

  async function handleDownload() {
    const blob = await buildDataPackArchive({
      packName,
      packFormat,
      packDescription,
      namespace,
      item: {
        id: itemId,
        displayName: itemDisplayName,
        count: itemCount,
        lore: loreLines,
        enchantments,
      },
      recipe: {
        id: recipeId,
        ingredients,
      },
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugify(packName)}.zip`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  return (
    <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr),28rem]">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-8 shadow-lg shadow-zinc-900/[0.03] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-black/30">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Конструктор интегрируемого мода
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Настройте датапак: он добавит собственный рецепт и команду для выдачи предмета.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Основное
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Название набора
                <input
                  value={packName}
                  onChange={(event) => setPackName(event.target.value)}
                  className="mt-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="Мой датапак"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Namespace
                <input
                  value={namespace}
                  onChange={(event) => {
                    setNamespaceTouched(true);
                    setNamespace(slugify(event.target.value));
                  }}
                  className="mt-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="legendary_blade"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Целевая версия Minecraft
                <select
                  value={packFormat}
                  onChange={(event) => setPackFormat(Number(event.target.value))}
                  className="mt-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                >
                  {PACK_FORMAT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} · pack_format {option.value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:col-span-2">
                Описание
                <textarea
                  value={packDescription}
                  onChange={(event) => setPackDescription(event.target.value)}
                  className="mt-2 h-24 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Новый предмет
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-300">
                ID предмета
                <input
                  value={itemId}
                  onChange={(event) => setItemId(event.target.value)}
                  className="mt-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="minecraft:diamond_sword"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Название в игре
                <input
                  value={itemDisplayName}
                  onChange={(event) => setItemDisplayName(event.target.value)}
                  className="mt-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="Мой предмет"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Количество при выдаче
                <input
                  type="number"
                  min={1}
                  max={64}
                  value={itemCount}
                  onChange={(event) => setItemCount(Number(event.target.value || 1))}
                  className="mt-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </label>
            </div>

            <div className="mt-4 space-y-3">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Описание / Lore
              </span>
              {loreLines.map((line, index) => (
                <div className="flex items-center gap-2" key={`lore-${index}`}>
                  <input
                    value={line}
                    onChange={(event) =>
                      setLoreLines((prev) =>
                        prev.map((item, idx) => (idx === index ? event.target.value : item))
                      )
                    }
                    className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                    placeholder="Добавьте lore"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setLoreLines((prev) => prev.filter((_, idx) => idx !== index))
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-zinc-100 text-lg text-zinc-500 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    aria-label="Удалить строку"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setLoreLines((prev) => [...prev, ""])}
                className="rounded-xl border border-dashed border-emerald-400/60 px-4 py-2 text-sm font-medium text-emerald-600 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-emerald-500/40 dark:text-emerald-400"
              >
                Добавить строку lore
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Чары
              </span>
              {enchantments.map((entry, index) => (
                <div className="grid grid-cols-[1fr,minmax(0,8rem),auto] items-center gap-2" key={`enchant-${index}`}>
                  <input
                    value={entry.id}
                    onChange={(event) =>
                      setEnchantments((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, id: event.target.value } : item
                        )
                      )
                    }
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                    placeholder="minecraft:sharpness"
                  />
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={entry.level}
                    onChange={(event) =>
                      setEnchantments((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, level: Number(event.target.value || 1) } : item
                        )
                      )
                    }
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEnchantments((prev) => prev.filter((_, idx) => idx !== index))
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-zinc-100 text-lg text-zinc-500 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    aria-label="Удалить зачарование"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEnchantments((prev) => [...prev, { id: "", level: 1 }])}
                className="rounded-xl border border-dashed border-emerald-400/60 px-4 py-2 text-sm font-medium text-emerald-600 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-emerald-500/40 dark:text-emerald-400"
              >
                Добавить зачарование
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Рецепт (shapeless)
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Используйте ID предметов (например, minecraft:nether_star) или теги (например,
              #minecraft:planks).
            </p>
            <div className="mt-4 space-y-2">
              {ingredients.map((ingredient, index) => (
                <div className="flex items-center gap-2" key={`ingredient-${index}`}>
                  <input
                    value={ingredient}
                    onChange={(event) =>
                      setIngredients((prev) =>
                        prev.map((item, idx) => (idx === index ? event.target.value : item))
                      )
                    }
                    className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                    placeholder="minecraft:nether_star"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setIngredients((prev) => prev.filter((_, idx) => idx !== index))
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-zinc-100 text-lg text-zinc-500 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    aria-label="Удалить ингредиент"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setIngredients((prev) => [...prev, ""])}
                className="rounded-xl border border-dashed border-emerald-400/60 px-4 py-2 text-sm font-medium text-emerald-600 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-emerald-500/40 dark:text-emerald-400"
              >
                Добавить ингредиент
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            Скачать датапак
          </button>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 shadow-lg shadow-emerald-500/10 backdrop-blur dark:border-emerald-900 dark:bg-emerald-950/40 dark:shadow-emerald-900/30">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900 dark:text-emerald-100">
            Что внутри архива
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-emerald-900/90 dark:text-emerald-100/80">
            <li>pack.mcmeta с pack_format {packFormat}</li>
            <li>data/{namespace}/recipes/{recipeId}.json</li>
            <li>data/{namespace}/functions/give_item.mcfunction</li>
            <li>data/minecraft/tags/functions/load.json</li>
            <li>README.txt с инструкциями на русском</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-lg shadow-zinc-900/[0.03] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-black/30">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-200">
            Превью pack.mcmeta
          </h3>
          <pre className="mt-3 max-h-64 overflow-auto rounded-2xl bg-zinc-950/95 p-4 text-xs text-emerald-200 shadow-inner dark:bg-black/60">
            <code>{packMcMeta}</code>
          </pre>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-lg shadow-zinc-900/[0.03] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-black/30">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-200">
            Превью рецепта
          </h3>
          <pre className="mt-3 max-h-64 overflow-auto rounded-2xl bg-zinc-950/95 p-4 text-xs text-emerald-200 shadow-inner dark:bg-black/60">
            <code>{recipePreview}</code>
          </pre>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-lg shadow-zinc-900/[0.03] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-black/30">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-200">
            Команда для выдачи
          </h3>
          <pre className="mt-3 overflow-auto rounded-2xl bg-zinc-950/95 p-4 text-xs text-emerald-200 shadow-inner dark:bg-black/60">
            <code>{giveCommandPreview}</code>
          </pre>
        </div>
      </aside>
    </section>
  );
}
