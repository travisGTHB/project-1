/**
 * Copyright 2026 travisGTHB
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `project-1`
 * Instagram-style card that fetches random fox photos from randomfox.ca
 *
 * @demo index.html
 * @element project-1
 */
export class Project1 extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "project-1";
  }

  constructor() {
    super();
    this.title = "Random Fox";
    this.slides = [];
    this.currentIndex = 0;
    this.liked = false;
    this.loading = true;
    this.totalSlides = 6;
    this.t = this.t || {};
    this.t = { ...this.t, title: "Title" };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/project-1.ar.json", import.meta.url).href + "/../",
    });
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      slides: { type: Array },
      currentIndex: { type: Number },
      liked: { type: Boolean },
      loading: { type: Boolean },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
        }

        .card {
          max-width: 420px;
          margin: var(--ddd-spacing-4) auto;
          border: 1px solid var(--ddd-theme-default-limestoneLight);
          border-radius: var(--ddd-radius-lg);
          overflow: hidden;
          background-color: var(--ddd-theme-default-white);
          box-shadow: var(--ddd-boxShadow-sm);
          transition: box-shadow 0.2s ease;
        }

        .card:hover {
          box-shadow: var(--ddd-boxShadow-md);
        }

        @media (prefers-color-scheme: dark) {
          .card {
            background-color: var(--ddd-theme-default-coalyGray);
            border-color: var(--ddd-theme-default-limestoneGray);
            color: var(--ddd-theme-default-white);
          }
          .username, .timestamp, .caption {
            color: var(--ddd-theme-default-white);
          }
          .action-bar {
            border-top-color: var(--ddd-theme-default-limestoneGray);
          }
          .arrow {
            background: var(--ddd-theme-default-coalyGray);
            color: var(--ddd-theme-default-link, #0071b8);
          }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
        }

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--ddd-primary-1);
        }

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .username {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-s);
          color: var(--ddd-theme-default-white);
        }

        .timestamp {
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-theme-default-limestoneGray);
        }

        .card-image-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          background-color: var(--ddd-theme-default-limestoneLight);
          overflow: hidden;
          position: relative;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .card-image:hover {
          transform: scale(1.02);
        }

        .skeleton {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--ddd-theme-default-limestoneLight) 25%,
            var(--ddd-theme-default-limestoneMaxLight) 50%,
            var(--ddd-theme-default-limestoneLight) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Arrow buttons - your provided styles */
        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid var(--ddd-theme-default-link, #0071b8);
          background: white;
          color: var(--ddd-theme-default-link, #0071b8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          font-size: 20px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .arrow:hover {
          background: var(--ddd-theme-default-link, #0071b8);
          color: white;
          transform: translateY(-50%) scale(1.08);
        }

        .arrow:disabled {
          opacity: 0.3;
          cursor: default;
          pointer-events: none;
        }

        .arrow-left  { left: var(--ddd-spacing-2); }
        .arrow-right { right: var(--ddd-spacing-2); }

        /* Dot controls - your provided pattern */
        .controls-overlay {
          position: absolute;
          bottom: var(--ddd-spacing-2);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: var(--ddd-spacing-1);
          z-index: 10;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          padding: 0;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .dot.active {
          background: white;
          transform: scale(1.35);
        }

        .slide-counter {
          position: absolute;
          top: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
          background: rgba(0,0,0,0.5);
          color: white;
          font-size: var(--ddd-font-size-4xs);
          padding: 2px 8px;
          border-radius: 12px;
          z-index: 10;
          font-weight: var(--ddd-font-weight-bold);
        }

        .action-bar {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-top: 1px solid var(--ddd-theme-default-limestoneLight);
        }

        /* Clean labeled text buttons */
        .action-btn {
          background: none;
          border: 1px solid var(--ddd-theme-default-link, #0071b8);
          color: var(--ddd-theme-default-link, #0071b8);
          cursor: pointer;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-sm);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-navigation);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .action-btn:hover {
          background: var(--ddd-theme-default-link, #0071b8);
          color: white;
        }

        .action-btn.liked {
          background: #c0392b;
          border-color: #c0392b;
          color: white;
        }

        .action-btn.liked:hover {
          background: #a93226;
          border-color: #a93226;
        }

        .share-btn {
          margin-left: auto;
        }

        .card-footer {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4) var(--ddd-spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }

        .caption {
          font-size: var(--ddd-font-size-xs);
          color: var(--ddd-theme-default-white);
          line-height: 1.5;
        }

        .liked-note {
          font-size: var(--ddd-font-size-4xs);
          color: #c0392b;
          font-style: italic;
        }

        .source-link {
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-primary-1);
          text-decoration: none;
          font-weight: var(--ddd-font-weight-bold);
        }

        .source-link:hover {
          text-decoration: underline;
        }

        .error-msg {
          padding: var(--ddd-spacing-4);
          text-align: center;
          color: var(--ddd-theme-default-original87Pink);
          font-size: var(--ddd-font-size-xs);
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchSlides();
  }

  async _fetchSlides() {
    this.loading = true;
    try {
      const requests = Array.from({ length: this.totalSlides }, () =>
        fetch("https://randomfox.ca/floof/").then((r) => r.json())
      );
      const results = await Promise.all(requests);
      this.slides = results.map((data) => ({
        image: data.image,
        link: data.link,
      }));
      this.currentIndex = 0;
    } catch (e) {
      console.error("Failed to fetch fox slides:", e);
      this.slides = [];
    } finally {
      this.loading = false;
      this.updateComplete.then(() => this._createDots());
    }
  }

  // Your createDots pattern, adapted for shadow DOM
  _createDots() {
    const dotContainer = this.shadowRoot.querySelector(".controls-overlay");
    if (!dotContainer) return;
    dotContainer.innerHTML = "";
    this.slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = `dot${i === this.currentIndex ? " active" : ""}`;
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.onclick = () => {
        this.currentIndex = i;
        this._updateDots();
      };
      dotContainer.appendChild(dot);
    });
  }

  _updateDots() {
    const dots = this.shadowRoot.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === this.currentIndex);
    });
    const leftArrow  = this.shadowRoot.querySelector(".arrow-left");
    const rightArrow = this.shadowRoot.querySelector(".arrow-right");
    if (leftArrow)  leftArrow.disabled  = this.currentIndex === 0;
    if (rightArrow) rightArrow.disabled = this.currentIndex === this.slides.length - 1;
  }

  _prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this._updateDots();
    }
  }

  _next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this._updateDots();
    }
  }

  _toggleLike() {
    this.liked = !this.liked;
  }

  _sharePhoto() {
    const current = this.slides[this.currentIndex];
    const url = current?.link || current?.image || window.location.href;
    if (navigator.share) {
      navigator.share({ title: "Check out this fox!", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!"));
    }
  }

  get _currentSlide() {
    return this.slides[this.currentIndex] || null;
  }

  render() {
    const slide = this._currentSlide;
    const total = this.slides.length;

    return html`
      <div class="card">

        <!-- Header -->
        <div class="card-header">
          <img
            class="avatar"
            src="https://randomfox.ca/images/fox.png"
            alt="FoxGram avatar"
            onerror="this.src='https://placehold.co/38x38?text=F'"
          />
          <div class="header-info">
            <span class="username">FoxGram</span>
            <span class="timestamp">Just now</span>
          </div>
        </div>

        <!-- Image area with navigation -->
        <div class="card-image-wrap">
          ${this.loading
            ? html`<div class="skeleton"></div>`
            : slide
            ? html`
                <img
                  class="card-image"
                  src="${slide.image}"
                  alt="A random fox"
                  loading="lazy"
                />

                <span class="slide-counter">${this.currentIndex + 1} / ${total}</span>

                <button
                  class="arrow arrow-left"
                  aria-label="Previous photo"
                  ?disabled="${this.currentIndex === 0}"
                  @click="${this._prev}"
                >&lt;</button>

                <button
                  class="arrow arrow-right"
                  aria-label="Next photo"
                  ?disabled="${this.currentIndex === total - 1}"
                  @click="${this._next}"
                >&gt;</button>

                <div class="controls-overlay"></div>
              `
            : html`<p class="error-msg">Could not load fox images.</p>`
          }
        </div>

        <!-- Action bar -->
        <div class="action-bar">
          <button
            class="action-btn ${this.liked ? "liked" : ""}"
            aria-label="${this.liked ? "Unlike" : "Like"} this photo"
            @click="${this._toggleLike}"
          >
            ${this.liked ? "Liked" : "Like"}
          </button>

          <button
            class="action-btn share-btn"
            aria-label="Share this photo"
            @click="${this._sharePhoto}"
          >
            Share
          </button>
        </div>

        <!-- Footer -->
        <div class="card-footer">
          <span class="caption">
            <strong>FoxGram</strong> I like foxes. Look at these foxes c:
          </span>
          ${this.liked ? html`<span class="liked-note">You liked this photo.</span>` : ""}
          ${slide?.link
            ? html`<a class="source-link" href="${slide.link}" target="_blank" rel="noopener">
                View original source
              </a>`
            : ""}
        </div>

      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(Project1.tag, Project1);