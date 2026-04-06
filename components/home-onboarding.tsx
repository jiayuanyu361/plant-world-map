"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";

const STORAGE_KEY = "plant-world-map-home-guide-dismissed";

export function HomeOnboarding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="inline-flex max-w-xl items-center gap-3 rounded-full border border-white/12 bg-[#0d1827]/76 px-4 py-2.5 text-sm text-[#d5e3f5] shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <Sparkles className="h-4 w-4 shrink-0 text-[#8fd8b4]" />
      <p className="min-w-0 truncate">点开地图上的植物节点，先看卡片，再继续深入探索。</p>
      <Link href="/submit" className="shrink-0 font-medium text-[#9fe4c6] hover:text-white">
        提交植物
      </Link>
      <button
        type="button"
        onClick={dismiss}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#86a2bd] transition hover:bg-white/6 hover:text-white"
        aria-label="关闭引导"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
