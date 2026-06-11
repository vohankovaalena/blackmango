/* ===========================
   TRANSLATIONS
   ===========================
   The translation strings live in translations.js (loaded before this file),
   exposed as the global BM_TRANSLATIONS. Edit copy there — this file only
   contains language logic.
*/
const translations = BM_TRANSLATIONS;

/* ===========================
   CONFIG
   =========================== */
const CONFIG = {
    NAVBAR_SHADOW_THRESHOLD: 100,
    SCROLL_REVEAL_OFFSET_PX: 20,
    SCROLL_REVEAL_DURATION: '0.6s',
    CAROUSEL_NUDGE_RESUME_MS: 1400,
    EXIT_POPUP_READY_DELAY_MS: 4000,
    CAROUSEL_SPEED_PARTNERS: 34,
    CAROUSEL_SPEED_WEB: 26,
    CAROUSEL_SPEED_GRAFIKA: 26,
    CAROUSEL_SPEED_BRANDING: 26,
    // Below this viewport width the PDF iframe preview is unreliable (mobile
    // browsers render embedded PDFs without zoom/scroll), so we open the file
    // in a new tab and let the device's native full-screen viewer handle it.
    PDF_NATIVE_VIEWER_MAX_WIDTH: 768,
    // Web3Forms public access key. NOTE: this is a public-by-design identifier
    // (it only permits delivery to the inbox configured at web3forms.com — it is
    // not a secret credential), so hardcoding it here is safe and required for
    // the build-less GitHub Pages deploy. Spam is mitigated by the hidden
    // `botcheck` honeypot field on each form.
    WEB3FORMS_ACCESS_KEY: '7ec9e00b-a696-425d-9a3e-2deeaf36376e',
    WEB3FORMS_ENDPOINT: 'https://api.web3forms.com/submit',
};

/* ===========================
   LANGUAGE SWITCHER
   =========================== */
(function () {
    const STORAGE_KEY = 'bm_lang';

    // Language is swapped fully client-side — there is no separate per-language
    // page. Resolve the initial language from ?lang=, then localStorage, then 'cz'.
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    let currentLang = (urlLang === 'en' || urlLang === 'cz')
        ? urlLang
        : (localStorage.getItem(STORAGE_KEY) || 'cz');

    function applyLang(lang) {
        const t = translations[lang];
        if (!t) return;

        document.documentElement.lang = lang === 'en' ? 'en' : 'cs';

        // Keep the document title and meta description in sync with the language.
        if (t['meta.title']) document.title = t['meta.title'];
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && t['meta.description']) metaDesc.setAttribute('content', t['meta.description']);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (t[key] !== undefined) el.textContent = t[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.dataset.i18nHtml;
            if (t[key] !== undefined) el.innerHTML = t[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (t[key] !== undefined) el.placeholder = t[key];
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.dataset.i18nAria;
            if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            const active = btn.dataset.lang === lang;
            btn.classList.toggle('lang-btn--active', active);
            btn.setAttribute('aria-pressed', String(active));
        });

        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);

        // Reflect the choice in the URL (?lang=) so a chosen language is shareable,
        // without triggering a navigation/reload.
        const url = new URL(window.location.href);
        if (lang === 'cz') {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', lang);
        }
        window.history.replaceState(null, '', url);
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyLang(btn.dataset.lang);
        });
    });

    applyLang(currentLang);

    window.getCurrentLang = () => currentLang;
    window.getLangKey = (key) => (translations[currentLang] || translations.cz)[key];
}());

/* ===========================
   FLIP CARDS – click toggle (mobile & keyboard)
   =========================== */
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function () {
        this.classList.toggle('is-flipped');
    });

    card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.classList.toggle('is-flipped');
        }
    });

    card.addEventListener('mouseleave', function () {
        this.classList.remove('is-flipped');
    });
});

