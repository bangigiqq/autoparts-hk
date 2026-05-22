/** Product rich content types (Enlarge-style detail page) */
export type GalleryImage = {
  id: string;
  label: string;
  src: string;
};

export type ProductFeatureBlock = {
  num: number;
  title: string;
  body: string;
  note?: string;
  visual:
    | "auto-lock"
    | "relock"
    | "unlock"
    | "door-hazard"
    | "engine-lock"
    | "back-hazard"
    | "emergency";
};

export type ProductRichContent = {
  points: string[];
  summaryTitle: string;
  shopMessage: string;
  gallery: GalleryImage[];
  features: ProductFeatureBlock[];
  showDipSwitch?: boolean;
};

export const FEATURE_VISUAL_OPTIONS: {
  value: ProductFeatureBlock["visual"];
  label: string;
}[] = [
  { value: "auto-lock", label: "\u81ea\u52d5\u4e0a\u9396" },
  { value: "relock", label: "\u518d\u9396\u5b9a" },
  { value: "unlock", label: "\u81ea\u52d5\u89e3\u9396" },
  { value: "door-hazard", label: "\u9580\u5371\u96aa\u71c8" },
  { value: "engine-lock", label: "\u5f15\u64ce\u5f85\u6a5f\u9396" },
  { value: "back-hazard", label: "\u5012\u8eca\u5371\u96aa\u71c8" },
  { value: "emergency", label: "\u6025\u6e1b\u901f\u89e3\u9396" },
];

export function emptyRichContent(): ProductRichContent {
  return {
    summaryTitle: "",
    points: [],
    shopMessage: "",
    gallery: [],
    features: [],
    showDipSwitch: false,
  };
}

export function normalizeRichContent(raw: unknown): ProductRichContent | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const visuals = new Set(FEATURE_VISUAL_OPTIONS.map((v) => v.value));
  const gallery: GalleryImage[] = Array.isArray(o.gallery)
    ? o.gallery
        .map((g, i) => {
          const item = g as Record<string, unknown>;
          const src = String(item.src ?? "").trim();
          if (!src) return null;
          return {
            id: String(item.id ?? `g-${i + 1}`),
            label: String(item.label ?? `\u5716 ${i + 1}`),
            src,
          };
        })
        .filter((x): x is GalleryImage => x !== null)
    : [];
  const features: ProductFeatureBlock[] = Array.isArray(o.features)
    ? (o.features
        .map((f) => {
          const item = f as Record<string, unknown>;
          const visual = String(item.visual ?? "auto-lock");
          if (!visuals.has(visual as ProductFeatureBlock["visual"])) return null;
          const title = String(item.title ?? "").trim();
          if (!title) return null;
          return {
            num: Number(item.num) || 0,
            title,
            body: String(item.body ?? ""),
            note: item.note ? String(item.note) : undefined,
            visual: visual as ProductFeatureBlock["visual"],
          };
        })
        .filter((x) => x !== null) as ProductFeatureBlock[])
    : [];
  const points = Array.isArray(o.points)
    ? o.points.map((p) => String(p).trim()).filter(Boolean)
    : [];

  const content: ProductRichContent = {
    summaryTitle: String(o.summaryTitle ?? ""),
    points,
    shopMessage: String(o.shopMessage ?? ""),
    gallery,
    features,
    showDipSwitch: o.showDipSwitch === true,
  };

  if (!hasRichContent(content)) return null;
  return content;
}

export function hasRichContent(c: ProductRichContent): boolean {
  return !!(
    c.summaryTitle ||
    c.shopMessage ||
    c.points.length ||
    c.gallery.length ||
    c.features.length
  );
}

export function serializeRichContent(c: ProductRichContent | null): string | null {
  if (!c || !hasRichContent(c)) return null;
  return JSON.stringify(c);
}

export function parseRichContentJson(
  json: string | null | undefined
): ProductRichContent | null {
  if (!json?.trim()) return null;
  try {
    return normalizeRichContent(JSON.parse(json));
  } catch {
    return null;
  }
}

export function isCorruptedText(text: string): boolean {
  return /\?{2,}/.test(text) || text.includes("\uFFFD");
}

export function isRichContentCorrupted(c: ProductRichContent): boolean {
  if (isCorruptedText(c.summaryTitle)) return true;
  if (isCorruptedText(c.shopMessage)) return true;
  return c.features.some(
    (f) => isCorruptedText(f.title) || isCorruptedText(f.body) || (f.note && isCorruptedText(f.note))
  );
}

export const DIP_SWITCH_ROWS = [
  { lever: 1, label: "\u4e0a\u9396\u6642\u6a5f", on: "D \u6a94", off: "\u6642\u901f 13km/h" },
  { lever: 2, label: "\u89e3\u9396\u6642\u6a5f", on: "\u7184\u706b", off: "P \u6a94" },
  { lever: 3, label: "\u9580\u5371\u96aa\u71c8", on: "\u958b\u555f", off: "\u95dc\u9589" },
  { lever: 4, label: "\u5f15\u64ce\u5f85\u6a5f\u9396", on: "\u95dc\u9589", off: "\u958b\u555f" },
  { lever: 5, label: "\u5012\u8eca\u5371\u96aa\u71c8", on: "\u958b\u555f", off: "\u95dc\u9589" },
] as const;

