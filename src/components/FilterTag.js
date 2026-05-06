"use client";

import { useRouter, useSearchParams } from "next/navigation";

const tags = [
  "all",
  "nature",
  "technology",
  "travel",
  "cars",
  "architecture",
  "animals",
  "art",
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTag = searchParams.get("tag") || "all";
  const currentSort = searchParams.get("sort") || "latest";

  const updateQuery = (newTag, newSort = currentSort) => {
    const params = new URLSearchParams();

    if (newTag && newTag !== "all") params.set("tag", newTag);
    if (newSort) params.set("sort", newSort);

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 flex-wrap">

        {/* SORT DROPDOWN */}
        <select
          value={currentSort}
          onChange={(e) => updateQuery(currentTag, e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm text-gray-600"
        >
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="oldest">Oldest</option>
        </select>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => updateQuery(tag)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
                currentTag === tag
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* RESET */}
      <button
        onClick={() => router.push("/")}
        className="text-gray-500 text-sm hover:text-red-500"
      >
        Reset
      </button>
    </div>
  );
}