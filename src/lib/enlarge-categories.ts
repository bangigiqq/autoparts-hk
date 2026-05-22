/**
 * 分類結構參考 Enlarge 官方網站
 * https://enlargecorp.co.jp/products/detail/1411
 */
export type CategorySeed = {
  id: string;
  slug: string;
  name: string;
  nameJa?: string;
  parentId: string | null;
  type: "function" | "brand" | "monitor" | "service";
  sortOrder: number;
};

function fn(
  id: string,
  slug: string,
  name: string,
  nameJa: string,
  sort: number,
  parentId: string | null = null
): CategorySeed {
  return { id, slug, name, nameJa, parentId, type: "function", sortOrder: sort };
}

function br(
  id: string,
  slug: string,
  name: string,
  nameJa: string,
  sort: number,
  parentId: string | null = null
): CategorySeed {
  return { id, slug, name, nameJa, parentId, type: "brand", sortOrder: sort };
}

/** 機能・取付箇所から選択 */
export const FUNCTION_CATEGORIES: CategorySeed[] = [
  fn("fn-root", "function-all", "功能・安裝位置", "功能・安裝位置", 0, null),
  fn("fn-easy-closer", "easy-closer", "輕鬆關門器", "イージークローザー", 1, "fn-root"),
  fn("fn-auto-light", "auto-light-sensor", "自動燈光感應", "オートライトセンサー", 2, "fn-root"),
  fn("fn-idle-stop", "idle-stop-cancel", "怠速熄火解除", "アイドリングストップキャンセラー", 3, "fn-root"),
  fn("fn-tv-navi", "tv-navi-cancel", "TV・導航解除", "TV・ナビキャンセラー", 4, "fn-root"),
  fn("fn-auto-park", "auto-parking-brake", "自動駐車煞車", "オートパーキングブレーキキット", 5, "fn-root"),
  fn("fn-brake-hold", "auto-brake-hold", "自動煞車保持", "オートブレーキホールドキット", 6, "fn-root"),
  fn("fn-speed-door-lock", "speed-door-lock", "車速連動自動門鎖", "車速連動オートドアロック", 7, "fn-root"),
  fn("fn-led", "led-lamp", "LED 燈組", "LEDランプ", 8, "fn-root"),
  fn("fn-led-plate", "led-number-plate", "車牌燈", "ナンバー灯", 1, "fn-led"),
  fn("fn-led-illum", "led-illumination", "LED 氛圍燈", "LEDイルミネーションライト", 2, "fn-led"),
  fn("fn-led-winker", "led-winker", "方向燈", "ウインカー", 3, "fn-led"),
  fn("fn-led-courtesy", "led-courtesy", "迎賓燈", "カーテシーランプ", 4, "fn-led"),
  fn("fn-led-seq", "led-sequential-winker", "序列式方向燈", "シーケンシャルウインカー", 5, "fn-led"),
  fn("fn-led-tail", "led-tail", "尾燈", "テールランプ", 6, "fn-led"),
  fn("fn-led-back", "led-back", "倒車燈", "バックランプ", 7, "fn-led"),
  fn("fn-led-fog", "led-fog", "霧燈", "フォグランプ", 8, "fn-led"),
  fn("fn-led-head", "led-head", "頭燈", "ヘッドランプ", 9, "fn-led"),
  fn("fn-led-license", "led-license", "牌照燈", "ライセンスランプ", 10, "fn-led"),
  fn("fn-led-reflector", "led-reflector-lamp", "反光燈", "リフレクター", 11, "fn-led"),
  fn("fn-led-room", "led-room", "室內燈", "ルームランプ", 12, "fn-led"),
  fn("fn-engine-lock", "engine-idle-lock", "引擎運轉中鎖門", "エンジンかけたままロック", 9, "fn-root"),
  fn("fn-slide-lock", "slide-door-lock", "滑門預約上鎖", "スライドドア予約ロック", 10, "fn-root"),
  fn("fn-thank-hazard", "thank-you-hazard", "感謝閃燈", "サンキューハザードキット", 11, "fn-root"),
  fn("fn-auto-hazard", "auto-hazard", "自動危險燈", "オートハザードシステム", 12, "fn-root"),
  fn("fn-mirror", "mirror-window", "後視鏡・車窗", "ミラー・ウインドウ関連", 13, "fn-root"),
  fn("fn-mirror-fold", "mirror-fold", "鎖門連動摺鏡", "ロック連動ミラー格納", 1, "fn-mirror"),
  fn("fn-power-window", "auto-power-window", "自動升降窗", "オートパワーウインドウ", 2, "fn-mirror"),
  fn("fn-daylight", "daylight-full", "日行燈・全燈化", "デイライト・全灯化", 14, "fn-root"),
  fn("fn-brake-full", "brake-full-light", "煞車燈全亮", "ブレーキランプ全灯化", 1, "fn-daylight"),
  fn("fn-pos-daylight", "position-daylight", "示寬燈日行燈化", "ポジションランプデイライト化", 2, "fn-daylight"),
  fn("fn-tail-full", "tail-full-light", "尾燈全亮", "テールランプ全灯化", 3, "fn-daylight"),
  fn("fn-led-reflector-kit", "led-reflector-kit", "LED 反光片", "LEDリフレクター", 4, "fn-daylight"),
  fn("fn-luggage-lamp", "luggage-door-lamp", "尾門照明", "ラゲッジドアランプ", 15, "fn-root"),
  fn("fn-starter", "engine-starter", "遙控啟動", "エンジンスターター", 16, "fn-root"),
  fn("fn-one-touch", "one-touch-winker", "一鍵閃燈", "ワンタッチウインカー", 17, "fn-root"),
  fn("fn-high-mount", "high-mount-stop", "第三煞車燈", "ハイマウントストップランプ", 18, "fn-root"),
  fn("fn-dressup", "dress-up", "外觀升級", "ドレスアップ用品", 19, "fn-root"),
  fn("fn-dress-ext", "dress-exterior", "外觀件", "エクステリアパーツ", 1, "fn-dressup"),
  fn("fn-dress-int", "dress-interior", "內裝件", "インテリアパーツ", 2, "fn-dressup"),
  fn("fn-foot-mat", "foot-mat", "腳墊", "フットマット", 3, "fn-dressup"),
  fn("fn-navi", "car-navi", "導航相關", "カーナビ関連", 20, "fn-root"),
  fn("fn-obd", "obd", "OBD 相關", "OBD関連", 21, "fn-root"),
  fn("fn-ac100v", "ac100v-switch", "AC100V 自動開關", "AC100Vオートスイッチ", 22, "fn-root"),
  fn("fn-throttle", "power-throttle", "油門控制", "パワースロットルコントロール", 23, "fn-root"),
  fn("fn-key-case", "smart-key-case", "智能匙殼", "スマートキーケース", 24, "fn-root"),
  fn("fn-handle", "door-handle-protect", "門把護套", "ドアハンドルプロテクター", 25, "fn-root"),
  fn("fn-phone-holder", "phone-holder", "手機支架", "スマホホルダー", 26, "fn-root"),
  fn("fn-carbon", "carbon-parts", "碳纖維", "カーボン素材", 27, "fn-root"),
  fn("fn-charger", "charger", "充電器", "充電器", 28, "fn-root"),
  fn("fn-night-vision", "night-vision", "夜視系統", "ナイトビジョン", 29, "fn-root"),
  fn("fn-hud", "hud-display", "HUD 抬頭顯示", "HUDヘッドアップディスプレイ", 30, "fn-root"),
  fn("fn-tpms", "tpms", "胎壓監測 TPMS", "タイヤ空気圧監視(TPMS)", 31, "fn-root"),
  fn("fn-other", "other-parts", "其他零件", "その他パーツ", 32, "fn-root"),
  // 欣榮油品類（擴展）
  fn("fn-engine-oil", "engine-oil", "汽車機油", "エンジンオイル", 33, "fn-root"),
  fn("fn-battery", "car-battery", "汽車電池", "バッテリー", 34, "fn-root"),
];

