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
    let currentLang = 'id';

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

    const projectsData = [
        {
            category: { id: 'Alat', en: 'Tools' },
            description: { id: 'Alat produktivitas dan pengembangan', en: 'Productivity and development tools' },
            items: [
                { 
                    name: 'Tocket', desc: {
                        id: 'Aplikasi pesan real‑time modern', en: 'Modern real‑time messaging app' },
                        tags: ['cryptography', 'requests', 'rich', 'prompt_toolkit', 'inquirer'],
                        image: 'https://raw.githubusercontent.com/neveerlabs/mylink/66713ce132ebb37669ced1e2f0f13395142079a2/image/tocket.png',
                        repo: 'neveerlabs/Tocket'
                },
                {
                    name: 'OSM', desc: {
                        id: 'CLI ringan untuk mengelola repositori', en: 'Lightweight CLI to manage repos' },
                        tags: ['inquirer', 'mysql2'],
                        image: 'https://raw.githubusercontent.com/neveerlabs/mylink/66713ce132ebb37669ced1e2f0f13395142079a2/image/OSM.png',
                        repo: 'neveerlabs/OSM'
                },
                {
                    name: 'Fuzzer', desc: {
                        id: 'Web fuzzer untuk penemuan endpoint', en: 'Web fuzzer for endpoint discovery' },
                        tags: ['requests', 'colorama', 'pyyaml'],
                        image: 'https://raw.githubusercontent.com/neveerlabs/mylink/66713ce132ebb37669ced1e2f0f13395142079a2/image/fuzzer.png',
                        repo: 'neveerlabs/fuzzer'
                },
                {
                    name: 'Interface', desc: {
                        id: `Alat Bantu Pengujian Jaringan pribadi`, en: `Internal Network Testing Tool` },
                        tags: [`subprocess`, `re`, `sys`, `os`, `socket`, `fcntl`, `struct`, `platform`, `Thread`, `Queue`, `time`, `signal`, `questionary`, `arp-scan`, `nmap`, `curl`, `ethtool`, `iproute2`, `iwgetid`, `sudo`, `nmcli`],
                        image: `https://raw.githubusercontent.com/neveerlabs/mylink/39d87d84c26280d4b54ec9af2b5f136b43948f46/image/interface.png`,
                        repo: `neveerlabs/Interface`
                }
            ]
        },
        {
            category: { id: 'E‑commerce', en: 'E‑commerce' },
            description: { id: 'Platform jual beli dan toko online', en: 'Online store and marketplace platforms' },
            items: [
                {
                    name: 'Sentral Plastik', desc: {
                        id: 'Toko Plastik online modern', en: 'Modern online store template' },
                        tags: ['bcrypt', 'cors', 'dotenv', 'express', 'express-mysql-session', 'express-session', 'multer', 'mysql2', 'passport', 'passport-google-oauth20', 'web-push', 'Node'],
                        image: 'https://raw.githubusercontent.com/neveerlabs/mylink/66713ce132ebb37669ced1e2f0f13395142079a2/image/logo.jpg',
                        repo: 'neveerlabs/sentralplastik'
                },
                {
                    name: 'Cartify', desc: {
                        id: 'Keranjang belanja headless', en: 'Headless shopping cart' },
                        tags: ['Vue', 'Node', 'MongoDB'],
                        image: 'https://raw.githubusercontent.com/neveerlabs/mylink/66713ce132ebb37669ced1e2f0f13395142079a2/image/logo.jpg',
                        repo: 'neveerlabs/cartify'
                }
            ]
        },
        {
            category: { id: 'Komunitas', en: 'Community' },
            description: { id: 'Proyek sosial dan forum', en: 'Social and forum projects' },
            items: [
                {
                    name: 'Riyadh Community\'s', desc: {
                        id: 'Forum diskusi ringan', en: 'Lightweight discussion forum' },
                        tags: ['Laravel', 'Vue.js', 'mysql2'],
                        image: 'https://raw.githubusercontent.com/neveerlabs/mylink/66713ce132ebb37669ced1e2f0f13395142079a2/image/logo.jpg',
                        repo: 'neveerlabs/diskusi'
                }
            ]
        }
    ];

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
        projectsData.forEach(section => {
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
            const container = scroll.parentElement;
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
            const markdown = content;
            const html = marked.parse(markdown);
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

    const style = document.createElement('style');
    style.textContent = `.project-card, .header-back, .menu-item, .menu-toggle, .github-link-btn, .readme-close { -webkit-tap-highlight-color: transparent; }`;
    document.head.appendChild(style);

    applyLanguage('id');
})();
