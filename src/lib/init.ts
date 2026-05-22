import { seedDatabase } from "./seed";
import { repairCorruptedRichContent } from "./product-rich-db";

const globalInit = globalThis as typeof globalThis & {
  __seedPromise?: Promise<void>;
};

export async function ensureSeeded() {
  if (!globalInit.__seedPromise) {
    globalInit.__seedPromise = seedDatabase()
      .then(() => {
        repairCorruptedRichContent();
      })
      .then(() => undefined);
  }
  await globalInit.__seedPromise;
}
