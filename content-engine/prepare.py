"""
Parameterized article evaluator for the content engine.
Adapted from autoresearch/prepare.py with CLI-configurable keywords and word counts.

Usage:
  python content-engine/prepare.py article.html --keywords "claude,law firm" --min-words 400 --max-words 800
  python content-engine/prepare.py article.html --json  # JSON output for pipeline parsing
"""

import os
import re
import sys
import json
import math
import argparse
from html.parser import HTMLParser

# Score weights (same as autoresearch)
WEIGHTS = {
    "readability": 0.20,
    "seo_score": 0.20,
    "content_depth": 0.25,
    "engagement": 0.20,
    "structure": 0.15,
}


class ArticleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.headings = []
        self.links = []
        self.current_tag = None
        self.current_data = []
        self.paragraphs = []
        self.lists = 0
        self.blockquotes = 0
        self.strong_count = 0
        self.em_count = 0
        self.tag_stack = []
        self._in_heading = False
        self._in_link = False
        self._heading_text = []
        self._link_text = []
        self._link_href = ""
        self._para_text = []
        self._in_para = False

    def handle_starttag(self, tag, attrs):
        self.tag_stack.append(tag)
        attrs_dict = dict(attrs)
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._in_heading = True
            self._heading_text = []
            self.current_tag = tag
        if tag == "a":
            self._in_link = True
            self._link_text = []
            self._link_href = attrs_dict.get("href", "")
        if tag == "p":
            self._in_para = True
            self._para_text = []
        if tag in ("ul", "ol"):
            self.lists += 1
        if tag == "blockquote":
            self.blockquotes += 1
        if tag == "strong":
            self.strong_count += 1
        if tag == "em":
            self.em_count += 1

    def handle_endtag(self, tag):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self._in_heading:
            text = " ".join(self._heading_text).strip()
            self.headings.append((tag, text))
            self._in_heading = False
        if tag == "a" and self._in_link:
            text = " ".join(self._link_text).strip()
            self.links.append((self._link_href, text))
            self._in_link = False
        if tag == "p" and self._in_para:
            text = " ".join(self._para_text).strip()
            if text:
                self.paragraphs.append(text)
            self._in_para = False

    def handle_data(self, data):
        self.text_parts.append(data)
        if self._in_heading:
            self._heading_text.append(data)
        if self._in_link:
            self._link_text.append(data)
        if self._in_para:
            self._para_text.append(data)

    def get_full_text(self):
        return " ".join(self.text_parts)


def parse_article(html_content):
    parser = ArticleParser()
    parser.feed(html_content)
    return parser


def count_words(text):
    return len(text.split())


def count_sentences(text):
    sentences = re.split(r'[.!?]+', text)
    return len([s for s in sentences if s.strip()])


def count_syllables(word):
    word = word.lower().strip()
    if not word:
        return 0
    if len(word) <= 3:
        return 1
    if word.endswith("e"):
        word = word[:-1]
    vowels = "aeiouy"
    count = 0
    prev_vowel = False
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    return max(1, count)


def flesch_kincaid_grade(text):
    words = text.split()
    word_count = len(words)
    if word_count == 0:
        return 0
    sentence_count = count_sentences(text)
    if sentence_count == 0:
        return 0
    syllable_count = sum(count_syllables(w) for w in words)
    grade = (0.39 * (word_count / sentence_count) +
             11.8 * (syllable_count / word_count) - 15.59)
    return max(0, grade)


def score_readability(text):
    grade = flesch_kincaid_grade(text)
    if grade == 0:
        return 0
    ideal = 10
    distance = abs(grade - ideal)
    if distance <= 2:
        score = 100 - (distance * 5)
    elif distance <= 4:
        score = 90 - ((distance - 2) * 10)
    elif distance <= 6:
        score = 70 - ((distance - 4) * 10)
    else:
        score = max(20, 50 - ((distance - 6) * 5))
    return min(100, max(0, score))


