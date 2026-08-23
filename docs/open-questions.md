# Відкриті питання — 519 Barbershop

Зафіксовано після копіювання сайту з GoDaddy Airo (519barbershop.ca) в цю папку. 2026-08-18.

## 1. Форма контактів не працює

`index.html`, секція `#contact` — форма шле `POST /api/contact/contact-us`. Це internal API GoDaddy Airo, не існує поза платформою. TODO-коментар вже в коді перед `<form>`.

**Статус:** відкрито навмисно. За планом (`docs/ghl-roadmap` в памʼяті проєкту) форма буде замінена на нативну форму GoHighLevel при переносі сайту на GHL (Фаза E). До того часу не чіпати.

## 2. Домен у метаданих не збігається з реальним — ✅ вирішено (2026-08-23)

Прибрано дублікат `<link rel="canonical" href="https://519barbershop.com"/>`. `og:url` і всі `@id`/`url` в JSON-LD приведені до `https://519barbershop.ca/`. Лишився один canonical, на `.ca`.

## 3. Ліцензія на Getty-фото в галереї — ✅ вирішено (2026-08-23)

6 фото секції "Fresh Cuts, Every Time" (`images/gallery-1..6.jpg`) були Getty stock-фото, підключені через GoDaddy (`img1.wsimg.com/isteam/getty/...`).

Getty-фото `gallery-1/2/3/5` видалено. Галерея тепер складається з реальних фото барбершопу (`docs/Barber other files/to-gallery/`, опис — памʼять `barbershop_photo_inventory`): `gallery-4`, `gallery-6` (лишились з попередньої заміни) + `gallery-7..14`, `gallery-16..20` (нові). `images/gaming-arcade.jpg` теж вже реальне фото (IMG_7330), заміна від 2026-08-23.

## 4. Favicon — тимчасовий плейсхолдер — ✅ вирішено (2026-08-23)

`favicon.ico` тепер згенеровано з barber-pole іконки логотипу (`images/logo-horizontal.png`), multi-size ICO (16/32/48/64px) + `images/apple-touch-icon.png` (180px) підключено в `<head>`.
