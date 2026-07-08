"use client";

import { useState } from "react";

type Progress = { processed: number; total: number; created: number; skipped: number };

export default function ImportRunner() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState("");

  async function runImport() {
    setRunning(true);
    setError("");
    let offset = 0;
    let totalCreated = 0;
    let totalSkipped = 0;
    let total = 0;

    try {
      while (true) {
        const res = await fetch("/api/admin/seed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offset, limit: 15 }),
        });
        if (!res.ok) throw new Error(`Lỗi server (${res.status})`);
        const data = await res.json();
        totalCreated += data.created;
        totalSkipped += data.skipped;
        total = data.total;
        offset = data.nextOffset;
        setProgress({ processed: Math.min(offset, total), total, created: totalCreated, skipped: totalSkipped });
        if (data.done) break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="max-w-lg rounded-xl bg-white p-6 shadow-sm">
      <p className="mb-4 text-sm text-gray-600">
        Import toàn bộ sản phẩm + ảnh từ file Excel gốc vào database. An toàn khi bấm nhiều
        lần — sản phẩm đã tồn tại (trùng tên/loại/size) sẽ được bỏ qua, không tạo trùng.
      </p>
      <button
        onClick={runImport}
        disabled={running}
        className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {running ? "Đang import..." : "Bắt đầu import"}
      </button>

      {progress && (
        <div className="mt-4 text-sm text-gray-700">
          <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-2 bg-brand-600 transition-all"
              style={{ width: `${Math.round((progress.processed / progress.total) * 100)}%` }}
            />
          </div>
          <p>
            Đã xử lý {progress.processed}/{progress.total} — tạo mới {progress.created}, bỏ qua{" "}
            {progress.skipped} (đã tồn tại)
          </p>
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
