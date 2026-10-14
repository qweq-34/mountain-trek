/* ==========================================================================
   应用逻辑：渲染首页数据 + 交互（导航汉堡菜单）
   ========================================================================== */

/* ---------- 工具：HTML 转义，防止数据注入 ---------- */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * 渲染单张目的地卡片（可复用组件）
 * @param {Object} m 单个山的数据对象
 * @returns {string} 卡片 HTML 字符串
 */
function renderDestinationCard(m) {
  const diff = m.difficulty || "medium";
  const diffLabel = DIFFICULTY_LABEL[diff] || "适中";

  return `
    <article class="destination-card">
      <!-- 图片区：真实图片 + 难度徽章；加载失败时回退到占位图 -->
      <div class="card-media">
        <img src="${m.image}" data-fallback="${m.fallback}" alt="${escapeHtml(m.name)}徒步风景" loading="lazy" />
        <span class="difficulty-badge ${diff}">${diffLabel}</span>
      </div>

      <!-- 主体：标题、省份、指标、简介、链接 -->
      <div class="card-body">
        <header class="card-header">
          <h3 class="card-title">${escapeHtml(m.name)}</h3>
          <span class="card-province">${escapeHtml(m.province)}</span>
        </header>

        <div class="card-stats">
          <div class="stat">
            <span class="stat-label">海拔</span>
            <span class="stat-value">${m.elevation} 米</span>
          </div>
          <div class="stat">
            <span class="stat-label">难度</span>
            <span class="stat-value">${diffLabel}</span>
          </div>
          <div class="stat">
            <span class="stat-label">最佳季节</span>
            <span class="stat-value">${escapeHtml(m.season)}</span>
          </div>
        </div>

        <p class="card-desc">${escapeHtml(m.desc)}</p>

        <a class="card-link" href="#destinations" aria-label="查看${escapeHtml(m.name)}详情">查看详情 →</a>
      </div>
    </article>
  `;
}

/**
 * 渲染“精选推荐”卡片（横向大图样式）
 * @param {Object} m 单个山的数据对象
 */
function renderFeaturedCard(m) {
  return `
    <a class="featured-card" href="#destinations" aria-label="查看精选目的地：${escapeHtml(m.name)}">
      <div class="fc-img">
        <img src="${m.image}" data-fallback="${m.fallback}" alt="${escapeHtml(m.name)}精选推荐" loading="lazy" />
      </div>
      <div class="fc-body">
        <span class="fc-tag">精选推荐 · ${escapeHtml(m.province)}</span>
        <h3 class="fc-title">${escapeHtml(m.name)}</h3>
        <p class="fc-meta">${m.elevation} 米 · ${DIFFICULTY_LABEL[m.difficulty]}</p>
      </div>
    </a>
  `;
}

/* ---------- 渲染所有内容到 DOM ---------- */
function renderPage() {
  // 精选推荐：筛选 featured 为 true 的数据
  const featured = MOUNTAINS.filter((m) => m.featured);
  document.getElementById("featuredGrid").innerHTML =
    featured.map(renderFeaturedCard).join("");

  // 全部目的地卡片网格
  document.getElementById("destinationGrid").innerHTML =
    MOUNTAINS.map(renderDestinationCard).join("");
}

/* ---------- 搜索与筛选 ---------- */
/**
 * 根据关键词过滤目的地（匹配山名、省份、简介）
 * @param {string} keyword 搜索关键词
 */
function filterMountains(keyword) {
  const kw = (keyword || "").trim().toLowerCase();

  // 无关键词时显示全部
  if (!kw) return MOUNTAINS;

  return MOUNTAINS.filter((m) => {
    const haystack = [m.name, m.province, m.desc]
      .join(" ")
      .toLowerCase();
    return haystack.includes(kw);
  });
}

/* ---------- 图片加载失败降级 ---------- */
/**
 * 为所有带 data-fallback 的图片绑定错误回退：
 * 真实图片加载失败时，自动替换为内联 SVG 占位图，保证卡片永不空白。
 */
function bindImageFallback() {
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    // 若已在缓存中失败过，直接替换
    img.addEventListener("error", function handler() {
      const fb = this.getAttribute("data-fallback");
      if (fb && this.src !== fb) {
        this.src = fb;
        this.removeAttribute("data-fallback"); // 防止无限循环
      }
      this.removeEventListener("error", handler);
    });
  });
}

/* ---------- 初始化搜索栏 ---------- */
function initSearch() {
  const input = document.getElementById("searchInput");
  const grid = document.getElementById("destinationGrid");
  const empty = document.getElementById("emptyState");

  if (!input || !grid) return;

  const applyFilter = () => {
    const results = filterMountains(input.value);
    grid.innerHTML = results.map(renderDestinationCard).join("");
    // 绑定新渲染卡片的图片降级
    bindImageFallback();

    // 无结果时展示空状态提示
    if (empty) {
      empty.style.display = results.length ? "none" : "block";
    }
  };

  // 输入实时过滤（含中文输入法组合结束事件）
  input.addEventListener("input", applyFilter);
  input.addEventListener("compositionend", applyFilter);
}

/* ---------- 导航汉堡菜单交互 ---------- */
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "关闭导航菜单" : "打开导航菜单");
  });

  // 点击任一导航链接后，自动收起移动端菜单
  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- 页面加载完成后执行 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderPage();
  initNavToggle();
  initSearch();
  bindImageFallback();
});
