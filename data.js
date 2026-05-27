/* eslint-disable no-undef */
// vgsales site — Chart.js + heatmap + scroll reveals
(function () {
  const D = window.VGSALES;
  if (!D) {
    console.error("Dados vgsales não carregados (data.js).");
    return;
  }

  // ----------- AOS reveal -----------
  AOS.init({
    duration: 750,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });

  // ----------- Hero stats counter animation -----------
  const fmt = (n) => n.toLocaleString("pt-BR");
  const countUp = (el, target, suffix = "") => {
    if (!el) return;
    const start = performance.now();
    const dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  countUp(document.getElementById("stat-games"), D.meta.totalGames);
  countUp(document.getElementById("stat-platforms"), D.meta.platforms);
  countUp(document.getElementById("stat-publishers"), D.meta.publishers);
  countUp(document.getElementById("stat-genres"), D.meta.genres);

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setText("meta-games", fmt(D.meta.totalGames));
  setText("meta-year-min", D.meta.yearMin);
  setText("meta-year-max", D.meta.yearMax);
  setText("meta-sales", fmt(Math.round(D.meta.totalSales)));

  // ----------- Chart.js global defaults -----------
  Chart.defaults.color = "rgba(231,233,243,.78)";
  Chart.defaults.borderColor = "rgba(255,255,255,.06)";
  Chart.defaults.font.family = '"Space Grotesk", system-ui, sans-serif';
  Chart.defaults.plugins.legend.labels.color = "rgba(231,233,243,.85)";

  const tooltipStyle = {
    backgroundColor: "rgba(10,13,24,.95)",
    titleColor: "#22d3ee",
    bodyColor: "#e7e9f3",
    borderColor: "rgba(168,139,250,.4)",
    borderWidth: 1,
    padding: 12,
    cornerRadius: 12,
    titleFont: { weight: "600", size: 13 },
    bodyFont: { size: 12 },
    displayColors: true,
    boxPadding: 6,
  };

  // Reusable: vertical gradient (top -> bottom)
  const vGradient = (ctx, top, bottom) => {
    const { chartArea, ctx: c } = ctx.chart;
    if (!chartArea) return top;
    const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    return g;
  };
  const hGradient = (ctx, left, right) => {
    const { chartArea, ctx: c } = ctx.chart;
    if (!chartArea) return left;
    const g = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    g.addColorStop(0, left);
    g.addColorStop(1, right);
    return g;
  };

  // ============= Q1 — Top 10 jogos (bar horizontal) =============
  new Chart(document.getElementById("chartQ1"), {
    type: "bar",
    data: {
      labels: D.q1.map((j) => `${j.name}  ·  ${j.platform}`),
      datasets: [{
        label: "Vendas globais (milhões)",
        data: D.q1.map((j) => j.sales),
        backgroundColor: (ctx) => hGradient(ctx, "rgba(34,211,238,.85)", "rgba(168,139,250,.85)"),
        borderRadius: 8,
        borderSkipped: false,
        barThickness: "flex",
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: "easeOutCubic" },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle,
          callbacks: { label: (c) => ` ${c.raw} M de unidades` },
        },
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,.05)" }, ticks: { callback: (v) => v + "M" } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });

  // ============= Q2 — Gêneros (bar vertical) =============
  new Chart(document.getElementById("chartQ2"), {
    type: "bar",
    data: {
      labels: D.q2.map((g) => g.genre),
      datasets: [{
        data: D.q2.map((g) => g.sales),
        backgroundColor: (ctx) => vGradient(ctx, "rgba(244,114,182,.95)", "rgba(168,139,250,.45)"),
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStyle, callbacks: { label: (c) => ` ${c.raw} M de unidades` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 35, minRotation: 25, font: { size: 11 } } },
        y: { grid: { color: "rgba(255,255,255,.05)" }, ticks: { callback: (v) => v + "M" } },
      },
    },
  });

  // ============= Q3 — Evolução por ano (area) =============
  new Chart(document.getElementById("chartQ3"), {
    type: "line",
    data: {
      labels: D.q3.map((d) => d.year),
      datasets: [{
        label: "Vendas globais",
        data: D.q3.map((d) => d.sales),
        borderColor: "#22d3ee",
        backgroundColor: (ctx) => vGradient(ctx, "rgba(34,211,238,.45)", "rgba(34,211,238,0)"),
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#22d3ee",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      animation: { duration: 1100 },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle,
          callbacks: {
            title: (items) => `Ano ${items[0].label}`,
            label: (c) => ` ${c.raw} M de unidades vendidas`,
          },
        },
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,.04)" }, ticks: { maxTicksLimit: 12 } },
        y: { grid: { color: "rgba(255,255,255,.05)" }, ticks: { callback: (v) => v + "M" } },
      },
    },
  });

  // ============= Q4 — Plataformas =============
  const corFab = {
    Sony: "rgba(0,112,209,.9)",
    Microsoft: "rgba(16,124,16,.9)",
    Nintendo: "rgba(230,0,18,.9)",
    PC: "rgba(180,180,180,.9)",
    Outro: "rgba(150,150,180,.85)",
  };
  new Chart(document.getElementById("chartQ4"), {
    type: "bar",
    data: {
      labels: D.q4.map((p) => p.platform),
      datasets: [{
        data: D.q4.map((p) => p.sales),
        backgroundColor: D.q4.map((p) => corFab[p.maker] || corFab.Outro),
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle,
          callbacks: {
            title: (items) => items[0].label,
            label: (c) => ` ${c.raw} M de unidades  ·  ${D.q4[c.dataIndex].maker}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "rgba(255,255,255,.05)" }, ticks: { callback: (v) => v + "M" } },
      },
    },
  });

  // ============= Q5 — Donut regiões =============
  const coresRegiao = ["#22d3ee", "#a78bfa", "#f472b6", "#fbbf24"];
  new Chart(document.getElementById("chartQ5"), {
    type: "doughnut",
    data: {
      labels: D.q5.map((r) => r.region),
      datasets: [{
        data: D.q5.map((r) => r.sales),
        backgroundColor: coresRegiao,
        borderColor: "rgba(10,13,24,.8)",
        borderWidth: 4,
        hoverOffset: 14,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      animation: { duration: 1000, animateRotate: true, animateScale: true },
      plugins: {
        legend: {
          position: "right",
          labels: { padding: 16, boxWidth: 12, font: { size: 13 } },
        },
        tooltip: {
          ...tooltipStyle,
          callbacks: {
            label: (c) => {
              const total = c.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((c.raw / total) * 100).toFixed(1);
              return ` ${c.raw} M  ·  ${pct}%`;
            },
          },
        },
      },
    },
  });

  // ============= Q6 — Publishers (bar horizontal) =============
  new Chart(document.getElementById("chartQ6"), {
    type: "bar",
    data: {
      labels: D.q6.map((p) => p.publisher),
      datasets: [{
        data: D.q6.map((p) => p.sales),
        backgroundColor: (ctx) => hGradient(ctx, "rgba(163,230,53,.85)", "rgba(34,211,238,.85)"),
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStyle, callbacks: { label: (c) => ` ${c.raw} M de unidades` } },
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,.05)" }, ticks: { callback: (v) => v + "M" } },
        y: { grid: { display: false }, ticks: { font: { size: 12 } } },
      },
    },
  });

  // ============= Q7 — Heatmap (grid CSS custom) =============
  const heat = document.getElementById("heatmap");
  if (heat) {
    const { genres, regions, values } = D.q7;
    const flat = values.flat();
    const min = Math.min(...flat), max = Math.max(...flat);

    // cor: YlOrRd via interpolação simples HSL
    const colorFor = (v) => {
      const t = (v - min) / (max - min || 1); // 0..1
      // Hue: amarelo (50) -> laranja (20) -> vermelho (0)
      const hue = 50 - t * 50;
      const sat = 80 + t * 15;
      const light = 60 - t * 25; // mais escuro qto maior
      return `hsl(${hue} ${sat}% ${light}%)`;
    };

    const cols = regions.length + 1; // 1 col p/ labels + N regiões
    let html = `<div style="display:grid;grid-template-columns:140px repeat(${regions.length},1fr);gap:6px">`;
    // Header row
    html += `<div></div>`;
    regions.forEach((r) => {
      html += `<div class="text-center text-xs font-mono uppercase tracking-wider text-white/55 py-2">${r}</div>`;
    });
    // Rows
    genres.forEach((g, i) => {
      html += `<div class="text-sm font-medium text-white/85 flex items-center pr-2">${g}</div>`;
      regions.forEach((_, j) => {
        const v = values[i][j];
        const bg = colorFor(v);
        const fg = v / max > 0.55 ? "#1a0f00" : "#08111a";
        html += `<div class="heat-cell rounded-lg flex items-center justify-center text-sm font-semibold py-3"
                 style="background:${bg};color:${fg}"
                 title="${g} em ${regions[j]}: ${v}%">${v.toFixed(1)}%</div>`;
      });
    });
    html += `</div>`;
    // Legenda
    html += `<div class="mt-5 flex items-center gap-3 text-xs text-white/60 justify-end">
        <span>menor</span>
        <span class="inline-block h-2 w-40 rounded-full"
              style="background:linear-gradient(90deg,${colorFor(min)},${colorFor((min+max)/2)},${colorFor(max)})"></span>
        <span>maior · % do mercado regional</span>
    </div>`;
    heat.innerHTML = html;
  }
})();
