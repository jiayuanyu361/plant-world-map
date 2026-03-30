"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div style={{ padding: 32, fontFamily: "Segoe UI, PingFang SC, sans-serif" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>应用发生错误</h2>
          <p style={{ marginTop: 12, color: "#5d6a5d" }}>
            {error.message || "发生了未知错误。"}
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 24,
              border: "none",
              borderRadius: 999,
              padding: "10px 18px",
              background: "#355f3b",
              color: "white",
              cursor: "pointer"
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
