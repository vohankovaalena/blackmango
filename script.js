/* ===========================
   FLIP CARDS – click toggle (mobile & keyboard)
   =========================== */
document.querySelectorAll('.flip-card').forEach(card => {
    // Click: toggle flipped state
    card.addEventListener('click', function () {
        this.classList.toggle('is-flipped');
    });

    // Keyboard: Enter or Space toggles the card
    card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.classList.toggle('is-flipped');
        }
    });

    // On desktop hover the CSS handles flip, so remove is-flipped when mouse leaves
    // to avoid double-flip after hover + click
    card.addEventListener('mouseleave', function () {
        this.classList.remove('is-flipped');
    });
});

/* ===========================
   FORM HANDLING
   =========================== */
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelectorAll('input[type="text"]')[1].value;
    const message = this.querySelector('textarea').value;
    
    // Validate
    if (!name || !email || !subject || !message) {
        alert('Prosím, vyplňte všechna pole.');
        return;
    }
    
    // Success message
    alert(`Děkujeme, ${name}! Vaši zprávu jsme obdrželi a brzy se vám ozveme.`);
    
    // Reset form
    this.reset();
    
    // In a real application, you would send this data to a server
    console.log({
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toISOString()
    });
});

/* ===========================
   SMOOTH SCROLL ENHANCEMENT
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
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
    
    if (currentScroll > 100) {
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

        // Close all open items
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            btn.nextElementSibling.classList.remove('is-open');
        });

        // Open clicked item if it was closed
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
        
        // Check if element is in viewport
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial state for elements
revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Trigger on initial load
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
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#D6C3A3';
        } else {
            link.style.color = '#0C2320';
        }
    });
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

function openPdfPreview(path) {
    if (!pdfModal || !pdfFrame) return;
    pdfFrame.src = buildPdfPreviewUrl(path);
    pdfModal.classList.add('is-open');
    pdfModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closePdfPreview() {
    if (!pdfModal || !pdfFrame) return;
    pdfModal.classList.remove('is-open');
    pdfModal.setAttribute('aria-hidden', 'true');
    pdfFrame.src = 'about:blank';
    document.body.style.overflow = '';
}

if (pdfModal && pdfFrame) {
    document.querySelectorAll('.portfolio-slide[data-pdf]').forEach(slide => {
        slide.addEventListener('click', () => openPdfPreview(slide.dataset.pdf));
    });

    if (pdfClose) {
        pdfClose.addEventListener('click', closePdfPreview);
    }

    pdfModal.querySelectorAll('[data-close-pdf="true"]').forEach(node => {
        node.addEventListener('click', closePdfPreview);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal.classList.contains('is-open')) {
            closePdfPreview();
        }
    });

    // Discourage save interactions in preview area.
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
   PARTNERS MARQUEE (SEAMLESS LOOP)
   =========================== */
function initPartnersMarquee() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.partners-marquee').forEach(marquee => {
        const track = marquee.querySelector('.partners-marquee-track');
        const groups = track ? track.querySelectorAll('.partners-marquee-group') : [];

        if (!track || groups.length < 2) return;

        let loopDistance = 0;
        let offset = 0;
        let lastTimestamp = 0;
        let rafId = null;
        let isPaused = false;
        const speedPxPerSecond = 34;

        const applyTransform = () => {
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        };

        const recalc = () => {
            const nextDistance = groups[0].getBoundingClientRect().width;
            if (nextDistance > 0) {
                loopDistance = nextDistance;
            }
            if (loopDistance > 0) {
                offset = offset % loopDistance;
            }
            applyTransform();
        };

        const step = (timestamp) => {
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }

            const delta = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            if (!isPaused && !reducedMotion.matches && loopDistance > 0) {
                offset += speedPxPerSecond * delta;
                if (offset >= loopDistance) {
                    offset -= loopDistance;
                }
                applyTransform();
            }

            rafId = window.requestAnimationFrame(step);
        };

        const pause = () => {
            isPaused = true;
        };

        const resume = () => {
            isPaused = false;
        };

        marquee.addEventListener('mouseenter', pause);
        marquee.addEventListener('mouseleave', resume);
        marquee.addEventListener('focusin', pause);
        marquee.addEventListener('focusout', resume);

        window.addEventListener('resize', recalc);

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(recalc);
        }

        if (reducedMotion.addEventListener) {
            reducedMotion.addEventListener('change', () => {
                if (reducedMotion.matches) {
                    offset = 0;
                    applyTransform();
                }
                lastTimestamp = 0;
            });
        }

        recalc();

        if (!rafId) {
            rafId = window.requestAnimationFrame(step);
        }
    });
}

