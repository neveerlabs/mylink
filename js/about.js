(function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuDropdown = document.getElementById('menuDropdown');
    const languageToggle = document.getElementById('languageToggle');
    const langBadge = document.getElementById('langBadge');
    let currentLang = 'id';

    const translations = {
        id: {
            pageTitle: 'Tentang',
            home: 'Beranda',
            about: 'Tentang',
            projects: 'Proyek',
            contact: 'Kontak',
            language: 'Bahasa',
            badgeText: 'Program Digital',
            bioText: 'Kami membangun pengalaman web modern dengan fokus pada kesederhanaan dan performa. Dari landing page interaktif hingga aplikasi full‑stack — kami mewujudkan ide menjadi kenyataan.',
            location: 'Depok, ID',
            website: 'MyLink',
            email: 'userlinuxorg@gmail.com',
            since: 'Sejak 2026',
            connectTitle: 'Hubungkan',
            footerText: '© 2026 Neverlabs • Hak cipta dilindungi.'
        },
        en: {
            pageTitle: 'About',
            home: 'Home',
            about: 'About',
            projects: 'Projects',
            contact: 'Contact',
            language: 'Language',
            badgeText: 'Digital Program',
            bioText: 'We build modern web experiences with a focus on simplicity and performance. From interactive landing pages to full‑stack applications — we turn ideas into reality.',
            location: 'Depok, ID',
            website: 'MyLink',
            email: 'userlinuxorg@gmail.com',
            since: 'Since 2026',
            connectTitle: 'Connect',
            footerText: '© 2026 Neverlabs • All rights reserved.'
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

    const style = document.createElement('style');
    style.textContent = `
        .social-card, .header-back, .info-item, .menu-item, .menu-toggle {
            -webkit-tap-highlight-color: transparent;
        }
    `;
    document.head.appendChild(style);

    applyLanguage('id');
})();
