"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "註冊失敗");
      return;
    }
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-center">新規會員註冊</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          required
          placeholder="姓名"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border px-4 py-3"
        />
        <input
          type="email"
          required
          placeholder="電郵"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border px-4 py-3"
        />
        <input
          placeholder="電話（選填）"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-lg border px-4 py-3"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="密碼（至少 6 字）"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border px-4 py-3"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 cursor-pointer"
        >
          {loading ? "註冊中…" : "註冊"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        已有帳戶？{" "}
        <Link href="/login" className="text-red-600 font-medium">
          登入
        </Link>
      </p>
    </div>
  );
}