initPartnersMarquee();

/* ===========================
   PORTFOLIO WEB CAROUSEL (SEAMLESS LOOP)
   =========================== */
function initPortfolioWebCarousel() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.portfolio-web-carousel').forEach(carousel => {
        const track = carousel.querySelector('.portfolio-web-carousel-track');
        const groups = track ? track.querySelectorAll('.portfolio-web-carousel-group') : [];
        const prevButton = carousel.querySelector('.portfolio-web-carousel-btn-prev');
        const nextButton = carousel.querySelector('.portfolio-web-carousel-btn-next');

        if (!track || groups.length < 2) return;

        let loopDistance = 0;
        let offset = 0;
        let lastTimestamp = 0;
        let rafId = null;
        let isPaused = false;
        const speedPxPerSecond = 26;

        const applyTransform = () => {
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        };

        const recalc = () => {
            const nextDistance = groups[0].getBoundingClientRect().width;
            if (nextDistance > 0) {
                loopDistance = nextDistance;
            }
            if (loopDistance > 0) {
                offset = offset % loopDistance;
            }
            applyTransform();
        };

        const getStepDistance = () => {
            const firstCard = groups[0].querySelector('.portfolio-web-card');
            if (!firstCard) return 0;

            const cardWidth = firstCard.getBoundingClientRect().width;
            const groupStyles = window.getComputedStyle(groups[0]);
            const gap = parseFloat(groupStyles.columnGap || groupStyles.gap || '0') || 0;

            return cardWidth + gap;
        };

        const nudge = (direction) => {
            const stepDistance = getStepDistance();
            if (!stepDistance || !loopDistance) return;

            isPaused = true;
            offset += direction * stepDistance;
            offset = ((offset % loopDistance) + loopDistance) % loopDistance;
            applyTransform();

            window.clearTimeout(carousel._resumeTimeout);
            carousel._resumeTimeout = window.setTimeout(() => {
                isPaused = false;
            }, 1400);
        };

        const step = (timestamp) => {
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }

            const delta = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            if (!isPaused && !reducedMotion.matches && loopDistance > 0) {
                offset += speedPxPerSecond * delta;
                if (offset >= loopDistance) {
                    offset -= loopDistance;
                }
                applyTransform();
            }

            rafId = window.requestAnimationFrame(step);
        };

        const pause = () => {
            isPaused = true;
        };

        const resume = () => {
            isPaused = false;
        };

        carousel.addEventListener('mouseenter', pause);
        carousel.addEventListener('mouseleave', resume);
        carousel.addEventListener('focusin', pause);
        carousel.addEventListener('focusout', resume);

        if (prevButton) {
            prevButton.addEventListener('click', () => nudge(-1));
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => nudge(1));
        }

        window.addEventListener('resize', recalc);

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(recalc);
        }

        if (reducedMotion.addEventListener) {
            reducedMotion.addEventListener('change', () => {
                if (reducedMotion.matches) {
                    offset = 0;
                    applyTransform();
                }
                lastTimestamp = 0;
            });
        }

        recalc();

        if (!rafId) {
            rafId = window.requestAnimationFrame(step);
        }
    });
}

initPortfolioWebCarousel();

/* ===========================
   PORTFOLIO GRAFIKA CAROUSEL (SEAMLESS LOOP)
   =========================== */
