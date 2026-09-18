/**
 * Original SVG Vector Assets for Chibi Anime Cat ("Neko") & Tiny Keyboard
 * Bespoke vector definitions with anime aesthetic (soft pink/purple/cyan palette).
 */

export const SVG_NS = "http://www.w3.org/2000/svg";

export function createCatSVG(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 260 200");
  svg.setAttribute("class", "cat-rig state-idle");
  svg.setAttribute("id", "cat-svg");

  svg.innerHTML = `
    <defs>
      <!-- Gradients -->
      <radialGradient id="shadow-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(20, 10, 30, 0.25)" />
        <stop offset="100%" stop-color="rgba(20, 10, 30, 0)" />
      </radialGradient>

      <linearGradient id="body-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--fur-base)" />
        <stop offset="100%" stop-color="var(--fur-shadow)" />
      </linearGradient>

      <linearGradient id="ear-inner-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--ear-inner)" />
        <stop offset="100%" stop-color="rgba(255, 182, 193, 0.6)" />
      </linearGradient>

      <linearGradient id="keyboard-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--keyboard-base)" />
        <stop offset="100%" stop-color="var(--keyboard-border)" />
      </linearGradient>

      <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Base Shadow beneath desk -->
    <ellipse cx="130" cy="188" rx="95" ry="10" fill="url(#shadow-gradient)" />

    <!-- Cat Body & Torso Layer -->
    <g id="layer-body" class="rig-body">
      <!-- Torso -->
      <path d="M 85 110 Q 75 160 88 175 Q 130 185 172 175 Q 185 160 175 110 Z" 
            fill="url(#body-gradient)" stroke="var(--fur-shadow)" stroke-width="1.5" />
      
      <!-- Collar Ribbon -->
      <path d="M 94 136 Q 130 148 166 136 Q 168 143 164 146 Q 130 156 96 146 Z" 
            fill="var(--ribbon-color)" />
      
      <!-- Collar Bell -->
      <g id="rig-bell" class="rig-bell" transform="translate(130, 148)">
        <circle cx="0" cy="0" r="6" fill="var(--bell-color)" stroke="var(--bell-ring)" stroke-width="1" />
        <circle cx="0" cy="2" r="1.5" fill="var(--bell-ring)" />
        <line x1="-4" y1="-0.5" x2="4" y2="-0.5" stroke="var(--bell-ring)" stroke-width="0.8" />
      </g>
    </g>

    <!-- Cat Head & Ears Layer -->
    <g id="layer-head" class="rig-head">
      <!-- Left Ear -->
      <g id="rig-ear-left">
        <path d="M 82 82 C 65 52 70 28 85 24 C 102 44 110 65 114 78 Z" 
              fill="url(#body-gradient)" stroke="var(--fur-shadow)" stroke-width="1.5" />
        <path d="M 85 75 C 75 52 78 36 88 33 C 98 46 103 62 106 72 Z" 
              fill="url(#ear-inner-gradient)" />
        <!-- Inner Ear Fluff -->
        <path d="M 92 68 Q 98 56 104 62 Q 99 70 92 68" fill="var(--ear-inner-tuft)" opacity="0.9" />
      </g>

      <!-- Right Ear -->
      <g id="rig-ear-right">
        <path d="M 178 82 C 195 52 190 28 175 24 C 158 44 150 65 146 78 Z" 
              fill="url(#body-gradient)" stroke="var(--fur-shadow)" stroke-width="1.5" />
        <path d="M 175 75 C 185 52 182 36 172 33 C 162 46 157 62 154 72 Z" 
              fill="url(#ear-inner-gradient)" />
        <!-- Inner Ear Fluff -->
        <path d="M 168 68 Q 162 56 156 62 Q 161 70 168 68" fill="var(--ear-inner-tuft)" opacity="0.9" />
      </g>

      <!-- Head Base (Rounded Chibi Contour) -->
      <path d="M 80 88 C 68 112 78 135 105 138 C 120 140 140 140 155 138 C 182 135 192 112 180 88 C 168 68 92 68 80 88 Z" 
            fill="url(#body-gradient)" stroke="var(--fur-shadow)" stroke-width="1.5" />

      <!-- Cheeks Blush -->
      <g id="rig-blush">
        <ellipse cx="94" cy="112" rx="10" ry="5.5" fill="var(--blush-color)" />
        <ellipse cx="166" cy="112" rx="10" ry="5.5" fill="var(--blush-color)" />
        <!-- Blush lines -->
        <line x1="90" y1="110" x2="93" y2="114" stroke="rgba(255, 100, 150, 0.6)" stroke-width="1" stroke-linecap="round" />
        <line x1="95" y1="110" x2="98" y2="114" stroke="rgba(255, 100, 150, 0.6)" stroke-width="1" stroke-linecap="round" />
        <line x1="162" y1="110" x2="165" y2="114" stroke="rgba(255, 100, 150, 0.6)" stroke-width="1" stroke-linecap="round" />
        <line x1="167" y1="110" x2="170" y2="114" stroke="rgba(255, 100, 150, 0.6)" stroke-width="1" stroke-linecap="round" />
      </g>

      <!-- Nose and Mouth -->
      <g id="rig-mouth">
        <polygon points="128,107 132,107 130,110" fill="#ff9ebb" />
        <path d="M 124 112 Q 127 117 130 112 Q 133 117 136 112" 
              fill="none" stroke="#5d4037" stroke-width="1.4" stroke-linecap="round" />
      </g>

      <!-- Eyes Container (Multi-State) -->
      <g id="rig-eyes">
        <!-- Normal Eyes -->
        <g id="eyes-normal" class="eye-group">
          <!-- Left Eye -->
          <ellipse cx="106" cy="98" rx="8" ry="11" fill="var(--eye-color)" />
          <!-- Eye highlights -->
          <circle id="left-pupil-shine" cx="104" cy="94" r="3.2" fill="var(--eye-shine)" />
          <circle cx="108" cy="103" r="1.8" fill="var(--eye-cyan-accent)" />
          
          <!-- Right Eye -->
          <ellipse cx="154" cy="98" rx="8" ry="11" fill="var(--eye-color)" />
          <!-- Eye highlights -->
          <circle id="right-pupil-shine" cx="152" cy="94" r="3.2" fill="var(--eye-shine)" />
          <circle cx="156" cy="103" r="1.8" fill="var(--eye-cyan-accent)" />
        </g>

        <!-- Happy Eyes (Arch Smiling: ^ω^) -->
        <g id="eyes-happy" class="eye-group" style="display: none;">
          <path d="M 98 102 Q 106 91 114 102" fill="none" stroke="var(--eye-color)" stroke-width="2.5" stroke-linecap="round" />
          <path d="M 146 102 Q 154 91 162 102" fill="none" stroke="var(--eye-color)" stroke-width="2.5" stroke-linecap="round" />
        </g>

        <!-- Sleeping Eyes (Serene closed arcs with eyelashes) -->
        <g id="eyes-sleeping" class="eye-group" style="display: none;">
          <path d="M 98 97 Q 106 106 114 97" fill="none" stroke="var(--eye-color)" stroke-width="2.2" stroke-linecap="round" />
          <path d="M 146 97 Q 154 106 162 97" fill="none" stroke="var(--eye-color)" stroke-width="2.2" stroke-linecap="round" />
          <line x1="112" y1="99" x2="116" y2="102" stroke="var(--eye-color)" stroke-width="1.2" stroke-linecap="round" />
          <line x1="148" y1="99" x2="144" y2="102" stroke="var(--eye-color)" stroke-width="1.2" stroke-linecap="round" />
        </g>

        <!-- Surprised Eyes (Wide dilated starry eyes) -->
        <g id="eyes-surprised" class="eye-group" style="display: none;">
          <ellipse cx="106" cy="97" rx="10" ry="12" fill="var(--eye-color)" />
          <ellipse cx="154" cy="97" rx="10" ry="12" fill="var(--eye-color)" />
          <circle cx="104" cy="93" r="4.2" fill="var(--eye-shine)" />
          <circle cx="152" cy="93" r="4.2" fill="var(--eye-shine)" />
          <circle cx="108" cy="103" r="2.2" fill="var(--eye-cyan-accent)" />
          <circle cx="156" cy="103" r="2.2" fill="var(--eye-cyan-accent)" />
          <!-- Small cute eyebrows -->
          <path d="M 98 84 Q 105 81 112 85" fill="none" stroke="var(--eye-color)" stroke-width="1.5" stroke-linecap="round" />
          <path d="M 148 85 Q 155 81 162 84" fill="none" stroke="var(--eye-color)" stroke-width="1.5" stroke-linecap="round" />
        </g>
      </g>
    </g>

    <!-- Keyboard Layer (Sitting in front of cat) -->
    <g id="layer-keyboard" class="rig-keyboard">
      <!-- Underglow Diffuser Strip -->
      <rect class="keyboard-underglow" x="65" y="166" width="130" height="7" rx="3.5" 
            fill="var(--rgb-glow)" filter="url(#glow-filter)" />

      <!-- Keyboard Case Body -->
      <rect x="68" y="152" width="124" height="26" rx="6" 
            fill="url(#keyboard-gradient)" stroke="var(--keyboard-border)" stroke-width="1.5" />

      <!-- Mechanical Keycaps Grid -->
      <!-- Left cluster -->
      <rect id="key-left-1" class="keycap" x="74" y="156" width="14" height="9" rx="2" fill="var(--keycap-left)" />
      <rect id="key-left-2" class="keycap" x="91" y="156" width="14" height="9" rx="2" fill="var(--keycap-left)" />
      <rect id="key-left-3" class="keycap" x="74" y="167" width="16" height="8" rx="2" fill="var(--keycap-left)" />
      <rect id="key-left-4" class="keycap" x="93" y="167" width="16" height="8" rx="2" fill="var(--keycap-left)" />

      <!-- Spacebar Center -->
      <rect id="key-space" class="keycap" x="112" y="166" width="36" height="9" rx="2.5" fill="var(--keycap-space)" />
      <rect id="key-center-top" class="keycap" x="112" y="156" width="36" height="8" rx="2" fill="var(--keycap-space)" opacity="0.85" />

      <!-- Right cluster -->
      <rect id="key-right-1" class="keycap" x="151" y="156" width="14" height="9" rx="2" fill="var(--keycap-right)" />
      <rect id="key-right-2" class="keycap" x="168" y="156" width="18" height="9" rx="2" fill="var(--keycap-right)" />
      <rect id="key-right-3" class="keycap" x="151" y="167" width="16" height="8" rx="2" fill="var(--keycap-right)" />
      <rect id="key-right-4" class="keycap" x="170" y="167" width="16" height="8" rx="2" fill="var(--keycap-right)" />
    </g>

    <!-- Articulated Paws Layer (In front of keyboard) -->
    <g id="layer-paws">
      <!-- Left Paw -->
      <g id="rig-paw-left" class="rig-paw-left paw-left-down">
        <!-- Paw Arm -->
        <path d="M 85 138 C 82 152 86 166 94 168 C 104 170 108 158 104 145 Z" 
              fill="url(#body-gradient)" stroke="var(--fur-shadow)" stroke-width="1.2" />
        <!-- Paw Pad / Toe beans (Nikukyu) -->
        <ellipse cx="94" cy="164" rx="3" ry="2" fill="#ffb6c1" />
        <circle cx="89" cy="161" r="1.2" fill="#ffb6c1" />
        <circle cx="94" cy="159" r="1.2" fill="#ffb6c1" />
        <circle cx="99" cy="161" r="1.2" fill="#ffb6c1" />
      </g>

      <!-- Right Paw -->
      <g id="rig-paw-right" class="rig-paw-right paw-right-down">
        <!-- Paw Arm -->
        <path d="M 175 138 C 178 152 174 166 166 168 C 156 170 152 158 156 145 Z" 
              fill="url(#body-gradient)" stroke="var(--fur-shadow)" stroke-width="1.2" />
        <!-- Paw Pad / Toe beans (Nikukyu) -->
        <ellipse cx="166" cy="164" rx="3" ry="2" fill="#ffb6c1" />
        <circle cx="161" cy="161" r="1.2" fill="#ffb6c1" />
        <circle cx="166" cy="159" r="1.2" fill="#ffb6c1" />
        <circle cx="171" cy="161" r="1.2" fill="#ffb6c1" />
      </g>
    </g>
  `;

  return svg;
}
