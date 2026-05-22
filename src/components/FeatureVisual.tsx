"use client";

import type { ProductFeatureBlock } from "@/lib/product-content-types";

export function FeatureVisual({ visual }: { visual: ProductFeatureBlock["visual"] }) {
  return (
    <div className="feature-visual-box relative aspect-[4/3] w-full max-w-md mx-auto rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 overflow-hidden shadow-xl">
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {visual === "auto-lock" && <AutoLockDemo />}
        {visual === "relock" && <RelockDemo />}
        {visual === "unlock" && <UnlockDemo />}
        {visual === "door-hazard" && <HazardDemo variant="door" />}
        {visual === "engine-lock" && <EngineLockDemo />}
        {visual === "back-hazard" && <HazardDemo variant="back" />}
        {visual === "emergency" && <EmergencyDemo />}
      </div>
      <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400">功能示範</div>
    </div>
  );
}

function CarOutline() {
  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-[220px] text-slate-500" aria-hidden>
      <rect x="30" y="40" width="140" height="55" rx="12" fill="currentColor" opacity="0.25" />
      <rect x="50" y="25" width="100" height="35" rx="8" fill="currentColor" opacity="0.35" />
      <circle cx="55" cy="98" r="14" fill="#1e293b" stroke="currentColor" strokeWidth="3" />
      <circle cx="145" cy="98" r="14" fill="#1e293b" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function AutoLockDemo() {
  return (
    <div className="text-center w-full">
      <CarOutline />
      <div className="mt-4 flex justify-center gap-2">
        <span className="speed-pulse rounded-lg bg-red-600/90 px-3 py-1 text-sm font-bold text-white">
          13 km/h
        </span>
        <span className="lock-pop rounded-lg bg-amber-400 px-3 py-1 text-sm font-bold text-slate-900">
          LOCK
        </span>
      </div>
    </div>
  );
}

function RelockDemo() {
  return (
    <div className="text-center w-full">
      <CarOutline />
      <p className="mt-3 text-xs text-amber-300 relock-flash font-semibold">瞬間再鎖定</p>
    </div>
  );
}

function UnlockDemo() {
  return (
    <div className="text-center w-full">
      <CarOutline />
      <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600/90 px-4 py-2 text-white font-bold text-lg">
        P
      </div>
      <p className="mt-2 text-xs text-emerald-300">自動解鎖</p>
    </div>
  );
}

function HazardDemo({ variant }: { variant: "door" | "back" }) {
  return (
    <div className="text-center w-full">
      <CarOutline />
      <div className="mt-3 flex justify-center gap-3">
        <span className="hazard-blink h-4 w-4 rounded-full bg-amber-400" />
        <span className="hazard-blink h-4 w-4 rounded-full bg-amber-400 [animation-delay:0.2s]" />
        <span className="hazard-blink h-4 w-4 rounded-full bg-amber-400 [animation-delay:0.4s]" />
      </div>
      <p className="mt-2 text-xs text-amber-200">
        {variant === "door" ? "開門危險燈" : "倒車危險燈"}
      </p>
    </div>
  );
}

function EngineLockDemo() {
  return (
    <div className="text-center w-full">
      <CarOutline />
      <div className="mt-3 engine-idle flex justify-center gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-6 w-1 rounded-full bg-sky-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-sky-300">引擎運轉中 · 可鎖門</p>
    </div>
  );
}

function EmergencyDemo() {
  return (
    <div className="text-center w-full">
      <CarOutline />
      <div className="mt-4 flex justify-center">
        <span className="emergency-unlock rounded-full border-2 border-red-500 px-4 py-2 text-red-400 text-sm font-bold">
          UNLOCK
        </span>
      </div>
      <p className="mt-2 text-xs text-red-300">急減速解鎖</p>
    </div>
  );
}
