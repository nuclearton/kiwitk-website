const RTL_LANGS = ['ar'];
const DEFAULT_LANG = 'en';

function getSUPPORTED_LANGS() {
    return Object.keys(window.__I18N_TRANSLATIONS.lang || {});
}

function getBrowserLang() {
    const bl = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
    const supported = getSUPPORTED_LANGS();
    return supported.includes(bl) ? bl : DEFAULT_LANG;
}

function applyTranslations(lang) {
    const translations = window.__I18N_TRANSLATIONS;
    const t = (translations && translations[lang]) || (translations && translations[DEFAULT_LANG]) || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.setAttribute('placeholder', t[key]);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key]) el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (t[key]) el.setAttribute('title', t[key]);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        const key = el.getAttribute('data-i18n-alt');
        if (t[key]) el.setAttribute('alt', t[key]);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        if (t[key]) el.setAttribute('aria-label', t[key]);
    });
    if (t['page.title']) document.title = t['page.title'];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && t['page.description']) metaDesc.setAttribute('content', t['page.description']);
    document.documentElement.lang = lang;
    if (RTL_LANGS.includes(lang)) {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
}

function loadLanguageScript(lang) {
    return new Promise((resolve, reject) => {
        if (window.__I18N_TRANSLATIONS && window.__I18N_TRANSLATIONS[lang]) {
            resolve();
            return;
        }
        const existingScript = document.querySelector(`script[data-i18n-lang="${lang}"]`);
        if (existingScript) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'js/i18n/lang/' + lang + '.js';
        script.setAttribute('data-i18n-lang', lang);
        script.onload = () => resolve();
        script.onerror = () => {
            console.warn('Failed to load language: ' + lang);
            reject(new Error('Failed to load language: ' + lang));
        };
        document.head.appendChild(script);
    });
}

function setLanguage(lang) {
    const supported = getSUPPORTED_LANGS();
    if (!supported.includes(lang)) return;
    loadLanguageScript(lang).then(() => {
        localStorage.setItem('i18n_lang', lang);
        applyTranslations(lang);
        const sel = document.getElementById('lang-selector');
        if (sel) sel.value = lang;
        const mobileSel = document.querySelector('.mobile-lang-selector');
        if (mobileSel) mobileSel.value = lang;
    }).catch(() => {});
}

function initI18n(selector) {
    const saved = localStorage.getItem('i18n_lang');
    const supported = getSUPPORTED_LANGS();
    let lang = saved && supported.includes(saved) ? saved : getBrowserLang();
    loadLanguageScript(lang).then(() => {
        applyTranslations(lang);
        if (selector) {
            const el = document.querySelector(selector);
            if (el) {
                el.value = lang;
                el.addEventListener('change', e => setLanguage(e.target.value));
            }
        }
        const mobileSel = document.querySelector('.mobile-lang-selector');
        if (mobileSel) {
            mobileSel.value = lang;
            mobileSel.addEventListener('change', e => setLanguage(e.target.value));
        }
    });
}

if (typeof window !== 'undefined') {
    window.__I18N_TRANSLATIONS = window.__I18N_TRANSLATIONS || {};
    document.addEventListener('DOMContentLoaded', () => {
        initI18n('#lang-selector');
    });
}