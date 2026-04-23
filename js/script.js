(function() {
    const video = document.getElementById('bannerVideo');
    const audioIndicator = document.getElementById('audioIndicator');
    const unmuteBtn = document.getElementById('unmuteBtn');
    const menuToggle = document.getElementById('menuToggle');
    const menuDropdown = document.getElementById('menuDropdown');
    const languageToggle = document.getElementById('languageToggle');
    const langBadge = document.getElementById('langBadge');
    let indicatorTimeout;
    let hasUserInteracted = false;
    let videoObserver = null;
    let currentLang = 'id';

    const translations = {
        id: {
            home: 'Beranda',
            about: 'Tentang',
            projects: 'Proyek',
            contact: 'Kontak',
            language: 'Bahasa',
            mainAccount: 'Akun Utama',
            faxAccount: 'Akun Fax',
            faxEmail: 'Email Fax',
            supportEmail: 'Email Support',
            visitGithub: 'Kunjungi Github',
            shareTitle: 'Bagikan Link',
            copy: 'Copy',
            close: 'Tutup',
            tapForSound: 'Tap untuk Suara'
        },
        en: {
            home: 'Home',
            about: 'About',
            projects: 'Projects',
            contact: 'Contact',
            language: 'Language',
            mainAccount: 'Main Account',
            faxAccount: 'Fax Account',
            faxEmail: 'Fax Email',
            supportEmail: 'Support Email',
            visitGithub: 'Visit Github',
            shareTitle: 'Share Link',
            copy: 'Copy',
            close: 'Close',
            tapForSound: 'Tap for Sound'
        }
    };

    function applyLanguage(lang) {
        currentLang = lang;
        if (langBadge) langBadge.textContent = lang === 'id' ? 'ID' : 'EN';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
        const unmuteSpan = unmuteBtn?.querySelector('span');
        if (unmuteSpan) unmuteSpan.textContent = translations[lang].tapForSound;
    }

    if (languageToggle) {
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const newLang = currentLang === 'id' ? 'en' : 'id';
            applyLanguage(newLang);
            menuDropdown.classList.remove('active');
        });
    }

    function showAudioIndicator(isMuted) {
        if (!audioIndicator) return;
        const icon = audioIndicator.querySelector('i');
        icon.className = isMuted ? 'ri-volume-mute-fill' : 'ri-volume-up-fill';
        audioIndicator.classList.add('show');
        clearTimeout(indicatorTimeout);
        indicatorTimeout = setTimeout(() => {
            audioIndicator.classList.remove('show');
        }, 1200);
    }

    function restartAndPlay() {
        if (!video) return;
        video.currentTime = 0;
        video.play().then(() => {
            if (hasUserInteracted) {
                video.muted = false;
                showAudioIndicator(false);
            } else {
                video.muted = true;
                showAudioIndicator(true);
            }
        }).catch(() => {});
    }

    function pauseVideo() {
        if (!video) return;
        video.pause();
    }

    function handleVisibility(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && document.visibilityState === 'visible') {
                restartAndPlay();
            } else {
                pauseVideo();
            }
        });
    }

    function activateAudio() {
        if (!video) return;
        hasUserInteracted = true;
        video.muted = false;
        showAudioIndicator(false);
        if (unmuteBtn) {
            unmuteBtn.classList.add('hidden');
        }
        if (video.paused) {
            restartAndPlay();
        }
    }

    if (menuToggle && menuDropdown) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            menuDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('active');
            }
        });

        document.addEventListener('touchstart', function(e) {
            if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('active');
            }
        });
    }

    if (video) {
        video.addEventListener('click', function(e) {
            e.stopPropagation();
            this.muted = !this.muted;
            showAudioIndicator(this.muted);
            if (!this.muted) {
                hasUserInteracted = true;
                if (unmuteBtn) unmuteBtn.classList.add('hidden');
            }
        });

        if (unmuteBtn) {
            unmuteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                activateAudio();
            });
        }

        const interactionHandler = function() {
            if (!hasUserInteracted) {
                hasUserInteracted = true;
                if (video.paused) {
                    restartAndPlay();
                } else {
                    video.muted = false;
                    showAudioIndicator(false);
                }
                if (unmuteBtn) unmuteBtn.classList.add('hidden');
            }
            document.removeEventListener('click', interactionHandler);
            document.removeEventListener('touchstart', interactionHandler);
            document.removeEventListener('scroll', interactionHandler);
        };

        document.addEventListener('click', interactionHandler, { once: true });
        document.addEventListener('touchstart', interactionHandler, { once: true });
        document.addEventListener('scroll', interactionHandler, { once: true });

        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                if (videoObserver) {
                    const entries = videoObserver.takeRecords();
                    if (entries.length > 0) {
                        handleVisibility(entries);
                    } else {
                        const rect = video.getBoundingClientRect();
                        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                        if (isVisible) restartAndPlay();
                    }
                }
            } else {
                pauseVideo();
            }
        });

        videoObserver = new IntersectionObserver(handleVisibility, {
            threshold: 0.1
        });
        videoObserver.observe(video);

        if (video.paused && document.visibilityState === 'visible') {
            const rect = video.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) restartAndPlay();
        }
    }

    const overlay = document.getElementById('sharePopupOverlay');
    const urlInput = document.getElementById('shareUrlInput');
    const copyBtn = document.getElementById('copyUrlBtn');
    const closeBtn = document.getElementById('closePopupBtn');
    let currentShareLink = '';

    function openSharePopup(link) {
        currentShareLink = link;
        urlInput.value = link;
        overlay.classList.add('active');
    }

    function closeSharePopup() {
        overlay.classList.remove('active');
    }

    document.querySelectorAll('.share-review-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const link = this.getAttribute('data-link');
            openSharePopup(link);
        });
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            urlInput.select();
            document.execCommand('copy');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = currentLang === 'id' ? 'Tersalin!' : 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = translations[currentLang].copy;
            }, 1500);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSharePopup);
    }

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeSharePopup();
    });

    document.querySelectorAll('.share-option').forEach(option => {
        option.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const encodedLink = encodeURIComponent(currentShareLink);
            const text = encodeURIComponent('Cek ini!');
            let shareUrl = '';

            switch(platform) {
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${text}%20${encodedLink}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
                    break;
                case 'instagram':
                    alert('Instagram share via browser tidak mendukung langsung. Copy link manual.');
                    return;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodedLink}&text=${text}`;
                    break;
                case 'reddit':
                    shareUrl = `https://www.reddit.com/submit?url=${encodedLink}&title=${text}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${text}&body=${encodedLink}`;
                    break;
                default: return;
            }

            if (shareUrl) window.open(shareUrl, '_blank');
        });
    });

    const scrollContainer = document.getElementById('reviewScrollContainer');
    const dotsContainer = document.getElementById('reviewDots');
    const cards = document.querySelectorAll('.review-card');

    if (scrollContainer && cards.length > 0) {
        function generateDots() {
            dotsContainer.innerHTML = '';
            cards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('review-dot');
                dot.setAttribute('aria-label', `Slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    scrollContainer.scrollTo({
                        left: cards[index].offsetLeft - scrollContainer.offsetLeft,
                        behavior: 'smooth'
                    });
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateActiveDot() {
            const scrollLeft = scrollContainer.scrollLeft;
            const containerWidth = scrollContainer.offsetWidth;
            let activeIndex = 0;

            cards.forEach((card, index) => {
                const cardLeft = card.offsetLeft - scrollContainer.offsetLeft;
                const cardRight = cardLeft + card.offsetWidth;
                if (scrollLeft >= cardLeft - containerWidth / 3 && scrollLeft < cardRight - containerWidth / 3) {
                    activeIndex = index;
                }
            });

            const dots = dotsContainer.querySelectorAll('.review-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }

        generateDots();
        updateActiveDot();

        let scrollTimeout;
        scrollContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateActiveDot();
                const scrollLeft = scrollContainer.scrollLeft;
                const containerWidth = scrollContainer.offsetWidth;
                const targetCard = Array.from(cards).find(card => {
                    const cardLeft = card.offsetLeft - scrollContainer.offsetLeft;
                    const cardRight = cardLeft + card.offsetWidth;
                    return scrollLeft >= cardLeft - containerWidth / 3 && scrollLeft < cardRight - containerWidth / 3;
                });
                if (targetCard) {
                    const targetScroll = targetCard.offsetLeft - scrollContainer.offsetLeft;
                    scrollContainer.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                    });
                }
            }, 80);
        });

        window.addEventListener('resize', () => {
            updateActiveDot();
        });
    }

    const bannerWrapper = document.getElementById('bannerWrapper');
    if (bannerWrapper) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            bannerWrapper.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }

    const repoImages = document.querySelectorAll('.review-bg-image');
    repoImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    applyLanguage('id');
})();
