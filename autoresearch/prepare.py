"""
Article evaluation for autoresearch — article evolution.
Fixed evaluation metrics. DO NOT MODIFY.

Usage: python autoresearch/prepare.py
       python autoresearch/prepare.py --article path/to/article.html
"""

import os
import re
import sys
import math
import argparse
from html.parser import HTMLParser
from collections import Counter

# ---------------------------------------------------------------------------
# Constants (fixed, do not modify)
# ---------------------------------------------------------------------------

ARTICLE_PATH = os.path.join(os.path.dirname(__file__), "article.html")

# Score weights
WEIGHTS = {
    "readability": 0.20,
    "seo_score": 0.20,
    "content_depth": 0.25,
    "engagement": 0.20,
    "structure": 0.15,
}

# Target keywords (primary + secondary)
TARGET_KEYWORDS = [
    "autoresearch", "karpathy", "ai agents", "autonomous",
    "openclaw", "claude opus", "ai agent", "ml experiments",
    "autonomous research", "firefox vulnerabilities",
    "agent framework", "ai science",
]

# Word count bounds
MIN_WORDS = 1500
MAX_WORDS = 4000
IDEAL_MIN_WORDS = 2000
IDEAL_MAX_WORDS = 3000

# ---------------------------------------------------------------------------
# HTML Parser — extract text, headings, links, structure
# ---------------------------------------------------------------------------

class ArticleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.headings = []  # (tag, text)
        self.links = []     # (href, text)
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
    """Parse HTML article and return structured data."""
    parser = ArticleParser()
    parser.feed(html_content)
    return parser


# ---------------------------------------------------------------------------
# Text analysis utilities
# ---------------------------------------------------------------------------

def count_words(text):
    """Count words in plain text."""
    return len(text.split())


def count_sentences(text):
    """Count sentences using basic heuristics."""
    # Split on sentence-ending punctuation
    sentences = re.split(r'[.!?]+', text)
    return len([s for s in sentences if s.strip()])


def count_syllables(word):
    """Estimate syllable count for a word."""
    word = word.lower().strip()
    if not word:
        return 0
    if len(word) <= 3:
        return 1

    # Remove trailing e
    if word.endswith("e"):
        word = word[:-1]

    # Count vowel groups
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
    """Calculate Flesch-Kincaid grade level."""
    words = text.split()
    word_count = len(words)
    if word_count == 0:
        return 0

    sentence_count = count_sentences(text)
    if sentence_count == 0:
        return 0

    syllable_count = sum(count_syllables(w) for w in words)

    # Flesch-Kincaid formula
    grade = (0.39 * (word_count / sentence_count) +
             11.8 * (syllable_count / word_count) - 15.59)
    return max(0, grade)


# ---------------------------------------------------------------------------
# Scoring functions (each returns 0-100)
# ---------------------------------------------------------------------------

def score_readability(text):
    """
    Score readability based on Flesch-Kincaid grade level.
    Ideal range: grade 8-12 (accessible professional writing).
    Grade 10 = perfect score of 100.
    """
    grade = flesch_kincaid_grade(text)

    if grade == 0:
        return 0

    # Bell curve centered on grade 10
    ideal = 10
    # Score drops off as grade moves away from ideal
    distance = abs(grade - ideal)

    if distance <= 2:
        # Grades 8-12: excellent range (90-100)
        score = 100 - (distance * 5)
    elif distance <= 4:
        # Grades 6-8 or 12-14: good range (70-90)
        score = 90 - ((distance - 2) * 10)
    elif distance <= 6:
        # Grades 4-6 or 14-16: okay range (50-70)
        score = 70 - ((distance - 4) * 10)
    else:
        # Too simple or too complex
        score = max(20, 50 - ((distance - 6) * 5))

    return min(100, max(0, score))


def score_seo(parsed, full_text):
    """
    Score SEO signals:
    - Keyword presence and density
    - Heading structure with keywords
    - Link count (internal + external)
    - Content length signals
    """
    text_lower = full_text.lower()
    word_count = count_words(full_text)

    if word_count == 0:
        return 0

    score = 0

    # Keyword density (target: 1-3% for primary keywords)
    keyword_hits = 0
    for kw in TARGET_KEYWORDS:
        count = text_lower.count(kw.lower())
        keyword_hits += count

    density = (keyword_hits / word_count) * 100 if word_count > 0 else 0

    if 1.0 <= density <= 3.0:
        score += 30  # Ideal density
    elif 0.5 <= density < 1.0 or 3.0 < density <= 4.0:
        score += 20  # Acceptable
    elif density > 0:
        score += 10  # At least present
    # else 0

    # Keywords in headings
    heading_text = " ".join(text for _, text in parsed.headings).lower()
    heading_kw_hits = sum(1 for kw in TARGET_KEYWORDS if kw.lower() in heading_text)
    score += min(20, heading_kw_hits * 5)

    # H2 count (target: 5-10)
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

    # Internal links (target: 2-5)
    if 2 <= internal_links <= 5:
        score += 15
    elif internal_links > 0:
        score += 8

    # External links (target: 3-8, shows research/authority)
    if 3 <= external_links <= 8:
        score += 10
    elif external_links > 0:
        score += 5

    # Content length bonus
    if IDEAL_MIN_WORDS <= word_count <= IDEAL_MAX_WORDS:
        score += 10
    elif MIN_WORDS <= word_count <= MAX_WORDS:
        score += 5

    return min(100, score)