def score_seo(parsed, full_text, target_keywords, min_words, max_words):
    text_lower = full_text.lower()
    word_count = count_words(full_text)
    if word_count == 0:
        return 0

    score = 0
    ideal_min = int(min_words + (max_words - min_words) * 0.3)
    ideal_max = int(min_words + (max_words - min_words) * 0.8)

    # Keyword density
    keyword_hits = 0
    for kw in target_keywords:
        keyword_hits += text_lower.count(kw.lower())
    density = (keyword_hits / word_count) * 100 if word_count > 0 else 0
    if 1.0 <= density <= 3.0:
        score += 30
    elif 0.5 <= density < 1.0 or 3.0 < density <= 4.0:
        score += 20
    elif density > 0:
        score += 10

    # Keywords in headings
    heading_text = " ".join(text for _, text in parsed.headings).lower()
    heading_kw_hits = sum(1 for kw in target_keywords if kw.lower() in heading_text)
    score += min(20, heading_kw_hits * 5)

    # H2 count
    h2_count = sum(1 for tag, _ in parsed.headings if tag == "h2")
    if 5 <= h2_count <= 10:
        score += 15
    elif 3 <= h2_count < 5 or 10 < h2_count <= 12:
        score += 10
    elif h2_count > 0:
        score += 5

    # Links
    internal_links = sum(1 for href, _ in parsed.links if "shipsquad.ai" in href or href.startswith("/") or href.startswith("#"))
    external_links = sum(1 for href, _ in parsed.links if href.startswith("http") and "shipsquad.ai" not in href)
    if 2 <= internal_links <= 5:
        score += 15
    elif internal_links > 0:
        score += 8
    if 3 <= external_links <= 8:
        score += 10
    elif external_links > 0:
        score += 5

    # Content length bonus
    if ideal_min <= word_count <= ideal_max:
        score += 10
    elif min_words <= word_count <= max_words:
        score += 5

    return min(100, score)


def score_content_depth(parsed, full_text, min_words, max_words):
    word_count = count_words(full_text)
    if word_count == 0:
        return 0

    score = 0
    ideal_min = int(min_words + (max_words - min_words) * 0.3)
    ideal_max = int(min_words + (max_words - min_words) * 0.8)

    if ideal_min <= word_count <= ideal_max:
        score += 20
    elif min_words <= word_count <= max_words:
        score += 12
    elif word_count > 0:
        score += 5

    h2_count = sum(1 for tag, _ in parsed.headings if tag == "h2")
    if 6 <= h2_count <= 8:
        score += 15
    elif 4 <= h2_count <= 10:
        score += 10
    elif h2_count > 0:
        score += 5

    numbers = re.findall(r'\d+[,.]?\d*[%$KMBkTb]?', full_text)
    data_point_count = len(numbers)
    if data_point_count >= 15:
        score += 20
    elif data_point_count >= 10:
        score += 15
    elif data_point_count >= 5:
        score += 10
    elif data_point_count > 0:
        score += 5

    proper_nouns = set(re.findall(r'[A-Z][a-z]+(?:\s[A-Z][a-z]+)+', full_text))
    if len(proper_nouns) >= 10:
        score += 15
    elif len(proper_nouns) >= 5:
        score += 10
    elif len(proper_nouns) > 0:
        score += 5

    if parsed.strong_count >= 10:
        score += 10
    elif parsed.strong_count >= 5:
        score += 7
    elif parsed.strong_count > 0:
        score += 3

    if parsed.lists >= 3:
        score += 10
    elif parsed.lists >= 1:
        score += 5

    if parsed.blockquotes >= 2:
        score += 10
    elif parsed.blockquotes >= 1:
        score += 5

    return min(100, score)


def score_engagement(parsed, full_text):
    word_count = count_words(full_text)
    text_lower = full_text.lower()
    paragraphs = parsed.paragraphs
    if word_count == 0:
        return 0

    score = 0

    if paragraphs:
        first_para = paragraphs[0].lower()
        first_para_words = count_words(first_para)
        if first_para_words <= 50:
            score += 10
        elif first_para_words <= 80:
            score += 5
        if re.search(r'\d', first_para):
            score += 10
        power_words = ["never", "always", "everything", "nothing", "revolution",
                      "breakthrough", "critical", "fundamental", "unprecedented",
                      "remarkable", "extraordinary", "profound", "dramatic"]
        hook_power = sum(1 for pw in power_words if pw in first_para)
        score += min(10, hook_power * 5)

    question_count = full_text.count("?")
    if question_count >= 3:
        score += 10
    elif question_count >= 1:
        score += 5

    if parsed.blockquotes >= 2:
        score += 10
    elif parsed.blockquotes >= 1:
        score += 7

    cta_signals = ["waitlist", "join", "sign up", "get started", "try", "start",
                   "shipsquad", "ship squad", "contact us", "learn more"]
    cta_count = sum(1 for sig in cta_signals if sig in text_lower)
    if cta_count >= 2:
        score += 15
    elif cta_count >= 1:
        score += 10

    if paragraphs:
        last_para = paragraphs[-1].lower()
        has_final_cta = any(sig in last_para for sig in cta_signals)
        if has_final_cta:
            score += 10

    engagement_words = ["you", "your", "imagine", "discover", "secret",
                       "proven", "guaranteed", "instant", "now", "today",
                       "future", "transform", "unlock", "master"]
    eng_count = sum(1 for ew in engagement_words if ew in text_lower)
    score += min(15, eng_count * 3)

    you_count = len(re.findall(r'\byou\b', text_lower))
    if you_count >= 10:
        score += 10
    elif you_count >= 5:
        score += 7
    elif you_count >= 1:
        score += 3

    return min(100, score)


