# Public Asset Guide

This guide explains the replaceable files inside `public/`. Keep the same filename when replacing an asset unless you also update the code reference.

## Files That Should Keep Their Exact Names

- `public/favicon.ico`: Browser favicon.
- `public/favicon.png`: PNG favicon used by browsers and social previews.
- `public/robots.txt`: Search engine crawl rules.
- `public/sitemap.xml`: Public route index for search engines.
- `public/.well-known/bimi/praeliator.svg`: BIMI email logo. This path is part of the BIMI standard.

## Brand Assets

- `public/praeliator-gold-monogram-logo.png`: Main gold monogram logo used where a raster logo is needed.
- `public/praeliator-gold-monogram-logo.svg`: Vector version of the gold monogram logo.
- `public/praeliator-gold-wordmark-full.png`: Full Praeliator wordmark used in headers.
- `public/praeliator-gold-monogram-mark.svg`: Monogram mark used in compact brand moments.
- `public/praeliator-gold-laurel-mark.svg`: Laurel mark used by the header/menu system.
- `public/praeliator-menu-mini-laurel-mark.svg`: Small menu laurel mark.
- `public/praeliator-ownership-record-seal.png`: Ownership/authentication seal used in private ownership moments.
- `public/brand/monogram/leaf-*.svg`: Individual animated wreath leaves.
- `public/brand/monogram/praeliator-menu-wreath-clubmark.svg`: Menu wreath clubmark.

## Homepage Images

- `public/images/homepage-cinematic-hero-poster.jpg`: Poster and preload image for the opening homepage cinematic.
- `public/images/homepage-secondary-video-poster.jpg`: Secondary homepage poster image.
- `public/images/homepage-material-gallery-reference.jpg`: Material/reference image used in the homepage media set.
- `public/images/private-acquisition-presentation-poster.jpg`: Poster image for private acquisition presentation media.

## VIS Product Images

- `public/images/vis-glove-hero.jpg`: Main VIS glove/object image.
- `public/images/vis-leather-material-closeup.jpg`: Leather/material closeup.
- `public/images/vis-logo-construction-detail.jpg`: Logo and construction detail.
- `public/images/vis-packaging-presentation.jpg`: Packaging and ownership presentation image.
- `public/images/praeliator-video-loading-mark.svg`: Discreet loading mark shown while video media resolves.

## Homepage And Product Videos

Each main video can have up to four related files:

- `.mp4`: Desktop/full source.
- `-ios.mp4`: iPhone/touch-friendly source.
- `-lite.mp4`: Lightweight fallback motion source.
- `.avif`: Animated image fallback when available.

Current sets:

- `public/videos/homepage-boxing-as-art-hero.*`: First homepage cinematic.
- `public/videos/homepage-vis-flagship-glove.*`: VIS homepage product film.
- `public/videos/vis-leather-material-study.*`: Leather/material film.
- `public/videos/ownership-record-packaging-archive.*`: Ownership/packaging film.
- `public/videos/private-acquisition-correspondence.*`: Private acquisition film.
- `public/videos/vis-product-object-study.*`: Object Record and VIS study film.

## Unused Reference Thumbnails

These files are retained but not currently assigned to a main page section:

- `public/images/unused-gallery-thumbnail-02.jpg`
- `public/images/unused-gallery-thumbnail-04.jpg`
- `public/images/unused-gallery-thumbnail-05.jpg`
- `public/images/unused-gallery-thumbnail-07.jpg`
- `public/images/unused-gallery-thumbnail-08.jpg`
- `public/images/unused-gallery-thumbnail-10.jpg`

