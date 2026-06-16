// ----- Password gate -----
// NOTE: client-side check only — not real security. Anyone can read this
// source. It's a soft gate to keep casual visitors out of the preview.
const PASSWORD = "preview2026";
const UNLOCK_KEY = "chroma-unlocked";

const gate = document.getElementById("gate");
const gateForm = document.getElementById("gateForm");
const gateInput = document.getElementById("gateInput");
const gateError = document.getElementById("gateError");

function unlock() {
  document.body.classList.remove("locked");
}

// Remembered from a previous visit?
if (localStorage.getItem(UNLOCK_KEY) === "true") {
  unlock();
} else {
  // Make sure the input is focused for first-time visitors.
  setTimeout(() => gateInput && gateInput.focus(), 100);
}

if (gateForm) {
  gateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (gateInput.value === PASSWORD) {
      localStorage.setItem(UNLOCK_KEY, "true");
      gateError.classList.remove("show");
      unlock();
    } else {
      gateError.textContent = "That's not quite right — try again.";
      gateError.classList.add("show");
      gate.classList.add("shake");
      gateInput.value = "";
      gateInput.focus();
      setTimeout(() => gate.classList.remove("shake"), 500);
    }
  });
}

// ----- Chroma: harmonious random palette generator -----

const palette = document.getElementById("palette");
const generateBtn = document.getElementById("generateBtn");
const schemeLabel = document.getElementById("schemeLabel");
const toast = document.getElementById("toast");

const SWATCH_COUNT = 5;

// Harmony schemes. Each returns 5 hues given a base hue.
const SCHEMES = [
  {
    name: "analogous",
    hues: (h) => [h - 40, h - 20, h, h + 20, h + 40],
  },
  {
    name: "complementary",
    hues: (h) => [h, h + 15, h + 180, h + 195, h + 30],
  },
  {
    name: "triadic",
    hues: (h) => [h, h + 120, h + 240, h + 60, h + 180],
  },
  {
    name: "split complementary",
    hues: (h) => [h, h + 150, h + 210, h + 30, h - 30],
  },
  {
    name: "monochrome",
    hues: (h) => [h, h, h, h, h],
  },
  {
    name: "tetradic",
    hues: (h) => [h, h + 90, h + 180, h + 270, h + 45],
  },
];

const rand = (min, max) => Math.random() * (max - min) + min;
const wrapHue = (h) => ((h % 360) + 360) % 360;

function hslToHex(h, s, l) {
  h = wrapHue(h);
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

// Decide readable text color (black/white) for a given hex background.
function readableText(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return lum > 0.45 ? "#111111" : "#ffffff";
}

function buildPalette() {
  const scheme = SCHEMES[Math.floor(Math.random() * SCHEMES.length)];
  const baseHue = rand(0, 360);
  const baseSat = rand(55, 90);
  const hues = scheme.hues(baseHue);

  return {
    name: scheme.name,
    colors: hues.map((h, i) => {
      // Vary lightness/saturation across swatches for depth.
      const l =
        scheme.name === "monochrome"
          ? 22 + i * 15 // stepped ramp for mono
          : rand(45, 72);
      const s =
        scheme.name === "monochrome"
          ? baseSat
          : Math.min(95, baseSat + rand(-12, 12));
      return hslToHex(h, s, l);
    }),
  };
}

function showToast(hex) {
  toast.innerHTML = `<span class="toast__chip" style="background:${hex}"></span>Copied ${hex.toUpperCase()}`;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyHex(hex, swatchEl) {
  try {
    await navigator.clipboard.writeText(hex.toUpperCase());
  } catch {
    // Fallback for older / insecure contexts
    const ta = document.createElement("textarea");
    ta.value = hex.toUpperCase();
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  showToast(hex);
  swatchEl.classList.add("copied");
  setTimeout(() => swatchEl.classList.remove("copied"), 450);
}

function render(animate = true) {
  const { name, colors } = buildPalette();
  schemeLabel.textContent = `${name} · tap to copy`;
  palette.innerHTML = "";

  colors.forEach((hex, i) => {
    const text = readableText(hex);
    const swatch = document.createElement("button");
    swatch.className = "swatch" + (animate ? " animate" : "");
    swatch.style.background = hex;
    swatch.style.color = text;
    swatch.style.animationDelay = `${i * 0.06}s`;
    swatch.setAttribute("aria-label", `Copy color ${hex}`);
    swatch.innerHTML = `
      <span class="swatch__inner">
        <span class="swatch__hex">${hex.toUpperCase()}</span>
        <span class="swatch__copy">Click to copy</span>
      </span>`;
    swatch.addEventListener("click", () => copyHex(hex, swatch));
    palette.appendChild(swatch);
  });
}

// ----- Events -----
generateBtn.addEventListener("click", () => render(true));

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();
    render(true);
  }
});

// First paint
render(true);