/** メーカー・車種から選択 */
export const BRAND_CATEGORIES: CategorySeed[] = [
  br("br-root", "brand-all", "品牌・車種", "メーカー・車種", 0, null),

  br("br-toyota", "toyota", "TOYOTA 豐田", "TOYOTA(トヨタ)", 1, "br-root"),
  br("br-toyota-estima", "toyota-estima", "ESTIMA 普瑞維亞", "ESTIMA", 1, "br-toyota"),
  br("br-toyota-voxy90", "toyota-voxy-90", "VOXY/NOAH 90系", "VOXY・NOAH90系", 2, "br-toyota"),
  br("br-toyota-prius30", "toyota-prius-30", "30系 Prius", "30系プリウス", 3, "br-toyota"),
  br("br-toyota-prius40a", "toyota-prius-alpha-40", "40系 Prius α", "40系プリウスα", 4, "br-toyota"),
  br("br-toyota-prius50", "toyota-prius-50", "50系 Prius/PHV", "50系プリウス", 5, "br-toyota"),
  br("br-toyota-prius60", "toyota-prius-60", "60系 Prius/PHEV", "60系プリウス", 6, "br-toyota"),
  br("br-toyota-alphard30", "toyota-alphard-30", "30系 Alphard", "ALPHARD30系", 7, "br-toyota"),
  br("br-toyota-alphard40", "toyota-alphard-40", "40系 Alphard", "ALPHARD40系", 8, "br-toyota"),
  br("br-toyota-vellfire30", "toyota-vellfire-30", "30系 Vellfire", "VELLFIRE30系", 9, "br-toyota"),
  br("br-toyota-vellfire40", "toyota-vellfire-40", "40系 Vellfire", "VELLFIRE40系", 10, "br-toyota"),
  br("br-toyota-aqua", "toyota-aqua", "AQUA", "AQUA", 11, "br-toyota"),
  br("br-toyota-rav4", "toyota-rav4", "RAV4/PHV", "RAV4", 12, "br-toyota"),
  br("br-toyota-yaris", "toyota-yaris", "YARIS / Cross / GR", "YARIS", 13, "br-toyota"),
  br("br-toyota-hiace", "toyota-hiace", "Hiace 海獅", "ハイエース", 14, "br-toyota"),

  br("br-honda", "honda", "HONDA 本田", "HONDA(ホンダ)", 2, "br-root"),
  br("br-honda-civic", "honda-civic", "CIVIC 思域", "CIVIC", 1, "br-honda"),
  br("br-honda-crv", "honda-crv", "CR-V", "CR-V", 2, "br-honda"),
  br("br-honda-fit", "honda-fit", "FIT 飛度", "FIT", 3, "br-honda"),
  br("br-honda-freed", "honda-freed", "FREED 弗烈特", "FREED(フリード)", 4, "br-honda"),
  br("br-honda-e", "honda-e", "HONDA e", "HONDA e", 5, "br-honda"),
  br("br-honda-nbox", "honda-nbox", "N-BOX", "N-BOX", 6, "br-honda"),
  br("br-honda-none", "honda-n-one", "N-ONE", "N-ONE", 7, "br-honda"),
  br("br-honda-nvan", "honda-n-van", "N-VAN", "N-VAN", 8, "br-honda"),
  br("br-honda-nwgn", "honda-n-wgn", "N-WGN", "N-WGN", 9, "br-honda"),
  br("br-honda-odyssey", "honda-odyssey", "ODYSSEY 奧德賽", "ODYSSEY", 10, "br-honda"),
  br("br-honda-stepwgn", "honda-stepwgn", "STEPWGN 步威", "STEPWGN", 11, "br-honda"),
  br("br-honda-shuttle", "honda-shuttle", "SHUTTLE", "SHUTTLE", 12, "br-honda"),
  br("br-honda-vezel", "honda-vezel", "VEZEL 繽智", "VEZEL", 13, "br-honda"),
  br("br-honda-wrv", "honda-wr-v", "WR-V", "WR-V", 14, "br-honda"),
  br("br-honda-zrv", "honda-zr-v", "ZR-V", "ZR-V", 15, "br-honda"),

  br("br-nissan", "nissan", "NISSAN 日產", "NISSAN(ニッサン)", 3, "br-root"),
  br("br-nissan-serena", "nissan-serena", "SERENA 塞麗納", "SERENA", 1, "br-nissan"),
  br("br-nissan-xtrail", "nissan-x-trail", "X-TRAIL", "X-TRAIL", 2, "br-nissan"),
  br("br-nissan-note", "nissan-note", "NOTE / AURA", "NOTE", 3, "br-nissan"),
  br("br-nissan-leaf", "nissan-leaf", "LEAF", "LEAF", 4, "br-nissan"),

  br("br-mitsubishi", "mitsubishi", "MITSUBISHI 三菱", "MITSUBISHI", 4, "br-root"),
  br("br-mitsu-delica", "mitsubishi-delica", "DELICA 得利卡", "DELICA", 1, "br-mitsubishi"),
  br("br-mitsu-outlander", "mitsubishi-outlander", "OUTLANDER", "OUTLANDER", 2, "br-mitsubishi"),

  br("br-suzuki", "suzuki", "SUZUKI 鈴木", "SUZUKI(スズキ)", 5, "br-root"),
  br("br-suzuki-spacia", "suzuki-spacia", "SPACIA", "スペーシア", 1, "br-suzuki"),
  br("br-suzuki-hustler", "suzuki-hustler", "HUSTLER", "ハスラー", 2, "br-suzuki"),
  br("br-suzuki-jimny", "suzuki-jimny", "JIMNY 吉姆尼", "ジムニー", 3, "br-suzuki"),

  br("br-daihatsu", "daihatsu", "DAIHATSU 大發", "DAIHATSU(ダイハツ)", 6, "br-root"),
  br("br-daihatsu-tanto", "daihatsu-tanto", "TANTO", "タント", 1, "br-daihatsu"),
  br("br-daihatsu-move", "daihatsu-move", "MOVE", "ムーブ", 2, "br-daihatsu"),
  br("br-daihatsu-hijet", "daihatsu-hijet", "HIJET 海獅", "ハイゼット", 3, "br-daihatsu"),

  br("br-lexus", "lexus", "LEXUS 凌志", "LEXUS(レクサス)", 7, "br-root"),
  br("br-lexus-rx", "lexus-rx", "RX", "RX", 1, "br-lexus"),
  br("br-lexus-nx", "lexus-nx", "NX", "NX", 2, "br-lexus"),

  br("br-mazda", "mazda", "MAZDA 萬事得", "MAZDA(マツダ)", 8, "br-root"),
  br("br-mazda-cx5", "mazda-cx5", "CX-5 / CX-8", "CX-5", 1, "br-mazda"),
  br("br-mazda-cx30", "mazda-cx30", "CX-30 / Mazda3", "CX-30", 2, "br-mazda"),

  br("br-subaru", "subaru", "SUBARU 富士", "SUBARU(スバル)", 9, "br-root"),
  br("br-subaru-forester", "subaru-forester", "FORESTER", "フォレスター", 1, "br-subaru"),
  br("br-subaru-impreza", "subaru-impreza", "IMPREZA", "インプレッサ", 2, "br-subaru"),

  br("br-volvo", "volvo", "VOLVO 富豪", "VOLVO(ボルボ)", 10, "br-root"),

  br("br-universal", "universal", "汎用品", "汎用品", 11, "br-root"),
  br("br-uni-obd", "universal-obd2", "OBD2 診斷機", "OBD2診断機", 1, "br-universal"),
  br("br-uni-battery-tester", "universal-battery-tester", "電池測試儀", "バッテリーテスター", 2, "br-universal"),
];

export const MONITOR_CATEGORIES: CategorySeed[] = [
  {
    id: "mon-root",
    slug: "monitor",
    name: "開發招募中",
    nameJa: "開發招募中",
    parentId: null,
    type: "monitor",
    sortOrder: 0,
  },
  {
    id: "mon-freed-2024",
    slug: "monitor-freed-2024",
    name: "新型 FREED 2024 招募",
    nameJa: "本田新型 FREED 2024",
    parentId: "mon-root",
    type: "monitor",
    sortOrder: 1,
  },
  {
    id: "mon-voxy-90",
    slug: "monitor-voxy-90",
    name: "VOXY 90 系 2026 招募",
    nameJa: "VOXY 90 系",
    parentId: "mon-root",
    type: "monitor",
    sortOrder: 2,
  },
];

export const ALL_ENLARGE_CATEGORIES: CategorySeed[] = [
  ...FUNCTION_CATEGORIES,
  ...BRAND_CATEGORIES,
  ...MONITOR_CATEGORIES,
];
