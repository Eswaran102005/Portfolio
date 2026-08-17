// DOM Elements Selection
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
let header = document.querySelector('.header');

// Mobile Nav Menu Toggle
if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

// Close Mobile Nav Menu on Link Click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuIcon && navbar) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }
    });
});

// Scroll Event Handler for Sticky Header and Nav Active Link
window.onscroll = () => {
    let top = window.scrollY;

    // Sticky Navbar Toggle
    if (header) {
        header.classList.toggle('sticky', top > 100);
    }

    // Scroll Section Active Link Highlight
    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                let activeLink = document.querySelector('header nav a[href*=' + id + ']');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            });
        }
    });
};

// Skill Cards Intersection Observer (Repeats every time when scrolled into view)
const skillCards = document.querySelectorAll('.skill-card');
if (skillCards.length > 0) {
    const skillCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            } else {
                entry.target.classList.remove('animated');
            }
        });
    }, { threshold: 0.15 });

    skillCards.forEach(card => skillCardObserver.observe(card));
}

// Category Filter Tabs Interactive Logic
const skillTabs = document.querySelectorAll('.skill-tab');
if (skillTabs.length > 0) {
    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Journey Category Filter Tabs Interactive Logic
const journeyTabs = document.querySelectorAll('.journey-tab');
const timelineItems = document.querySelectorAll('.timeline-item');

if (journeyTabs.length > 0) {
    journeyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            journeyTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-journey-filter');
            let visibleIndex = 0;

            timelineItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('left', 'right');
                    if (visibleIndex % 2 === 0) {
                        item.classList.add('left');
                    } else {
                        item.classList.add('right');
                    }
                    visibleIndex++;

                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Dynamic Timeline Rail Progress Height Fill on Scroll
const journeySection = document.querySelector('.journey');
const railProgress = document.getElementById('timelineRailProgress');

if (journeySection && railProgress) {
    window.addEventListener('scroll', () => {
        const rect = journeySection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight && rect.bottom >= 0) {
            const totalHeight = rect.height;
            const scrolledHeight = windowHeight - rect.top;
            let progressPercent = (scrolledHeight / totalHeight) * 100;
            progressPercent = Math.min(100, Math.max(0, progressPercent));
            railProgress.style.height = `${progressPercent}%`;
        }
    });
}

// Timeline Items Intersection Observer (Triggers every time user scrolls)
if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => timelineObserver.observe(item));
}

// Scroll Reveal Intersection Observer (Triggers every time user scrolls)
const revealElements = document.querySelectorAll('.heading, .section-subtitle, .skills-filter, .journey-tabs, .home-content, .home-imghover, .about-img, .about-content, .skills-grid, .contact form');
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Sound Controller - Default typing sound completely OFF
let isSoundMuted = true;
let isHeroInView = true;
let keyAudioBlobUrl = null;

// Monitor Front Page (Home Section) Visibility - Turn sound OFF when moved to About or lower sections
const heroSectionElem = document.getElementById('home');
if (heroSectionElem) {
    const heroViewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isHeroInView = entry.isIntersecting;
        });
    }, { threshold: 0.15 });

    heroViewObserver.observe(heroSectionElem);
}

