import { HeaderWithMenu } from "@/components/HeaderWithMenu";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import {
  buildCategoryTree,
  getCategoryCounts,
  getProductCountForCategoryType,
} from "@/lib/categories";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const functionTree = buildCategoryTree("function");
  const brandTree = buildCategoryTree("brand");
  const monitorTree = buildCategoryTree("monitor");
  const categoryCounts = getCategoryCounts();
  const productTotals = {
    function: getProductCountForCategoryType("function"),
    brand: getProductCountForCategoryType("brand"),
    monitor: getProductCountForCategoryType("monitor"),
  };

  return (
    <CartProvider>
      <HeaderWithMenu
        functionTree={functionTree}
        brandTree={brandTree}
        monitorTree={monitorTree}
        categoryCounts={categoryCounts}
        productTotals={productTotals}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
