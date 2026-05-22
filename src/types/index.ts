export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string | null;
  description: string | null;
  price: number;
  sku: string | null;
  stock: number;
  categoryId: string | null;
  brand: string | null;
  vehicleModels: string | null;
  specs: Record<string, string> | null;
  imageUrl: string | null;
  badges: string[];
  featured: boolean;
  avgRating?: number;
  reviewCount?: number;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
};

export type Order = {
  id: string;
  orderNumber: number;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  fpsRef: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingMethod: string | null;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
};