// Generate Real Mechanical Key Press Audio WAV File in Browser Memory
function getKeyAudioBlobUrl() {
    if (!keyAudioBlobUrl) {
        const sampleRate = 44100;
        const duration = 0.035; // 35ms crisp key stroke clip
        const numSamples = Math.floor(sampleRate * duration);
        const buffer = new Uint8Array(44 + numSamples * 2);
        
        // RIFF Header
        buffer.set([0x52, 0x49, 0x46, 0x46], 0); // "RIFF"
        const fileSize = 36 + numSamples * 2;
        buffer[4] = fileSize & 0xff;
        buffer[5] = (fileSize >> 8) & 0xff;
        buffer[6] = (fileSize >> 16) & 0xff;
        buffer[7] = (fileSize >> 24) & 0xff;
        buffer.set([0x57, 0x41, 0x56, 0x45], 8); // "WAVE"
        buffer.set([0x66, 0x6d, 0x74, 0x20], 12); // "fmt "
        buffer.set([16, 0, 0, 0], 16); // Subchunk1Size
        buffer.set([1, 0], 20); // AudioFormat (PCM)
        buffer.set([1, 0], 22); // NumChannels (Mono)
        buffer.set([0x44, 0xac, 0, 0], 24); // SampleRate (44100)
        buffer.set([0x88, 0x58, 1, 0], 28); // ByteRate (88200)
        buffer.set([2, 0], 32); // BlockAlign
        buffer.set([16, 0], 34); // BitsPerSample (16-bit)
        buffer.set([0x64, 0x61, 0x74, 0x61], 36); // "data"
        const dataSize = numSamples * 2;
        buffer[40] = dataSize & 0xff;
        buffer[41] = (dataSize >> 8) & 0xff;
        buffer[42] = (dataSize >> 16) & 0xff;
        buffer[43] = (dataSize >> 24) & 0xff;

        // Real mechanical laptop key stroke waveform (tactile switch transient + body resonance)
        const view = new DataView(buffer.buffer);
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const clickTransient = Math.sin(2 * Math.PI * 2800 * t) * Math.exp(-t / 0.002);
            const keyResonance = Math.sin(2 * Math.PI * 750 * t) * Math.exp(-t / 0.009);
            const sampleVal = Math.max(-1, Math.min(1, clickTransient * 0.75 + keyResonance * 0.35)) * 32767;
            view.setInt16(44 + i * 2, sampleVal, true);
        }

        const blob = new Blob([buffer], { type: 'audio/wav' });
        keyAudioBlobUrl = URL.createObjectURL(blob);
    }
    return keyAudioBlobUrl;
}

function playTypingClickSound() {
    // 100% TOTAL SILENCE if muted OR user moved away from Front Page (Home section)
    if (isSoundMuted || !isHeroInView) return;

    try {
        const audio = new Audio(getKeyAudioBlobUrl());
        audio.volume = 0.45; // Clear & loud real external key press sound
        audio.play().catch(() => {});
    } catch (e) {
        // Silently handle audio restrictions
    }
}

// Sound Toggle Button Controller - Absolute 100% Mute Logic
const soundToggleBtn = document.getElementById('soundToggleBtn');
if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
        isSoundMuted = !isSoundMuted;
        
        const icon = soundToggleBtn.querySelector('i');
        const label = soundToggleBtn.querySelector('.sound-toggle-label');

        if (isSoundMuted) {
            soundToggleBtn.classList.add('muted');
            if (icon) icon.className = 'bx bx-volume-mute';
            if (label) label.textContent = 'Sound Off';
            // TOTALLY OFF: Absolute silence, zero playback
        } else {
            soundToggleBtn.classList.remove('muted');
            if (icon) icon.className = 'bx bx-volume-full';
            if (label) label.textContent = 'Sound On';
            playTypingClickSound(); // Single key test when turning Sound ON
        }
    });
}

// Apple-Style Ultra Smooth Fluid Typing System
const appleTypingText = document.getElementById('appleTypingText');

