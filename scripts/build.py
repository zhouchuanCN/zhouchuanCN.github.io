#!/usr/bin/env python3
"""Build the static homepage using only Python's standard library."""

import json
import shutil
from html import escape
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent


def safe_url(url):
    if urlparse(url).scheme != "https":
        raise ValueError(f"Publication links must use HTTPS: {url}")
    return escape(url, quote=True)


def author_list(authors):
    return ", ".join(
        f"<strong>{escape(author)}</strong>"
        if author.rstrip("*") == "Chuan Zhou"
        else escape(author)
        for author in authors
    )


def publication_html(paper):
    title = escape(paper["title"])
    links = paper["links"]
    if links.get("Paper"):
        title = (
            f'<a href="{safe_url(links["Paper"])}" target="_blank" '
            f'rel="noopener noreferrer">{title}</a>'
        )
    resources = " ".join(
        f'<a href="{safe_url(url)}" target="_blank" rel="noopener noreferrer" '
        f'aria-label="{escape(label)}: {escape(paper["title"], quote=True)}">'
        f'{escape(label)} <svg class="icon" aria-hidden="true">'
        '<use href="#icon-arrow"/></svg></a>'
        for label, url in links.items()
    )
    distinction = (
        f'<span class="distinction">{escape(paper["distinction"])}</span>'
        if paper.get("distinction") else ""
    )
    return f"""
<article class="publication" id="paper-{escape(paper["id"], quote=True)}"
  data-selected="{str(paper["selected"]).lower()}" data-topic="{escape(paper["topic"], quote=True)}">
  <div class="publication-venue">
    <span class="venue-badge">{escape(paper["venue"])}</span>
    <span class="publication-year">{paper["year"]}</span>
  </div>
  <div class="publication-content">
    <h3>{title}</h3>
    <p class="publication-authors">{author_list(paper["authors"])}</p>
    <p class="publication-journal">{escape(paper["venue_full"])}, {paper["year"]}.</p>
    <div class="publication-links">{resources}{distinction}</div>
  </div>
</article>"""


def main():
    papers = json.loads((ROOT / "data/publications.json").read_text(encoding="utf-8"))
    ids = [paper["id"] for paper in papers]
    if len(ids) != len(set(ids)):
        raise ValueError("Publication IDs must be unique.")
    content = (ROOT / "templates/index.html").read_text(encoding="utf-8")
    content = content.replace("__PUBLICATIONS__", "\n".join(map(publication_html, papers)))
    content = content.replace("__PUBLICATION_COUNT__", str(len(papers)))
    content = content.replace("__SELECTED_COUNT__", str(sum(paper["selected"] for paper in papers)))
    (ROOT / "index.html").write_text(content, encoding="utf-8")
    # GitHub Actions deploys only public files, never build scripts or review notes.
    output = ROOT / "_site"
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()
    for filename in ("index.html", ".nojekyll"):
        shutil.copy2(ROOT / filename, output / filename)
    shutil.copytree(ROOT / "assets", output / "assets")
    print(f"Built homepage with {len(papers)} publications.")
    print(f"GitHub Pages output: {output}")


if __name__ == "__main__":
    main()
