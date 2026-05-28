(function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuDropdown = document.getElementById('menuDropdown');
    const languageToggle = document.getElementById('languageToggle');
    const langBadge = document.getElementById('langBadge');
    const contactForm = document.getElementById('contactForm');
    const loadingScreen = document.getElementById('loadingScreen');
    const notificationOverlay = document.getElementById('notificationOverlay');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationCloseBtn = document.getElementById('notificationCloseBtn');
    let currentLang = 'id';

    const translations = {
        id: {
            pageTitle: 'Kontak',
            home: 'Beranda',
            about: 'Tentang',
            projects: 'Proyek',
            contact: 'Kontak',
            language: 'Bahasa',
            getInTouch: 'Hubungi Saya',
            contactDesc: 'Punya pertanyaan atau ingin kolaborasi? Jangan ragu untuk mengirim pesan.',
            emailLabel: 'Email',
            telegramLabel: 'Telegram',
            discordLabel: 'Discord',
            namePlaceholder: 'Masukkan nama...',
            emailPlaceholder: 'Masukkan email...',
            subjectPlaceholder: 'Masukkan subjek...',
            messagePlaceholder: 'Masukkan pesan...',
            sendBtn: 'Kirim Pesan',
            footerText: '© 2026 Neverlabs • All rights reserved.',
            fillAllFields: 'Harap isi nama, email, subjek, dan pesan terlebih dahulu.',
            sendSuccess: 'Pesan berhasil dikirim! Terima kasih.',
            sendError: 'Gagal mengirim pesan. Silakan coba lagi.',
            closeNotification: 'Tutup'
        },
        en: {
            pageTitle: 'Contact',
            home: 'Home',
            about: 'About',
            projects: 'Projects',
            contact: 'Contact',
            language: 'Language',
            getInTouch: 'Get In Touch',
            contactDesc: 'Have a question or want to collaborate? Feel free to send a message.',
            emailLabel: 'Email',
            telegramLabel: 'Telegram',
            discordLabel: 'Discord',
            namePlaceholder: 'Enter name...',
            emailPlaceholder: 'Enter email...',
            subjectPlaceholder: 'Enter subject...',
            messagePlaceholder: 'Enter message...',
            sendBtn: 'Send Message',
            footerText: '© 2026 Neverlabs • All rights reserved.',
            fillAllFields: 'Please fill in your name, email, subject, and message.',
            sendSuccess: 'Message sent successfully! Thank you.',
            sendError: 'Failed to send message. Please try again.',
            closeNotification: 'Close'
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

    function showNotification(type, message) {
        if (type === 'error') {
            notificationIcon.className = 'notification-icon ri-error-warning-fill';
            notificationIcon.style.color = '#f87171';
        } else {
            notificationIcon.className = 'notification-icon ri-checkbox-circle-fill';
            notificationIcon.style.color = '#4ade80';
        }
        notificationMessage.textContent = message;
        notificationOverlay.classList.add('active');
    }

    function hideNotification() {
        notificationOverlay.classList.remove('active');
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

    notificationCloseBtn.addEventListener('click', hideNotification);
    notificationOverlay.addEventListener('click', function(e) {
        if (e.target === notificationOverlay) hideNotification();
    });

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showNotification('error', translations[currentLang].fillAllFields);
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('_subject', subject);
            formData.append('message', message);
            formData.append('_captcha', 'false');

            try {
                const response = await fetch('https://formsubmit.co/userlinuxorg@gmail.com', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    showNotification('success', translations[currentLang].sendSuccess);
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showNotification('error', translations[currentLang].sendError);
            }
        });
    }

    function hideLoadingScreen() {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    window.addEventListener('load', function() {
        setTimeout(hideLoadingScreen, 1200);
    });

    applyLanguage('id');
})();
