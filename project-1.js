/**
 * Copyright 2026 travisGTHB
 * @license Apache-2.0, see LICENSE for full text.
 *
 * LOCATION: /project-1.js
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class Project1 extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "project-1";
  }

  static get LS_LIKES_KEY() {
    return "project1_likes";
  }

  constructor() {
    super();
    this.title = "Photo Gallery";
    this.slides = [];
    this.author = {};
    this.currentIndex = 0;
    this.likes = {};
    this.loading = true;
    this.error = false;
    this.t = this.t || {};
    this.t = { ...this.t, title: "Title" };
    
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      title:        { type: String, reflect: true },
      slides:       { type: Array },
      author:       { type: Object },
      currentIndex: { type: Number, reflect: true, attribute: "current-index" },
      likes:        { type: Object },
      loading:      { type: Boolean, reflect: true },
      error:        { type: Boolean, reflect: true },
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
          --card-bg:     var(--ddd-theme-default-white);
          --card-border: var(--ddd-theme-default-limestoneLight);
          --text-main:   #111;
          --text-muted:  var(--ddd-theme-default-limestoneGray);
          --accent:      var(--ddd-theme-default-link, #0071b8);
          --liked-color: #e0245e;
          --bar-border:  var(--ddd-theme-default-limestoneLight);
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --card-bg:     #1a1a1a;
            --card-border: #333;
            --text-main:   #f0f0f0;
            --text-muted:  #888;
            --accent:      #58a6ff;
            --bar-border:  #333;
          }
          .arrow {
            background: #242424;
            color: var(--accent);
            border-color: var(--accent);
          }
          .skeleton {
            background: linear-gradient(90deg, #222 25%, #2e2e2e 50%, #222 75%) !important;
            background-size: 200% 100% !important;
          }
        }

        .gallery-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-2);
          min-height: 100vh;
        }

        .card {
          width: 100%;
          max-width: 470px;
          border: 1px solid var(--card-border);
          border-radius: var(--ddd-radius-lg);
          overflow: hidden;
          background-color: var(--card-bg);
          box-shadow: var(--ddd-boxShadow-sm);
          transition: box-shadow 0.2s ease;
        }

        .card:hover { box-shadow: var(--ddd-boxShadow-md); }

        @media (max-width: 500px) {
          .card {
            max-width: 100%;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
        }

        /* ─── CHANGE #1: UPDATED CSS STYLES ─── */
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          flex-shrink: 0;
          
          /* New flexbox rules to center the initials "TG" */
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--accent); /* Initial circle is accent color */
          color: #ffffff; /* Initials are white */
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-s);
          text-transform: uppercase;
        }
        /* ─── END CHANGE #1 ─── */

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .username {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-s);
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-since {
          font-size: var(--ddd-font-size-4xs);
          color: var(--text-muted);
        }

        .channel-badge {
          margin-left: auto;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--accent);
          border: 1px solid var(--accent);
          border-radius: var(--ddd-radius-sm);
          padding: 2px 8px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .card-image-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          background-color: var(--card-border);
          overflow: hidden;
          position: relative;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .card-image:hover { transform: scale(1.025); }

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

        .slide-counter {
          position: absolute;
          top: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
          background: rgba(0,0,0,0.52);
          color: #fff;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          padding: 2px 10px;
          border-radius: 12px;
          z-index: 10;
          letter-spacing: 0.04em;
        }

        .location-badge {
          position: absolute;
          bottom: var(--ddd-spacing-8);
          left: var(--ddd-spacing-2);
          background: rgba(0,0,0,0.5);
          color: #fff;
          font-size: var(--ddd-font-size-4xs);
          padding: 2px 10px;
          border-radius: 12px;
          z-index: 10;
        }

        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          background: white;
          color: var(--accent);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          font-size: 20px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .arrow:hover {
          background: var(--accent);
          color: white;
          transform: translateY(-50%) scale(1.08);
        }

        .arrow:disabled {
          opacity: 0.25;
          cursor: default;
          pointer-events: none;
        }

        .arrow-left  { left:  var(--ddd-spacing-2); }
        .arrow-right { right: var(--ddd-spacing-2); }

        .controls-overlay {
          position: absolute;
          bottom: var(--ddd-spacing-2);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: var(--ddd-spacing-1);
          z-index: 10;
          max-width: 90%;
          overflow: hidden;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .dot.active {
          background: #fff;
          transform: scale(1.4);
        }

        .action-bar {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-top: 1px solid var(--bar-border);
          flex-wrap: wrap;
        }

        .action-btn {
          background: none;
          border: 1px solid var(--accent);
          color: var(--accent);
          cursor: pointer;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-sm);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-navigation);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: background 0.15s ease, color 0.15s ease;
          white-space: nowrap;
        }

        .action-btn:hover {
          background: var(--accent);
          color: #fff;
        }

        .action-btn.liked {
          background: var(--liked-color);
          border-color: var(--liked-color);
          color: #fff;
        }

        .action-btn.liked:hover {
          background: #c01850;
          border-color: #c01850;
        }

        .share-btn { margin-left: auto; }

        .card-footer {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4) var(--ddd-spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }

        .photo-title {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-s);
          color: var(--text-main);
          margin: 0;
        }

        .photo-date {
          font-size: var(--ddd-font-size-4xs);
          color: var(--text-muted);
        }

        .caption {
          font-size: var(--ddd-font-size-xs);
          color: var(--text-main);
          line-height: 1.5;
        }

        .liked-note {
          font-size: var(--ddd-font-size-4xs);
          color: var(--liked-color);
          font-style: italic;
        }

        .fullsize-link {
          display: inline-block;
          font-size: var(--ddd-font-size-4xs);
          color: var(--accent);
          text-decoration: none;
          font-weight: var(--ddd-font-weight-bold);
          margin-top: var(--ddd-spacing-1);
        }

        .fullsize-link:hover { text-decoration: underline; }

        .status-msg {
          padding: var(--ddd-spacing-6) var(--ddd-spacing-4);
          text-align: center;
          font-size: var(--ddd-font-size-xs);
          color: var(--text-muted);
        }

        .status-msg.error-msg {
          color: var(--ddd-theme-default-original87Pink);
        }
      `,
    ];
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    this._loadLikes();
    
    // RESTORE STATE FROM URL
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get("activeIndex"), 10);
    if (!isNaN(idx) && idx >= 0) {
      this.currentIndex = idx;
    }

    // ROBUST ROUTING: Handle Browser Back/Forward buttons
    window.addEventListener("popstate", this._handlePopstate.bind(this));

    this._fetchSlides();
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this._handlePopstate.bind(this));
    super.disconnectedCallback();
  }

  _handlePopstate() {
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get("activeIndex"), 10);
    if (!isNaN(idx) && idx !== this.currentIndex) {
      this.currentIndex = idx;
    }
  }

  // ── Fetch from /api/photos ─────────────────────────────────────────────────

  async _fetchSlides() {
    this.loading = true;
    this.error = false;
    try {
      const res = await fetch("/api/photos");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.author = data.author || {};
      this.slides = data.photos || [];
      
      // Bounds check for incoming index
      if (this.currentIndex >= this.slides.length) {
        this.currentIndex = 0;
      }
    } catch (e) {
      console.error("Failed to fetch photos:", e);
      this.slides = [];
      this.error = true;
    } finally {
      this.loading = false;
      await this.updateComplete;
      this._createDots();
    }
  }

  // ── localStorage likes ─────────────────────────────────────────────────────

  _loadLikes() {
    try {
      const stored = localStorage.getItem(Project1.LS_LIKES_KEY);
      this.likes = stored ? JSON.parse(stored) : {};
    } catch {
      this.likes = {};
    }
  }

  _saveLikes() {
    try {
      localStorage.setItem(Project1.LS_LIKES_KEY, JSON.stringify(this.likes));
    } catch (e) {
      console.warn("localStorage unavailable:", e);
    }
  }

  _isLiked(photoId) {
    return !!this.likes[photoId];
  }

  _toggleLike(photoId) {
    this.likes = { ...this.likes, [photoId]: !this.likes[photoId] };
    this._saveLikes();
    this.requestUpdate();
  }

  // ── URL routing ────────────────────────────────────────────────────────────

  _updateUrl(index) {
    const url = new URL(window.location.href);
    url.searchParams.set("activeIndex", index);
    // PushState instead of ReplaceState allows "Back" button to work
    window.history.pushState({}, "", url.toString());
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  _goTo(index) {
    if (index < 0 || index >= this.slides.length) return;
    this.currentIndex = index;
    this._updateUrl(index);
    this._updateDots();
  }

  _prev() { this._goTo(this.currentIndex - 1); }
  _next() { this._goTo(this.currentIndex + 1); }

  // ── Dots ───────────────────────────────────────────────────────────────────

  _createDots() {
    const container = this.shadowRoot?.querySelector(".controls-overlay");
    if (!container) return;
    container.innerHTML = "";
    this.slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = `dot${i === this.currentIndex ? " active" : ""}`;
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.onclick = () => this._goTo(i);
      container.appendChild(dot);
    });
  }

  _updateDots() {
    this.shadowRoot?.querySelectorAll(".dot")
      .forEach((dot, i) => dot.classList.toggle("active", i === this.currentIndex));
    const l = this.shadowRoot?.querySelector(".arrow-left");
    const r = this.shadowRoot?.querySelector(".arrow-right");
    if (l) l.disabled = this.currentIndex === 0;
    if (r) r.disabled = this.currentIndex === this.slides.length - 1;
  }

  // ── Share ──────────────────────────────────────────────────────────────────

  _sharePhoto() {
    const slide = this._currentSlide;
    if (!slide) return;
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("activeIndex", this.currentIndex);
    const shareData = {
      title: slide.title,
      text: slide.description,
      url: shareUrl.toString(),
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl.toString())
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert(`Share this link:\n${shareUrl}`));
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  get _currentSlide() {
    return this.slides[this.currentIndex] ?? null;
  }

  _formatDate(dateStr) {
    if (!dateStr) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric", month: "long", day: "numeric",
      }).format(new Date(dateStr + "T12:00:00"));
    } catch { return dateStr; }
  }

  _formatSince(dateStr) {
    if (!dateStr) return "";
    try { return `Member since ${new Date(dateStr).getFullYear()}`; }
    catch { return ""; }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  render() {
    const slide = this._currentSlide;
    const total = this.slides.length;
    const liked = slide ? this._isLiked(slide.id) : false;

    return html`
      <div class="gallery-wrapper">
        <div class="card">

          <div class="card-header">
            
            <div class="avatar" aria-label="Author initials: TG">
              TG
            </div>
            <div class="header-info">
              <span class="username">${this.author.username || this.author.name || "Unknown"}</span>
              <span class="user-since">${this._formatSince(this.author.userSince)}</span>
            </div>
            ${this.author.channel
              ? html`<span class="channel-badge">${this.author.channel}</span>`
              : ""}
          </div>

          <div class="card-image-wrap">
            ${this.loading
              ? html`<div class="skeleton"></div>`
              : this.error || !slide
              ? html`<p class="status-msg error-msg">Could not load photos.</p>`
              : html`
                  <img
                    class="card-image"
                    .src="${slide.thumbnail}"
                    alt="${slide.title}"
                    loading="lazy"
                  />
                  <span class="slide-counter">${this.currentIndex + 1} / ${total}</span>
                  ${slide.location
                    ? html`<span class="location-badge">${slide.location}</span>`
                    : ""}
                  <button
                    class="arrow arrow-left"
                    aria-label="Previous photo"
                    ?disabled="${this.currentIndex === 0}"
                    @click="${this._prev}"
                  >&lsaquo;</button>
                  <button
                    class="arrow arrow-right"
                    aria-label="Next photo"
                    ?disabled="${this.currentIndex === total - 1}"
                    @click="${this._next}"
                  >&rsaquo;</button>
                  <div class="controls-overlay"></div>
                `}
          </div>

          ${!this.loading && slide ? html`
            <div class="action-bar">
              <button
                class="action-btn ${liked ? "liked" : ""}"
                aria-label="${liked ? "Unlike" : "Like"} this photo"
                @click="${() => this._toggleLike(slide.id)}"
              >${liked ? "Liked" : "Like"}</button>
              <button
                class="action-btn share-btn"
                aria-label="Share this photo"
                @click="${this._sharePhoto}"
              >Share</button>
            </div>

            <div class="card-footer">
              <p class="photo-title">${slide.title}</p>
              <span class="photo-date">${this._formatDate(slide.dateTaken)}</span>
              <p class="caption">
                <strong>${this.author.username || "Author"}</strong>
                &nbsp;${slide.description}
              </p>
              ${liked ? html`<span class="liked-note">You liked this photo.</span>` : ""}
              <a
                class="fullsize-link"
                href="${slide.fullSize}"
                target="_blank"
                rel="noopener noreferrer"
              >View full-size image &rarr;</a>
            </div>
          ` : ""}

        </div>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(Project1.tag, Project1);