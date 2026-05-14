# CLAUDE.md

Bu dosya Claude Code için proje rehberidir. Detaylı kullanım dokümantasyonu için `README.md`'ye bak.

## Proje özeti

**Coddy** — sayfanın köşesine oturan, **vanilla JS, sıfır bağımlılıklı** interaktif geliştirici maskotu. Tek bir `<script>` ile dahil edilen UMD widget'ı. Üç durum (`idle`/`working`/`sleeping`), üç tema (`dark`/`light`/`metallic`), marquee vizör, menü ve prompt input.

- Yazar: Onur Karasoy
- Lisans: MIT
- Versiyon: 0.1.0
- Hedef: ES5+ class syntax destekleyen modern tarayıcılar (Chrome/Firefox/Safari/Edge — IE yok)

## Yapı

```
src/coddy.js          # Tüm kütüphane — tek dosya, UMD wrapper, ~640 satır
examples/index.html   # Çalışan demo
package.json          # main: src/coddy.js
README.md / CHANGELOG.md / LICENSE
```

Build adımı **yok**. Bundler **yok**. Transpiler **yok**. Test runner **yok**. `src/coddy.js` doğrudan dağıtılır.

## `src/coddy.js` iç haritası

Tek `Coddy` sınıfı, UMD factory içinde sarılı. Önemli metodlar (yaklaşık satırlar):

| Metod | Satır | Ne yapar |
|---|---|---|
| `constructor` | ~22 | Defaults + options merge, `init()` çağırır |
| `injectStyles` | ~58 | `<style id="coddy-styles">` enjekte eder; CSS custom property tabanlı tema |
| `buildDOM` | ~338 | `.coddy-wrapper` ağacını kurar (gövde, kol, vizör, marquee, menü, prompt) |
| `bindEvents` | ~412 | Mouse takip, dış tık, click handler |
| `setState` | ~565 | `idle`/`working`/`sleeping` geçişleri, mesaj havuzundan rastgele seçim |
| `say` / `showMarqueeText` / `ask` / `setMenu` / `toggleMenu` / `setTheme` | — | Public API |
| `destroy` | ~696 | DOM, listener, timer temizliği |

State'e bağlı timer/interval'ler `this.intervals` ve `this.textTimer` üzerinde tutulur — `destroy()` bunları clear etmek zorunda; yeni timer eklersen orada da temizle.

## Komutlar

```bash
npm start    # http-server ile examples/index.html aç
npm test     # node --check src/coddy.js — sadece syntax doğrulama
```

Gerçek test suite'i yok; "test" sadece parse kontrolü.

## Bu projede uygulanan kurallar

- **Bağımlılık ekleme.** `package.json`'da `dependencies` ve `devDependencies` boş olmalı. Bir şeye ihtiyaç duyarsan önce kullanıcıya sor. `http-server` bile `npx --yes` ile çağrılıyor — npm registry'den indirilmiyor.
- **Build/transpile pipeline kurma.** Webpack/Rollup/Vite/Babel/TypeScript ekleme. Tek dosya UMD kalmalı.
- **Tek dosya prensibi.** `src/coddy.js`'i parçalara bölme. Yeni özellikler aynı dosyaya, mevcut sınıfa eklenmeli.
- **Türkçe kullanıcı metinleri ve kod yorumları.** Mesaj havuzları (`messages.idle/working/sleeping`), README, JSDoc yorumları Türkçe. Public API isimleri ve identifier'lar İngilizce. Bu karışım kasıtlı — değiştirme.
- **CSS custom properties ile tema.** Yeni tema = `.coddy-theme-{name}` selector'ü altında var override'ları. Inline style ile değişken set etme.
- **Public API geriye uyumluluk.** README'deki imzalar (`new Coddy(options)`, `setState`, `say`, `setTheme`, `showMarqueeText`, `toggleRandomMarquee`, `ask`, `setMenu`, `toggleMenu`, `destroy`) sözleşmedir. Değiştirme; ekle.
- **`destroy()` temizliği.** Yeni global listener veya timer eklersen `destroy()`'da temizliğini de ekle — aksi halde SPA route geçişlerinde leak olur.
- **`say()` HTML'i escape etmiyor.** Kasıtlı (`<br>` desteklemek için). Kullanıcı girdisi geçtiğin yerde dokümantasyonda uyar ya da kendi escape'in yapılsın — kütüphane içinde `innerHTML` kullanımını çoğaltma.

## Yeni özellik eklerken kontrol listesi

1. `src/coddy.js`'in ilgili bölümüne ekle (style → `injectStyles`, DOM → `buildDOM`, behavior → metod).
2. Public method ise README'deki "API" bölümüne imza + örnek ekle.
3. Yeni timer/listener → `destroy()`'a temizliği.
4. `examples/index.html` demoyu güncelle (görsel doğrulama için).
5. `CHANGELOG.md`'ye Unreleased altına not düş.
6. `package.json` versiyonunu sen artırma — release sırasında elle yapılır.

## Kullanıcı hakkında

Onur Karasoy — TokenFlex (Token Finansal Teknolojiler) backend ekibi. Asıl iş .NET mikroservisleri; Coddy onun **kişisel açık kaynak projesi** (klasör adı `benim/ozel/coddyjs`). TokenFlex'e özel skill'ler (CQRS, SQL vb.) bu repo için **alakasız** — burada vanilla JS ve UMD widget bağlamında çalış.
