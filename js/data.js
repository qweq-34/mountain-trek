/* ==========================================================================
   模拟数据：国内名山目的地
   说明：数据均为演示用模拟数据，海拔为近似主峰高度（米）。
   字段说明：
     - name     山名
     - province 所在省份
     - elevation 海拔（米）
     - difficulty 徒步难度：easy / medium / hard
     - season   最佳季节
     - desc     简介
     - image    真实图片（本地生成的山景图，精确对应每座山）
     - fallback 占位图（内联 SVG data URI，作为图片加载失败时的降级）
     - featured 是否进入“精选推荐”
   ========================================================================== */

/* 图片基础路径：指向本地 images 目录 */
const IMG_BASE = "images/";

/* 生成山形占位图的工具函数：根据色相返回一张带山形的 SVG data URI */
function mountainPlaceholder(label, hueA, hueB) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${hueA}" />
          <stop offset="1" stop-color="${hueB}" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#g)" />
      <circle cx="470" cy="90" r="34" fill="#fff" opacity="0.85" />
      <path fill="rgba(255,255,255,0.18)" d="M0,280 L120,180 L210,250 L340,140 L470,230 L600,170 L600,400 L0,400 Z" />
      <path fill="rgba(20,40,30,0.30)" d="M0,320 L150,240 L280,310 L420,210 L600,300 L600,400 L0,400 Z" />
      <text x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="700" fill="#ffffff" opacity="0.9">${label}</text>
    </svg>
  `.replace(/\s+/g, " ");
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/* 目的地数据集 */
const MOUNTAINS = [
  {
    name: "黄山",
    province: "安徽省",
    elevation: 1864,
    difficulty: "medium",
    season: "3-5月 / 9-11月",
    desc: "奇松、怪石、云海、温泉“四绝”闻名天下，光明顶观日出为经典徒步体验。",
    image: IMG_BASE + "huangshan.png",
    fallback: mountainPlaceholder("黄 山", "#3f6b4f", "#2f4a3a"),
    featured: true,
  },
  {
    name: "泰山",
    province: "山东省",
    elevation: 1545,
    difficulty: "easy",
    season: "全年",
    desc: "五岳之首，帝王封禅之地，十八盘与南天门是登顶路上的标志性地标。",
    image: IMG_BASE + "taishan.png",
    fallback: mountainPlaceholder("泰 山", "#6a8f63", "#3d5c46"),
    featured: true,
  },
  {
    name: "华山",
    province: "陕西省",
    elevation: 2155,
    difficulty: "hard",
    season: "4-10月",
    desc: "以“奇险天下第一山”著称，长空栈道、鹞子翻身考验胆量，适合挑战型山友。",
    image: IMG_BASE + "huashan.png",
    fallback: mountainPlaceholder("华 山", "#8f6b4a", "#5c4430"),
    featured: true,
  },
  {
    name: "峨眉山",
    province: "四川省",
    elevation: 3099,
    difficulty: "medium",
    season: "4-6月 / 9-11月",
    desc: "佛教名山，金顶云海与佛光闻名，徒步可穿越清音阁、洪椿坪等古刹胜景。",
    image: IMG_BASE + "emeishan.png",
    fallback: mountainPlaceholder("峨眉山", "#4a7c59", "#274a3a"),
    featured: false,
  },
  {
    name: "武功山",
    province: "江西省",
    elevation: 1918,
    difficulty: "medium",
    season: "5-10月",
    desc: "高山草甸绵延起伏，云雾缭绕如入画中，是入门徒步与星空露营的热门目的地。",
    image: IMG_BASE + "wugongshan.png",
    fallback: mountainPlaceholder("武功山", "#7a9b6d", "#4c6a45"),
    featured: true,
  },
  {
    name: "三清山",
    province: "江西省",
    elevation: 1819,
    difficulty: "medium",
    season: "4-11月",
    desc: "花岗岩峰林地貌，巨蟒出山、东方女神等奇石景观，徒步栈道视野开阔。",
    image: IMG_BASE + "sanqingshan.png",
    fallback: mountainPlaceholder("三清山", "#5d7d6a", "#384e40"),
    featured: false,
  },
  {
    name: "长白山",
    province: "吉林省",
    elevation: 2691,
    difficulty: "hard",
    season: "6-9月",
    desc: "天池静谧神秘，火山地貌与原始森林并存，西坡、北坡各有徒步风光。",
    image: IMG_BASE + "changbaishan.png",
    fallback: mountainPlaceholder("长白山", "#5a7a8a", "#35505e"),
    featured: false,
  },
  {
    name: "衡山",
    province: "湖南省",
    elevation: 1300,
    difficulty: "easy",
    season: "全年",
    desc: "五岳中的南岳，祝融峰观日出，山间云雾与古寺相映，适合轻松徒步。",
    image: IMG_BASE + "hengshan.png",
    fallback: mountainPlaceholder("衡 山", "#6f8f6a", "#456049"),
    featured: false,
  },
];

/* 难度等级 → 中文标签（供卡片徽章与筛选使用） */
const DIFFICULTY_LABEL = {
  easy: "轻松",
  medium: "适中",
  hard: "挑战",
};
