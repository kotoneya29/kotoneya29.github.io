#!/usr/bin/env python3
"""Render a static episode and archive card; never publish or edit live pages."""
import argparse
import datetime
import html
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "comics/templates"


def render(name, values):
    template = (TEMPLATES / name).read_text()
    def substitute(match):
        return values[match[1]]
    return re.sub(r"\{\{([A-Z0-9_]+)\}\}", substitute, template)


def build(data, output):
    # Actual image data is mandatory. An X URL or a mascot is not a substitute.
    images = data.get("images", [])
    if not images:
        raise ValueError("作品画像が未確認です。公式投稿の全画像を取得・照合してから実行してください。")
    from PIL import Image
    for item in images:
        path = (ROOT / item["file"]).resolve()
        if ROOT not in path.parents or not path.is_file():
            raise ValueError("リポジトリ内の作品画像が必要です: " + item["file"])
        if not item["file"].startswith("assets/comics/"):
            raise ValueError("作品画像は assets/comics/ に保存してください。")
        if not re.fullmatch(r"https://pbs\.twimg\.com/media/[^\s]+", item["source_url"]):
            raise ValueError("各画像の公式配信元URLを記録してください。")
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            if list(image.size) != [item["width"], item["height"]]:
                raise ValueError("画像の実寸とメタデータが一致しません: " + item["file"])
    if data.get("artwork_verified") is not True:
        raise ValueError("全ページ・文字・画像順序の目視照合が必要です。")
    number = data["episode"]
    if type(number) is not int or number < 1:
        raise ValueError("episode は1以上の整数です。")
    post = data["post_url"]
    if not re.fullmatch(r"https://x\.com/kotoneya29/status/[0-9]+", post):
        raise ValueError("公式投稿の恒久URL（クエリなし）が必要です。")
    date = datetime.date.fromisoformat(data["date_published"])
    episode_id = f"{number:03d}"
    canonical = f"https://kotoneya29.github.io/comics/{episode_id}/"
    thumbnail = images[data.get("thumbnail_index", 0)]
    # Same card crop as episode 7: use the whole source, let .thumb clip the top.
    thumbnail_url = "/" + thumbnail["file"]
    fields = {
        "EPISODE": str(number), "EPISODE_ID": episode_id,
        "EPISODE_PAD2": f"{number:02d}", "TITLE": data["title"],
        "SUMMARY": data["summary"], "TAGLINE": data["tagline"],
        "EXPLANATION": data["explanation"], "POST_URL": post,
        "DATE_LABEL": f"{date.year}年{date.month}月{date.day}日",
        "DATE_DOTS": date.strftime("%Y.%m.%d"), "CANONICAL": canonical,
        "THUMBNAIL_URL": thumbnail_url,
        "IMAGE_WIDTH": str(thumbnail["width"]),
        "IMAGE_HEIGHT": str(thumbnail["height"]),
        "IMAGE_COUNT": str(len(images)), "NEW_LABEL": " NEW",
    }
    values = {key: html.escape(value, quote=True) for key, value in fields.items()}
    schema = {
        "@context": "https://schema.org", "@type": "CreativeWork",
        "name": data["title"], "description": data["summary"],
        "inLanguage": "ja-JP", "url": canonical,
        "image": ["https://kotoneya29.github.io/" + item["file"] for item in images],
        "isPartOf": {"@type": "CreativeWorkSeries", "name": "ことねや式 日常の小さなズレ",
                     "url": "https://kotoneya29.github.io/comics/"},
        "datePublished": date.isoformat(), "sameAs": post,
    }
    schema_json = json.dumps(schema, ensure_ascii=False).replace("<", "\\u003c")
    values["STRUCTURED_DATA"] = '<script type="application/ld+json">' + schema_json + '</script>'
    values["TAGS"] = '<div class="tags">' + ''.join(
        '<span class="tag">' + html.escape(tag) + '</span>' for tag in data["tags"]) + '</div>'
    values["COMIC_FIGURE"] = render("figure.html.tmpl", values)
    links = f'<a href="/comics/{number - 1:03d}/">← 前の話</a>'
    links += '<a href="/comics/">バックナンバー一覧</a>'
    next_episode = data.get("next_episode")
    if next_episode is not None:
        if type(next_episode) is not int or next_episode <= number:
            raise ValueError("next_episode は公開済みの次話の整数です。")
        links += f'<a href="/comics/{next_episode:03d}/">次の話 →</a>'
    values["EPISODE_NAV"] = '<nav class="footer-nav" aria-label="前後の4コマ">' + links + '</nav>'
    # OGP must be absolute while the card may use a repository-local image.
    page_values = dict(values, THUMBNAIL_URL=html.escape(
        "https://kotoneya29.github.io" + thumbnail_url, quote=True))
    page = render("episode.html.tmpl", page_values)
    card = render("card.html.tmpl", values)
    output = output.resolve()
    if output == ROOT or ROOT in output.parents:
        raise ValueError("出力先は公開リポジトリの外（例: /workspace/work/comic-008）にしてください。")
    output.mkdir(parents=True, exist_ok=True)
    (output / "index.html").write_text(page)
    (output / "card.html").write_text(card)
    print(f"Generated {output}/index.html and card.html; no public files changed.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("metadata", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        build(json.loads(args.metadata.read_text()), args.output)
    except (ValueError, KeyError, OSError, IndexError) as error:
        sys.exit(str(error))
