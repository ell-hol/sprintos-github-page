# SprintOS GitHub Pages backlink page

Minimal static GitHub Pages page for SprintOS.

## Deploy

Create a public repo, for example:

```bash
gh repo create sprintos --public --clone
cp index.html sprintos/
cd sprintos
git add index.html
git commit -m "Add SprintOS page"
git push origin main
```

Then enable:

Settings → Pages → Deploy from branch → main → /root

Final URL:

```text
https://YOUR_GITHUB_USERNAME.github.io/sprintos/
```

Replace `YOUR_GITHUB_USERNAME` in `index.html` after you know the exact URL.
