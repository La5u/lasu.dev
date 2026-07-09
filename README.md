# lasu.dev

Personal website.

## Structure

- `index.html` - Main site
- `blog/` - Blog (built from hugo-blog/)
- `hugo-blog/` - Hugo blog source
- `clearframe/` - ClearFrame browser extension landing page
- `right-side-comments/` - Browser extension landing page
- `recommendations/` - Static recommendation pages

## Development

```bash
# Serve main site
npx serve .

# Build blog
cd hugo-blog && hugo
```

## Deployment

Pushed to Cloudflare Pages automatically.

## TODO

- Add a reproducible, repository-owned Cloudflare build configuration for the Hugo blog and generated sitemap dates.
- Establish site-wide design tokens and apply them to the remaining page-specific styles.
- Replace Font Awesome and particles.js CDN dependencies with local or inline assets where appropriate.
- Replace the Right Side Comments runtime GitHub release lookup with a deploy-time version value.
