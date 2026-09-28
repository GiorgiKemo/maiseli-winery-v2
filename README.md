# Maiseli Winery — v2

A static, animated, single-page site for Maiseli Winery. The layout rhythm takes cues from frug.rs; the names, copy, photography, palette and motion are all Maiseli's own.

## Run

```
npm start        # http://localhost:4400 (Node only, no install needed)
npm run check    # JS syntax check
```

The folder deploys as-is to any static host: `index.html`, `css/`, `js/`, `assets/`, `vendor/`.

## What's inside

- **Preloader**: the Maiseli arch draws itself while the years count up from 1908, then the curtain opens.
- **Age gate**: remembered per browser.
- **Hero**: split-letter title, drifting golden dust, pointer parallax, and a scroll-out effect.
- **Wine stage**: 8 wines in 3 collections. The background colour shifts with each wine; you can browse with arrows, swipe, drag or the keyboard. Bottles tilt in 3D, and each wine opens a details dialog.
- **Story, May, Vineyard, Winemaking, Homeland, Cellar**: the arch-window image reveal, pinned "One who belongs to May" scene, a variety list with a cursor-following image, stacking cards, a horizontal 8,000-year timeline, and a zoom-through cellar gallery.
- **Motion**: GSAP 3 (ScrollTrigger and SplitText) with Lenis smooth scrolling, all vendored locally. Reduced-motion users get a static layout.

## Content sources

- All copy comes from `Maiseli Winery.docx`.
- Vintage, alcohol and "limited run of 1,500 bottles" are read from the bottle labels in the supplied photos.
- Bottles were cut out of their white backgrounds automatically. Photos are converted to WebP at two sizes.

## Before launch

- **Rkatsiteli Qvevri · French Oak**: no bottle photo, vintage or ABV was supplied. It uses a stand-in: the real Rkatsiteli bottle with the middle of its label reprinted "RKATSITELI QVEVRI · FRENCH OAK · bottle photograph coming soon". When the real photo arrives, replace `assets/img/bottle-rkatsiteli-oak.webp` and remove `placeholder: true` in `js/wines.js`.
- **Contact details, address and social links** were not supplied. The footer has a marked spot for them.
- Confirm the Georgian wordmark მაისელი with the winery.
