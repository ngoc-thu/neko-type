import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { applyTheme } from "../character/themes";
import { AnimationStateMachine } from "../animation/state_machine";
import { EffectsManager } from "../effects/particles";

export interface AppSettings {
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

export class ContextMenu {
  private container: HTMLElement;
  private menuEl: HTMLElement;
  private stateMachine: AnimationStateMachine;
  private effects: EffectsManager;
  private currentSettings: AppSettings = {
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
  private isOpen: boolean = false;

  constructor(
    container: HTMLElement,
    stateMachine: AnimationStateMachine,
    effects: EffectsManager
  ) {
    this.container = container;
    this.stateMachine = stateMachine;
    this.effects = effects;
    this.menuEl = this.createMenuElement();
    this.container.appendChild(this.menuEl);
    this.initListeners();
    this.loadInitialSettings();
  }

  private createMenuElement(): HTMLElement {
    const el = document.createElement("div");
    el.className = "context-menu-wrapper";
    el.innerHTML = `
      <div class="menu-header">
        <div class="menu-title">
          <span>🐾</span> Neko Companion
        </div>
        <button class="menu-close-btn" id="menu-close">✕</button>
      </div>

      <!-- Theme Section -->
      <div class="menu-section">
        <div class="menu-label">Palette Theme</div>
        <div class="theme-grid">
          <div class="theme-pill theme-sakura active" data-theme="sakura" title="Sakura Dream"></div>
          <div class="theme-pill theme-cyber" data-theme="cyber" title="Cyber Midnight"></div>
          <div class="theme-pill theme-calico" data-theme="calico" title="Calico Peach"></div>
          <div class="theme-pill theme-caramel" data-theme="caramel" title="Caramel Latte"></div>
        </div>
      </div>

      <!-- Scale Section -->
      <div class="menu-section">
        <div class="menu-label">Widget Scale</div>
        <div class="segmented-control" id="scale-control">
          <button class="segment-btn" data-scale="0.75">75%</button>
          <button class="segment-btn active" data-scale="1.0">100%</button>
          <button class="segment-btn" data-scale="1.25">125%</button>
          <button class="segment-btn" data-scale="1.5">150%</button>
        </div>
      </div>

      <!-- Position Section -->
      <div class="menu-section">
        <div class="menu-label">Dock Position</div>
        <div class="segmented-control" id="position-control">
          <button class="segment-btn" data-pos="bottom-left">Left</button>
          <button class="segment-btn" data-pos="bottom-center">Center</button>
          <button class="segment-btn active" data-pos="bottom-right">Right</button>
        </div>
      </div>

      <!-- Toggles -->
      <div class="menu-section">
        <div class="toggle-row">
          <span>Typing Reaction</span>
          <label class="switch">
            <input type="checkbox" id="toggle-typing" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="toggle-row">
          <span>Visual Effects</span>
          <label class="switch">
            <input type="checkbox" id="toggle-effects" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="toggle-row">
          <span>Always On Top</span>
          <label class="switch">
            <input type="checkbox" id="toggle-top" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="toggle-row">
          <span>Launch on Startup</span>
          <label class="switch">
            <input type="checkbox" id="toggle-autostart" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <button class="settings-full-btn" id="btn-open-settings" style="width: 100%; margin-top: 8px; padding: 8px 0; background: var(--accent-gradient, linear-gradient(135deg, #ff80bf, #c8b6ff)); border: none; color: #ffffff; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 8px rgba(255, 128, 191, 0.3); transition: all 0.2s;">⚙️ Mở Bảng Cài Đặt Chi Tiết</button>

      <div style="display: flex; gap: 6px; margin-top: 6px;">
        <button class="hide-btn" id="btn-hide" style="flex: 1; padding: 6px 0; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Ẩn Mèo</button>
        <button class="exit-btn" id="btn-exit" style="flex: 1; margin-top: 0;">Thoát</button>
      </div>
    `;
    return el;
  }

  private async loadInitialSettings() {
    try {
      const settings = await invoke<AppSettings>("get_settings");
      if (settings) {
        this.currentSettings = settings;
        this.applySettingsToUI();
      }
    } catch (e) {
      console.warn("Could not load settings from backend:", e);
      this.applySettingsToUI();
    }
  }

  private applySettingsToUI() {
    // Theme
    applyTheme(this.currentSettings.theme);
    this.menuEl.querySelectorAll(".theme-pill").forEach((pill) => {
      const theme = pill.getAttribute("data-theme");
      pill.classList.toggle("active", theme === this.currentSettings.theme);
    });

    // Scale
    this.menuEl.querySelectorAll("#scale-control .segment-btn").forEach((btn) => {
      const scaleVal = parseFloat(btn.getAttribute("data-scale") || "1.0");
      btn.classList.toggle("active", Math.abs(scaleVal - this.currentSettings.scale) < 0.05);
    });

    // Position
    this.menuEl.querySelectorAll("#position-control .segment-btn").forEach((btn) => {
      const pos = btn.getAttribute("data-pos");
      btn.classList.toggle("active", pos === this.currentSettings.position_preset);
    });

    // Toggles
    const typingToggle = this.menuEl.querySelector<HTMLInputElement>("#toggle-typing");
    if (typingToggle) typingToggle.checked = this.currentSettings.typing_enabled;

    const effectsToggle = this.menuEl.querySelector<HTMLInputElement>("#toggle-effects");
    if (effectsToggle) effectsToggle.checked = this.currentSettings.effects_enabled;

    const topToggle = this.menuEl.querySelector<HTMLInputElement>("#toggle-top");
    if (topToggle) topToggle.checked = this.currentSettings.always_on_top;

    const autoToggle = this.menuEl.querySelector<HTMLInputElement>("#toggle-autostart");
    if (autoToggle) autoToggle.checked = this.currentSettings.autostart;

    this.stateMachine.setTypingEnabled(this.currentSettings.typing_enabled);
    this.effects.setEnabled(this.currentSettings.effects_enabled);
  }

  private async saveAndSync() {
    try {
      await invoke("save_settings", { newSettings: this.currentSettings });
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }

  private initListeners() {
    // Close button
    this.menuEl.querySelector("#menu-close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.close();
    });

    // Theme selector
    this.menuEl.querySelectorAll(".theme-pill").forEach((pill) => {
      pill.addEventListener("click", (e) => {
        e.stopPropagation();
        const theme = pill.getAttribute("data-theme");
        if (theme) {
          this.currentSettings.theme = theme;
          applyTheme(theme);
          this.menuEl.querySelectorAll(".theme-pill").forEach((p) => p.classList.remove("active"));
          pill.classList.add("active");
          this.saveAndSync();
        }
      });
    });

    // Scale selector
    this.menuEl.querySelectorAll("#scale-control .segment-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const scaleVal = parseFloat(btn.getAttribute("data-scale") || "1.0");
        this.currentSettings.scale = scaleVal;
        this.menuEl.querySelectorAll("#scale-control .segment-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.saveAndSync();
      });
    });

