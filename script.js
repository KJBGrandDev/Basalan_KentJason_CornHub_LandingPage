// =========================================================
// 1. Initialize Lenis (Smooth Scroll)
// =========================================================
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// =========================================================
// 2. Navigation & Smooth Scroll to Anchors (FIXED)
// =========================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // --- MERGE FIX: Ensure menu closes AND scroll unlocks ---
        const hamburger = document.querySelector('.hamburger_menu');
        const mobileOverlay = document.querySelector('.mobile_nav_overlay');
        
        if(hamburger && mobileOverlay) {
            // 1. Visually close the menu
            hamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            
            // 2. Unlock CSS Body Scroll
            document.body.style.overflow = ''; 
            
            // 3. RESTART LENIS ENGINE (This was missing!)
            if (typeof lenis !== 'undefined') {
                lenis.start(); 
            }
        }

        // Lenis Scroll Logic
        const targetID = this.getAttribute('href');
        const targetElement = document.querySelector(targetID);
        
        if (targetElement) {
            lenis.scrollTo(targetID, {
                offset: 0,        
                duration: 2.5,
                easing: (t) => 1 - Math.pow(1 - t, 4), 
                immediate: false
            });
        }
    });
});

// =========================================================
// 3. Mobile Hamburger Logic (With Scroll Lock)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger_menu');
    const mobileOverlay = document.querySelector('.mobile_nav_overlay');
    
    // We don't need to select links here because Section 2 handles the clicks!
    // We only need to handle the Toggle Button here.

    if (hamburger && mobileOverlay) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileOverlay.classList.toggle('active');

            // --- NEW FEATURE: Scroll Locking ---
            if (mobileOverlay.classList.contains('active')) {
                // Menu Open: Stop background scrolling
                document.body.style.overflow = 'hidden';
                lenis.stop(); // Optional: Tell Lenis to pause
            } else {
                // Menu Closed: Resume background scrolling
                document.body.style.overflow = '';
                lenis.start(); // Optional: Tell Lenis to resume
            }
        });
    }
});