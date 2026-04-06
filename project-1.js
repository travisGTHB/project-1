/**
 * Copyright 2026 travisGTHB
 * @license Apache-2.0, see LICENSE for full text.
 *
 * LOCATION: /project-1.js
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// Inline fallback data — used when /api/photos is unreachable (e.g. static build preview).
// Rollup can tree-shake this at build time; no separate file import needed.
const FALLBACK_DATA = {
  author: {
    name: "Travis Kelce",
    username: "traviskelce",
    avatar: "https://i.pravatar.cc/150?img=11",
    userSince: "2019-03-14",
    channel: "TravisKelceOfficial",
  },
  photos: [
    { id: 1,  title: "Golden Hour at Arches",   description: "Landscapes!", dateTaken: "2024-11-03", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90", location: "Moab, Utah" },
    { id: 2,  title: "Misty Morning Peaks",     description: "Landscapes!", dateTaken: "2024-10-17", thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=90", location: "Patagonia, Chile" },
    { id: 3,  title: "Midnight Blue Ridge",     description: "Landscapes!", dateTaken: "2024-12-28", thumbnail: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=90", location: "Shenandoah, Virginia" },
    { id: 4,  title: "Sea Glass Shore",         description: "Landscapes!", dateTaken: "2024-09-05", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90", location: "Reynisfjara, Iceland" },
    { id: 5,  title: "Autumn Canopy",           description: "Landscapes!", dateTaken: "2024-10-29", thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=90", location: "Kyoto, Japan" },
    { id: 6,  title: "Desert Bloom",            description: "Landscapes!", dateTaken: "2024-08-14", thumbnail: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=90", location: "Atacama, Chile" },
    { id: 7,  title: "Fjord Reflection",        description: "Landscapes!", dateTaken: "2024-07-22", thumbnail: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=90", location: "Nærøyfjord, Norway" },
    { id: 8,  title: "Salt Flat Infinity",      description: "Landscapes!", dateTaken: "2024-06-10", thumbnail: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=1200&q=90", location: "Uyuni, Bolivia" },
    { id: 9,  title: "Volcanic Dawn",           description: "Landscapes!", dateTaken: "2024-05-03", thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90", location: "East Java, Indonesia" },
    { id: 10, title: "Lavender Sea",            description: "Landscapes!", dateTaken: "2024-07-08", thumbnail: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1200&q=90", location: "Valensole, France" },
    { id: 11, title: "Rainforest Veil",         description: "Landscapes!", dateTaken: "2024-04-18", thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=90", location: "Monteverde, Costa Rica" },
    { id: 12, title: "Canyon Spiral",           description: "Landscapes!", dateTaken: "2024-03-31", thumbnail: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=1200&q=90", location: "Page, Arizona" },
    { id: 13, title: "Aurora Curtain",          description: "Landscapes!", dateTaken: "2024-02-14", thumbnail: "https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=1200&q=90", location: "Whitehorse, Canada" },
    { id: 14, title: "Terracotta Rooftops",     description: "Landscapes!", dateTaken: "2024-09-19", thumbnail: "https://images.unsplash.com/photo-1600623471616-8c1966c91ff6?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1600623471616-8c1966c91ff6?w=1200&q=90", location: "Dubrovnik, Croatia" },
    { id: 15, title: "Frozen Waterfall",        description: "Landscapes!", dateTaken: "2025-01-07", thumbnail: "https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=400&q=75", fullSize: "https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=1200&q=90", location: "South Iceland" },
  ],
};

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
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--accent);
          color: #fff;
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
        }

        .header-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .username {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-s);
          color: var(--text-main);
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
        }

        .card-image-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          background-color: var(--card-border);
          position: relative;
          overflow: hidden;
        }

        .skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .slide-counter {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.8);
          color: #333;
          cursor: pointer;
          font-size: 24px;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .arrow:disabled { opacity: 0.3; cursor: not-allowed; }
        .arrow-left  { left: 10px; }
        .arrow-right { right: 10px; }

        .action-bar {
          display: flex;
          padding: 10px 15px;
          gap: 15px;
          border-top: 1px solid var(--bar-border);
        }

        .action-btn {
          background: none;
          border: none;
          font-weight: bold;
          cursor: pointer;
          color: var(--text-main);
          padding: 0;
        }

        .action-btn.liked { color: var(--liked-color); }

        .card-footer {
          padding: 0 15px 15px;
        }

        .photo-title  { font-weight: bold; margin: 5px 0; color: var(--text-main); }
        .caption      { font-size: 14px; margin: 5px 0; color: var(--text-main); }
        .photo-location {
          font-size: 12px;
          color: var(--text-muted);
          margin: 2px 0 6px;
        }
        .fullsize-link { font-size: 12px; color: var(--accent); text-decoration: none; }

        .error-msg {
          padding: 40px 20px;
          text-align: center;
          color: var(--text-muted);
        }
      `
    ];
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  _getInitials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .map(w => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    this._loadLikes();

    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get("activeIndex"), 10);
    if (!isNaN(idx)) this.currentIndex = idx;

    window.addEventListener("popstate", this._handlePopstate.bind(this));
    this._fetchSlides();
  }

  _handlePopstate() {
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get("activeIndex"), 10);
    if (!isNaN(idx)) this.currentIndex = idx;
  }

  // ── Logic ──────────────────────────────────────────────────────────────────

  _shuffle(array) {
    let curr = array.length;
    while (curr !== 0) {
      const rand = Math.floor(Math.random() * curr);
      curr--;
      [array[curr], array[rand]] = [array[rand], array[curr]];
    }
    return array;
  }

  async _fetchSlides() {
    this.loading = true;
    this.error = false;
    try {
      // Try the real API first (works when Next.js server is running)
      const res = await fetch("/api/photos");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this._applyData(data);
    } catch (_e) {
      // Fallback: use the inline constant so the component works without a server.
      // This is also Rollup-safe — no dynamic import() that the bundler can't resolve.
      this._applyData(FALLBACK_DATA);
    } finally {
      this.loading = false;
      await this.updateComplete;
      this._createDots();
    }
  }

  _applyData(data) {
    this.author = data.author || {};
    this.slides = this._shuffle([...(data.photos || [])]);
    if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
  }

  _loadLikes() {
    const stored = localStorage.getItem(Project1.LS_LIKES_KEY);
    this.likes = stored ? JSON.parse(stored) : {};
  }

  _toggleLike(id) {
    this.likes = { ...this.likes, [id]: !this.likes[id] };
    localStorage.setItem(Project1.LS_LIKES_KEY, JSON.stringify(this.likes));
    this.requestUpdate();
  }

  _goTo(index) {
    if (index < 0 || index >= this.slides.length) return;
    this.currentIndex = index;
    const url = new URL(window.location.href);
    url.searchParams.set("activeIndex", index);
    window.history.pushState({}, "", url.toString());
    this._updateDots();
  }

  _createDots() { /* dot rendering hook */ }
  _updateDots()  { /* active dot state hook */ }

  // ── Render ─────────────────────────────────────────────────────────────────

  render() {
    const slide = this.slides[this.currentIndex];
    const liked = slide ? !!this.likes[slide.id] : false;
    const initials = this._getInitials(this.author.name);

    if (this.error) {
      return html`
        <div class="gallery-wrapper">
          <div class="card">
            <div class="error-msg">⚠️ Could not load photos. Please try again later.</div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="gallery-wrapper">
        <div class="card">

          <!-- Header -->
          <div class="card-header">
            <div class="avatar" aria-label="${this.author.name || 'Author'} avatar">
              ${initials}
            </div>
            <div class="header-info">
              <span class="username">${this.author.username || "User"}</span>
              <span class="user-since">
                Member since ${this.author.userSince
                  ? new Date(this.author.userSince).getFullYear()
                  : "—"}
              </span>
            </div>
            ${this.author.channel
              ? html`<span class="channel-badge">${this.author.channel}</span>`
              : ""}
          </div>

          <!-- Image -->
          <div class="card-image-wrap">
            ${this.loading ? html`<div class="skeleton"></div>` : ""}
            ${slide ? html`
              <img
                class="card-image"
                src="${slide.thumbnail}"
                alt="${slide.title}"
                loading="lazy"
              >
              <span class="slide-counter">
                ${this.currentIndex + 1} / ${this.slides.length}
              </span>
              <button
                class="arrow arrow-left"
                ?disabled="${this.currentIndex === 0}"
                @click="${() => this._goTo(this.currentIndex - 1)}"
                aria-label="Previous photo"
              >&#8249;</button>
              <button
                class="arrow arrow-right"
                ?disabled="${this.currentIndex === this.slides.length - 1}"
                @click="${() => this._goTo(this.currentIndex + 1)}"
                aria-label="Next photo"
              >&#8250;</button>
            ` : ""}
          </div>

          <!-- Actions -->
          <div class="action-bar">
            <button
              class="action-btn ${liked ? "liked" : ""}"
              @click="${() => slide && this._toggleLike(slide.id)}"
              aria-label="${liked ? "Unlike" : "Like"} this photo"
            >
              ${liked ? "❤️ Liked" : "🤍 Like"}
            </button>
            <button class="action-btn">🔗 Share</button>
          </div>

          <!-- Footer -->
          <div class="card-footer">
            <p class="photo-title">${slide?.title ?? ""}</p>
            ${slide?.location
              ? html`<p class="photo-location">📍 ${slide.location}</p>`
              : ""}
            <p class="caption">
              <strong>${this.author.username ?? ""}</strong>
              ${slide?.description ?? ""}
            </p>
            <a class="fullsize-link" href="${slide?.fullSize ?? "#"}" target="_blank" rel="noopener">
              View Full Size →
            </a>
          </div>

        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(Project1.tag, Project1);