    // Position selector
    this.menuEl.querySelectorAll("#position-control .segment-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const pos = btn.getAttribute("data-pos");
        if (pos) {
          this.currentSettings.position_preset = pos;
          this.menuEl.querySelectorAll("#position-control .segment-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.saveAndSync();
        }
      });
    });

    // Toggles
    this.menuEl.querySelector("#toggle-typing")?.addEventListener("change", (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      this.currentSettings.typing_enabled = checked;
      this.stateMachine.setTypingEnabled(checked);
      this.saveAndSync();
    });

    this.menuEl.querySelector("#toggle-effects")?.addEventListener("change", (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      this.currentSettings.effects_enabled = checked;
      this.effects.setEnabled(checked);
      this.saveAndSync();
    });

    this.menuEl.querySelector("#toggle-top")?.addEventListener("change", (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      this.currentSettings.always_on_top = checked;
      this.saveAndSync();
    });

    this.menuEl.querySelector("#toggle-autostart")?.addEventListener("change", (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      this.currentSettings.autostart = checked;
      this.saveAndSync();
    });

    this.menuEl.querySelector("#btn-open-settings")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.close();
      invoke("open_settings_window");
    });

    this.menuEl.querySelector("#btn-hide")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.close();
      invoke("hide_window");
    });

    // Exit Button
    this.menuEl.querySelector("#btn-exit")?.addEventListener("click", (e) => {
      e.stopPropagation();
      invoke("exit_app");
    });

    // Listen to updates from System Tray or external actions
    try {
      listen<AppSettings>("settings-updated", (event) => {
        this.currentSettings = event.payload;
        this.applySettingsToUI();
      });
    } catch (e) {
      console.warn("Could not bind settings-updated listener:", e);
    }

    // Click outside to close
    window.addEventListener("click", (e) => {
      if (this.isOpen && !this.menuEl.contains(e.target as Node)) {
        this.close();
      }
    });
  }

  public toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open() {
    this.isOpen = true;
    this.menuEl.classList.add("active");
  }

  public close() {
    this.isOpen = false;
    this.menuEl.classList.remove("active");
  }
}