def score_content_depth(parsed, full_text):
    """
    Score content depth:
    - Word count and section count
    - Data points (numbers, statistics)
    - Specificity (proper nouns, specific claims)
    - Examples and evidence
    """
    word_count = count_words(full_text)
    text_lower = full_text.lower()

    if word_count == 0:
        return 0

    score = 0

    # Word count (target: 2000-3000)
    if IDEAL_MIN_WORDS <= word_count <= IDEAL_MAX_WORDS:
        score += 20
    elif MIN_WORDS <= word_count <= MAX_WORDS:
        score += 12
    elif word_count > 0:
        score += 5

    # Section count (H2s, target: 6-8)
    h2_count = sum(1 for tag, _ in parsed.headings if tag == "h2")
    if 6 <= h2_count <= 8:
        score += 15
    elif 4 <= h2_count <= 10:
        score += 10
    elif h2_count > 0:
        score += 5

    # Data points (numbers, percentages, dollar amounts)
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

    # Proper nouns / specificity (capitalized multi-word phrases)
    proper_nouns = set(re.findall(r'[A-Z][a-z]+(?:\s[A-Z][a-z]+)+', full_text))
    if len(proper_nouns) >= 10:
        score += 15
    elif len(proper_nouns) >= 5:
        score += 10
    elif len(proper_nouns) > 0:
        score += 5

    # Strong tags (bold = emphasis on key points)
    if parsed.strong_count >= 10:
        score += 10
    elif parsed.strong_count >= 5:
        score += 7
    elif parsed.strong_count > 0:
        score += 3

    # List usage (shows structured thinking)
    if parsed.lists >= 3:
        score += 10
    elif parsed.lists >= 1:
        score += 5

    # Blockquotes (pull quotes, expert citations)
    if parsed.blockquotes >= 2:
        score += 10
    elif parsed.blockquotes >= 1:
        score += 5

    return min(100, score)


def score_engagement(parsed, full_text):
    """
    Score engagement signals:
    - Opening hook strength
    - CTA presence and quality
    - Questions (engage reader)
    - Pull quotes / blockquotes
    - Emotional / power words
    """
    word_count = count_words(full_text)
    text_lower = full_text.lower()
    paragraphs = parsed.paragraphs

    if word_count == 0:
        return 0

    score = 0

    # Opening hook (first paragraph)
    if paragraphs:
        first_para = paragraphs[0].lower()
        first_para_words = count_words(first_para)

        # Short, punchy opener (under 50 words)
        if first_para_words <= 50:
            score += 10
        elif first_para_words <= 80:
            score += 5

        # Contains a number/stat in opener
        if re.search(r'\d', first_para):
            score += 10

        # Contains a strong claim or bold statement
        power_words = ["never", "always", "everything", "nothing", "revolution",
                      "breakthrough", "critical", "fundamental", "unprecedented",
                      "remarkable", "extraordinary", "profound", "dramatic"]
        hook_power = sum(1 for pw in power_words if pw in first_para)
        score += min(10, hook_power * 5)

    # Questions throughout (engage reader thinking)
    question_count = full_text.count("?")
    if question_count >= 3:
        score += 10
    elif question_count >= 1:
        score += 5

    # Blockquotes / pull quotes
    if parsed.blockquotes >= 2:
        score += 10
    elif parsed.blockquotes >= 1:
        score += 7

    # CTA presence
    cta_signals = ["waitlist", "join", "sign up", "get started", "try", "start"]
    cta_count = sum(1 for sig in cta_signals if sig in text_lower)
    if cta_count >= 2:
        score += 15
    elif cta_count >= 1:
        score += 10

    # Last section has CTA
    if paragraphs:
        last_para = paragraphs[-1].lower()
        has_final_cta = any(sig in last_para for sig in cta_signals)
        if has_final_cta:
            score += 10

    # Power words throughout
    engagement_words = ["you", "your", "imagine", "discover", "secret",
                       "proven", "guaranteed", "instant", "now", "today",
                       "future", "transform", "unlock", "master"]
    eng_count = sum(1 for ew in engagement_words if ew in text_lower)
    score += min(15, eng_count * 3)

    # "You" addressing the reader directly
    you_count = len(re.findall(r'\byou\b', text_lower))
    if you_count >= 10:
        score += 10
    elif you_count >= 5:
        score += 7
    elif you_count >= 1:
        score += 3

    return min(100, score)


