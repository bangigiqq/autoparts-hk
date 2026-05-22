export type CategoryWithMeta = {
  id: string;
  slug: string;
  name: string;
  nameJa: string | null;
  parentId: string | null;
  type: string;
  sortOrder: number;
  productCount: number;
  childCount: number;
  depth: number;
};
