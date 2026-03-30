"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="panel rounded-[32px] p-8">
      <h2 className="text-3xl font-semibold">页面加载出错</h2>
      <p className="mt-3 text-[var(--muted)]">
        {error.message || "发生了未知错误。"}
      </p>
      <button className="btn btn-primary mt-6" onClick={() => reset()}>
        重试
      </button>
    </div>
  );
}