def score_structure(parsed, full_text):
    """
    Score structural quality:
    - Heading hierarchy (H2 > H3, no skipping levels)
    - Paragraph length distribution
    - List usage
    - Content balance across sections
    """
    word_count = count_words(full_text)
    paragraphs = parsed.paragraphs

    if word_count == 0:
        return 0

    score = 0

    # Heading hierarchy
    headings = parsed.headings
    h2_count = sum(1 for tag, _ in headings if tag == "h2")
    h3_count = sum(1 for tag, _ in headings if tag == "h3")

    # Has H2s
    if h2_count >= 5:
        score += 20
    elif h2_count >= 3:
        score += 12
    elif h2_count > 0:
        score += 5

    # Has H3 subheadings (shows depth)
    if h3_count >= 3:
        score += 15
    elif h3_count >= 1:
        score += 8

    # No heading level skipping (H2 before H3)
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

    # Paragraph length distribution
    if paragraphs:
        para_lengths = [count_words(p) for p in paragraphs]
        avg_para_len = sum(para_lengths) / len(para_lengths)

        # Ideal average: 30-60 words per paragraph
        if 30 <= avg_para_len <= 60:
            score += 15
        elif 20 <= avg_para_len <= 80:
            score += 10
        elif avg_para_len > 0:
            score += 5

        # Variety in paragraph lengths (not all same length)
        if len(para_lengths) >= 3:
            std_dev = (sum((l - avg_para_len) ** 2 for l in para_lengths) / len(para_lengths)) ** 0.5
            if std_dev > 10:  # Good variety
                score += 10
            elif std_dev > 5:
                score += 5

    # List usage (breaks up text)
    if parsed.lists >= 3:
        score += 10
    elif parsed.lists >= 1:
        score += 5

    # Paragraph count relative to word count
    if paragraphs:
        paras_per_1000 = (len(paragraphs) / word_count) * 1000
        # Target: 10-20 paragraphs per 1000 words
        if 10 <= paras_per_1000 <= 20:
            score += 10
        elif 7 <= paras_per_1000 <= 25:
            score += 5

    # Bold emphasis used (scanability)
    if parsed.strong_count >= 8:
        score += 10
    elif parsed.strong_count >= 4:
        score += 5

    return min(100, score)


# ---------------------------------------------------------------------------
# Main evaluation
# ---------------------------------------------------------------------------

def evaluate_article(html_content):
    """Run all evaluations and return scores."""
    parsed = parse_article(html_content)
    full_text = parsed.get_full_text()
    word_count = count_words(full_text)

    # Validate bounds
    if word_count < MIN_WORDS:
        print(f"WARNING: Article is too short ({word_count} words, minimum {MIN_WORDS})")
    if word_count > MAX_WORDS:
        print(f"WARNING: Article is too long ({word_count} words, maximum {MAX_WORDS})")

    # Calculate individual scores
    scores = {
        "readability": score_readability(full_text),
        "seo_score": score_seo(parsed, full_text),
        "content_depth": score_content_depth(parsed, full_text),
        "engagement": score_engagement(parsed, full_text),
        "structure": score_structure(parsed, full_text),
    }

    # Composite score
    composite = sum(scores[k] * WEIGHTS[k] for k in WEIGHTS)

    # Metadata
    h2_count = sum(1 for tag, _ in parsed.headings if tag == "h2")
    h3_count = sum(1 for tag, _ in parsed.headings if tag == "h3")
    section_count = h2_count + h3_count

    return {
        "composite_score": round(composite, 1),
        **{k: round(v, 1) for k, v in scores.items()},
        "word_count": word_count,
        "section_count": section_count,
        "paragraph_count": len(parsed.paragraphs),
        "link_count": len(parsed.links),
        "list_count": parsed.lists,
        "blockquote_count": parsed.blockquotes,
        "bold_count": parsed.strong_count,
        "fk_grade": round(flesch_kincaid_grade(full_text), 1),
    }


def print_results(results):
    """Print results in autoresearch format."""
    print("---")
    print(f"composite_score:   {results['composite_score']}")
    print(f"readability:       {results['readability']}")
    print(f"seo_score:         {results['seo_score']}")
    print(f"content_depth:     {results['content_depth']}")
    print(f"engagement:        {results['engagement']}")
    print(f"structure:         {results['structure']}")
    print(f"word_count:        {results['word_count']}")
    print(f"section_count:     {results['section_count']}")
    print(f"paragraph_count:   {results['paragraph_count']}")
    print(f"link_count:        {results['link_count']}")
    print(f"list_count:        {results['list_count']}")
    print(f"blockquote_count:  {results['blockquote_count']}")
    print(f"bold_count:        {results['bold_count']}")
    print(f"fk_grade:          {results['fk_grade']}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate article for autoresearch")
    parser.add_argument("--article", type=str, default=ARTICLE_PATH,
                       help="Path to the article HTML file")
    args = parser.parse_args()

    if not os.path.exists(args.article):
        print(f"ERROR: Article file not found: {args.article}")
        sys.exit(1)

    with open(args.article, "r", encoding="utf-8") as f:
        html_content = f.read()

    results = evaluate_article(html_content)
    print_results(results)
