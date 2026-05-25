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
   MOBILE MENU (if needed)
   =========================== */
function initMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navBrand = document.querySelector('.nav-brand');
    
    // Add mobile hamburger if screen is small
    if (window.innerWidth <= 768) {
        // This would be expanded with actual mobile menu functionality
    }
}

window.addEventListener('resize', initMobileMenu);
window.addEventListener('load', initMobileMenu);

/* ===========================
   PAGE LOAD ANIMATION
   =========================== */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.animation = 'fadeIn 0.5s ease';
});

document.body.style.opacity = '0.95';
