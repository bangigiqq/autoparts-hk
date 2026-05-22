import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <h3 className="font-semibold text-white mb-3">聯絡我們</h3>
          <p>辦公室地址：屯門萬能閣 G7 地鋪</p>
          <p>電郵: cs@ywengineoil.com</p>
          <p>WhatsApp: (+852) 5449 5722</p>
          <p className="mt-2 text-slate-400">
            星期一至六 10:00–19:00
            <br />
            星期日及公眾假期休息
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">選單</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-white">
                首頁
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                商品目錄
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-white">
                我的訂單
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                聯絡我們
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-white text-slate-500">
                管理後台
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">付款方式</h3>
          <p>轉數快 FPS · AlipayHK · 門市自取</p>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-500">
        © 2026 欣榮汽配專門店 — All Rights Reserved
      </div>
    </footer>
  );
}
