import { createCatSVG } from "./assets";

export type EyeState = "normal" | "happy" | "sleeping" | "surprised";

export class CatRig {
  public svg: SVGSVGElement;
  private pawLeft: HTMLElement | null = null;
  private pawRight: HTMLElement | null = null;
  private earLeft: HTMLElement | null = null;
  private earRight: HTMLElement | null = null;
  private eyeGroups: Record<EyeState, HTMLElement | null> = {
    normal: null,
    happy: null,
    sleeping: null,
    surprised: null,
  };
  private leftPupilShine: HTMLElement | null = null;
  private rightPupilShine: HTMLElement | null = null;
  private currentEyeState: EyeState = "normal";

  constructor(container: HTMLElement) {
    this.svg = createCatSVG();
    container.appendChild(this.svg);
    this.initElements();
  }

  private initElements() {
    this.pawLeft = this.svg.querySelector("#rig-paw-left");
    this.pawRight = this.svg.querySelector("#rig-paw-right");
    this.earLeft = this.svg.querySelector("#rig-ear-left");
    this.earRight = this.svg.querySelector("#rig-ear-right");

    this.eyeGroups.normal = this.svg.querySelector("#eyes-normal");
    this.eyeGroups.happy = this.svg.querySelector("#eyes-happy");
    this.eyeGroups.sleeping = this.svg.querySelector("#eyes-sleeping");
    this.eyeGroups.surprised = this.svg.querySelector("#eyes-surprised");

    this.leftPupilShine = this.svg.querySelector("#left-pupil-shine");
    this.rightPupilShine = this.svg.querySelector("#right-pupil-shine");
  }

  public setPaw(side: "left" | "right", state: "up" | "down") {
    const el = side === "left" ? this.pawLeft : this.pawRight;
    if (!el) return;

    if (side === "left") {
      el.classList.remove("paw-left-up", "paw-left-down");
      el.classList.add(state === "up" ? "paw-left-up" : "paw-left-down");
    } else {
      el.classList.remove("paw-right-up", "paw-right-down");
      el.classList.add(state === "up" ? "paw-right-up" : "paw-right-down");
    }
  }

  public depressKey(side: "left" | "right" | "space") {
    let keyId = "key-space";
    if (side === "left") {
      keyId = Math.random() > 0.5 ? "key-left-1" : "key-left-2";
    } else if (side === "right") {
      keyId = Math.random() > 0.5 ? "key-right-1" : "key-right-2";
    }

    const keyEl = this.svg.querySelector(`#${keyId}`);
    if (keyEl) {
      keyEl.classList.add("key-depressed");
      setTimeout(() => {
        keyEl.classList.remove("key-depressed");
      }, 70);
    }
  }

  public setEyeState(state: EyeState) {
    if (this.currentEyeState === state) return;
    this.currentEyeState = state;

    (Object.keys(this.eyeGroups) as EyeState[]).forEach((key) => {
      const group = this.eyeGroups[key];
      if (group) {
        group.style.display = key === state ? "inline" : "none";
      }
    });
  }

  public lookAt(cursorX: number, cursorY: number) {
    if (this.currentEyeState !== "normal") return;

    const rect = this.svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.45;

    const deltaX = (cursorX - centerX) / (rect.width * 0.8);
    const deltaY = (cursorY - centerY) / (rect.height * 0.8);

    const clampedX = Math.max(-2.5, Math.min(2.5, deltaX * 2.5));
    const clampedY = Math.max(-2.0, Math.min(2.0, deltaY * 2.0));

    if (this.leftPupilShine) {
      this.leftPupilShine.setAttribute("cx", (104 + clampedX).toString());
      this.leftPupilShine.setAttribute("cy", (94 + clampedY).toString());
    }
    if (this.rightPupilShine) {
      this.rightPupilShine.setAttribute("cx", (152 + clampedX).toString());
      this.rightPupilShine.setAttribute("cy", (94 + clampedY).toString());
    }
  }

  public triggerBlink() {
    if (this.currentEyeState !== "normal") return;
    const normalEyes = this.eyeGroups.normal;
    if (!normalEyes) return;

    normalEyes.style.transform = "scaleY(0.1)";
    normalEyes.style.transformOrigin = "130px 98px";
    normalEyes.style.transition = "transform 0.08s ease-in-out";

    setTimeout(() => {
      normalEyes.style.transform = "scaleY(1)";
    }, 110);
  }

  public triggerEarTwitch(side: "left" | "right") {
    const el = side === "left" ? this.earLeft : this.earRight;
    if (!el) return;

    const cls = side === "left" ? "ear-twitch-left" : "ear-twitch-right";
    el.classList.add(cls);
    setTimeout(() => {
      el.classList.remove(cls);
    }, 350);
  }

  public setAnimationState(stateClass: string) {
    this.svg.classList.remove(
      "state-idle",
      "state-typing-left",
      "state-typing-right",
      "state-fast-typing",
      "state-sleeping",
      "state-happy",
      "state-surprised"
    );
    this.svg.classList.add(stateClass);
  }
}
