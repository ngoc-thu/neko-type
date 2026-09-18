/**
 * Lightweight Visual Effects & Particle System
 * Supports floating Zzz, pastel sparkles, hearts, and reaction marks.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
  type: "zzz" | "sparkle" | "heart" | "exclamation";
  text?: string;
}

export class EffectsManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private particles: Particle[] = [];
  private isRunning: boolean = false;
  private enabled: boolean = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resize();
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.particles = [];
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  public resize() {
    this.canvas.width = 260;
    this.canvas.height = 200;
  }

  public spawnZzz() {
    if (!this.enabled) return;
    this.particles.push({
      x: 135 + (Math.random() * 20 - 10),
      y: 80,
      vx: 0.3 + Math.random() * 0.4,
      vy: -(0.5 + Math.random() * 0.4),
      alpha: 1.0,
      decay: 0.008,
      size: 11 + Math.random() * 5,
      color: "rgba(255, 182, 218, 0.9)",
      type: "zzz",
      text: "z",
    });
    this.startLoop();
  }

  public spawnSparkle(x?: number, y?: number) {
    if (!this.enabled) return;
    const colors = ["#ffcbf2", "#c8b6ff", "#70e6ff", "#ffd166"];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    this.particles.push({
      x: x !== undefined ? x : 75 + Math.random() * 110,
      y: y !== undefined ? y : 155 + Math.random() * 15,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(0.8 + Math.random() * 1.2),
      alpha: 1.0,
      decay: 0.03,
      size: 4 + Math.random() * 3,
      color: chosenColor,
      type: "sparkle",
    });
    this.startLoop();
  }

  public spawnHeart() {
    if (!this.enabled) return;
    this.particles.push({
      x: 130 + (Math.random() * 30 - 15),
      y: 90,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -1.2,
      alpha: 1.0,
      decay: 0.015,
      size: 14,
      color: "#ff69b4",
      type: "heart",
      text: "❤",
    });
    this.startLoop();
  }

  public spawnExclamation() {
    if (!this.enabled) return;
    this.particles.push({
      x: 168,
      y: 35,
      vx: 0,
      vy: -0.3,
      alpha: 1.0,
      decay: 0.02,
      size: 18,
      color: "#ffd166",
      type: "exclamation",
      text: "!",
    });
    this.startLoop();
  }

  private startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    requestAnimationFrame(() => this.loop());
  }

  private loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;

      if (p.type === "zzz" && p.text) {
        this.ctx.font = `bold ${p.size}px sans-serif`;
        this.ctx.fillStyle = p.color;
        this.ctx.fillText(p.text, p.x, p.y);
      } else if (p.type === "sparkle") {
        // Draw 4-point star sparkle
        this.ctx.fillStyle = p.color;
        this.drawStar(p.x, p.y, 4, p.size, p.size * 0.4);
      } else if (p.type === "heart" && p.text) {
        this.ctx.font = `${p.size}px sans-serif`;
        this.ctx.fillStyle = p.color;
        this.ctx.fillText(p.text, p.x, p.y);
      } else if (p.type === "exclamation" && p.text) {
        this.ctx.font = `bold ${p.size}px sans-serif`;
        this.ctx.fillStyle = p.color;
        this.ctx.fillText(p.text, p.x, p.y);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.isRunning = false;
    }
  }

  private drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
    if (!this.ctx) return;
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
