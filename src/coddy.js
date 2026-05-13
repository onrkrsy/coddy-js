/*!
 * Coddy.js v0.1.0
 * Bağımsız, sıfır bağımlılıklı geliştirici maskotu.
 * https://github.com/<user>/coddy
 *
 * (c) 2026 Onur Karasoy
 * Released under the MIT License.
 */
(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Coddy = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    class Coddy {
    constructor(options = {}) {
        const defaults = {
            position: 'bottom-right',
            offsetX: 50,
            offsetY: 40,
            theme: 'dark',
            onClick: null,
            marqueeText: null,
            enableRandomMarquee: true,
            menu: null,
            messages: {
                idle: ["Kod ver, laf yapma.", "Sıkıldım...", "Deploy alalım mı?", "Neye bakıyorsun?"],
                working: ["DOKUNMA KODLUYORUM!", "BU KİMİN KODU?!", "DERLENİYOR...!!!", "BÖCEK EZİYORUM!"],
                sleeping: ["Error: Brain Not Found", "System.exit(0)", "Zzz...", "404 Coffee Not Found"]
            }
        };

        this.config = Object.assign({}, defaults, options);
        this.config.messages = Object.assign({}, defaults.messages, options.messages || {});

        this.state = 'idle'; // Başlangıç durumu
        this.dom = {};       // DOM elementlerini tutacağımız obje
        this.intervals = {}; // setInterval referansları
        this.customSayTimer = null; // Özel mesajlar için zamanlayıcı
        
        // Kayan Yazı Zamanlayıcıları
        this.textTimer = null;     
        this.textDuration = null;

        // Kütüphaneyi başlat
        this.init();
    }

    /**
     * Gerekli CSS stillerini DOM'a enjekte eder.
     */
    injectStyles() {
        if (document.getElementById('coddy-styles')) return;

        const style = document.createElement('style');
        style.id = 'coddy-styles';
        style.innerHTML = `
            /* Kök Değişkenler - Tema Yönetimi İçin */
            .coddy-wrapper {
                --coddy-orange: #FF4D00;
                --coddy-red: #FF0000;
                --coddy-green: #10b981;
                --coddy-font: 'Fira Code', 'Courier New', monospace;

                /* Varsayılan Dark Tema Değişkenleri */
                --coddy-bg: #1e293b;
                --coddy-bubble-bg: #1e293b;
                --coddy-bubble-text: #FF4D00;
                --coddy-bubble-border: #334155;
                --coddy-visor: #000;
                --coddy-gray: #475569;
                --coddy-shadow: rgba(0,0,0,0.5);
                --coddy-working-bg: #0f172a;
                --coddy-sleeping-bg: #334155;
                --coddy-keyboard-bg: rgba(255, 77, 0, 0.1);
                --coddy-keyboard-border: rgba(255, 77, 0, 0.4);
                --coddy-hand-shadow-1: rgba(0,0,0,0.6);
                --coddy-hand-shadow-2: rgba(0,0,0,0.3);
                --coddy-body-sh-1: rgba(0,0,0,0.6);
                --coddy-body-sh-2: rgba(255,255,255,0.1);
                --coddy-body-sh-3: rgba(0,0,0,0.4);
                --coddy-visor-border: #334155;
                --coddy-visor-inner: rgba(0,0,0,1);
                
                /* Menü Özel Değişkenleri */
                --coddy-menu-hover: rgba(255,255,255,0.05);
            }

            .coddy-wrapper.coddy-theme-light {
                /* Açık Tema Değişkenleri */
                --coddy-bg: #f8fafc;
                --coddy-bubble-bg: #ffffff;
                --coddy-bubble-text: #ea580c;
                --coddy-bubble-border: #cbd5e1;
                --coddy-visor: #1e293b;
                --coddy-gray: #cbd5e1;
                --coddy-shadow: rgba(0,0,0,0.15);
                --coddy-working-bg: #e2e8f0;
                --coddy-sleeping-bg: #f1f5f9;
                --coddy-keyboard-bg: rgba(255, 77, 0, 0.05);
                --coddy-keyboard-border: rgba(255, 77, 0, 0.2);
                --coddy-hand-shadow-1: rgba(0,0,0,0.05);
                --coddy-hand-shadow-2: rgba(0,0,0,0.1);
                --coddy-body-sh-1: rgba(0,0,0,0.05);
                --coddy-body-sh-2: rgba(255,255,255,1);
                --coddy-body-sh-3: rgba(0,0,0,0.15);
                --coddy-visor-border: #cbd5e1;
                --coddy-visor-inner: rgba(0,0,0,0.4);
                --coddy-menu-hover: rgba(0,0,0,0.05);
            }

            .coddy-wrapper.coddy-theme-metallic {
                /* Metalik / Apple Gümüş & Uzay Grisi Tonları */
                --coddy-bg: #d1d5db; /* Alüminyum kasa rengi */
                --coddy-bubble-bg: #f3f4f6;
                --coddy-bubble-text: #ea580c;
                --coddy-bubble-border: #9ca3af;
                --coddy-visor: #1e293b;
                --coddy-gray: #9ca3af; /* Kollar (Koyu Gümüş) */
                --coddy-shadow: rgba(0,0,0,0.2);
                --coddy-working-bg: #cbd5e1;
                --coddy-sleeping-bg: #e5e7eb;
                --coddy-keyboard-bg: rgba(255, 77, 0, 0.08);
                --coddy-keyboard-border: rgba(255, 77, 0, 0.3);
                --coddy-hand-shadow-1: rgba(0,0,0,0.2);
                --coddy-hand-shadow-2: rgba(255,255,255,0.8);
                --coddy-body-sh-1: rgba(0,0,0,0.2); /* Kavis hissi veren iç gölge */
                --coddy-body-sh-2: rgba(255,255,255,1); /* Metalik parıltı (Highlight) */
                --coddy-body-sh-3: rgba(0,0,0,0.25); /* Yere düşen gölge */
                --coddy-visor-border: #9ca3af;
                --coddy-visor-inner: rgba(0,0,0,0.6);
                --coddy-menu-hover: rgba(0,0,0,0.05);
            }

            .coddy-wrapper {
                position: fixed;
                width: 100px;
                height: 120px;
                z-index: 2147483647;
                cursor: pointer;
                perspective: 1000px;
                font-family: var(--coddy-font);
                user-select: none;
            }
            
            /* pos sınıfları sadece balon/menü yönü için; offset değerleri inline atanır */

            .coddy-shadow {
                position: absolute;
                bottom: -10px; left: 50%; transform: translateX(-50%);
                width: 60px; height: 10px; background: var(--coddy-shadow);
                border-radius: 50%; filter: blur(4px);
                animation: coddy-shadow-breathe 2s ease-in-out infinite;
            }

            .coddy-bubble {
                position: absolute;
                bottom: 110px; right: -20px; /* Büyüme yönünü yukarı olarak değiştirir */
                max-width: 280px; /* Uzun paragraflar için genişlik limiti */
                width: max-content; /* Kısa kelimelerde balonu küçük tutar */
                background: var(--coddy-bubble-bg); color: var(--coddy-bubble-text);
                padding: 12px 16px; border-radius: 12px 12px 2px 12px;
                font-weight: 600; font-size: 13px; line-height: 1.5; /* Uzun metin okunabilirliği */
                box-shadow: 0 10px 25px var(--coddy-shadow), 0 0 0 1px var(--coddy-bubble-border);
                opacity: 0; transform: translateY(15px) scale(0.8);
                transform-origin: bottom right; pointer-events: auto; /* Balon içindeki yazılar seçilebilsin */
                white-space: normal; word-wrap: break-word; z-index: 50; /* Metin taşmalarını önler */
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .coddy-wrapper.pos-bottom-left .coddy-bubble {
                right: auto; left: -20px; border-radius: 12px 12px 12px 2px; transform-origin: bottom left;
            }
            .coddy-bubble.show { opacity: 1; transform: translateY(0) scale(1); }

            /* Dinamik Etkileşim Menüsü */
            .coddy-menu {
                position: absolute;
                bottom: 110px; right: 0;
                background: var(--coddy-bubble-bg);
                border: 1px solid var(--coddy-bubble-border);
                border-radius: 12px;
                box-shadow: 0 10px 25px var(--coddy-shadow);
                display: flex; flex-direction: column; overflow: hidden;
                min-width: 160px; z-index: 60;
                opacity: 0; transform: translateY(15px) scale(0.8);
                transform-origin: bottom right; pointer-events: none;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .coddy-wrapper.pos-bottom-left .coddy-menu {
                right: auto; left: 0; transform-origin: bottom left;
            }
            .coddy-menu.show { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

            .coddy-menu-item {
                padding: 10px 16px;
                color: var(--coddy-bubble-text);
                font-size: 13px; font-weight: 600;
                cursor: pointer; text-align: left;
                border-bottom: 1px solid var(--coddy-bubble-border);
                transition: background 0.2s;
            }
            .coddy-menu-item:last-child { border-bottom: none; }
            .coddy-menu-item:hover { background: var(--coddy-menu-hover); }

            /* Soru Sorma (Prompt) Paneli */
            .coddy-prompt {
                position: absolute;
                bottom: 110px; right: 0;
                background: var(--coddy-bubble-bg);
                border: 1px solid var(--coddy-bubble-border);
                border-radius: 12px;
                box-shadow: 0 10px 25px var(--coddy-shadow);
                padding: 12px;
                display: flex; flex-direction: column; gap: 8px;
                min-width: 220px; z-index: 70;
                opacity: 0; transform: translateY(15px) scale(0.8);
                transform-origin: bottom right; pointer-events: none;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .coddy-wrapper.pos-bottom-left .coddy-prompt {
                right: auto; left: 0; transform-origin: bottom left;
            }
            .coddy-prompt.show { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
            
            .coddy-prompt-title { font-size: 13px; font-weight: 600; color: var(--coddy-bubble-text); }
            .coddy-prompt-group { display: flex; gap: 6px; }
            
            .coddy-prompt-input { 
                flex: 1; padding: 8px 10px; font-size: 12px; 
                border: 1px solid var(--coddy-bubble-border); 
                border-radius: 6px; background: var(--coddy-bg); color: var(--coddy-bubble-text);
                outline: none; font-family: var(--coddy-font);
                transition: border-color 0.2s;
            }
            .coddy-prompt-input:focus { border-color: var(--coddy-orange); }
            
            .coddy-prompt-btn {
                background: var(--coddy-orange); color: white; border: none;
                border-radius: 6px; padding: 0 12px; cursor: pointer;
                font-weight: bold; font-size: 14px; transition: background 0.2s;
                display: flex; align-items: center; justify-content: center;
            }
            .coddy-prompt-btn:hover { background: var(--coddy-red); }

            .coddy-body {
                position: absolute; bottom: 20px; width: 76px; height: 80px;
                background: var(--coddy-bg); border-radius: 38px 38px 20px 20px;
                box-shadow: inset -4px -4px 10px var(--coddy-body-sh-1), inset 4px 4px 10px var(--coddy-body-sh-2), 0 15px 25px var(--coddy-body-sh-3);
                display: flex; flex-direction: column; align-items: center;
                animation: coddy-angry-float 2s ease-in-out infinite; z-index: 10;
                transition: background 0.3s, box-shadow 0.3s;
            }

            .coddy-visor {
                position: absolute; top: 20px; width: 60px; height: 30px;
                background: var(--coddy-visor); border-radius: 10px;
                box-shadow: inset 0 5px 15px var(--coddy-visor-inner), 0 0 0 2px var(--coddy-visor-border);
                display: flex; justify-content: center; align-items: center; overflow: hidden;
            }

            .coddy-eyes { display: flex; gap: 10px; transition: transform 0.1s ease-out; }
            .coddy-eye {
                width: 14px; height: 10px; background: var(--coddy-orange);
                box-shadow: 0 0 10px var(--coddy-orange), 0 0 20px #FFD500;
                border-radius: 2px; position: relative; transition: all 0.2s ease;
            }
            .coddy-eye.left { transform: rotate(15deg); clip-path: polygon(0 40%, 100% 0, 100% 100%, 0 100%); }
            .coddy-eye.right { transform: rotate(-15deg); clip-path: polygon(0 0, 100% 40%, 100% 100%, 0 100%); }

            .coddy-eyes.show-text .coddy-eye { opacity: 0; transform: scale(0); }
            .coddy-eyes::after {
                content: attr(data-text); 
                position: absolute;
                color: var(--coddy-orange); 
                font-size: 14px; 
                font-weight: 900;
                letter-spacing: 2px;
                text-shadow: 0 0 10px var(--coddy-orange), 0 0 20px #FFD500;
                opacity: 0; 
                pointer-events: none;
                white-space: nowrap;
                transform: translateX(60px);
            }
            .coddy-eyes.show-text::after { 
                opacity: 1; 
                animation: coddy-marquee var(--marquee-speed, 2.5s) linear forwards;
            }

            .coddy-keyboard {
                position: absolute; bottom: -5px; width: 90px; height: 25px;
                background: var(--coddy-keyboard-bg); border: 1px solid var(--coddy-keyboard-border);
                border-radius: 4px; transform: perspective(200px) rotateX(60deg);
                box-shadow: 0 0 15px rgba(255, 77, 0, 0.2); z-index: 5;
                display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(2, 1fr); gap: 2px; padding: 2px;
            }
            .coddy-key { background: rgba(255, 77, 0, 0.3); border-radius: 1px; transition: background 0.1s; }

            .coddy-hands { position: absolute; bottom: 10px; width: 100%; display: flex; justify-content: space-between; padding: 0 5px; z-index: 20; }
            .coddy-hand { width: 16px; height: 16px; background: var(--coddy-gray); border-radius: 50%; box-shadow: inset -2px -2px 5px var(--coddy-hand-shadow-1), 0 5px 10px var(--coddy-hand-shadow-2); transition: all 0.2s; }

            .coddy-bug { position: absolute; color: #ef4444; font-size: 10px; font-weight: bold; pointer-events: none; opacity: 0; z-index: 30; }

            .coddy-state-idle .coddy-hand.right { animation: coddy-tap-finger 0.4s infinite; }
            .coddy-state-idle .coddy-eye { animation: coddy-angry-blink 4s infinite; }

            .coddy-state-working .coddy-body { animation: coddy-rage-shake 0.15s infinite; background: var(--coddy-working-bg); box-shadow: 0 15px 30px rgba(255, 77, 0, 0.2); }
            .coddy-state-working .coddy-eye { height: 4px; background: var(--coddy-red); box-shadow: 0 0 15px var(--coddy-red), 0 0 30px var(--coddy-orange); }
            .coddy-state-working .coddy-keyboard { background: rgba(255, 0, 0, 0.2); border-color: rgba(255, 0, 0, 0.8); box-shadow: 0 0 20px rgba(255, 0, 0, 0.4); animation: coddy-keyboard-flash 0.1s infinite alternate; }
            .coddy-state-working .coddy-hand { animation: coddy-furious-typing 0.1s infinite alternate; }
            .coddy-state-working .coddy-hand.right { animation-delay: 0.05s; }

            .coddy-state-sleeping .coddy-body { transform: translateY(20px) rotate(15deg); animation: none; background: var(--coddy-sleeping-bg); }
            .coddy-state-sleeping .coddy-eye { height: 2px; background: #ef4444; box-shadow: none; transform: rotate(0); clip-path: none; animation: coddy-cursor-blink 1s infinite step-end; }
            .coddy-state-sleeping .coddy-keyboard { opacity: 0.2; box-shadow: none; }
            .coddy-state-sleeping .coddy-hand { transform: translateY(15px); animation: none; }
            .coddy-state-sleeping .coddy-shadow { transform: translateX(-50%) scale(1.2); opacity: 0.2; animation: none; }

            @keyframes coddy-shadow-breathe { 0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.5; } 50% { transform: translateX(-50%) scale(0.9); opacity: 0.4; } }
            @keyframes coddy-angry-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
            @keyframes coddy-tap-finger { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            @keyframes coddy-angry-blink { 0%, 94%, 98% { transform: scaleY(1); } 96% { transform: scaleY(0.2); } }
            @keyframes coddy-rage-shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 25% { transform: translate(-1px, -2px) rotate(-1deg); } 50% { transform: translate(-3px, 0px) rotate(1deg); } 75% { transform: translate(3px, 2px) rotate(0deg); } 100% { transform: translate(1px, -1px) rotate(-1deg); } }
            @keyframes coddy-furious-typing { 0% { transform: translate(-5px, 0); } 100% { transform: translate(5px, -8px); } }
            @keyframes coddy-keyboard-flash { 0% { opacity: 0.8; } 100% { opacity: 1; } }
            @keyframes coddy-cursor-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
            @keyframes coddy-bug-fly { 0% { transform: translate(0, 0) scale(0.5) rotate(0deg); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(45deg); opacity: 0; } }
            @keyframes coddy-marquee { 0% { transform: translateX(60px); opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { transform: translateX(calc(-100% - 10px)); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    buildDOM() {
        this.dom.wrapper = document.createElement('div');
        this.dom.wrapper.className = `coddy-wrapper pos-${this.config.position} coddy-theme-${this.config.theme} coddy-state-idle`;
        this.dom.wrapper.style.bottom = `${this.config.offsetY}px`;
        if (this.config.position === 'bottom-left') {
            this.dom.wrapper.style.left = `${this.config.offsetX}px`;
        } else {
            this.dom.wrapper.style.right = `${this.config.offsetX}px`;
        }
        
        const shadow = document.createElement('div');
        shadow.className = 'coddy-shadow';
        
        this.dom.bubble = document.createElement('div');
        this.dom.bubble.className = 'coddy-bubble';

        this.dom.menu = document.createElement('div');
        this.dom.menu.className = 'coddy-menu';

        // Prompt (Soru Sorma) Paneli
        this.dom.prompt = document.createElement('div');
        this.dom.prompt.className = 'coddy-prompt';
        this.dom.prompt.innerHTML = `
            <div class="coddy-prompt-title">Bana bir şey sor:</div>
            <div class="coddy-prompt-group">
                <input type="text" class="coddy-prompt-input" placeholder="Buraya yazın..." />
                <button class="coddy-prompt-btn">➜</button>
            </div>
        `;
        this.dom.promptTitle = this.dom.prompt.querySelector('.coddy-prompt-title');
        this.dom.promptInput = this.dom.prompt.querySelector('.coddy-prompt-input');
        this.dom.promptBtn = this.dom.prompt.querySelector('.coddy-prompt-btn');

        const body = document.createElement('div');
        body.className = 'coddy-body';

        this.dom.keyboard = document.createElement('div');
        this.dom.keyboard.className = 'coddy-keyboard';
        for(let i=0; i<12; i++) {
            const key = document.createElement('div');
            key.className = 'coddy-key';
            this.dom.keyboard.appendChild(key);
        }

        const visor = document.createElement('div');
        visor.className = 'coddy-visor';
        this.dom.eyes = document.createElement('div');
        this.dom.eyes.className = 'coddy-eyes';
        this.dom.eyes.innerHTML = '<div class="coddy-eye left"></div><div class="coddy-eye right"></div>';
        visor.appendChild(this.dom.eyes);

        const hands = document.createElement('div');
        hands.className = 'coddy-hands';
        hands.innerHTML = '<div class="coddy-hand left"></div><div class="coddy-hand right"></div>';

        this.dom.errorContainer = document.createElement('div');

        body.appendChild(this.dom.keyboard);
        body.appendChild(visor);
        body.appendChild(hands);
        
        this.dom.wrapper.appendChild(shadow);
        this.dom.wrapper.appendChild(this.dom.menu);
        this.dom.wrapper.appendChild(this.dom.prompt); // Prompt panelini ekle
        this.dom.wrapper.appendChild(this.dom.bubble);
        this.dom.wrapper.appendChild(body);
        this.dom.wrapper.appendChild(this.dom.errorContainer);

        document.body.appendChild(this.dom.wrapper);
        this.dom.keys = this.dom.keyboard.querySelectorAll('.coddy-key');
        
        if (this.config.menu) this.setMenu(this.config.menu);
    }

    bindEvents() {
        this._onMouseMove = (e) => {
            if (this.state !== 'idle') return;

            const rect = this.dom.wrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + 40;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            const panX = Math.max(-8, Math.min(8, deltaX / 20));
            const panY = Math.max(-4, Math.min(4, deltaY / 20));

            this.dom.eyes.style.transform = `translate(${panX}px, ${panY}px)`;
        };

        this._onDocClick = (e) => {
            if (this.dom.menu.classList.contains('show') && !this.dom.wrapper.contains(e.target)) {
                this.toggleMenu(false);
            }
            if (this.dom.prompt.classList.contains('show') && !this.dom.wrapper.contains(e.target)) {
                this.closePrompt();
            }
        };

        document.addEventListener('mousemove', this._onMouseMove);
        document.addEventListener('click', this._onDocClick);

        this.dom.wrapper.addEventListener('click', (e) => {
            if (this.dom.menu.contains(e.target) || this.dom.prompt.contains(e.target)) return;

            if (typeof this.config.onClick === 'function') {
                this.config.onClick(e, this);
            } else if (this.config.menu && this.config.menu.length > 0) {
                this.toggleMenu();
            }
        });

        this.dom.promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.dom.promptBtn.click();
        });
    }

    spawnBug() {
        if(this.state !== 'working') return;
        
        const bug = document.createElement('div');
        bug.className = 'coddy-bug';
        const bugTypes = ['TypeError', 'NaN', 'undefined', '; expected', 'NullPtr', '{}', '500'];
        bug.innerText = bugTypes[Math.floor(Math.random() * bugTypes.length)];
        
        bug.style.left = `${Math.random() * 60 + 10}px`;
        bug.style.bottom = '40px'; 
        
        const tx = (Math.random() - 0.5) * 100 + 'px';
        const ty = - (Math.random() * 80 + 40) + 'px';
        bug.style.setProperty('--tx', tx);
        bug.style.setProperty('--ty', ty);
        
        bug.style.animation = `coddy-bug-fly 1.5s ease-out forwards`;
        this.dom.errorContainer.appendChild(bug);

        setTimeout(() => {
            if(this.dom.errorContainer.contains(bug)) bug.remove();
        }, 1500);
    }

    /* =========================================================================
       PUBLIC API METOTLARI
       ========================================================================= */

    /**
     * Dinamik etkileşim menüsünü oluşturur ve doldurur
     */
    setMenu(menuItems) {
        if (!Array.isArray(menuItems)) return;
        this.config.menu = menuItems;
        this.dom.menu.innerHTML = ''; // Eski menüyü temizle
        
        menuItems.forEach(item => {
            const btn = document.createElement('div');
            btn.className = 'coddy-menu-item';
            btn.innerHTML = item.label;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof item.onClick === 'function') item.onClick(e, this);
                this.toggleMenu(false); // İşlem bitince menüyü kapat
            });
            this.dom.menu.appendChild(btn);
        });
    }

    /**
     * Menüyü açar veya kapatır
     */
    toggleMenu(forceState = null) {
        const isShowing = this.dom.menu.classList.contains('show');
        const willShow = forceState !== null ? forceState : !isShowing;

        if (willShow) {
            this.dom.bubble.classList.remove('show'); // Menü açılırken balonu gizle
            this.closePrompt(); // Menü açılırken promptu gizle
            this.dom.menu.classList.add('show');
        } else {
            this.dom.menu.classList.remove('show');
        }
    }

    /**
     * Soru sorma (Prompt) panelini açar ve kullanıcıdan yanıt bekler.
     * @param {string} title - Panel başlığı (örn: "Bana soru sor:")
     * @param {function} callback - Kullanıcı soruyu gönderdiğinde çalışacak fonksiyon
     */
    ask(title, callback) {
        this.toggleMenu(false); // Menü açıksa kapat
        this.dom.bubble.classList.remove('show'); // Balon açıksa kapat

        this.dom.promptTitle.innerText = title || 'Bana bir şey sor:';
        this.dom.promptInput.value = ''; // Eski yazıyı temizle
        this.dom.prompt.classList.add('show');
        
        // Inputa otomatik odaklan ki kullanıcı hemen yazabilsin (setTimeout gerekir CSS animasyonu için)
        setTimeout(() => this.dom.promptInput.focus(), 50);

        // Eski dinleyicileri temizlemek için onclick üzerine yazıyoruz
        this.dom.promptBtn.onclick = () => {
            const text = this.dom.promptInput.value.trim();
            if (text) {
                this.closePrompt();
                if (typeof callback === 'function') callback(text, this);
            } else {
                // Boşsa inputu kırmızı yapıp uyar
                this.dom.promptInput.style.borderColor = 'var(--coddy-red)';
                setTimeout(() => this.dom.promptInput.style.borderColor = '', 1000);
            }
        };
    }

    /**
     * Soru sorma panelini kapatır
     */
    closePrompt() {
        this.dom.prompt.classList.remove('show');
    }

    setTheme(theme) {
        if (!['dark', 'light', 'metallic'].includes(theme)) return;
        this.dom.wrapper.classList.remove('coddy-theme-dark', 'coddy-theme-light', 'coddy-theme-metallic');
        this.dom.wrapper.classList.add(`coddy-theme-${theme}`);
        this.config.theme = theme;
    }

    setState(newState, customMessage = null) {
        if (!['idle', 'working', 'sleeping'].includes(newState)) return;

        // Kayan yazı durumlarını temizle
        clearTimeout(this.textTimer);
        clearTimeout(this.textDuration);
        if (this.dom.eyes) this.dom.eyes.classList.remove('show-text');

        this.dom.wrapper.classList.remove(`coddy-state-${this.state}`);
        this.dom.wrapper.classList.add(`coddy-state-${newState}`);
        this.state = newState;

        clearInterval(this.intervals.bug);
        clearInterval(this.intervals.keys);
        clearTimeout(this.customSayTimer);
        this.dom.errorContainer.innerHTML = '';
        
        let message = customMessage;
        if (!message && this.config.messages[newState] && this.config.messages[newState].length > 0) {
            const pool = this.config.messages[newState];
            message = pool[Math.floor(Math.random() * pool.length)];
        }

        // State değiştiğinde menüyü ve promptu otomatik kapat
        this.toggleMenu(false);
        this.closePrompt();

        if (newState === 'working') {
            this.dom.bubble.innerHTML = message || 'Çalışıyorum...';
            this.dom.bubble.style.color = "var(--coddy-red)";
            this.dom.bubble.classList.add('show');
            
            this.intervals.bug = setInterval(() => this.spawnBug(), 300);
            this.intervals.keys = setInterval(() => {
                const rKey = this.dom.keys[Math.floor(Math.random() * this.dom.keys.length)];
                rKey.style.background = 'rgba(255,255,255,0.8)';
                setTimeout(() => rKey.style.background = 'rgba(255, 77, 0, 0.3)', 100);
            }, 50);

        } else if (newState === 'sleeping') {
            this.dom.bubble.innerHTML = message || 'Zzz...';
            this.dom.bubble.style.color = "var(--coddy-red)";
            this.dom.bubble.classList.add('show');
            this.dom.eyes.style.transform = `translate(0, 0)`; 
            
        } else {
            // Idle durumuna geçtiğinde kayan yazı döngüsünü aktif et
            this.scheduleTextAnimation();

            if (customMessage) {
                this.dom.bubble.innerHTML = customMessage;
                this.dom.bubble.style.color = "var(--coddy-bubble-text)";
                this.dom.bubble.classList.add('show');
            } else {
                this.dom.bubble.classList.remove('show');
            }
        }
    }

    say(text, duration = 3000) {
        clearTimeout(this.customSayTimer);
        this.dom.bubble.innerHTML = text;
        this.dom.bubble.style.color = this.state === 'working' ? 'var(--coddy-red)' : 'var(--coddy-bubble-text)';
        this.dom.bubble.classList.add('show');

        if (duration > 0) {
            this.customSayTimer = setTimeout(() => {
                if (this.state === 'idle') {
                    this.dom.bubble.classList.remove('show');
                } else {
                    this.setState(this.state); 
                }
            }, duration);
        }
    }

    showMarqueeText(text, customDuration = null) {
        clearTimeout(this.textDuration);
        clearTimeout(this.textTimer); 
        
        // Metnin ekranda kaplayacağı genişliği dinamik olarak hesapla
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = "900 14px 'Fira Code', 'Courier New', monospace"; // CSS'teki font ile eşleşmeli
        const textWidth = ctx.measureText(text).width;

        // Vizör Genişliği (60px) + Metin Genişliği
        // Kayan yazı hızını saniyede ~60 piksel olarak sabitle (Daha okunaklı)
        let calculatedDuration = ((textWidth + 60) / 60) * 1000;
        
        // Animasyonun çok hızlı bitmemesi için bir alt limit koy (min 2.5 sn)
        if (calculatedDuration < 2500) calculatedDuration = 2500;

        // Kullanıcı kendi özel bir süre gönderdiyse onu kullan, yoksa otomatiği al
        const finalDuration = customDuration || calculatedDuration;
        
        this.dom.eyes.setAttribute('data-text', text);
        this.dom.eyes.style.setProperty('--marquee-speed', `${finalDuration}ms`);
        
        // CSS animasyonunu tetiklemek için DOM yenilemesi (Reflow)
        this.dom.eyes.classList.remove('show-text');
        void this.dom.eyes.offsetWidth; 
        this.dom.eyes.classList.add('show-text');

        this.textDuration = setTimeout(() => {
            if (this.dom.eyes) this.dom.eyes.classList.remove('show-text');
            this.scheduleTextAnimation();
        }, finalDuration);
    }

    toggleRandomMarquee(isEnabled) {
        this.config.enableRandomMarquee = isEnabled;
        clearTimeout(this.textTimer);
        if (isEnabled) this.scheduleTextAnimation();
    }

    scheduleTextAnimation() {
        if (this.state !== 'idle') return;
        if (!this.config.marqueeText || !this.config.enableRandomMarquee) return;

        // 5-12 saniye arasında rastgele zaman
        const nextTime = Math.random() * 7000 + 5000;
        
        this.textTimer = setTimeout(() => {
            if (this.state === 'idle') {
                // Süreyi belirtmiyoruz, otomatik olarak hesaplanacak
                this.showMarqueeText(this.config.marqueeText);
            }
        }, nextTime);
    }

    destroy() {
        clearInterval(this.intervals.bug);
        clearInterval(this.intervals.keys);
        clearTimeout(this.customSayTimer);
        clearTimeout(this.textTimer);
        clearTimeout(this.textDuration);
        if (this._onMouseMove) document.removeEventListener('mousemove', this._onMouseMove);
        if (this._onDocClick) document.removeEventListener('click', this._onDocClick);
        if (this.dom.wrapper && this.dom.wrapper.parentNode) {
            this.dom.wrapper.parentNode.removeChild(this.dom.wrapper);
        }
    }

    init() {
        this.injectStyles();
        this.buildDOM();
        this.bindEvents();
        this.setState(this.state);
    }
}

    return Coddy;
}));