def score_structure(parsed, full_text):
    word_count = count_words(full_text)
    paragraphs = parsed.paragraphs
    if word_count == 0:
        return 0

    score = 0
    headings = parsed.headings
    h2_count = sum(1 for tag, _ in headings if tag == "h2")
    h3_count = sum(1 for tag, _ in headings if tag == "h3")

    if h2_count >= 5:
        score += 20
    elif h2_count >= 3:
        score += 12
    elif h2_count > 0:
        score += 5

    if h3_count >= 3:
        score += 15
    elif h3_count >= 1:
        score += 8

    valid_hierarchy = True
    seen_h2 = False
    for tag, _ in headings:
        if tag == "h2":
            seen_h2 = True
        elif tag == "h3" and not seen_h2:
            valid_hierarchy = False
            break
    if valid_hierarchy and headings:
        score += 10

    if paragraphs:
        para_lengths = [count_words(p) for p in paragraphs]
        avg_para_len = sum(para_lengths) / len(para_lengths)
        if 30 <= avg_para_len <= 60:
            score += 15
        elif 20 <= avg_para_len <= 80:
            score += 10
        elif avg_para_len > 0:
            score += 5
        if len(para_lengths) >= 3:
            std_dev = (sum((l - avg_para_len) ** 2 for l in para_lengths) / len(para_lengths)) ** 0.5
            if std_dev > 10:
                score += 10
            elif std_dev > 5:
                score += 5

    if parsed.lists >= 3:
        score += 10
    elif parsed.lists >= 1:
        score += 5

    if paragraphs:
        paras_per_1000 = (len(paragraphs) / word_count) * 1000
        if 10 <= paras_per_1000 <= 20:
            score += 10
        elif 7 <= paras_per_1000 <= 25:
            score += 5

    if parsed.strong_count >= 8:
        score += 10
    elif parsed.strong_count >= 4:
        score += 5

    return min(100, score)


def evaluate_article(html_content, target_keywords, min_words, max_words):
    parsed = parse_article(html_content)
    full_text = parsed.get_full_text()
    word_count = count_words(full_text)

    scores = {
        "readability": score_readability(full_text),
        "seo_score": score_seo(parsed, full_text, target_keywords, min_words, max_words),
        "content_depth": score_content_depth(parsed, full_text, min_words, max_words),
        "engagement": score_engagement(parsed, full_text),
        "structure": score_structure(parsed, full_text),
    }

    composite = sum(scores[k] * WEIGHTS[k] for k in WEIGHTS)
    h2_count = sum(1 for tag, _ in parsed.headings if tag == "h2")
    h3_count = sum(1 for tag, _ in parsed.headings if tag == "h3")

    return {
        "composite_score": round(composite, 1),
        **{k: round(v, 1) for k, v in scores.items()},
        "word_count": word_count,
        "section_count": h2_count + h3_count,
        "paragraph_count": len(parsed.paragraphs),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate article for content engine")
    parser.add_argument("article", type=str, help="Path to article HTML file")
    parser.add_argument("--keywords", type=str, default="ai,artificial intelligence,machine learning",
                       help="Comma-separated target keywords")
    parser.add_argument("--min-words", type=int, default=400, help="Minimum word count")
    parser.add_argument("--max-words", type=int, default=1500, help="Maximum word count")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    if not os.path.exists(args.article):
        print(f"ERROR: Article not found: {args.article}", file=sys.stderr)
        sys.exit(1)

    with open(args.article, "r", encoding="utf-8") as f:
        html_content = f.read()

    target_keywords = [k.strip() for k in args.keywords.split(",") if k.strip()]
    results = evaluate_article(html_content, target_keywords, args.min_words, args.max_words)

    if args.json:
        print(json.dumps(results))
    else:
        print("---")
        for k, v in results.items():
            print(f"{k}: {v}")
