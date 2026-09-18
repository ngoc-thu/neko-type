import { CatRig } from "./character/rig";
import { EffectsManager } from "./effects/particles";
import { AnimationStateMachine } from "./animation/state_machine";
import { ContextMenu } from "./menu/context_menu";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

interface TypingPayload {
  paw: "left" | "right";
  kps: number;
  fast: boolean;
}

window.addEventListener("DOMContentLoaded", async () => {
  const catMount = document.getElementById("cat-mount") as HTMLElement;
  const effectsCanvas = document.getElementById("effects-canvas") as HTMLCanvasElement;
  const menuMount = document.getElementById("menu-mount") as HTMLElement;
  const petContainer = document.getElementById("pet-container") as HTMLElement;

  if (!catMount || !effectsCanvas || !menuMount || !petContainer) {
    console.error("Failed to find mounting elements");
    return;
  }

  // 1. Initialize Vector Rig
  const rig = new CatRig(catMount);

  // 2. Initialize Effects Engine
  const effects = new EffectsManager(effectsCanvas);

  // 3. Initialize Animation State Machine
  const stateMachine = new AnimationStateMachine(rig, effects);

  // 4. Initialize Glassmorphic Context Menu
  const contextMenu = new ContextMenu(menuMount, stateMachine, effects);

  // 5. Connect Tauri Native Keyboard Event Listener
  try {
    await listen<TypingPayload>("typing-event", (event) => {
      stateMachine.onTypingEvent(event.payload.paw, event.payload.fast);
    });
    console.log("Subscribed to Tauri typing-event");
  } catch (err) {
    console.warn("Not running in Tauri or failed to subscribe:", err);
  }

  // 6. Local Fallback Keyboard Listener (for Dev / Browser Testing)
  let localPaw: "left" | "right" = "right";
  let lastKeyTime = 0;
  let keyCountInWindow = 0;

  window.addEventListener("keydown", (e) => {
    // Ignore repeat keys to mimic hardware listener
    if (e.repeat) return;

    const now = performance.now();
    if (now - lastKeyTime < 1000) {
      keyCountInWindow++;
    } else {
      keyCountInWindow = 1;
    }
    lastKeyTime = now;

    localPaw = localPaw === "left" ? "right" : "left";
    const fast = keyCountInWindow >= 6;
    stateMachine.onTypingEvent(localPaw, fast);
  });

  // 7. Mouse Interactions
  window.addEventListener("mousemove", (e) => {
    rig.lookAt(e.clientX, e.clientY);
  });

  petContainer.addEventListener("mouseenter", () => {
    rig.triggerEarTwitch("right");
  });

  petContainer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    // If clicked inside the context menu, don't trigger pet click
    if (target.closest(".context-menu-wrapper")) {
      return;
    }
    stateMachine.triggerHappy();
    contextMenu.toggle();
  });

  petContainer.addEventListener("dblclick", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(".context-menu-wrapper")) return;
    stateMachine.triggerSurprised();
  });

  petContainer.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    invoke("open_settings_window");
  });
});
