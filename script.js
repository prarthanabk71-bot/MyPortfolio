/**
 * Retro Pixel Portfolio Scripts
 * - Left Vertical Navigation Interactivity (Desktop & Mobile Drawer)
 * - Scroll Spy with IntersectionObserver & Accessible States
 * - Media Query Theme Detection & Sync (Day/Night Mode)
 * - Interactive Terminal Chat Simulation
 * - Retro 8-bit Sound FX (Web Audio API)
 * - Dynamic Year Update
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. WEB AUDIO API - 8-BIT RETRO SOUND FX
  // =========================================================================
  function playPixelSound(type = 'click') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'theme') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'nav') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'chat') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(587, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio might be blocked until user interacts with the page
    }
  }

  // =========================================================================
  // 2. THEME MANAGEMENT & CSS MEDIA QUERY DETECTION
  // =========================================================================
  const themeToggleSidebar = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeModeText = document.getElementById('theme-mode-text');
  const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getEffectiveTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return colorSchemeQuery.matches ? 'dark' : 'light';
  }

  function updateThemeUI(effectiveTheme, isExplicit) {
    const isDark = effectiveTheme === 'dark';

    [themeToggleSidebar, themeToggleMobile].forEach(btn => {
      if (btn) {
        btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        btn.setAttribute('title', isDark ? 'Switch to Day Mode' : 'Switch to Night Mode');
      }
    });

    if (themeModeText) {
      if (!isExplicit) {
        themeModeText.textContent = isDark ? 'AUTO (NIGHT)' : 'AUTO (DAY)';
      } else {
        themeModeText.textContent = isDark ? 'NIGHT 🌙' : 'DAY ☀️';
      }
    }
  }

  function applyTheme(theme, isExplicit = false) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    const effective = getEffectiveTheme();
    updateThemeUI(effective, isExplicit);
  }

  // Initialize theme from storage or default to browser media query
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme, true);
  } else {
    updateThemeUI(colorSchemeQuery.matches ? 'dark' : 'light', false);
  }

  // Listen for real-time OS / Browser theme changes
  colorSchemeQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      updateThemeUI(e.matches ? 'dark' : 'light', false);
    }
  });

  // Theme toggle click handler
  function handleThemeToggle() {
    const current = getEffectiveTheme();
    const nextTheme = current === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme, true);
    playPixelSound('theme');
  }

  if (themeToggleSidebar) {
    themeToggleSidebar.addEventListener('click', handleThemeToggle);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', handleThemeToggle);
  }

  // =========================================================================
  // 3. LEFT VERTICAL NAVIGATION & MOBILE DRAWER
  // =========================================================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const vnavCloseBtn = document.getElementById('vnav-close-btn');
  const vnavBackdrop = document.getElementById('vnav-backdrop');
  const verticalNav = document.getElementById('vertical-nav');
  const navLinks = document.querySelectorAll('.vnav-link');

  function openMobileNav() {
    document.body.classList.add('menu-open');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
    playPixelSound('nav');
  }

  function closeMobileNav() {
    document.body.classList.remove('menu-open');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (document.body.classList.contains('menu-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (vnavCloseBtn) {
    vnavCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (vnavBackdrop) {
    vnavBackdrop.addEventListener('click', closeMobileNav);
  }

  // Close drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMobileNav();
      if (mobileMenuToggle) mobileMenuToggle.focus();
    }
  });

  // Nav link click behavior
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      playPixelSound('nav');
      if (window.innerWidth <= 991) {
        closeMobileNav();
      }
    });
  });

  // =========================================================================
  // 4. SCROLL SPY (INTERSECTION OBSERVER)
  // =========================================================================
  const sectionIds = ['hero', 'about', 'skills', 'timeline', 'video-showcase', 'projects', 'testimonials', 'chat', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;
          navLinks.forEach(link => {
            const matches = link.getAttribute('data-section') === activeId;
            if (matches) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            } else {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // =========================================================================
  // 5. INTERACTIVE TERMINAL CHAT
  // =========================================================================
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-user-input');
  const chatMessages = document.getElementById('chat-messages');

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;

      playPixelSound('chat');

      // Add user message
      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'chat-msg user-msg';
      userMsgDiv.innerHTML = `
        <div class="msg-avatar">🧙</div>
        <div class="msg-bubble pixel-box">
          <span class="msg-sender">[YOU / VISITOR]:</span>
          <p>${escapeHTML(userText)}</p>
        </div>
      `;
      chatMessages.appendChild(userMsgDiv);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Automated retro reply after a short delay
      setTimeout(() => {
        playPixelSound('nav');
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'chat-msg bot-msg';
        botMsgDiv.innerHTML = `
          <div class="msg-avatar">👾</div>
          <div class="msg-bubble pixel-box">
            <span class="msg-sender">[PRARTHANA_VIRTUAL]:</span>
            <p>Transmission received! Thank you for reaching out. Feel free to connect directly via email or LinkedIn!</p>
          </div>
        `;
        chatMessages.appendChild(botMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 700);
    });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // =========================================================================
  // 6. ABOUT ME - AVATAR SWITCHER (PIXEL ART VS PHOTO)
  // =========================================================================
  const btnAvatarPixel = document.getElementById('btn-avatar-pixel');
  const btnAvatarPhoto = document.getElementById('btn-avatar-photo');
  const aboutProfileImg = document.getElementById('about-profile-img');

  if (btnAvatarPixel && btnAvatarPhoto && aboutProfileImg) {
    btnAvatarPixel.addEventListener('click', () => {
      aboutProfileImg.style.opacity = '0';
      setTimeout(() => {
        aboutProfileImg.src = 'pixel-avatar.jpg';
        aboutProfileImg.alt = 'Pixel art avatar of Prarthana - Software Engineer';
        aboutProfileImg.style.opacity = '1';
      }, 150);
      btnAvatarPixel.classList.add('active');
      btnAvatarPixel.setAttribute('aria-pressed', 'true');
      btnAvatarPhoto.classList.remove('active');
      btnAvatarPhoto.setAttribute('aria-pressed', 'false');
      playPixelSound('nav');
    });

    btnAvatarPhoto.addEventListener('click', () => {
      aboutProfileImg.style.opacity = '0';
      setTimeout(() => {
        aboutProfileImg.src = 'profile.jpg';
        aboutProfileImg.alt = 'Photo of Prarthana - Software Engineer';
        aboutProfileImg.style.opacity = '1';
      }, 150);
      btnAvatarPhoto.classList.add('active');
      btnAvatarPhoto.setAttribute('aria-pressed', 'true');
      btnAvatarPixel.classList.remove('active');
      btnAvatarPixel.setAttribute('aria-pressed', 'false');
      playPixelSound('nav');
    });
  }

  // =========================================================================
  // 7. SKILLS SECTION - INTERACTIVE FILTER TABS & PROGRESS BAR ANIMATIONS
  // =========================================================================
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  skillTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      // Update active tab button state
      skillTabBtns.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter category cards
      skillCategoryCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      playPixelSound('nav');
    });
  });

  // Animate progress bars on hover or on initial scroll into view
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const fill = item.querySelector('.pixel-progress-fill');
      if (fill) {
        fill.style.filter = 'brightness(1.25)';
      }
    });
    item.addEventListener('mouseleave', () => {
      const fill = item.querySelector('.pixel-progress-fill');
      if (fill) {
        fill.style.filter = 'none';
      }
    });
  });

  // =========================================================================
  // 8. TIMELINE SECTION - INTERACTIVE FILTER TABS
  // =========================================================================
  const timelineTabBtns = document.querySelectorAll('.timeline-tab-btn');
  const timelineEntries = document.querySelectorAll('.timeline-entry');

  timelineTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-timeline-filter');

      // Update active tab button
      timelineTabBtns.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter entries
      timelineEntries.forEach(entry => {
        const cat = entry.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          entry.classList.remove('hidden');
        } else {
          entry.classList.add('hidden');
        }
      });

      playPixelSound('nav');
    });
  });


  // =========================================================================
  // 9. DYNAMIC FOOTER YEAR
  // =========================================================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 10. BUTTON CLICK AUDIO FEEDBACK (all .btn-pixel elements)
  // =========================================================================
  const pixelButtons = document.querySelectorAll('.btn-pixel');
  pixelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playPixelSound('nav');
    });
  });

  // =========================================================================
  // 11. PROJECTS SECTION — CATEGORY FILTER TABS
  // =========================================================================
  /**
   * Each .proj-tab-btn carries a `data-proj-filter` attribute matching the
   * `data-category` attribute on .project-card <article> elements.
   * Clicking a tab button updates ARIA states, marks the button active,
   * and toggles the `.hidden` CSS class on cards that do not match.
   */
  const projTabBtns    = document.querySelectorAll('.proj-tab-btn');
  const projectCards   = document.querySelectorAll('.project-card');

  projTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-proj-filter'); // e.g. "all", "fullstack", "cloud", "tools"

      // -- Update active tab UI state --
      projTabBtns.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // -- Show / hide project cards based on their data-category attribute --
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category'); // e.g. "fullstack"
        if (filter === 'all' || cardCategory === filter) {
          card.classList.remove('hidden');  // CSS: display block (from grid)
        } else {
          card.classList.add('hidden');     // CSS: display none
        }
      });

      playPixelSound('nav');
    });
  });

  // =========================================================================
  // 12. PROJECTS SECTION — DETAIL MODAL ENGINE
  // =========================================================================

  /**
   * PROJECT_DATA — Central lookup table for all project details.
   *
   * Key structure:
   *   "project-N" → matches the `data-project-id` attribute on:
   *     • The thumbnail <button class="project-thumbnail-btn" data-project-id="project-N">
   *     • The card-level <button class="btn-inspect-modal"    data-project-id="project-N">
   *
   * When the user clicks either trigger, openProjectModal("project-N") is called,
   * which uses this object to populate every dynamic slot inside #project-detail-modal.
   */
  const PROJECT_DATA = {

    // -----------------------------------------------------------------
    // PROJECT 1: PixelFlow — Real-Time Collaborative Canvas
    // HTML thumbnail: .thumb-pixelflow | data-project-id="project-1"
    // -----------------------------------------------------------------
    'project-1': {
      id:         'QUEST_01',
      title:      'PixelFlow — Real-Time Canvas',
      category:   'FULL-STACK · REAL-TIME COLLABORATION',
      icon:       '🎨',
      status:     'STATUS: PRODUCTION LIVE 🟢',
      /* gradient mirrors .thumb-pixelflow in style.css for visual consistency */
      heroGradient: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 60%, #0ea5e9 100%)',
      overview: `
        PixelFlow is a low-latency collaborative whiteboarding platform that allows
        multiple users to draw simultaneously on a shared HTML5 canvas. The server
        synchronises cursor positions, brush strokes, and layer operations in
        under 30 ms using binary WebSocket frames, enabling truly real-time collaboration
        without visible lag or conflicts.
      `,
      /* Each bullet maps to a key architectural decision or technical highlight */
      highlights: [
        'Binary WebSocket frame protocol reduces bandwidth 4× vs JSON payloads',
        'Operational Transform engine resolves concurrent draw conflicts without locking',
        'Layered canvas renderer supports 20+ simultaneous cursors at 60 fps',
        'Room-based session isolation with JWT authentication and RBAC permissions',
        'Autosave + undo/redo stack with LZ-string compressed delta history',
      ],
      tags:       ['React 18', 'TypeScript', 'WebSockets', 'HTML5 Canvas', 'Node.js', 'Redis Pub/Sub'],
      github:     'https://github.com',
      demo:       '#',
    },

    // -----------------------------------------------------------------
    // PROJECT 2: CloudSentinel — Distributed API Health Monitor
    // HTML thumbnail: .thumb-cloudsentinel | data-project-id="project-2"
    // -----------------------------------------------------------------
    'project-2': {
      id:         'QUEST_02',
      title:      'CloudSentinel — API Monitor',
      category:   'CLOUD & APIS · DISTRIBUTED INFRASTRUCTURE',
      icon:       '📡',
      status:     'STATUS: ACTIVE 🟢',
      heroGradient: 'linear-gradient(135deg, #065f46 0%, #0284c7 60%, #06b6d4 100%)',
      overview: `
        CloudSentinel is a production-grade API telemetry daemon that continuously
        probes registered endpoints with configurable heartbeat intervals and
        escalation policies. It aggregates latency percentiles, uptime SLAs, and
        error-rate trends, exporting them as Prometheus-compatible metrics scraped
        by Grafana dashboards.
      `,
      highlights: [
        'Sub-second alert dispatch via Slack, PagerDuty, and custom webhook targets',
        'Prometheus /metrics endpoint with p50/p95/p99 latency histograms',
        'Horizontally scalable Go worker pool — 10 k endpoint checks per minute on a single node',
        'PostgreSQL time-series incident log with automated 90-day retention pruning',
        'Docker Compose + Kubernetes Helm chart for one-command self-hosted deployment',
      ],
      tags:       ['Go', 'Node.js', 'Docker', 'Redis', 'Prometheus', 'PostgreSQL', 'Grafana'],
      github:     'https://github.com',
      demo:       '#',
    },

    // -----------------------------------------------------------------
    // PROJECT 3: DevVault — Zero-Knowledge Secrets & Snippets Store
    // HTML thumbnail: .thumb-devvault | data-project-id="project-3"
    // -----------------------------------------------------------------
    'project-3': {
      id:         'QUEST_03',
      title:      'DevVault — Zero-Knowledge Store',
      category:   'SECURITY · ZERO-KNOWLEDGE CIPHER',
      icon:       '🔐',
      status:     'STATUS: SECURED 🔒',
      heroGradient: 'linear-gradient(135deg, #1c1917 0%, #78350f 55%, #d97706 100%)',
      overview: `
        DevVault is a client-side encrypted secrets manager and syntax-highlighted
        code snippet vault. All encryption and decryption happens entirely in the
        browser using the Web Crypto API — the server never sees plaintext data.
        CLI tooling integrates seamlessly with .env pipelines and CI/CD secrets injection.
      `,
      highlights: [
        'AES-256-GCM encryption with PBKDF2-derived keys — zero plaintext ever leaves the browser',
        'Shamir's Secret Sharing for multi-owner vault access without master password risk',
        'Syntax highlighting for 30+ languages powered by PrismJS tokeniser',
        'End-to-end encrypted real-time sync between devices via encrypted CRDT patches',
        'CLI binary (Rust) for shell integration — reads vault entries into process env',
      ],
      tags:       ['Next.js 14', 'TypeScript', 'Web Crypto API', 'Prisma', 'PostgreSQL', 'Rust CLI'],
      github:     'https://github.com',
      demo:       '#',
    },

    // -----------------------------------------------------------------
    // PROJECT 4: AlgoVisualizer — 8-Bit Interactive Algorithm Lab
    // HTML thumbnail: .thumb-algovisualizer | data-project-id="project-4"
    // -----------------------------------------------------------------
    'project-4': {
      id:         'QUEST_04',
      title:      'AlgoVisualizer — 8-Bit Sim Lab',
      category:   'TOOLS & GRAPHICS · ALGORITHM SIMULATION',
      icon:       '🕹️',
      status:     'STATUS: OPEN SOURCE 🌟',
      heroGradient: 'linear-gradient(135deg, #14532d 0%, #4d7c0f 50%, #84cc16 100%)',
      overview: `
        AlgoVisualizer is an interactive computer-science learning sandbox that
        renders classical algorithms as animated 8-bit game sequences. Users can
        set custom graph weights, pause at any step, and hear unique synthesised
        8-bit audio cues for each algorithmic event — making abstract concepts
        tangible and memorable.
      `,
      highlights: [
        'Step-by-step debugger with rewind / fast-forward timeline scrubber',
        'Supports Dijkstra, A*, BFS, DFS, Bellman-Ford, Kruskal, Prim on any user graph',
        'Sorting visualisations: Merge, Quick, Heap, Radix with swap-count metrics',
        'Web Audio API 8-bit sound events keyed to comparison, swap, and visit operations',
        'Shareable encoded URL for a specific algorithm state — great for teaching',
      ],
      tags:       ['Vanilla JS (ES2022)', 'Web Audio API', 'HTML5 Canvas', 'CSS Grid', 'Vite', 'PWA'],
      github:     'https://github.com',
      demo:       '#',
    },

    // -----------------------------------------------------------------
    // PROJECT 5: NeuralPixel — AI Retro Filter & Colour Quantisation Engine
    // HTML thumbnail: .thumb-neuralpixel | data-project-id="project-5"
    // -----------------------------------------------------------------
    'project-5': {
      id:         'QUEST_05',
      title:      'NeuralPixel — Retro AI Engine',
      category:   'AI / ML · COMPUTER VISION & RETRO',
      icon:       '👾',
      status:     'STATUS: MODEL TRAINED 🧠',
      heroGradient: 'linear-gradient(135deg, #4c1d95 0%, #be185d 55%, #f43f5e 100%)',
      overview: `
        NeuralPixel transforms high-resolution images into authentic 8-bit and
        16-bit game-style palettes using a combination of neural style transfer
        and k-means colour quantisation. The PyTorch model runs inference
        server-side, with a WebAssembly port for in-browser previews without
        any server round-trip.
      `,
      highlights: [
        'k-means colour quantisation reduces palette to 4–64 colours with perceptual weighting',
        'PyTorch convolutional style-transfer model fine-tuned on 12 k retro game screenshots',
        'ONNX model export + WebAssembly runtime enables zero-latency browser preview',
        'FastAPI streaming endpoint returns progressive JPEG for perceived speed',
        'Batch-processing CLI for artists — process entire sprite sheets in one command',
      ],
      tags:       ['Python 3.11', 'FastAPI', 'PyTorch', 'ONNX', 'WebAssembly', 'React', 'Pillow'],
      github:     'https://github.com',
      demo:       '#',
    },

    // -----------------------------------------------------------------
    // PROJECT 6: OmniCommerce — Headless Microservices E-Commerce Core
    // HTML thumbnail: .thumb-omnicommerce | data-project-id="project-6"
    // -----------------------------------------------------------------
    'project-6': {
      id:         'QUEST_06',
      title:      'OmniCommerce — Headless Core',
      category:   'CLOUD & APIS · HEADLESS ECOMMERCE',
      icon:       '🛍️',
      status:     'STATUS: SCALED TO PROD 🚀',
      heroGradient: 'linear-gradient(135deg, #7c2d12 0%, #b45309 50%, #f97316 100%)',
      overview: `
        OmniCommerce is a headless e-commerce backend architecture designed for
        high-throughput flash sales. Idempotent checkout pipelines, Redis-based
        distributed inventory locks, and Stripe webhook reconciliation guarantee
        consistency under concurrent purchase bursts, while the event-driven
        architecture decouples order fulfilment from payment processing.
      `,
      highlights: [
        'Idempotency keys on every mutation prevent duplicate charges under retries',
        'Redis SETNX distributed locks prevent oversell on limited-stock SKUs',
        'Stripe webhook signature verification with automatic dead-letter-queue replay',
        'MongoDB change streams drive real-time inventory sync to CDN edge caches',
        'Grafana dashboard monitors order-funnel drop-off, GMV, and p99 latency SLAs',
      ],
      tags:       ['Node.js', 'Express', 'Stripe API', 'MongoDB', 'Redis', 'BullMQ', 'Docker', 'k8s'],
      github:     'https://github.com',
      demo:       '#',
    },
  };

  // -- DOM references for the modal --
  const modalBackdrop     = document.getElementById('project-modal-backdrop');
  const modalDialog       = document.getElementById('project-detail-modal');
  const modalCloseBtn     = document.getElementById('modal-close-btn');
  const modalCloseFooter  = document.getElementById('modal-close-footer-btn');

  // Slots inside the modal that are populated dynamically
  const modalHeroVisual   = document.getElementById('modal-hero-visual');
  const modalHeroIcon     = document.getElementById('modal-hero-icon');
  const modalHeroStatus   = document.getElementById('modal-hero-status');
  const modalProjectId    = document.getElementById('modal-project-id');
  const modalTitle        = document.getElementById('modal-project-title');
  const modalCategory     = document.getElementById('modal-project-category');
  const modalOverview     = document.getElementById('modal-project-overview');
  const modalHighlights   = document.getElementById('modal-project-highlights');
  const modalTags         = document.getElementById('modal-project-tags');
  const modalLiveLink     = document.getElementById('modal-live-link');
  const modalGithubLink   = document.getElementById('modal-github-link');

  // Track the element that triggered the modal so we can return focus on close
  let modalTriggerElement = null;

  /**
   * openProjectModal(projectId)
   *
   * Looks up PROJECT_DATA[projectId] and populates every dynamic slot in
   * #project-detail-modal, then reveals the backdrop by removing aria-hidden.
   *
   * Connection: projectId ("project-1" … "project-6") comes directly from
   * the clicked button's `data-project-id` attribute, which matches the
   * object keys in PROJECT_DATA above.
   */
  function openProjectModal(projectId, triggerEl) {
    const data = PROJECT_DATA[projectId];
    if (!data || !modalBackdrop) return; // Guard: unknown id or modal missing from DOM

    // -- Store trigger for focus restoration on close --
    modalTriggerElement = triggerEl || null;

    // -- Populate the modal hero banner gradient (mirrors the card thumbnail) --
    if (modalHeroVisual)  modalHeroVisual.style.background  = data.heroGradient;
    if (modalHeroIcon)    modalHeroIcon.textContent          = data.icon;
    if (modalHeroStatus)  modalHeroStatus.textContent        = data.status;

    // -- Populate header meta --
    if (modalProjectId)   modalProjectId.textContent         = `[ID: ${data.id}]`;

    // -- Populate title and category --
    if (modalTitle)       modalTitle.textContent              = data.title;
    if (modalCategory)    modalCategory.textContent           = data.category;

    // -- Populate overview paragraph --
    if (modalOverview)    modalOverview.textContent           = data.overview.trim();

    // -- Build architecture highlights list (each entry becomes an <li>) --
    if (modalHighlights) {
      modalHighlights.innerHTML = data.highlights
        .map(h => `<li>${escapeHTML(h)}</li>`)
        .join('');
    }

    // -- Build technology tags list (each tag becomes an <li>) --
    if (modalTags) {
      modalTags.innerHTML = data.tags
        .map(t => `<li>${escapeHTML(t)}</li>`)
        .join('');
    }

    // -- Wire external link buttons --
    if (modalLiveLink)   modalLiveLink.href   = data.demo   || '#';
    if (modalGithubLink) modalGithubLink.href = data.github || '#';

    // -- Show the modal: remove aria-hidden (CSS transitions handle opacity/scale) --
    modalBackdrop.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // -- Move focus into the dialog for accessibility --
    if (modalDialog) {
      modalDialog.focus();
    }

    playPixelSound('nav');
  }

  /**
   * closeProjectModal()
   *
   * Hides the modal backdrop by restoring aria-hidden="true", re-enables
   * background scrolling, and returns keyboard focus to the triggering element.
   */
  function closeProjectModal() {
    if (!modalBackdrop) return;

    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to the element that originally opened the modal
    if (modalTriggerElement) {
      modalTriggerElement.focus();
      modalTriggerElement = null;
    }

    playPixelSound('nav');
  }

  // -- Wire close buttons --
  if (modalCloseBtn)    modalCloseBtn.addEventListener('click',    closeProjectModal);
  if (modalCloseFooter) modalCloseFooter.addEventListener('click', closeProjectModal);

  // -- Clicking the backdrop (outside the panel) closes the modal --
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      // Only close if the click was directly on the backdrop, not the dialog
      if (e.target === modalBackdrop) closeProjectModal();
    });
  }

  // -- Escape key closes the modal (and ignores it if no modal is open) --
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && !modalBackdrop.hasAttribute('aria-hidden')) {
      closeProjectModal();
    }
  });

  /**
   * Wire ALL thumbnail buttons and "Details" inspect buttons.
   *
   * Both element types share the same `data-project-id` attribute value.
   * The JS reads this attribute and passes it to openProjectModal(), which
   * performs the PROJECT_DATA lookup and populates the modal.
   *
   * Thumbnail buttons:  <button class="project-thumbnail-btn" data-project-id="project-N">
   * Details buttons:    <button class="btn-inspect-modal"     data-project-id="project-N">
   */
  const allProjectTriggers = document.querySelectorAll(
    '.project-thumbnail-btn[data-project-id], .btn-inspect-modal[data-project-id]'
  );

  allProjectTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const projectId = trigger.getAttribute('data-project-id'); // e.g. "project-1"
      openProjectModal(projectId, trigger); // Pass trigger for focus return
    });
  });

  // =========================================================================
  // Basic focus trap inside the modal dialog (Tab / Shift+Tab cycles within)
  // =========================================================================
  if (modalDialog) {
    modalDialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      if (modalBackdrop && modalBackdrop.hasAttribute('aria-hidden')) return;

      // Collect all focusable elements currently inside the dialog
      const focusable = Array.from(modalDialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.disabled && el.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

}); // end DOMContentLoaded

