const headerHTML = `
<header>
  <div class="header-main">
    <a href="/" class="header-logo">
      <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
        <path fill="currentColor" d="m128 35.624 80 46.188v92.376l-80 46.188-80-46.188v-45.95l12 3.75v35.272l68 39.26 68-39.26V88.74l-68-39.26-68 39.26v24.499l-12-2.062V81.812z"/>
        <path fill="currentColor" d="m0 108 128 22 63-10.828v9.141L128 148zm213 7.391L256 108l-43 13.437z"/>
      </svg>
    </a>
    <div class="header-separator"></div>
    <nav class="nav-desktop">
      <a class="nav-link header-interactive" href="/">Projects</a>
      <a class="nav-link header-interactive" href="/about_me">About me</a>
    </nav>
    <div class="header-actions">
      <button class="action-button header-interactive theme" title="Switch mode">
        <div class="theme-switch-icon">
          <span class="switch-track"><span class="switch-thumb"></span></span>
        </div>
      </button>
      <button class="action-button header-interactive burger" title="Menu">
        <div class="burger-icon">
          <span class="bar bar1"></span>
          <span class="bar bar2"></span>
          <span class="bar bar3"></span>
        </div>
      </button>
    </div>
  </div>
  <div class="header-panel">
    <nav class="nav-mobile">
      <a class="nav-link" href="/">Projects</a>
      <a class="nav-link" href="/about_me">About me</a>
    </nav>
  </div>
</header>
<div id="dark-overlay"></div>
`;


(function () {
  const placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.innerHTML = headerHTML;
  }

  const themeBtn = document.querySelector('.theme');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
  }

  if (themeBtn) {
    let timeoutId = null;

    themeBtn.addEventListener('click', function () {
      document.documentElement.classList.add('theme-transition');

      requestAnimationFrame(() => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');

        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
          timeoutId = null;
        }, 1000);
      });
    });
  }

  const header = document.querySelector('header');
  const burgerBtn = document.querySelector('.burger');
  const darkOverlay = document.getElementById('dark-overlay');

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      darkOverlay.classList.remove('is-animating');
      closeMenu();
    }
  });

  function closeMenu() {
    darkOverlay.classList.add('is-animating');
    if (header) {
      header.classList.remove('is-open');
    }
    darkOverlay.classList.remove('active');
  }

  if (header && burgerBtn && darkOverlay) {
    darkOverlay.addEventListener('transitionend', () => {
      darkOverlay.classList.remove('is-animating');
    });

    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      darkOverlay.classList.add('is-animating');
      header.classList.toggle('is-open');
      darkOverlay.classList.toggle('active');
    });

    darkOverlay.addEventListener('click', () => {
      if (header.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  const headerMain = document.querySelector('.header-main');
    
    if (headerMain) {
      const hoverLine = document.createElement('div');
      hoverLine.className = 'header-hover-line';
      headerMain.appendChild(hoverLine);
  
      let isHovering = false;
      let leaveTimeout = null;
      let currentItem = null;
  
      document.querySelectorAll('.header-interactive').forEach(el => {
        el.addEventListener('mouseenter', e => {
          if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  
          clearTimeout(leaveTimeout);
  
          const rect = el.getBoundingClientRect();
          const parentRect = headerMain.getBoundingClientRect();
          const targetLeft = rect.left - parentRect.left;
          const targetWidth = rect.width;
  
          if (!isHovering) {
            const fromLeft = e.clientX < rect.left + rect.width / 2;
            
            hoverLine.style.transition = 'none';
            hoverLine.style.left = (fromLeft ? targetLeft : targetLeft + targetWidth) + 'px';
            hoverLine.style.width = '0px';
            
            void hoverLine.offsetHeight;
            
            hoverLine.style.transition = 'left var(--line-duration-io) var(--line-curve-io), width var(--line-duration-io) var(--line-curve-io)';
            hoverLine.style.left = targetLeft + 'px';
            hoverLine.style.width = targetWidth + 'px';
            
            isHovering = true;
          } else {
            hoverLine.style.transition = 'left var(--line-duration-move) var(--line-curve-move), width var(--line-duration-move) var(--line-curve-move)';
            hoverLine.style.left = targetLeft + 'px';
            hoverLine.style.width = targetWidth + 'px';
          }
          
          currentItem = el;
        });
  
        el.addEventListener('mouseleave', e => {
          if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
          if (currentItem !== el) return;
  
          const rect = el.getBoundingClientRect();
          const parentRect = headerMain.getBoundingClientRect();
          const targetLeft = rect.left - parentRect.left;
          const targetWidth = rect.width;
          const toRight = e.clientX > rect.left + rect.width / 2;
  
          leaveTimeout = setTimeout(() => {
            hoverLine.style.transition = 'left var(--line-duration-io) var(--line-curve-io), width var(--line-duration-io) var(--line-curve-io)';
            hoverLine.style.left = (toRight ? targetLeft + targetWidth : targetLeft) + 'px';
            hoverLine.style.width = '0px';
            
            isHovering = false;
            currentItem = null;
          }, 30);
        });
      });
    }
})();





const footerHTML = `
<footer id="footer">
  <ul>
    <li><a href="/legal_information">Legal Information</a></li>
    <li>
      <a href="https://github.com/jdecroocq/jdecroocq.github.io" target="_blank" rel="noopener noreferrer">
        <span id="build-version">Build -.-.-</span>
      </a>
    </li>
    <li>© <span id="year"></span> Jean Decroocq</li>
  </ul>
</footer>`;


(function () {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;
  placeholder.innerHTML = footerHTML;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const CACHE_KEY = 'portfolio_latest_release';
  const CACHE_TS_KEY = 'portfolio_latest_release_ts';
  const CACHE_DURATION_MS = 15 * 60 * 1000;

  function applyVersion(tag) {
    const versionEl = document.getElementById('build-version');
    if (versionEl && tag) versionEl.textContent = 'Build ' + tag;
  }

  const now = Date.now();
  const cachedTs = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
  const cached = localStorage.getItem(CACHE_KEY);

  if (cached && !isNaN(cachedTs) && now - cachedTs < CACHE_DURATION_MS) {
    applyVersion(cached);
  } else {
    fetch('https://api.github.com/repos/jdecroocq/jdecroocq.github.io/releases/latest')
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then(data => {
        if (data.tag_name) {
          applyVersion(data.tag_name);
          try {
            localStorage.setItem(CACHE_KEY, data.tag_name);
            localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
          } catch (_) {}
        }
      })
      .catch(err => {
        console.error('Footer build version fetch failed:', err);
      });
  }
})();




(function () {
  const overlay = document.createElement('div');
  overlay.id = 'page-overlay';
  document.body.appendChild(overlay);

  overlay.classList.add('fade-in');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.35s ease';
      overlay.classList.remove('fade-in');
    });
  });

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;
    if (link.classList.contains('dock-btn')) return;
    if (link.target === '_blank') return;

    let url;
    try { url = new URL(link.href, window.location.origin); } catch { return; }
    if (url.origin !== window.location.origin) return;

    const linkPath = url.pathname.replace(/\/+$/, "");
    const currentPath = window.location.pathname.replace(/\/+$/, "");

    if (linkPath === currentPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    e.preventDefault();
    overlay.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = link.href;
    }, 350);
  });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      overlay.style.transition = 'none';
      overlay.classList.remove('fade-out');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.transition = 'opacity 0.35s ease';
        });
      });
    }
  });
})();
