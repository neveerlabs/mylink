(function() {
    const video = document.getElementById('bannerVideo');
    const audioIndicator = document.getElementById('audioIndicator');
    const unmuteBtn = document.getElementById('unmuteBtn');
    const menuToggle = document.getElementById('menuToggle');
    const menuDropdown = document.getElementById('menuDropdown');
    const languageToggle = document.getElementById('languageToggle');
    const langBadge = document.getElementById('langBadge');
    const reviewScrollContainer = document.getElementById('reviewScrollContainer');
    const reviewCardsContainer = document.getElementById('reviewCardsContainer');
    const dotsContainer = document.getElementById('reviewDots');
    const sharePopupOverlay = document.getElementById('sharePopupOverlay');
    const shareUrlInput = document.getElementById('shareUrlInput');
    const copyBtn = document.getElementById('copyUrlBtn');
    const closeBtn = document.getElementById('closePopupBtn');
    const loadingScreen = document.getElementById('loadingScreen');

    let indicatorTimeout;
    let hasUserInteracted = false;
    let videoObserver = null;
    let currentLang = 'id';
    let allProjects = [];

    const translations = {
        id: {
            home: 'Beranda',
            about: 'Tentang',
            projects: 'Proyek',
            contact: 'Kontak',
            language: 'Bahasa',
            mainAccount: 'Akun Utama',
            faxAccount: 'Akun Faq',
            faxEmail: 'Email Faq',
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
            faxAccount: 'Faq Account',
            faxEmail: 'Faq Email',
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
        updateReviewCardsLanguage();
    }

    function updateReviewCardsLanguage() {
        document.querySelectorAll('.visit-github-btn span[data-i18n="visitGithub"]').forEach(span => {
            span.textContent = translations[currentLang].visitGithub;
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
        if (unmuteBtn) unmuteBtn.classList.add('hidden');
        if (video.paused) restartAndPlay();
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

    if (languageToggle) {
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const newLang = currentLang === 'id' ? 'en' : 'id';
            applyLanguage(newLang);
            menuDropdown.classList.remove('active');
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

        videoObserver = new IntersectionObserver(handleVisibility, { threshold: 0.1 });
        videoObserver.observe(video);

        if (video.paused && document.visibilityState === 'visible') {
            const rect = video.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) restartAndPlay();
        }
    }

    function openSharePopup(link) {
        shareUrlInput.value = link;
        sharePopupOverlay.classList.add('active');
    }

    function closeSharePopup() {
        sharePopupOverlay.classList.remove('active');
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            shareUrlInput.select();
            document.execCommand('copy');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = translations[currentLang].copy === 'Copy' ? 'Copied!' : 'Tersalin!';
            setTimeout(() => {
                copyBtn.textContent = translations[currentLang].copy;
            }, 1500);
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeSharePopup);
    sharePopupOverlay.addEventListener('click', function(e) {
        if (e.target === sharePopupOverlay) closeSharePopup();
    });

    document.querySelectorAll('.share-option').forEach(option => {
        option.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const encodedLink = encodeURIComponent(shareUrlInput.value);
            const text = encodeURIComponent('Cek ini!');
            let shareUrl = '';
            switch(platform) {
                case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${encodedLink}`; break;
                case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`; break;
                case 'instagram': alert('Instagram share via browser tidak mendukung langsung. Copy link manual.'); return;
                case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${encodedLink}&text=${text}`; break;
                case 'reddit': shareUrl = `https://www.reddit.com/submit?url=${encodedLink}&title=${text}`; break;
                case 'email': shareUrl = `mailto:?subject=${text}&body=${encodedLink}`; break;
                default: return;
            }
            if (shareUrl) window.open(shareUrl, '_blank');
        });
    });

    function renderReviewCards(projects) {
        reviewCardsContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        if (!projects.length) return;

        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="review-blur-placeholder"></div>
                <img src="${project.image}" alt="${project.name}" class="review-bg-image" loading="lazy">
                <div class="review-overlay">
                    <div class="review-header">
                        <i class="ri-github-fill review-github-icon"></i>
                        <span class="review-name">${project.repo || project.name}</span>
                    </div>
                    <div class="review-footer">
                        <button class="share-review-btn" data-link="https://github.com/${project.repo}">
                            <i class="ri-share-forward-line share-icon"></i>
                        </button>
                        <a href="https://github.com/${project.repo}" class="visit-github-btn" target="_blank">
                            <span data-i18n="visitGithub">${translations[currentLang].visitGithub}</span>
                            <i class="ri-github-fill btn-github-icon"></i>
                        </a>
                    </div>
                </div>
            `;
            reviewCardsContainer.appendChild(card);

            const dot = document.createElement('button');
            dot.className = 'review-dot';
            dot.setAttribute('aria-label', `Slide ${index + 1}`);
            dot.addEventListener('click', () => {
                reviewScrollContainer.scrollTo({
                    left: card.offsetLeft - reviewScrollContainer.offsetLeft,
                    behavior: 'smooth'
                });
            });
            dotsContainer.appendChild(dot);
        });

        const images = reviewCardsContainer.querySelectorAll('.review-bg-image');
        images.forEach(img => {
            if (img.complete) img.classList.add('loaded');
            else img.addEventListener('load', () => img.classList.add('loaded'));
        });

        const shareBtns = reviewCardsContainer.querySelectorAll('.share-review-btn');
        shareBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openSharePopup(this.getAttribute('data-link'));
            });
        });
    }

    function updateActiveDot() {
        if (!reviewScrollContainer || !dotsContainer) return;
        const cards = reviewCardsContainer.querySelectorAll('.review-card');
        const dots = dotsContainer.querySelectorAll('.review-dot');
        if (!cards.length || !dots.length) return;

        const scrollLeft = reviewScrollContainer.scrollLeft;
        const containerWidth = reviewScrollContainer.offsetWidth;
        let activeIndex = 0;

        cards.forEach((card, index) => {
            const cardLeft = card.offsetLeft - reviewScrollContainer.offsetLeft;
            const cardRight = cardLeft + card.offsetWidth;
            if (scrollLeft >= cardLeft - containerWidth / 3 && scrollLeft < cardRight - containerWidth / 3) {
                activeIndex = index;
            }
        });

        dots.forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
    }

    function initReviewScroll() {
        if (!reviewScrollContainer) return;
        let scrollTimeout;
        reviewScrollContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateActiveDot();
                const cards = reviewCardsContainer.querySelectorAll('.review-card');
                if (!cards.length) return;
                const containerWidth = reviewScrollContainer.offsetWidth;
                const targetCard = Array.from(cards).find(card => {
                    const cardLeft = card.offsetLeft - reviewScrollContainer.offsetLeft;
                    const cardRight = cardLeft + card.offsetWidth;
                    return reviewScrollContainer.scrollLeft >= cardLeft - containerWidth / 3 &&
                           reviewScrollContainer.scrollLeft < cardRight - containerWidth / 3;
                });
                if (targetCard) {
                    const targetScroll = targetCard.offsetLeft - reviewScrollContainer.offsetLeft;
                    reviewScrollContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
                }
            }, 80);
        });

        window.addEventListener('resize', updateActiveDot);
    }

    const bannerWrapper = document.getElementById('bannerWrapper');
    if (bannerWrapper) {
        window.addEventListener('scroll', () => {
            bannerWrapper.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
        }, { passive: true });
    }

    function preloadImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = url;
        });
    }

    function preloadVideo(videoElement) {
        return new Promise((resolve) => {
            if (videoElement.readyState >= 3) {
                resolve();
            } else {
                videoElement.addEventListener('canplay', resolve, { once: true });
                videoElement.load();
            }
        });
    }

    async function preloadAll() {
        try {
            const response = await fetch('project.json');
            if (!response.ok) throw new Error('Gagal memuat project.json');
            const data = await response.json();
            allProjects = data.flatMap(category => category.items);

            const imageUrls = allProjects.map(p => p.image);
            const preloadPromises = imageUrls.map(url => preloadImage(url));
            preloadPromises.push(preloadVideo(video));

            await Promise.all(preloadPromises);
        } catch (err) {
            console.error('Preload gagal:', err);
        } finally {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                if (loadingScreen) loadingScreen.style.display = 'none';
                applyLanguage('id');
                renderReviewCards(allProjects);
                updateActiveDot();
                initReviewScroll();
            }, 500);
        }
    }

    preloadAll();
})();
