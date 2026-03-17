# Site images (WordPress backgrounds and assets)

These images were brought in from the Atrium Court WordPress site so backgrounds and icons load from your own site instead of external URLs.

**Source:** Run `node scripts/download-wp-images.js` to re-download from `atriumcourtseattle.com`.

**Sharpness:** Hero and full-width background images will look blurry or pixelated if they are smaller than the viewport. For crisp results, use images at least **1920px wide** (or **2560px** for large screens). Replace those files with higher-resolution versions of the same image to fix blur.

- **Home page hero** (`home-hero.png`): If the main hero looks pixelated, replace this file with the same aerial/sunset image at **1920px wide or larger** (2560px is better for large or Retina screens).
- Other hero/CTA images: `availability-hero.png`, `live-othello-hero.png`, etc.—same rule: use 1920px+ width for sharpness.

**Missing (404 from WordPress):** If the logo or any image is missing, add it manually:

- `Atrium-Court-Logo.png` – used in Header and Footer (WordPress: 2024/08)
- `Atrium-Court-Rendering-1.jpg` – home hero fallback (WordPress: 2024/08)
- `S2INSIDE2.jpg` – home “Affordable Housing” section (WordPress: 2025/11). The home page currently uses `DSC05454-home.jpg` for that section instead.