/* ===========================
   FORM HANDLING (Web3Forms)
   ===========================
   Both the contact form and the floating chat form post to Web3Forms via this
   shared helper — there is no backend. The access key lives in CONFIG. Each
   form carries a hidden `botcheck` honeypot (rejected server-side if filled) and
   a `subject` so the two sources are distinguishable in the inbox.
*/
async function sendViaWeb3Forms(form) {
    const formData = new FormData(form);
    formData.append('access_key', CONFIG.WEB3FORMS_ACCESS_KEY);

    const response = await fetch(CONFIG.WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
    });
    return response.ok;
}

document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = window.getLangKey('form.sending');
    submitBtn.disabled = true;

    try {
        if (await sendViaWeb3Forms(this)) {
            alert(window.getLangKey('form.success'));
            this.reset();
        } else {
            alert(window.getLangKey('form.error'));
        }
    } catch (err) {
        alert(window.getLangKey('form.error'));
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

/* ===========================
   SMOOTH SCROLL ENHANCEMENT
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#top' || href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===========================
   NAVBAR ANIMATION ON SCROLL
   =========================== */
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > CONFIG.NAVBAR_SHADOW_THRESHOLD) {
        navbar.style.boxShadow = '0 2px 8px rgba(12, 35, 32, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

/* ===========================
   FAQ ACCORDION
   =========================== */
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        const isOpen = this.getAttribute('aria-expanded') === 'true';

        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            btn.nextElementSibling.classList.remove('is-open');
        });

        if (!isOpen) {
            this.setAttribute('aria-expanded', 'true');
            answer.classList.add('is-open');
        }
    });
});

/* ===========================
    SCROLL REVEAL ANIMATION
    =========================== */
const revealElements = document.querySelectorAll('.flip-card, .portfolio-carousel-block, .testimonial');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = `translateY(${CONFIG.SCROLL_REVEAL_OFFSET_PX}px)`;
    element.style.transition = `opacity ${CONFIG.SCROLL_REVEAL_DURATION} ease, transform ${CONFIG.SCROLL_REVEAL_DURATION} ease`;
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
revealOnScroll();

/* ===========================
   ACTIVE NAV LINK ON SCROLL
   =========================== */
window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href').slice(1) === current);
    });
});

/* ===========================
   MODAL HELPERS
   =========================== */
const registeredModals = [];

function openModal(el, focusTarget) {
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const target = focusTarget || el.querySelector('button, [tabindex]');
    if (target) target.focus();
    if (!registeredModals.includes(el)) registeredModals.push(el);
}

function closeModal(el) {
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = registeredModals.find(m => m.classList.contains('is-open'));
    if (open) {
        const closeFn = open._closeModal;
        if (closeFn) closeFn();
        else closeModal(open);
    }
});

/* ===========================
   PORTFOLIO CAROUSEL + PDF PREVIEW
   =========================== */
const pdfModal = document.getElementById('pdfPreviewModal');
const pdfFrame = document.getElementById('pdfPreviewFrame');
const pdfClose = document.getElementById('pdfPreviewClose');