export const FREED_LOCK_CONTENT: ProductRichContent = {
  summaryTitle:
    "\u8eca\u901f\u9023\u52d5\u81ea\u52d5\u9580\u9396\u30fbP \u6a94\u89e3\u9396\u30fb\u9580\u5371\u96aa\u71c8\u30fb\u5012\u8eca\u5371\u96aa\u71c8\u30fb\u5f15\u64ce\u5f85\u6a5f\u9396\u5b9a\uff08\u542b\u518d\u9396\u5b9a\u529f\u80fd\uff09",
  points: [
    "\u81ea\u52d5\u4e0a\u9396\u3001\u81ea\u52d5\u89e3\u9396\u3001\u6025\u6e1b\u901f\u89e3\u9396\u3001\u9580\u5371\u96aa\u71c8\u3001\u5012\u8eca\u5371\u96aa\u71c8\u3001\u5f15\u64ce\u5f85\u6a5f\u9396\u5b9a\u516d\u5927\u529f\u80fd",
    "\u4e0a\u9396\uff0f\u89e3\u9396\u6642\u6a5f\u8207\u5371\u96aa\u71c8\u958b\u95dc\u53ef\u5207\u63db",
    "\u518d\u9396\u5b9a\u529f\u80fd\uff1a\u884c\u99c6\u4e2d\u8aa4\u89f8\u89e3\u9396\u6703\u77ac\u9593\u518d\u9396\uff08\u524d\u5ea7\u9069\u7528\uff09",
    "\u5f15\u64ce\u5f85\u6a5f\u9396\u5b9a\uff1a\u9810\u71b1\u6216\u958b\u51b7\u6c23\u6642\u53ef\u9396\u9580\u96e2\u9580\u8eca\u8f1b",
  ],
  shopMessage:
    "\u3010\u5b89\u88dd\u8aaa\u660e\u3011\n\u5b89\u88dd\u4f4d\u7f6e\u70ba\u99d5\u99db\u5e2d\u8173\u90e8\u4fdd\u96aa\u7d72\u76d2\u9644\u8fd1\u7684\u5361\u666e\u62c9\u53ca\u9078\u88dd\u5361\u666e\u62c9\u3002\u82e5\u9078\u88dd\u53e3\u5df2\u88ab\u5360\u7528\uff0c\u8acb\u53e6\u8cfc\u96fb\u6e90\u9078\u88dd\u5361\u666e\u62c9\uff08HC-01-f\uff09\u5f8c\u63a5\u7e8c\u3002\n\n\u3010\u6ce8\u610f\u4e8b\u9805\u3011\n\u30fb\u65b0\u5546\u54c1\u529f\u80fd\u53ef\u80fd\u56e0\u6539\u7248\u800c\u8abf\u6574\uff0c\u656c\u8acb\u898b\u8ad2\u3002\n\u30fb\u90e8\u5206\u6539\u88dd\u54c1\u53ef\u80fd\u8207\u672c\u5957\u4ef6\u4e0d\u76f8\u5bb9\u3002\n\u30bb\u518d\u9396\u5b9a\u50c5\u9069\u7528\u99d5\u99db\u5e2d\u53ca\u52a9\u624b\u5e2d\uff0c\u5f8c\u5ea7\u4e0d\u9069\u7528\u3002\n\u30bb\u8eca\u6aa2\u662f\u5426\u901a\u904e\u8996\u6aa2\u9a57\u54e1\u5224\u65b7\uff0c\u672c\u5e97\u4e0d\u4f5c\u767e\u5206\u4e4b\u767e\u4fdd\u8b49\u3002\n\n\u3010\u4fdd\u56fa\u3011\n\u767c\u8ca8\u65e5\u8d77\u4e00\u5e74\u5167\uff0c\u6b63\u5e38\u4f7f\u7528\u4e0b\u4e4b\u6545\u969c\u53ef\u514d\u8cbb\u7dad\u4fee\u6216\u66f4\u63db\u3002\u521d\u671f\u4e0d\u826f\u8acb\u65bc\u5230\u8ca8\u4e00\u9031\u5167\u806f\u7d61\u3002",
  gallery: [
    { id: "1", label: "\u4e3b\u5716", src: "/products/gallery/freed-main.svg" },
    { id: "2", label: "\u5957\u4ef6", src: "/products/gallery/freed-kit.svg" },
    { id: "3", label: "\u529f\u80fd\u4e00", src: "/products/gallery/freed-f1.svg" },
    { id: "4", label: "\u518d\u9396\u5b9a", src: "/products/gallery/freed-relock.svg" },
    { id: "5", label: "\u529f\u80fd\u4e8c", src: "/products/gallery/freed-f2.svg" },
    { id: "6", label: "\u529f\u80fd\u4e09", src: "/products/gallery/freed-f3.svg" },
    { id: "7", label: "\u529f\u80fd\u56db", src: "/products/gallery/freed-f4.svg" },
    { id: "8", label: "\u529f\u80fd\u4e94", src: "/products/gallery/freed-f5.svg" },
    { id: "9", label: "\u529f\u80fd\u516d", src: "/products/gallery/freed-f6.svg" },
    { id: "10", label: "\u63a5\u7dda", src: "/products/gallery/freed-wire.svg" },
    { id: "11", label: "\u5b89\u88dd", src: "/products/gallery/freed-install.svg" },
  ],
  features: [
    {
      num: 1,
      title: "\u81ea\u52d5\u4e0a\u9396\u529f\u80fd",
      body: "\u6642\u901f\u7d04 13 \u516c\u91cc\u524d\u5f8c\u884c\u99c6\u6642\u81ea\u52d5\u4e0a\u9396\uff0c\u4ea6\u53ef\u8a2d\u5b9a\u70ba D \u6a94\u5165\u6a94\u6642\u4e0a\u9396\u3002",
      visual: "auto-lock",
    },
    {
      num: 0,
      title: "\u518d\u9396\u5b9a\u529f\u80fd",
      body: "\u884c\u99c6\u4e2d\uff0813 \u516c\u91cc\u4ee5\u4e0a\uff09\u624b\u52d5\u89e3\u9396\u6703\u77ac\u9593\u518d\u9396\uff1b\u505c\u8eca\u6642\u6216\u5f8c\u5ea7\u4e0d\u9069\u7528\u3002",
      note: "\u203b\u50c5\u9069\u7528\u99d5\u99db\u5e2d\u53ca\u52a9\u624b\u5e2d",
      visual: "relock",
    },
    {
      num: 2,
      title: "\u81ea\u52d5\u89e3\u9396\u529f\u80fd",
      body: "P \u6a94\u81ea\u52d5\u89e3\u9396\uff0c\u65b9\u4fbf\u540c\u4e58\u8005\u4e0a\u4e0b\u8eca\uff1b\u53ef\u5207\u63db\u70ba\u7184\u706b\u6642\u89e3\u9396\u3002",
      visual: "unlock",
    },
    {
      num: 3,
      title: "\u9580\u81ea\u52d5\u5371\u96aa\u71c8",
      body: "\u9580\u6642\u5371\u96aa\u71c8\u81ea\u52d5\u9583\u70c1\u63d0\u9192\u5468\u570d\uff0c\u95dc\u9580\u5f8c\u7184\u6ec5\uff0c\u53ef\u8a2d\u5b9a\u958b\u95dc\u3002",
      visual: "door-hazard",
    },
    {
      num: 4,
      title: "\u5f15\u64ce\u5f85\u6a5f\u9396\u5b9a",
      body: "\u5f15\u64ce\u904b\u8f49\u4e2d\u53ef\u9396\u9580\uff0c\u51ac\u5b63\u9810\u71b1\u3001\u590f\u5b63\u958b\u51b7\u6c23\u6642\u7279\u5225\u5be6\u7528\u3002",
      note: "\u203b\u9470\u5319\u5728\u8eca\u5167\u6642\u4e0d\u6703\u52d5\u4f5c",
      visual: "engine-lock",
    },
    {
      num: 5,
      title: "\u5012\u8eca\u81ea\u52d5\u5371\u96aa\u71c8",
      body: "\u5165 R \u6a94\u81ea\u52d5\u9583\u70c1\u5371\u96aa\u71c8\uff0c\u7121\u9700\u624b\u52d5\u6309\u9215\uff0c\u53ef\u8a2d\u5b9a\u958b\u95dc\u3002",
      visual: "back-hazard",
    },
    {
      num: 6,
      title: "\u6025\u6e1b\u901f\u81ea\u52d5\u89e3\u9396",
      body: "\u7d04 40 \u516c\u91cc\u4ee5\u4e0a\u6025\u6e1b\u901f\u6642\u81ea\u52d5\u89e3\u9396\uff0c\u7dca\u6025\u9003\u751f\u6642\u6e1b\u5c11\u88ab\u56f0\u98a8\u96aa\u3002",
      note: "\u203b\u7121\u6cd5\u95dc\u9589\u6b64\u529f\u80fd",
      visual: "emergency",
    },
  ],
  showDipSwitch: true,
};

export const SPECS_HIDDEN_WHEN_RICH = new Set([
  "\u5c0d\u61c9\u8eca\u7a2e",
  "\u5c0d\u61c9\u5e74\u5f0f",
  "\u5546\u54c1\u4ee3\u78bc",
  "\u767c\u8ca8",
]);
