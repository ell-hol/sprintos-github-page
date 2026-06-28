import { writeFileSync } from "node:fs"

const SITEMAP_URL = "https://sprintos.co/sitemap.xml"

function titleFromUrl(url) {
  const slug = url.split("/").filter(Boolean).at(-1) ?? "SprintOS"

  return slug
    .replace(/-/g, " ")
    .replace(/\bia\b/g, "IA")
    .replace(/\bllm\b/g, "LLM")
    .replace(/\bmcp\b/g, "MCP")
    .replace(/\bpme\b/g, "PME")
    .replace(/\bglm\b/g, "GLM")
    .replace(/\bbpifrance\b/g, "Bpifrance")
    .replace(/\bfable\b/g, "Fable")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function section(title, urls) {
  if (!urls.length) return ""

  const items = urls
    .map((url) => `      <li><a href="${url}">${titleFromUrl(url)}</a></li>`)
    .join("\n")

  return `
    <h2>${title}</h2>
    <ul>
${items}
    </ul>`
}

const response = await fetch(SITEMAP_URL)

if (!response.ok) {
  throw new Error(`Could not fetch sitemap: ${response.status} ${response.statusText}`)
}

const xml = await response.text()

const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => match[1].trim())
  .filter((url) => url.startsWith("https://sprintos.co/"))

const mainPages = urls.filter((url) => {
  const path = new URL(url).pathname
  return (
    path === "/" ||
    path === "/sprintai" ||
    path === "/methode" ||
    path === "/cas-dusage" ||
    path === "/diagnostic" ||
    path === "/blog" ||
    path === "/boite-a-outils" ||
    path === "/etudes-de-cas" ||
    path === "/glossaire" ||
    path === "/faq" ||
    path === "/contact"
  )
})

const blogPosts = urls.filter((url) => {
  const path = new URL(url).pathname
  return path.startsWith("/blog/") && path !== "/blog"
})

const tools = urls.filter((url) => {
  const path = new URL(url).pathname
  return path.startsWith("/boite-a-outils/")
})

const caseStudies = urls.filter((url) => {
  const path = new URL(url).pathname
  return path.startsWith("/etudes-de-cas/")
})

const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>SprintOS — IA, agents et automatisation pour PME françaises</title>
  <meta name="description" content="SprintOS aide les PME françaises à mettre en production des agents IA, des automatisations métier, SprintAI et des systèmes de test E2E.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="https://ell-hol.github.io/sprintos-github-page/">

  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      max-width: 820px;
      margin: 56px auto;
      padding: 0 20px;
      line-height: 1.6;
      color: #151515;
    }

    h1 {
      line-height: 1.15;
      font-size: 2.2rem;
      margin-bottom: 1rem;
      letter-spacing: -0.03em;
    }

    h2 {
      margin-top: 2rem;
      font-size: 1.35rem;
      letter-spacing: -0.02em;
    }

    a {
      color: #0645ad;
      text-underline-offset: 2px;
    }

    ul {
      padding-left: 1.25rem;
    }

    li {
      margin: 0.5rem 0;
    }
  </style>
</head>

<body>
  <main>
    <h1>SprintOS — IA, agents et automatisation pour PME françaises</h1>

    <p>
      <a href="https://sprintos.co/">SprintOS</a> accompagne les PME françaises dans la mise en production
      de cas d’usage IA concrets : automatisation de processus internes, agents IA, diagnostic d’opportunités,
      systèmes métier et tests E2E autonomes.
    </p>

    <p>
      L’approche est orientée résultat : identifier un cas d’usage utile, construire un premier prototype,
      l’intégrer aux outils existants, puis mesurer le gain opérationnel réel avant de généraliser.
    </p>

${section("Pages SprintOS", mainPages)}
${section("Articles du blog SprintOS", blogPosts)}
${section("Boîte à outils SprintOS", tools)}
${section("Études de cas SprintOS", caseStudies)}
  </main>
</body>
</html>
`

writeFileSync("index.html", html)
console.log(`Wrote index.html with ${urls.length} SprintOS URLs, including ${blogPosts.length} blog posts.`)
