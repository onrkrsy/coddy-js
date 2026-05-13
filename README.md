<div align="center">

# Coddy

**Sayfanızın köşesine oturan, sıfır bağımlılıklı interaktif geliştirici maskotu.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](CHANGELOG.md)
[![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](package.json)
[![Vanilla JS](https://img.shields.io/badge/vanilla-js-yellow.svg)](src/coddy.js)

</div>

Coddy; web projelerinize tek bir `<script>` etiketiyle dahil edebileceğiniz, herhangi bir framework veya CSS kütüphanesine bağlı olmayan bir maskot widget'ıdır. Uzun süren API çağrılarında "çalışıyorum" hissi vermek, kullanıcıya bildirim göstermek ya da projeye biraz karakter katmak için tasarlandı.

```js
const bot = new Coddy({ theme: 'dark' });
bot.setState('working', 'API CEVAP VERMİYOR!');
```

## İçindekiler

- [Özellikler](#özellikler)
- [Kurulum](#kurulum)
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Yapılandırma](#yapılandırma)
- [API](#api)
- [Durumlar ve Temalar](#durumlar-ve-temalar)
- [Örnekler](#örnekler)
- [Tarayıcı Desteği](#tarayıcı-desteği)
- [Proje Yapısı](#proje-yapısı)
- [Geliştirme](#geliştirme)
- [Katkı](#katkı)
- [Lisans](#lisans)

## Özellikler

- **Sıfır bağımlılık.** jQuery, React, Tailwind, hiçbir şey gerekmez. Tek bir JS dosyası, ~33 KB.
- **Üç durum:** `idle` (etrafa bakar), `working` (sinirli sinirli yazar, böcek saçar), `sleeping` (yatar uyur).
- **Üç gömülü tema:** `dark`, `light`, `metallic`.
- **Marquee efekti.** Vizörden cyberpunk havalı kayan yazı geçirir; süreyi metne göre otomatik hesaplar.
- **Dinamik menü.** Maskota tıklayınca açılan tıklanabilir liste.
- **Prompt input.** Kullanıcıdan tek satırlık metin almak için inline soru kutusu.
- **UMD bundle.** `<script>` tag'iyle, CommonJS ile veya AMD ile yüklenebilir.
- **Temiz unmount.** `destroy()` ile DOM, listener'lar ve timer'lar tamamen temizlenir.

## Kurulum

### Doğrudan tarayıcı (önerilen)

[`src/coddy.js`](src/coddy.js)'i indirin, projenize atın:

```html
<script src="path/to/coddy.js"></script>
<script>
    const bot = new Coddy();
</script>
```

### npm

> Not: paket henüz npm registry'de yayında değil; yayınlandığında bu blok geçerli olacak.

```bash
npm install coddy
```

```js
const Coddy = require('coddy');
// veya
import Coddy from 'coddy';

const bot = new Coddy();
```

### CDN (yayınlandıktan sonra)

```html
<script src="https://unpkg.com/coddy@latest/src/coddy.js"></script>
```

## Hızlı Başlangıç

```html
<!DOCTYPE html>
<html lang="tr">
<body>
    <script src="src/coddy.js"></script>
    <script>
        const bot = new Coddy({
            position: 'bottom-right',
            theme: 'dark',
            marqueeText: 'READY'
        });
    </script>
</body>
</html>
```

Bu kadar. Sağ alt köşede maskot belirir.

## Yapılandırma

`new Coddy(options)` aşağıdaki seçenekleri kabul eder:

| Seçenek | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `position` | `string` | `'bottom-right'` | `'bottom-right'` veya `'bottom-left'`. |
| `offsetX` | `number` | `50` | Yatay kenardan boşluk (px). |
| `offsetY` | `number` | `40` | Alttan boşluk (px). |
| `theme` | `string` | `'dark'` | `'dark'`, `'light'` veya `'metallic'`. |
| `onClick` | `function` | `null` | Maskota tıklandığında çalışır. `(event, instance) => void`. Set edilmişse `menu` tıklamayı tetiklemez. |
| `menu` | `array` | `null` | `{ label, onClick }` listesi. `onClick` set edilmediyse tıklama menüyü açar. |
| `marqueeText` | `string` | `null` | Vizörden geçen kayan yazı. Boşsa kendiliğinden geçmez. |
| `enableRandomMarquee` | `boolean` | `true` | `marqueeText` set ise idle modda 5-12 sn aralıkla kendiliğinden geçer. |
| `messages` | `object` | havuz | `idle`, `working`, `sleeping` mesaj havuzları. Aşağıya bakın. |

### `messages`

Her durum için rastgele seçilecek mesaj listesi tutar. Sadece istediğiniz durumu override edebilirsiniz; diğerleri varsayılan havuzunu korur.

```js
new Coddy({
    messages: {
        working: ['DERLENİYOR!', 'BUG AVI...']
    }
});
```

## API

Bir `Coddy` örneği üzerinden çalışma zamanında her şeyi kontrol edebilirsiniz.

### `setState(state, customMessage?)`

Maskotun durumunu değiştirir. `state` üçünden biri olmalı: `'idle'`, `'working'`, `'sleeping'`. Mesaj vermezseniz ilgili havuzdan rastgele biri seçilir.

```js
bot.setState('working');
bot.setState('working', 'API CEVAP VERMİYOR!');
bot.setState('idle');
```

### `say(text, duration?)`

Geçici bir mesaj balonu gösterir. `duration` ms sonra otomatik kaybolur (varsayılan: `3000`). `0` verirseniz kalıcı kalır. HTML kabul eder (`<br>`, `<b>` vb.) — kullanıcı girdisi bastırıyorsanız mutlaka escape edin.

```js
bot.say('Veriler kaydedildi');
bot.say('Hata: bağlantı koptu', 5000);
```

### `setTheme(theme)`

Tema'yı çalışma anında değiştirir. `'dark' | 'light' | 'metallic'`.

```js
bot.setTheme('light');
```

### `showMarqueeText(text, duration?)`

Vizörde tek seferlik kayan yazı oynatır. Süre vermezseniz metin uzunluğuna göre hesaplar (~60 px/sn, min 2.5 sn).

```js
bot.showMarqueeText('DEPLOY OK');
```

### `toggleRandomMarquee(isEnabled)`

Idle'dayken kendiliğinden geçen marquee döngüsünü açar/kapatır.

```js
bot.toggleRandomMarquee(false);
```

### `ask(title, callback)`

Maskotun yanına bir input açar, kullanıcı yazıp Enter'a basınca veya butona tıklayınca callback çalışır. Boş gönderim engellenir.

```js
bot.ask('Aramak istediğin nedir?', (cevap, bot) => {
    bot.setState('working');
    fetch('/search?q=' + encodeURIComponent(cevap))
        .then(r => r.json())
        .then(data => {
            bot.setState('idle');
            bot.say(data.summary, 6000);
        });
});
```

### `setMenu(items)`

Menüyü çalışma zamanında değiştirir.

```js
bot.setMenu([
    { label: 'Uyut', onClick: (e, b) => b.setState('sleeping') },
    { label: 'Uyandır', onClick: (e, b) => b.setState('idle') }
]);
```

### `toggleMenu(forceState?)`

Menüyü manuel olarak açar/kapatır. Argüman vermezseniz toggle yapar, `true`/`false` ile zorlar.

```js
bot.toggleMenu();      // toggle
bot.toggleMenu(true);  // aç
bot.toggleMenu(false); // kapat
```

### `destroy()`

Maskotu DOM'dan kaldırır, document-level listener'ları ve aktif timer'ları temizler. SPA'larda route değişiminde çağırın.

```js
bot.destroy();
```

## Durumlar ve Temalar

### Durumlar

| State | Açıklama |
| --- | --- |
| `idle` | Etrafa bakar, fareyi takip eder, ara sıra mesaj veya marquee gösterir. |
| `working` | Klavyede titrer, gözleri kırmızıya döner, etrafa böcek/hata mesajları saçar. |
| `sleeping` | Yana yıkılır, gözleri yanıp söner. |

### Temalar

| Tema | Görünüm |
| --- | --- |
| `dark` | Koyu slate gövde, turuncu vurgular. Varsayılan. |
| `light` | Açık tonlar, gri gövde. |
| `metallic` | Alüminyum gümüş tonları (Apple esintili). |

## Örnekler

### Form gönderiminde durum eşleme

```js
const bot = new Coddy();

document.querySelector('#myForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    bot.setState('working');
    try {
        await sendForm();
        bot.setState('idle');
        bot.say('Gönderildi.');
    } catch (err) {
        bot.setState('working', 'HATA: ' + err.message);
        setTimeout(() => bot.setState('idle'), 4000);
    }
});
```

### Menü + Prompt + State zinciri

```js
const bot = new Coddy({
    theme: 'metallic',
    marqueeText: 'AI READY',
    menu: [
        {
            label: 'Bana bir şey sor',
            onClick: (e, b) => {
                b.ask('Konu?', async (q) => {
                    b.setState('working');
                    const r = await fetch('/api/ask?q=' + encodeURIComponent(q));
                    const data = await r.json();
                    b.setState('idle');
                    b.say(data.answer, 6000);
                });
            }
        },
        { label: 'Uyut', onClick: (e, b) => b.setState('sleeping') },
        { label: 'Uyandır', onClick: (e, b) => b.setState('idle') }
    ]
});
```

Çalışan tam örnek için [`examples/index.html`](examples/index.html) dosyasına bakın.

## Tarayıcı Desteği

Güncel Chrome, Firefox, Safari ve Edge. CSS custom properties, flexbox ve `clip-path` kullanır; Internet Explorer desteği yoktur.

## Proje Yapısı

```
coddy/
├── src/
│   └── coddy.js          # Kütüphanenin kendisi (UMD)
├── examples/
│   └── index.html        # Çalışan demo
├── package.json
├── README.md
├── CHANGELOG.md
├── LICENSE
└── .gitignore
```

## Geliştirme

Build adımı yok — vanilla JS, doğrudan `src/coddy.js`'i düzenleyin.

Demoyu lokal olarak çalıştırmak için:

```bash
npm start
```

Bu komut bir HTTP sunucusu başlatır ve `examples/` klasörünü açar.

Syntax doğrulaması:

```bash
npm test
```

## Katkı

Pull request'ler memnuniyetle kabul edilir. Büyük değişiklikler için önce bir issue açıp ne yapmak istediğinizi tartışın.

1. Repo'yu fork edin.
2. Feature branch oluşturun (`git checkout -b feature/some-thing`).
3. Değişikliklerinizi commit edin.
4. PR açın, ne yaptığınızı kısaca anlatın.

`CHANGELOG.md`'ye not eklemeyi unutmayın.

## Lisans

[MIT](LICENSE) © 2026 Onur Karasoy
