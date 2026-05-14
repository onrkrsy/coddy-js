# Changelog

Tüm önemli değişiklikler bu dosyada tutulur. Format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) standardına dayanır, sürümleme [Semantic Versioning](https://semver.org/spec/v2.0.0.html) izler.

## [Unreleased]

### Eklendi
- Mikro etkileşimler: idle'da hover'da gözler büyür/parlar, çift tıkta 1.5 sn'lik geçici "öfke" reaksiyonu, sağ tıkta `onContextMenu` callback veya snarky balon.
- `onContextMenu` config option'ı — sağ tık handler'ı.
- `autoSleepTimeout` config option'ı — N saniye etkileşim yoksa idle'dan otomatik `sleeping`'e geçiş.
- `setEyes(expression)` API'si — `normal | wink | shock | heart | tired | angry | star` göz ifadeleri. `setState` çağrılınca otomatik normale döner.
- Yeni state: `celebrating` — zıplama animasyonu, eller havada, yıldız gözler, konfeti efekti. 2.5 sn sonra otomatik `idle`'a döner. Mesaj havuzu `messages.celebrating`.
- `observe(promise, opts?)` API'si — pending → working, resolved → celebrating, rejected → working(error) → idle. Promise'i pass-through eder.
- Sürükle-bırak desteği — `draggable: true` (varsayılan) ile maskotu fare/dokunmatik ile taşıma. 6 px eşik, tıklama ile çakışmaz.
- `persistPosition: true` (varsayılan) — sürüklenen pozisyon `localStorage`'da `coddy-position` anahtarıyla saklanır.

## [0.1.0] - 2026-05-13

İlk public sürüm.

### Eklendi
- `Coddy` sınıfı, `new Coddy(options)` ile başlatma.
- Üç durum: `idle`, `working`, `sleeping`.
- Üç tema: `dark`, `light`, `metallic`.
- `setState`, `say`, `setTheme`, `showMarqueeText`, `toggleRandomMarquee`, `ask`, `setMenu`, `destroy` public API.
- Vizörde kayan yazı (marquee) efekti, metin uzunluğuna göre otomatik süre.
- Dinamik menü ve kullanıcı input prompt'u.
- UMD wrapper — `<script>`, CommonJS ve AMD ortamlarında çalışır.
- `examples/index.html` ile demo sayfası.