function buildPdfPreviewUrl(path) {
    return `${encodeURI(path)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
}

// Mobile browsers can't render an embedded PDF in an iframe in a usable way
// (no pinch-zoom/scroll), so on narrow viewports we hand the file off to the
// device's native full-screen viewer in a new tab instead of the modal.
function shouldUseNativePdfViewer() {
    return window.matchMedia(`(max-width: ${CONFIG.PDF_NATIVE_VIEWER_MAX_WIDTH}px)`).matches;
}

function openPdfPreview(path) {
    if (shouldUseNativePdfViewer()) {
        window.open(encodeURI(path), '_blank', 'noopener');
        return;
    }
    if (!pdfModal || !pdfFrame) return;
    pdfFrame.src = buildPdfPreviewUrl(path);
    openModal(pdfModal, pdfClose);
}

function closePdfPreview() {
    if (!pdfModal || !pdfFrame) return;
    pdfFrame.src = 'about:blank';
    closeModal(pdfModal);
}

if (pdfModal && pdfFrame) {
    pdfModal._closeModal = closePdfPreview;

    document.querySelectorAll('.portfolio-slide[data-pdf]').forEach(slide => {
        slide.addEventListener('click', () => openPdfPreview(slide.dataset.pdf));
    });

    if (pdfClose) {
        pdfClose.addEventListener('click', closePdfPreview);
    }

    pdfModal.querySelectorAll('[data-close-pdf="true"]').forEach(node => {
        node.addEventListener('click', closePdfPreview);
    });

    pdfModal.addEventListener('contextmenu', (e) => e.preventDefault());
}

document.querySelectorAll('.portfolio-carousel').forEach(carousel => {
    const track = carousel.querySelector('.portfolio-carousel-track');
    const slides = carousel.querySelectorAll('.portfolio-slide');
    const prev = carousel.querySelector('.carousel-btn-prev');
    const next = carousel.querySelector('.carousel-btn-next');
    const dots = carousel.parentElement.querySelectorAll('.carousel-dot');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, idx) => {
            dot.classList.toggle('is-active', idx === currentIndex);
        });
    };

    if (prev) {
        prev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    if (next) {
        next.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = Number(dot.dataset.slide);
            if (!Number.isNaN(idx) && idx >= 0 && idx < slides.length) {
                currentIndex = idx;
                updateCarousel();
            }
        });
    });

    updateCarousel();
});

/* ===========================
   SEAMLESS-LOOP CAROUSEL FACTORY
   =========================== */
function initCarousel({ wrapSelector, trackSelector, groupSelector, prevSelector, nextSelector, cardSelector, speed }) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll(wrapSelector).forEach(carousel => {
        const track = carousel.querySelector(trackSelector);
        const groups = track ? track.querySelectorAll(groupSelector) : [];
        const prevButton = prevSelector ? carousel.querySelector(prevSelector) : null;
        const nextButton = nextSelector ? carousel.querySelector(nextSelector) : null;

        if (!track || groups.length < 2) return;

        let loopDistance = 0;
        let offset = 0;
        let lastTimestamp = 0;
        let rafId = null;
        let isPaused = false;

        const applyTransform = () => {
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        };

        const recalc = () => {
            const nextDistance = groups[0].getBoundingClientRect().width;
            if (nextDistance > 0) loopDistance = nextDistance;
            if (loopDistance > 0) offset = offset % loopDistance;
            applyTransform();
        };

        const step = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const delta = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;
            if (!isPaused && !reducedMotion.matches && loopDistance > 0) {
                offset += speed * delta;
                if (offset >= loopDistance) offset -= loopDistance;
                applyTransform();
            }
            rafId = window.requestAnimationFrame(step);
        };

        const pause = () => { isPaused = true; };
        const resume = () => { isPaused = false; };

        carousel.addEventListener('mouseenter', pause);
        carousel.addEventListener('mouseleave', resume);
        carousel.addEventListener('focusin', pause);
        carousel.addEventListener('focusout', resume);

        if (cardSelector && (prevButton || nextButton)) {
            const getStepDistance = () => {
                const firstCard = groups[0].querySelector(cardSelector);
                if (!firstCard) return 0;
                const cardWidth = firstCard.getBoundingClientRect().width;
                const styles = window.getComputedStyle(groups[0]);
                const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
                return cardWidth + gap;
            };

            // Animate a swipe to an absolute target offset, then settle and resume auto-scroll.
            // If the move would cross the loop seam, jump instantly to the (visually identical)
            // wrapped spot to avoid a long backward slide or blank gap at the ends.
            const settleTo = (target, duration) => {
                const wrapped = ((target % loopDistance) + loopDistance) % loopDistance;
                const willWrap = Math.abs(wrapped - target) > 0.5;
                offset = wrapped;
                track.style.transition = willWrap ? '' : `transform ${duration}ms ease`;
                applyTransform();
                window.clearTimeout(carousel._snapTimeout);
                if (!willWrap) {
                    carousel._snapTimeout = window.setTimeout(() => { track.style.transition = ''; }, duration + 20);
                }
                window.clearTimeout(carousel._resumeTimeout);
                carousel._resumeTimeout = window.setTimeout(() => { isPaused = false; }, CONFIG.CAROUSEL_NUDGE_RESUME_MS);
            };

            const nudge = (direction) => {
                const stepDistance = getStepDistance();
                if (!stepDistance || !loopDistance) return;
                isPaused = true;
                // Snap to a whole-card boundary so each tap brings one full picture into view,
                // instead of nudging a fixed amount from the current mid-scroll position.
                const currentStep = Math.round(offset / stepDistance);
                settleTo((currentStep + direction) * stepDistance, 400);
            };

            if (prevButton) prevButton.addEventListener('click', () => nudge(-1));
            if (nextButton) nextButton.addEventListener('click', () => nudge(1));

            // Touch swipe — let users drag the carousel directly instead of only tapping arrows.
            let touchStartX = 0;
            let touchStartY = 0;
            let dragStartOffset = 0;
            let dragging = false;
            let horizontalSwipe = false;

            track.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1 || !loopDistance) return;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                dragStartOffset = offset;
                dragging = true;
                horizontalSwipe = false;
                isPaused = true;
                window.clearTimeout(carousel._snapTimeout);
                window.clearTimeout(carousel._resumeTimeout);
                track.style.transition = '';
            }, { passive: true });

            track.addEventListener('touchmove', (e) => {
                if (!dragging) return;
                const deltaX = e.touches[0].clientX - touchStartX;
                const deltaY = e.touches[0].clientY - touchStartY;
                if (!horizontalSwipe) {
                    // Decide once whether this gesture is a horizontal swipe or a vertical page scroll.
                    if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
                    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
                        dragging = false;
                        isPaused = false; // vertical scroll — let the carousel keep auto-scrolling
                        return;
                    }
                    horizontalSwipe = true;
                }
                e.preventDefault(); // claim the horizontal gesture from page scrolling
                // Follow the finger; wrap live so the drag is seamless across the loop.
                offset = ((dragStartOffset - deltaX) % loopDistance + loopDistance) % loopDistance;
                applyTransform();
            }, { passive: false });

            const endSwipe = () => {
                if (!dragging) return;
                dragging = false;
                if (horizontalSwipe) {
                    // Snap to the nearest whole card so the swipe lands on a full picture.
                    const stepDistance = getStepDistance();
                    if (stepDistance) {
                        settleTo(Math.round(offset / stepDistance) * stepDistance, 300);
                        return;
                    }
                }
                window.clearTimeout(carousel._resumeTimeout);
                carousel._resumeTimeout = window.setTimeout(() => { isPaused = false; }, CONFIG.CAROUSEL_NUDGE_RESUME_MS);
            };

            track.addEventListener('touchend', endSwipe);
            track.addEventListener('touchcancel', endSwipe);
        }

        window.addEventListener('resize', recalc);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(recalc);

        if (reducedMotion.addEventListener) {
            reducedMotion.addEventListener('change', () => {
                if (reducedMotion.matches) { offset = 0; applyTransform(); }
                lastTimestamp = 0;
            });
        }

        recalc();
        if (!rafId) rafId = window.requestAnimationFrame(step);
    });
}

initCarousel({
    wrapSelector: '.partners-marquee',
    trackSelector: '.partners-marquee-track',
    groupSelector: '.partners-marquee-group',
    speed: CONFIG.CAROUSEL_SPEED_PARTNERS,
});

initCarousel({
    wrapSelector: '.portfolio-web-carousel',
    trackSelector: '.portfolio-web-carousel-track',
    groupSelector: '.portfolio-web-carousel-group',
    prevSelector: '.portfolio-web-carousel-btn-prev',
    nextSelector: '.portfolio-web-carousel-btn-next',
    cardSelector: '.portfolio-web-card',
    speed: CONFIG.CAROUSEL_SPEED_WEB,
});

initCarousel({
    wrapSelector: '.portfolio-grafika-carousel',
    trackSelector: '.portfolio-grafika-carousel-track',
    groupSelector: '.portfolio-grafika-carousel-group',
    prevSelector: '.portfolio-web-carousel-btn-prev',
    nextSelector: '.portfolio-web-carousel-btn-next',
    cardSelector: '.portfolio-grafika-card',
    speed: CONFIG.CAROUSEL_SPEED_GRAFIKA,
});

initCarousel({
    wrapSelector: '.portfolio-branding-carousel',
    trackSelector: '.portfolio-branding-carousel-track',
    groupSelector: '.portfolio-branding-carousel-group',
    prevSelector: '.portfolio-web-carousel-btn-prev',
    nextSelector: '.portfolio-web-carousel-btn-next',
    cardSelector: '.portfolio-branding-card',
    speed: CONFIG.CAROUSEL_SPEED_BRANDING,
});

/* ===========================
   TISKOVINY LIGHTBOX
   =========================== */
(function () {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');

    if (!modal || !img) return;

    function openLightbox(src, alt) {
        img.src = src;
        img.alt = alt || '';
        openModal(modal, closeBtn || undefined);
    }

    function closeLightbox() {
        img.src = '';
        img.alt = '';
        closeModal(modal);
    }

    modal._closeModal = closeLightbox;

    document.querySelectorAll('[data-lightbox-src]').forEach(btn => {
        btn.addEventListener('click', () => {
            openLightbox(btn.dataset.lightboxSrc, btn.dataset.lightboxAlt);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    modal.querySelectorAll('[data-close-lightbox="true"]').forEach(el => {
        el.addEventListener('click', closeLightbox);
    });
}());

/* ===========================
   FLOATING CHAT WIDGET
   =========================== */
(function () {
    const widget = document.getElementById('chatWidget');
    const fab = document.getElementById('chatFab');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatPanelClose');
    const form = document.getElementById('chatForm');

    if (!widget || !fab || !panel) return;

    function openChat() {
        widget.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
        fab.setAttribute('aria-expanded', 'true');
        const first = panel.querySelector('input, textarea, button');
        if (first) first.focus();
    }

    function closeChat() {
        widget.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        fab.setAttribute('aria-expanded', 'false');
        fab.focus();
    }

    fab.addEventListener('click', () => {
        widget.classList.contains('is-open') ? closeChat() : openChat();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && widget.classList.contains('is-open')) closeChat();
    });

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = window.getLangKey('form.sending');
            submitBtn.disabled = true;

            try {
                if (await sendViaWeb3Forms(form)) {
                    form.innerHTML = window.getLangKey('chat.success');
                } else {
                    alert(window.getLangKey('form.error'));
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (err) {
                alert(window.getLangKey('form.error'));
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}());

/* ===========================
   EXIT INTENT POPUP
   =========================== */
(function () {
    const popup = document.getElementById('exitPopup');
    const backdrop = document.getElementById('exitPopupBackdrop');
    const closeBtn = document.getElementById('exitPopupClose');
    const dismissBtn = document.getElementById('exitPopupDismiss');
    const ctaBtn = document.getElementById('exitPopupCta');

    if (!popup) return;

    const SESSION_KEY = 'bm_exit_popup_shown';
    let readyToShow = false;

    if (sessionStorage.getItem(SESSION_KEY)) return;

    window.setTimeout(() => { readyToShow = true; }, CONFIG.EXIT_POPUP_READY_DELAY_MS);

    function openPopup() {
        if (!readyToShow || sessionStorage.getItem(SESSION_KEY)) return;
        sessionStorage.setItem(SESSION_KEY, '1');
        openModal(popup, closeBtn || undefined);
    }

    function closePopup() {
        closeModal(popup);
    }

    popup._closeModal = closePopup;

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) openPopup();
    });

    if (backdrop) backdrop.addEventListener('click', closePopup);
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (dismissBtn) dismissBtn.addEventListener('click', closePopup);

    if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closePopup();
            const target = document.querySelector('#contact');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}());

/* ===========================
   MOBILE MENU (HAMBURGER)
   =========================== */
(function () {
    const btn = document.getElementById('navHamburger');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;

    function closeMenu() {
        btn.classList.remove('is-open');
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', () => {
        const open = btn.classList.toggle('is-open');
        menu.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}());

/* ===========================
   PAGE LOAD ANIMATION
   =========================== */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.animation = 'fadeIn 0.5s ease';
});

document.body.style.opacity = '0.95';
