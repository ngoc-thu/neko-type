import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface AppSettings {
  scale: number;
  position_preset: string;
  custom_x: number | null;
  custom_y: number | null;
  theme: string;
  typing_enabled: boolean;
  always_on_top: boolean;
  effects_enabled: boolean;
  autostart: boolean;
}

let currentSettings: AppSettings = {
  scale: 1.0,
  position_preset: "bottom-right",
  custom_x: null,
  custom_y: null,
  theme: "sakura",
  typing_enabled: true,
  always_on_top: true,
  effects_enabled: true,
  autostart: false,
};

async function loadSettings() {
  try {
    const settings = await invoke<AppSettings>("get_settings");
    if (settings) {
      currentSettings = settings;
      applyToUI();
    }
  } catch (e) {
    console.error("Failed to load settings:", e);
  }
}

function applyToUI() {
  // Theme cards
  document.querySelectorAll(".theme-card").forEach((card) => {
    const theme = card.getAttribute("data-theme");
    card.classList.toggle("active", theme === currentSettings.theme);
  });

  // Scale buttons
  document.querySelectorAll("#scale-control .segment-btn").forEach((btn) => {
    const scale = parseFloat(btn.getAttribute("data-scale") || "1.0");
    btn.classList.toggle("active", Math.abs(scale - currentSettings.scale) < 0.05);
  });

  // Position buttons
  document.querySelectorAll("#position-control .segment-btn").forEach((btn) => {
    const pos = btn.getAttribute("data-pos");
    btn.classList.toggle("active", pos === currentSettings.position_preset);
  });

  // Toggles
  const typingToggle = document.getElementById("toggle-typing") as HTMLInputElement;
  if (typingToggle) typingToggle.checked = currentSettings.typing_enabled;

  const effectsToggle = document.getElementById("toggle-effects") as HTMLInputElement;
  if (effectsToggle) effectsToggle.checked = currentSettings.effects_enabled;

  const topToggle = document.getElementById("toggle-top") as HTMLInputElement;
  if (topToggle) topToggle.checked = currentSettings.always_on_top;

  const autostartToggle = document.getElementById("toggle-autostart") as HTMLInputElement;
  if (autostartToggle) autostartToggle.checked = currentSettings.autostart;
}

async function saveSettings() {
  try {
    await invoke("save_settings", { newSettings: currentSettings });
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  // Widget Power Toggle (Hiển thị / Ẩn bé mèo)
  const powerToggle = document.getElementById("toggle-widget-power") as HTMLInputElement;
  powerToggle?.addEventListener("change", async () => {
    if (powerToggle.checked) {
      await invoke("show_window");
    } else {
      await invoke("hide_window");
    }
  });

  // Theme selection
  document.querySelectorAll(".theme-card").forEach((card) => {
    card.addEventListener("click", () => {
      const theme = card.getAttribute("data-theme");
      if (theme) {
        currentSettings.theme = theme;
        applyToUI();
        saveSettings();
      }
    });
  });

  // Scale selection
  document.querySelectorAll("#scale-control .segment-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const scale = parseFloat(btn.getAttribute("data-scale") || "1.0");
      currentSettings.scale = scale;
      applyToUI();
      saveSettings();
    });
  });

  // Position selection
  document.querySelectorAll("#position-control .segment-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pos = btn.getAttribute("data-pos");
      if (pos) {
        currentSettings.position_preset = pos;
        applyToUI();
        saveSettings();
      }
    });
  });

  // Feature Toggles
  document.getElementById("toggle-typing")?.addEventListener("change", (e) => {
    currentSettings.typing_enabled = (e.target as HTMLInputElement).checked;
    saveSettings();
  });

  document.getElementById("toggle-effects")?.addEventListener("change", (e) => {
    currentSettings.effects_enabled = (e.target as HTMLInputElement).checked;
    saveSettings();
  });

  document.getElementById("toggle-top")?.addEventListener("change", (e) => {
    currentSettings.always_on_top = (e.target as HTMLInputElement).checked;
    saveSettings();
  });

  document.getElementById("toggle-autostart")?.addEventListener("change", (e) => {
    currentSettings.autostart = (e.target as HTMLInputElement).checked;
    saveSettings();
  });

  // Close Settings Button
  document.getElementById("btn-close-settings")?.addEventListener("click", () => {
    invoke("hide_settings_window");
  });

  // Quit Button
  document.getElementById("btn-quit")?.addEventListener("click", () => {
    invoke("exit_app");
  });

  // Listen for backend updates
  try {
    listen<AppSettings>("settings-updated", (event) => {
      currentSettings = event.payload;
      applyToUI();
    });
  } catch (e) {
    console.warn("Could not listen to settings-updated:", e);
  }
});
