import React from "react";

type Props = { name?: string; size?: number };

export default function ProfileCard({ name = "?", size = 64 }: Props) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-indigo-600 text-white font-bold"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span style={{ fontSize: Math.round(size / 2.6) }}>{initial}</span>
    </div>
  );
}
