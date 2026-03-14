# lasu.dev

Personal website.

## Structure

- `index.html` - Main site
- `blog/` - Blog (built from hugo-blog/)
- `hugo-blog/` - Hugo blog source
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
