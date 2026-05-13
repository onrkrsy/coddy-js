# Changelog

Tüm önemli değişiklikler bu dosyada tutulur. Format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) standardına dayanır, sürümleme [Semantic Versioning](https://semver.org/spec/v2.0.0.html) izler.

## [Unreleased]

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
