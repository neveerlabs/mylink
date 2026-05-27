(function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuDropdown = document.getElementById('menuDropdown');
    const languageToggle = document.getElementById('languageToggle');
    const langBadge = document.getElementById('langBadge');
    const projectContent = document.getElementById('projectContent');
    const readmeModalOverlay = document.getElementById('readmeModalOverlay');
    const readmeTitle = document.getElementById('readmeTitle');
    const readmeBody = document.getElementById('readmeBody');
    const readmeClose = document.getElementById('readmeClose');
    const loadingScreen = document.getElementById('loadingScreen');
    let currentLang = 'id';
    let allProjects = [];

    const translations = {
        id: {
            pageTitle: 'Proyek',
            home: 'Beranda',
            about: 'Tentang',
            projects: 'Proyek',
            contact: 'Kontak',
            language: 'Bahasa',
            footerText: '© 2026 Neverlabs • Hak cipta dilindungi.',
            viewOnGithub: 'Lihat di GitHub',
            loadingReadme: 'Memuat README...',
            noReadme: 'Tidak ada README.md'
        },
        en: {
            pageTitle: 'Projects',
            home: 'Home',
            about: 'About',
            projects: 'Projects',
            contact: 'Contact',
            language: 'Language',
            footerText: '© 2026 Neverlabs • All rights reserved.',
            viewOnGithub: 'View on GitHub',
            loadingReadme: 'Loading README...',
            noReadme: 'No README.md'
        }
    };

    function applyLanguage(lang) {
        currentLang = lang;
        if (langBadge) langBadge.textContent = lang === 'id' ? 'ID' : 'EN';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        renderProjects();
    }

    function renderProjects() {
        if (!projectContent) return;
        let html = '';
        allProjects.forEach(section => {
            const catTitle = section.category[currentLang] || section.category.id;
            const catDesc = section.description[currentLang] || section.description.id;
            html += `<div class="project-section">`;
            html += `<div class="section-header"><h2>${catTitle}</h2><p>${catDesc}</p></div>`;
            html += `<div class="carousel-container" data-category="${catTitle}">`;
            html += `<div class="carousel-scroll">`;
            section.items.forEach((item, idx) => {
                const desc = item.desc[currentLang] || item.desc.id;
                const tagsHtml = item.tags.map(t => `<span class="tag">${t}</span>`).join('');
                html += `<div class="project-card" data-repo="${item.repo}" data-name="${item.name}" data-index="${idx}">`;
                html += `<div class="project-image"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>`;
                html += `<div class="project-info">`;
                html += `<h3>${item.name}</h3>`;
                html += `<p>${desc}</p>`;
                html += `<div class="project-tags">${tagsHtml}</div>`;
                html += `<a href="https://github.com/${item.repo}" target="_blank" class="github-link-btn" style="display: none;"><i class="ri-github-fill"></i> <span>${translations[currentLang].viewOnGithub}</span></a>`;
                html += `</div></div>`;
            });
            html += `</div></div></div>`;
        });
        projectContent.innerHTML = html;
        initializeCarousels();
    }

    function initializeCarousels() {
        const carousels = document.querySelectorAll('.carousel-scroll');
        carousels.forEach(scroll => {
            const cards = scroll.querySelectorAll('.project-card');
            const updateActiveCard = () => {
                const containerRect = scroll.getBoundingClientRect();
                const centerX = containerRect.left + containerRect.width / 2;
                let activeCard = null;
                let minDistance = Infinity;
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const cardCenterX = rect.left + rect.width / 2;
                    const distance = Math.abs(centerX - cardCenterX);
                    if (distance < minDistance) {
                        minDistance = distance;
                        activeCard = card;
                    }
                });
                cards.forEach(card => {
                    card.classList.remove('active-card');
                    const btn = card.querySelector('.github-link-btn');
                    if (btn) btn.style.display = 'none';
                });
                if (activeCard) {
                    activeCard.classList.add('active-card');
                    const btn = activeCard.querySelector('.github-link-btn');
                    if (btn) btn.style.display = 'inline-flex';
                }
            };
            let scrollTimeout;
            scroll.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(updateActiveCard, 50);
            });
            updateActiveCard();
            cards.forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.github-link-btn')) return;
                    const repo = card.getAttribute('data-repo');
                    if (repo) fetchReadme(repo);
                });
            });
        });
    }

    async function fetchReadme(repo) {
        readmeTitle.textContent = `README · ${repo}`;
        readmeBody.innerHTML = `<div class="readme-loading">${translations[currentLang].loadingReadme}</div>`;
        readmeModalOverlay.classList.add('active');
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/readme`);
            if (!response.ok) throw new Error('No README');
            const data = await response.json();
            const content = atob(data.content);
            const html = marked.parse(content);
            readmeBody.innerHTML = html;
        } catch (err) {
            readmeBody.innerHTML = `<div class="readme-loading">${translations[currentLang].noReadme}</div>`;
        }
    }

    if (menuToggle && menuDropdown) {
        menuToggle.addEventListener('click', e => { e.stopPropagation(); menuDropdown.classList.toggle('active'); });
        document.addEventListener('click', e => { if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) menuDropdown.classList.remove('active'); });
        document.addEventListener('touchstart', e => { if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) menuDropdown.classList.remove('active'); });
    }

    if (languageToggle) {
        languageToggle.addEventListener('click', e => {
            e.stopPropagation();
            applyLanguage(currentLang === 'id' ? 'en' : 'id');
            menuDropdown.classList.remove('active');
        });
    }

    readmeClose.addEventListener('click', () => readmeModalOverlay.classList.remove('active'));
    readmeModalOverlay.addEventListener('click', e => { if (e.target === readmeModalOverlay) readmeModalOverlay.classList.remove('active'); });

    function preloadImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = url;
        });
    }

    async function fetchProjects() {
        try {
            const response = await fetch('../project.json');
            if (!response.ok) throw new Error('Gagal memuat project.json');
            const data = await response.json();
            allProjects = data;

            const imageUrls = data.flatMap(cat => cat.items.map(item => item.image));
            await Promise.all(imageUrls.map(url => preloadImage(url)));

            renderProjects();
        } catch (err) {
            console.error('Gagal memuat proyek:', err);
        } finally {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                if (loadingScreen) loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    const style = document.createElement('style');
    style.textContent = `.project-card, .header-back, .menu-item, .menu-toggle, .github-link-btn, .readme-close { -webkit-tap-highlight-color: transparent; }`;
    document.head.appendChild(style);

    applyLanguage('id');
    fetchProjects();
})();
