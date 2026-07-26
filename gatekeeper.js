import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

const callbackDomain = window.location.origin;
const callbackPath = "/sso-callback.html";
const SSO_LOGIN_URL = `https://bamboochain.id/#/login?redirect=${callbackDomain}${callbackPath}`;
const SSO_REGISTER_URL = `https://bamboochain.id/#/login?redirect=${callbackDomain}${callbackPath}`;

const isCallbackPage = window.location.pathname.includes('/sso-callback');

function removeInitialLoader() {
    const loader = document.getElementById('initial-loader');
    if (loader) loader.remove();
}

const translations = {
    id: {
        title: "Autentikasi Diperlukan",
        desc: "Untuk mengakses aplikasi ini, silakan masuk menggunakan akun BaMbooChain Anda.",
        loginBtn: "Masuk dengan BaMbooChain",
        registerBtn: "Daftar di BaMbooChain",
        footer: "Terhubung dengan ekosistem BaMbooChain."
    },
    en: {
        title: "Authentication Required",
        desc: "To access this application, please log in using your BaMbooChain account.",
        loginBtn: "Log in with BaMbooChain",
        registerBtn: "Register on BaMbooChain",
        footer: "Connected with the BaMbooChain ecosystem."
    }
};

window.toggleSsoLang = function(lang) {
    localStorage.setItem('sso_lang', lang);
    document.getElementById('sso-title').textContent = translations[lang].title;
    document.getElementById('sso-desc').textContent = translations[lang].desc;
    document.getElementById('sso-btn-login').textContent = translations[lang].loginBtn;
    document.getElementById('sso-btn-register').textContent = translations[lang].registerBtn;
    document.getElementById('sso-footer').textContent = translations[lang].footer;
    
    document.getElementById('lang-btn-id').style.opacity = lang === 'id' ? '1' : '0.5';
    document.getElementById('lang-btn-en').style.opacity = lang === 'en' ? '1' : '0.5';
}

function injectGatekeeperModal() {
    if (document.getElementById('sso-gatekeeper-modal')) return;

    removeInitialLoader();
    const currentLang = localStorage.getItem('sso_lang') || 'id';
    const t = translations[currentLang];

    const modalHTML = `
        <div id="sso-gatekeeper-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(17, 24, 39, 0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 999999;">
            <div style="background: #1f2937; padding: 40px; border-radius: 12px; border: 1px solid #374151; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); max-width: 450px; width: 90%; text-align: center; font-family: sans-serif; position: relative;">
                
                <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 8px;">
                    <button id="lang-btn-id" onclick="toggleSsoLang('id')" style="background: none; border: none; color: #fff; cursor: pointer; font-weight: bold; opacity: ${currentLang === 'id' ? '1' : '0.5'};">ID</button>
                    <span style="color: #6b7280;">|</span>
                    <button id="lang-btn-en" onclick="toggleSsoLang('en')" style="background: none; border: none; color: #fff; cursor: pointer; font-weight: bold; opacity: ${currentLang === 'en' ? '1' : '0.5'};">EN</button>
                </div>

                <h2 id="sso-title" style="color: #fff; font-size: 1.8rem; margin-top: 0; margin-bottom: 16px;">${t.title}</h2>
                <p id="sso-desc" style="color: #9ca3af; font-size: 1rem; line-height: 1.5; margin-bottom: 30px;">
                    ${t.desc}
                </p>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button id="sso-btn-login" onclick="window.location.href='${SSO_LOGIN_URL}'" style="background: #fbbf24; color: #111827; border: none; padding: 14px; border-radius: 8px; font-weight: 600; font-size: 1.1rem; cursor: pointer; transition: background 0.2s;">
                        ${t.loginBtn}
                    </button>
                    <button id="sso-btn-register" onclick="window.location.href='${SSO_REGISTER_URL}'" style="background: transparent; color: #d1d5db; border: 1px solid #4b5563; padding: 14px; border-radius: 8px; font-weight: 600; font-size: 1.1rem; cursor: pointer; transition: background 0.2s;">
                        ${t.registerBtn}
                    </button>
                </div>
                <p id="sso-footer" style="color: #6b7280; font-size: 0.85rem; margin-top: 24px;">
                    ${t.footer}
                </p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        if (!isCallbackPage) {
            console.log("No valid session found. Showing SSO Gatekeeper Modal...");
            injectGatekeeperModal();
        }
    } else {
        console.log("SSO Session active for UID:", user.uid);
        removeInitialLoader();
        document.body.classList.add('auth-resolved');
        
        try {
            const idToken = await user.getIdToken();
            localStorage.setItem('token', idToken); 
        } catch(e) {}
    }
});