function initPortfolioGrafikaCarousel() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.portfolio-grafika-carousel').forEach(carousel => {
        const track = carousel.querySelector('.portfolio-grafika-carousel-track');
        const groups = track ? track.querySelectorAll('.portfolio-grafika-carousel-group') : [];
        const prevButton = carousel.querySelector('.portfolio-web-carousel-btn-prev');
        const nextButton = carousel.querySelector('.portfolio-web-carousel-btn-next');

        if (!track || groups.length < 2) return;

        let loopDistance = 0;
        let offset = 0;
        let lastTimestamp = 0;
        let rafId = null;
        let isPaused = false;
        const speedPxPerSecond = 26;

        const applyTransform = () => {
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        };

        const recalc = () => {
            const nextDistance = groups[0].getBoundingClientRect().width;
            if (nextDistance > 0) loopDistance = nextDistance;
            if (loopDistance > 0) offset = offset % loopDistance;
            applyTransform();
        };

        const getStepDistance = () => {
            const firstCard = groups[0].querySelector('.portfolio-grafika-card');
            if (!firstCard) return 0;
            const cardWidth = firstCard.getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(groups[0]).columnGap || '0') || 0;
            return cardWidth + gap;
        };

        const nudge = (direction) => {
            const stepDistance = getStepDistance();
            if (!stepDistance || !loopDistance) return;
            isPaused = true;
            offset += direction * stepDistance;
            offset = ((offset % loopDistance) + loopDistance) % loopDistance;
            applyTransform();
            window.clearTimeout(carousel._resumeTimeout);
            carousel._resumeTimeout = window.setTimeout(() => { isPaused = false; }, 1400);
        };

        const step = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const delta = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;
            if (!isPaused && !reducedMotion.matches && loopDistance > 0) {
                offset += speedPxPerSecond * delta;
                if (offset >= loopDistance) offset -= loopDistance;
                applyTransform();
            }
            rafId = window.requestAnimationFrame(step);
        };

        carousel.addEventListener('mouseenter', () => { isPaused = true; });
        carousel.addEventListener('mouseleave', () => { isPaused = false; });
        carousel.addEventListener('focusin', () => { isPaused = true; });
        carousel.addEventListener('focusout', () => { isPaused = false; });

        if (prevButton) prevButton.addEventListener('click', () => nudge(-1));
        if (nextButton) nextButton.addEventListener('click', () => nudge(1));

        window.addEventListener('resize', recalc);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(recalc);

        recalc();
        if (!rafId) rafId = window.requestAnimationFrame(step);
    });
}

initPortfolioGrafikaCarousel();

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
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn && closeBtn.focus();
    }

    function closeLightbox() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        img.src = '';
        img.alt = '';
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-lightbox-src]').forEach(btn => {
        btn.addEventListener('click', () => {
            openLightbox(btn.dataset.lightboxSrc, btn.dataset.lightboxAlt);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    modal.querySelectorAll('[data-close-lightbox="true"]').forEach(el => {
        el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeLightbox();
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
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.innerHTML = '<p style="text-align:center;padding:1rem 0;color:var(--color-dark);font-weight:700;">Zpráva odeslána!<br><span style="font-weight:400;font-size:0.9rem;">Ozveme se do 48 hodin.</span></p>';
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

    // Only show if not already shown this session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Arm the trigger after 4 seconds on page
    window.setTimeout(() => { readyToShow = true; }, 4000);

    function openPopup() {
        if (!readyToShow || sessionStorage.getItem(SESSION_KEY)) return;
        sessionStorage.setItem(SESSION_KEY, '1');
        popup.classList.add('is-open');
        popup.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn && closeBtn.focus();
    }

    function closePopup() {
        popup.classList.remove('is-open');
        popup.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Exit intent: mouse leaves through the top of the viewport
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) openPopup();
    });

    if (backdrop) backdrop.addEventListener('click', closePopup);
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (dismissBtn) dismissBtn.addEventListener('click', closePopup);

    // CTA closes popup and scrolls to contact
    if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closePopup();
            const target = document.querySelector('#contact');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('is-open')) closePopup();
    });
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

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}());

/* ===========================
   BRANDING CAROUSEL – PREV / NEXT ARROWS (mobile)
   =========================== */
(function () {
    const grid = document.getElementById('brandingGrid');
    const prev = document.getElementById('brandingPrev');
    const next = document.getElementById('brandingNext');
    if (!grid || !prev || !next) return;

    const scrollBy = (dir) => {
        const slideWidth = grid.querySelector('.portfolio-slide')
            ? grid.querySelector('.portfolio-slide').offsetWidth
            : grid.clientWidth;
        grid.scrollBy({ left: dir * slideWidth, behavior: 'smooth' });
    };

    prev.addEventListener('click', () => scrollBy(-1));
    next.addEventListener('click', () => scrollBy(1));
}());

/* ===========================
   PAGE LOAD ANIMATION
   =========================== */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.animation = 'fadeIn 0.5s ease';
});

document.body.style.opacity = '0.95';
