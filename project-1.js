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

        /* Fixed TG Initials Avatar */
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

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
        }

        .arrow:disabled { opacity: 0.3; cursor: not-allowed; }
        .arrow-left { left: 10px; }
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

        .photo-title { font-weight: bold; margin: 5px 0; }
        .caption { font-size: 14px; margin: 5px 0; }
        .fullsize-link { font-size: 12px; color: var(--accent); text-decoration: none; }
      `
    ];
  }

  // ── Logic ──────────────────────────────────────────────────────────────────

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

  _shuffle(array) {
    let curr = array.length;
    while (curr !== 0) {
      let rand = Math.floor(Math.random() * curr);
      curr--;
      [array[curr], array[rand]] = [array[rand], array[curr]];
    }
    return array;
  }

  async _fetchSlides() {
    this.loading = true;
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      this.author = data.author || {};
      
      this.slides = this._shuffle([...(data.photos || [])]);

      if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
    } catch (e) {
      this.error = true;
    } finally {
      this.loading = false;
      await this.updateComplete;
      this._createDots();
    }
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

  _createDots() { /* Logic for dot rendering if needed */ }
  _updateDots() { /* Logic for active dot state */ }

  // ── Render ─────────────────────────────────────────────────────────────────

  render() {
    const slide = this.slides[this.currentIndex];
    const liked = slide ? !!this.likes[slide.id] : false;

    return html`
      <div class="gallery-wrapper">
        <div class="card">
          <div class="card-header">
            <div class="avatar" aria-label="Initials TG">
              TG
            </div>
            <div class="header-info">
              <span class="username">${this.author.username || "User"}</span>
              <span class="user-since">Member since ${this.author.userSince ? new Date(this.author.userSince).getFullYear() : '2026'}</span>
            </div>
            <span class="channel-badge">${this.author.channel}</span>
          </div>

          <div class="card-image-wrap">
            ${this.loading ? html`<div class="skeleton"></div>` : ""}
            ${slide ? html`
              <img class="card-image" src="${slide.thumbnail}" alt="${slide.title}" loading="lazy">
              <span class="slide-counter">${this.currentIndex + 1} / ${this.slides.length}</span>
              <button class="arrow arrow-left" ?disabled="${this.currentIndex === 0}" @click="${() => this._goTo(this.currentIndex - 1)}">&lsaquo;</button>
              <button class="arrow arrow-right" ?disabled="${this.currentIndex === this.slides.length - 1}" @click="${() => this._goTo(this.currentIndex + 1)}">&rsaquo;</button>
            ` : ""}
          </div>

          <div class="action-bar">
            <button class="action-btn ${liked ? 'liked' : ''}" @click="${() => this._toggleLike(slide.id)}">
              ${liked ? '❤️ Liked' : '🤍 Like'}
            </button>
            <button class="action-btn">🔗 Share</button>
          </div>

          <div class="card-footer">
            <p class="photo-title">${slide?.title}</p>
            <p class="caption"><strong>${this.author.username}</strong> ${slide?.description}</p>
            <a class="fullsize-link" href="${slide?.fullSize}" target="_blank">View Full Size →</a>
          </div>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(Project1.tag, Project1);