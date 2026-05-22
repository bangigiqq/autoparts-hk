export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">聯絡我們</h1>
      <div className="mt-8 space-y-4 text-slate-700">
        <p>
          <strong>辦公室地址：</strong>屯門萬能閣 G7 地鋪
        </p>
        <p>
          <strong>電郵：</strong> cs@ywengineoil.com
        </p>
        <p>
          <strong>WhatsApp：</strong>{" "}
          <a
            href="https://wa.me/85254495722"
            className="text-red-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            (+852) 5449 5722
          </a>
        </p>
        <p>
          <strong>營業時間：</strong>
          <br />
          星期一至六 10:00–19:00
          <br />
          星期日及公眾假期休息
        </p>
      </div>
    </div>
  );
}
