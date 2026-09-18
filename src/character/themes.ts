export interface ThemeConfig {
  id: string;
  name: string;
  furBase: string;
  furShadow: string;
  earInner: string;
  earTuft: string;
  eyeColor: string;
  eyeShine: string;
  eyeCyanAccent: string;
  blushColor: string;
  ribbonColor: string;
  bellColor: string;
  bellRing: string;
  keyboardBase: string;
  keyboardBorder: string;
  keycapLeft: string;
  keycapRight: string;
  keycapSpace: string;
  keycapActive: string;
  rgbGlow: string;
  rgbSecondary: string;
  menuBg: string;
  menuBorder: string;
  menuAccent: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  sakura: {
    id: "sakura",
    name: "Sakura Dream",
    furBase: "#ffffff",
    furShadow: "#f4ebf9",
    earInner: "#ffb6c1",
    earTuft: "#ffffff",
    eyeColor: "#2d1637",
    eyeShine: "#ffffff",
    eyeCyanAccent: "#70e6ff",
    blushColor: "rgba(255, 128, 171, 0.45)",
    ribbonColor: "#d1b3ff",
    bellColor: "#ffd166",
    bellRing: "#f48c06",
    keyboardBase: "#e8dff5",
    keyboardBorder: "#cfbaf0",
    keycapLeft: "#ffcbf2",
    keycapRight: "#c8b6ff",
    keycapSpace: "#b8c0ff",
    keycapActive: "#ff80bf",
    rgbGlow: "rgba(255, 105, 180, 0.65)",
    rgbSecondary: "rgba(0, 245, 212, 0.55)",
    menuBg: "rgba(35, 20, 48, 0.85)",
    menuBorder: "rgba(255, 182, 218, 0.35)",
    menuAccent: "#ff80bf",
  },
  cyber: {
    id: "cyber",
    name: "Cyber Midnight",
    furBase: "#1e1e2f",
    furShadow: "#141420",
    earInner: "#ff007f",
    earTuft: "#00f5d4",
    eyeColor: "#00f5d4",
    eyeShine: "#ffffff",
    eyeCyanAccent: "#ff007f",
    blushColor: "rgba(255, 0, 128, 0.35)",
    ribbonColor: "#ff007f",
    bellColor: "#00f5d4",
    bellRing: "#00bb9e",
    keyboardBase: "#161625",
    keyboardBorder: "#00f5d4",
    keycapLeft: "#2d1b4e",
    keycapRight: "#183a52",
    keycapSpace: "#00f5d4",
    keycapActive: "#ff007f",
    rgbGlow: "rgba(0, 245, 212, 0.8)",
    rgbSecondary: "rgba(255, 0, 128, 0.7)",
    menuBg: "rgba(18, 18, 30, 0.9)",
    menuBorder: "rgba(0, 245, 212, 0.4)",
    menuAccent: "#00f5d4",
  },
  calico: {
    id: "calico",
    name: "Calico Peach",
    furBase: "#fffdf9",
    furShadow: "#f1ece1",
    earInner: "#f7b267",
    earTuft: "#ffffff",
    eyeColor: "#3e2723",
    eyeShine: "#ffffff",
    eyeCyanAccent: "#80cbc4",
    blushColor: "rgba(247, 178, 103, 0.45)",
    ribbonColor: "#e76f51",
    bellColor: "#e9c46a",
    bellRing: "#d4a373",
    keyboardBase: "#f7ede2",
    keyboardBorder: "#e29578",
    keycapLeft: "#f5cac3",
    keycapRight: "#84a59d",
    keycapSpace: "#f7b267",
    keycapActive: "#e76f51",
    rgbGlow: "rgba(247, 178, 103, 0.7)",
    rgbSecondary: "rgba(132, 165, 157, 0.6)",
    menuBg: "rgba(45, 30, 25, 0.88)",
    menuBorder: "rgba(247, 178, 103, 0.35)",
    menuAccent: "#f7b267",
  },
  caramel: {
    id: "caramel",
    name: "Caramel Latte",
    furBase: "#fcf8f2",
    furShadow: "#eedbc5",
    earInner: "#8b5e3c",
    earTuft: "#fdf0d5",
    eyeColor: "#1d3557",
    eyeShine: "#ffffff",
    eyeCyanAccent: "#a8dadc",
    blushColor: "rgba(212, 163, 115, 0.4)",
    ribbonColor: "#6b4f3b",
    bellColor: "#ddb892",
    bellRing: "#b08968",
    keyboardBase: "#ede0d4",
    keyboardBorder: "#b08968",
    keycapLeft: "#ddb892",
    keycapRight: "#7f5539",
    keycapSpace: "#9c6644",
    keycapActive: "#b08968",
    rgbGlow: "rgba(221, 184, 146, 0.75)",
    rgbSecondary: "rgba(244, 162, 97, 0.6)",
    menuBg: "rgba(38, 28, 22, 0.9)",
    menuBorder: "rgba(221, 184, 146, 0.35)",
    menuAccent: "#ddb892",
  },
};

export function applyTheme(themeId: string) {
  const theme = THEMES[themeId] || THEMES.sakura;
  const root = document.documentElement;

  root.style.setProperty("--fur-base", theme.furBase);
  root.style.setProperty("--fur-shadow", theme.furShadow);
  root.style.setProperty("--ear-inner", theme.earInner);
  root.style.setProperty("--ear-inner-tuft", theme.earTuft);
  root.style.setProperty("--eye-color", theme.eyeColor);
  root.style.setProperty("--eye-shine", theme.eyeShine);
  root.style.setProperty("--eye-cyan-accent", theme.eyeCyanAccent);
  root.style.setProperty("--blush-color", theme.blushColor);
  root.style.setProperty("--ribbon-color", theme.ribbonColor);
  root.style.setProperty("--bell-color", theme.bellColor);
  root.style.setProperty("--bell-ring", theme.bellRing);
  root.style.setProperty("--keyboard-base", theme.keyboardBase);
  root.style.setProperty("--keyboard-border", theme.keyboardBorder);
  root.style.setProperty("--keycap-left", theme.keycapLeft);
  root.style.setProperty("--keycap-right", theme.keycapRight);
  root.style.setProperty("--keycap-space", theme.keycapSpace);
  root.style.setProperty("--keycap-active", theme.keycapActive);
  root.style.setProperty("--rgb-glow", theme.rgbGlow);
  root.style.setProperty("--rgb-secondary", theme.rgbSecondary);
  root.style.setProperty("--menu-bg", theme.menuBg);
  root.style.setProperty("--menu-border", theme.menuBorder);
  root.style.setProperty("--menu-accent", theme.menuAccent);
}
