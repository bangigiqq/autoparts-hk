import { z } from "zod";
import {
  emptyRichContent,
  normalizeRichContent,
  parseRichContentJson,
  type ProductRichContent,
} from "./product-content-types";
import { getRichContent, saveRichContent } from "./product-rich-db";

const gallerySchema = z.object({
  id: z.string(),
  label: z.string(),
  src: z.string(),
});

const featureSchema = z.object({
  num: z.number().int(),
  title: z.string(),
  body: z.string(),
  note: z.string().optional(),
  visual: z.enum([
    "auto-lock",
    "relock",
    "unlock",
    "door-hazard",
    "engine-lock",
    "back-hazard",
    "emergency",
  ]),
});

export const richContentSchema = z.object({
  summaryTitle: z.string().optional(),
  points: z.array(z.string()).optional(),
  shopMessage: z.string().optional(),
  gallery: z.array(gallerySchema).optional(),
  features: z.array(featureSchema).optional(),
  showDipSwitch: z.boolean().optional(),
});

export function getProductRichContent(productId: string): ProductRichContent {
  return getRichContent(productId) ?? emptyRichContent();
}

export function parseRichContentInput(
  input: z.infer<typeof richContentSchema> | null | undefined
): ProductRichContent | null {
  if (!input) return null;
  return normalizeRichContent({
    summaryTitle: input.summaryTitle ?? "",
    points: input.points ?? [],
    shopMessage: input.shopMessage ?? "",
    gallery: input.gallery ?? [],
    features: input.features ?? [],
    showDipSwitch: input.showDipSwitch ?? false,
  });
}

export function updateProductRichContent(
  productId: string,
  input: z.infer<typeof richContentSchema> | null | undefined
) {
  const content = parseRichContentInput(input);
  saveRichContent(productId, content);
  return content;
}
