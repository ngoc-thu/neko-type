import { CatRig } from "../character/rig";
import { EffectsManager } from "../effects/particles";

export type AnimationState =
  | "IDLE"
  | "TYPING_LEFT"
  | "TYPING_RIGHT"
  | "FAST_TYPING"
  | "SLEEPING"
  | "HAPPY"
  | "SURPRISED";

export class AnimationStateMachine {
  private rig: CatRig;
  private effects: EffectsManager;
  private currentState: AnimationState = "IDLE";
  private idleTimeout: number | null = null;
  private sleepTimeout: number | null = null;
  private blinkInterval: number | null = null;
  private earInterval: number | null = null;
  private zzzInterval: number | null = null;
  private typingEnabled: boolean = true;
  private fastTypingSparkleTimer: number | null = null;

  constructor(rig: CatRig, effects: EffectsManager) {
    this.rig = rig;
    this.effects = effects;
    this.enterState("IDLE");
    this.startIdleBehaviors();
  }

  public setTypingEnabled(enabled: boolean) {
    this.typingEnabled = enabled;
  }

  public onTypingEvent(paw: "left" | "right", fast: boolean) {
    if (!this.typingEnabled) return;

    // If sleeping, wake up immediately
    if (this.currentState === "SLEEPING") {
      this.effects.spawnExclamation();
      this.rig.triggerEarTwitch("left");
    }

    this.clearInactivityTimers();

    if (fast) {
      this.enterState("FAST_TYPING");
      this.rig.setPaw(paw, "down");
      this.rig.setPaw(paw === "left" ? "right" : "left", "up");
      this.rig.depressKey(paw);
      this.effects.spawnSparkle();
    } else {
      if (paw === "left") {
        this.enterState("TYPING_LEFT");
        this.rig.setPaw("left", "down");
        this.rig.setPaw("right", "up");
        this.rig.depressKey("left");
      } else {
        this.enterState("TYPING_RIGHT");
        this.rig.setPaw("right", "down");
        this.rig.setPaw("left", "up");
        this.rig.depressKey("right");
      }
    }

    // Schedule return to IDLE after 1.2s
    this.idleTimeout = window.setTimeout(() => {
      this.enterState("IDLE");
      this.rig.setPaw("left", "down");
      this.rig.setPaw("right", "down");

      // Schedule SLEEPING after 20s of total inactivity
      this.sleepTimeout = window.setTimeout(() => {
        this.enterState("SLEEPING");
      }, 20000);
    }, 1200);
  }

  public triggerHappy() {
    this.clearInactivityTimers();
    this.enterState("HAPPY");
    this.effects.spawnHeart();

    setTimeout(() => {
      this.enterState("IDLE");
      this.sleepTimeout = window.setTimeout(() => {
        this.enterState("SLEEPING");
      }, 20000);
    }, 1500);
  }

  public triggerSurprised() {
    this.clearInactivityTimers();
    this.enterState("SURPRISED");
    this.effects.spawnExclamation();

    setTimeout(() => {
      this.enterState("IDLE");
    }, 800);
  }

  private enterState(state: AnimationState) {
    this.currentState = state;
    this.stopZzzInterval();
    this.stopFastTypingSparkles();

    switch (state) {
      case "IDLE":
        this.rig.setAnimationState("state-idle");
        this.rig.setEyeState("normal");
        this.rig.setPaw("left", "down");
        this.rig.setPaw("right", "down");
        break;

      case "TYPING_LEFT":
        this.rig.setAnimationState("state-typing-left");
        this.rig.setEyeState("normal");
        break;

      case "TYPING_RIGHT":
        this.rig.setAnimationState("state-typing-right");
        this.rig.setEyeState("normal");
        break;

      case "FAST_TYPING":
        this.rig.setAnimationState("state-fast-typing");
        this.rig.setEyeState("surprised");
        this.startFastTypingSparkles();
        break;

      case "SLEEPING":
        this.rig.setAnimationState("state-sleeping");
        this.rig.setEyeState("sleeping");
        this.rig.setPaw("left", "down");
        this.rig.setPaw("right", "down");
        this.startZzzInterval();
        break;

      case "HAPPY":
        this.rig.setAnimationState("state-happy");
        this.rig.setEyeState("happy");
        break;

      case "SURPRISED":
        this.rig.setAnimationState("state-surprised");
        this.rig.setEyeState("surprised");
        break;
    }
  }

  private clearInactivityTimers() {
    if (this.idleTimeout !== null) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
    if (this.sleepTimeout !== null) {
      clearTimeout(this.sleepTimeout);
      this.sleepTimeout = null;
    }
  }

  private startIdleBehaviors() {
    // Blinking every 3 - 6 seconds
    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 3000;
      this.blinkInterval = window.setTimeout(() => {
        if (this.currentState === "IDLE") {
          this.rig.triggerBlink();
        }
        scheduleNextBlink();
      }, delay);
    };
    scheduleNextBlink();

    // Ear twitching every 8 - 14 seconds
    const scheduleNextEarTwitch = () => {
      const delay = 8000 + Math.random() * 6000;
      this.earInterval = window.setTimeout(() => {
        if (this.currentState === "IDLE") {
          const side = Math.random() > 0.5 ? "left" : "right";
          this.rig.triggerEarTwitch(side);
        }
        scheduleNextEarTwitch();
      }, delay);
    };
    scheduleNextEarTwitch();

    // Initial sleep timer after 20s
    this.sleepTimeout = window.setTimeout(() => {
      this.enterState("SLEEPING");
    }, 20000);
  }

  private startZzzInterval() {
    this.effects.spawnZzz();
    this.zzzInterval = window.setInterval(() => {
      if (this.currentState === "SLEEPING") {
        this.effects.spawnZzz();
      }
    }, 2400);
  }

  private stopZzzInterval() {
    if (this.zzzInterval !== null) {
      clearInterval(this.zzzInterval);
      this.zzzInterval = null;
    }
  }

  private startFastTypingSparkles() {
    this.fastTypingSparkleTimer = window.setInterval(() => {
      if (this.currentState === "FAST_TYPING") {
        this.effects.spawnSparkle();
      }
    }, 120);
  }

  private stopFastTypingSparkles() {
    if (this.fastTypingSparkleTimer !== null) {
      clearInterval(this.fastTypingSparkleTimer);
      this.fastTypingSparkleTimer = null;
    }
  }

  public destroy() {
    this.clearInactivityTimers();
    this.stopZzzInterval();
    this.stopFastTypingSparkles();
    if (this.blinkInterval !== null) {
      clearTimeout(this.blinkInterval);
      this.blinkInterval = null;
    }
    if (this.earInterval !== null) {
      clearTimeout(this.earInterval);
      this.earInterval = null;
    }
  }
}