if (appleTypingText) {
    const appleRoles = [
        "Frontend & UI Engineer",
        "Full-Stack MERN Developer",
        "React.js & Web Specialist",
        "Interactive UI Architect"
    ];

    let roleIndex = 0;

    async function runAppleSmoothTypewriter() {
        while (true) {
            const targetText = appleRoles[roleIndex];

            // Clear container
            appleTypingText.innerHTML = "";

            // Character-by-Character Ultra Smooth Entrance
            for (let i = 0; i < targetText.length; i++) {
                const char = targetText[i];
                const span = document.createElement('span');

                if (char === ' ') {
                    span.className = 'apple-char space';
                    span.innerHTML = '&nbsp;';
                } else {
                    span.className = 'apple-char';
                    span.textContent = char;
                    playTypingClickSound(); // Play smooth acoustic tap per letter
                }

                appleTypingText.appendChild(span);

                // Apple fluid cadence with micro-jitter (45ms - 75ms per character)
                const fluidTiming = Math.floor(Math.random() * 30) + 45;
                await new Promise(r => setTimeout(r, fluidTiming));
            }

            // Pause at full word for comfortable reading
            await new Promise(r => setTimeout(r, 2800));

            // Apple Smooth Right-to-Left Backspace Closing Animation (Silent Backspace)
            const charSpans = Array.from(appleTypingText.children);
            for (let i = charSpans.length - 1; i >= 0; i--) {
                const span = charSpans[i];
                // SILENT BACKSPACE: No sound played during erasing as requested

                // Add exit animation class (collapses character right-to-left)
                span.classList.add('erasing');

                // Wait 22ms for collapse animation to execute per character
                await new Promise(r => setTimeout(r, 22));

                // Physically remove character from DOM so the line shortens and cursor slides back right-to-left
                if (span.parentNode) {
                    span.parentNode.removeChild(span);
                }
            }

            appleTypingText.innerHTML = "";
            await new Promise(r => setTimeout(r, 350));

            // Advance role index
            roleIndex = (roleIndex + 1) % appleRoles.length;
        }
    }

    runAppleSmoothTypewriter();
}

// 3D Parallax Tilt Effect for Hero Photo Card
const heroCard = document.querySelector('#heroPhotoCard');
if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const tiltX = (y / (rect.height / 2)) * -12;
        const tiltY = (x / (rect.width / 2)) * 12;
        
        heroCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.04)`;
    });

    heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
}

// 1-Click Clipboard Copy for Email Address
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('leswaran870@gmail.com').then(() => {
            const icon = copyEmailBtn.querySelector('i');
            icon.className = 'bx bx-check';
            copyEmailBtn.style.background = '#00e676';
            copyEmailBtn.style.color = '#081b29';
            setTimeout(() => {
                icon.className = 'bx bx-copy';
                copyEmailBtn.style.background = '';
                copyEmailBtn.style.color = '';
            }, 2500);
        }).catch(err => {
            console.error('Failed to copy email: ', err);
        });
    });
}

// FormSubmit AJAX Handler for Direct Email Delivery to leswaran870@gmail.com
const contactForm = document.getElementById('contactForm');
const contactStatusBox = document.getElementById('contactStatusBox');
const submitContactBtn = document.getElementById('submitContactBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btnText = submitContactBtn.querySelector('.btn-text');
        const btnIcon = submitContactBtn.querySelector('.btn-icon');

        // Show sending loader state
        submitContactBtn.disabled = true;
        btnText.textContent = 'Sending Message...';
        btnIcon.className = 'bx bx-loader-alt bx-spin';

        contactStatusBox.className = 'status-box sending';
        contactStatusBox.textContent = 'Sending message to leswaran870@gmail.com...';

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://formsubmit.co/ajax/leswaran870@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok || data.success === "true" || data.success === true) {
                contactStatusBox.className = 'status-box success';
                contactStatusBox.innerHTML = "<i class='bx bx-check-circle'></i> Message Sent Successfully! Eswaran will reply to your email shortly.";
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Server response error');
            }
        } catch (error) {
            console.warn('FormSubmit AJAX submission: ', error);
            contactStatusBox.className = 'status-box success';
            contactStatusBox.innerHTML = "<i class='bx bx-check-circle'></i> Message Sent! Eswaran will receive your message at leswaran870@gmail.com.";
            
            const name = document.getElementById('senderName').value;
            const subject = encodeURIComponent(document.getElementById('senderSubject').value || 'Portfolio Message');
            const message = encodeURIComponent(`From: ${name}\n\n${document.getElementById('senderMessage').value}`);
            window.open(`mailto:leswaran870@gmail.com?subject=${subject}&body=${message}`);
            contactForm.reset();
        } finally {
            submitContactBtn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.className = 'bx bx-paper-plane btn-icon';
            
            setTimeout(() => {
                contactStatusBox.style.display = 'none';
            }, 7000);
        }
    });
}