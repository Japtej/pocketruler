#!/usr/bin/env python3
"""
PocketRuler Web SEO & Core Web Vitals Audit Utility
Analyzes HTML files for modern SEO, Structured Data, Open Graph,
Accessibility, and Core Web Vitals layout shift prevention.
"""

import sys
import os
import re
import json
from html.parser import HTMLParser
from pathlib import Path

class SEODocumentParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.meta_description = ""
        self.meta_keywords = ""
        self.meta_viewport = ""
        self.canonical = ""
        self.html_lang = ""
        
        self.og_tags = {}
        self.twitter_tags = {}
        
        self.headings = [] # list of (tag, text)
        self.current_heading_tag = None
        self.current_heading_text = []
        
        self.images = [] # list of dict(src, alt, width, height, loading, fetchpriority)
        self.scripts_json_ld = [] # list of parsed json objects or error strings
        self.in_json_ld = False
        self.json_ld_buffer = []
        
        self.word_count = 0
        self.visible_text = []
        self.in_non_visible_tag = False
        self.non_visible_tags = {'script', 'style', 'head', 'noscript', 'svg'}
        
        self.ad_slots = [] # list of ad container details
        self.current_ad_class = ""
        self.current_ad_style = ""
        self.in_ad_slot = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = {k.lower(): v for k, v in attrs if v is not None}
        
        if tag == 'html':
            self.html_lang = attrs_dict.get('lang', '')
            
        elif tag == 'title':
            self.in_title = True
            
        elif tag == 'meta':
            name = attrs_dict.get('name', '').lower()
            prop = attrs_dict.get('property', '').lower()
            content = attrs_dict.get('content', '')
            
            if name == 'description':
                self.meta_description = content
            elif name == 'keywords':
                self.meta_keywords = content
            elif name == 'viewport':
                self.meta_viewport = content
            elif prop.startswith('og:'):
                self.og_tags[prop] = content
            elif name.startswith('twitter:'):
                self.twitter_tags[name] = content
                
        elif tag == 'link':
            rel = attrs_dict.get('rel', '').lower()
            if rel == 'canonical':
                self.canonical = attrs_dict.get('href', '')
                
        elif tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.current_heading_tag = tag
            self.current_heading_text = []
            
        elif tag == 'img':
            self.images.append({
                'src': attrs_dict.get('src', ''),
                'alt': attrs_dict.get('alt', None),
                'width': attrs_dict.get('width', ''),
                'height': attrs_dict.get('height', ''),
                'loading': attrs_dict.get('loading', ''),
                'fetchpriority': attrs_dict.get('fetchpriority', '')
            })
            
        elif tag == 'script':
            script_type = attrs_dict.get('type', '').lower()
            if script_type == 'application/ld+json':
                self.in_json_ld = True
                self.json_ld_buffer = []
                
        if tag in self.non_visible_tags:
            self.in_non_visible_tag = True

        # Check for AdSense container tracking for CLS
        classes = attrs_dict.get('class', '')
        if 'adsense' in classes.lower() or 'adsbygoogle' in classes.lower():
            self.ad_slots.append({
                'tag': tag,
                'class': classes,
                'style': attrs_dict.get('style', '')
            })

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        elif tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6') and self.current_heading_tag == tag:
            text = " ".join(self.current_heading_text).strip()
            self.headings.append((tag, text))
            self.current_heading_tag = None
            self.current_heading_text = []
        elif tag == 'script' and self.in_json_ld:
            self.in_json_ld = False
            raw_json = "".join(self.json_ld_buffer).strip()
            try:
                parsed = json.loads(raw_json)
                self.scripts_json_ld.append(parsed)
            except Exception as e:
                self.scripts_json_ld.append({'__error__': str(e), '__raw__': raw_json[:80]})
            self.json_ld_buffer = []
        if tag in self.non_visible_tags:
            self.in_non_visible_tag = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        elif self.current_heading_tag:
            self.current_heading_text.append(data)
        elif self.in_json_ld:
            self.json_ld_buffer.append(data)
            
        if not self.in_non_visible_tag:
            text = data.strip()
            if text:
                self.visible_text.append(text)

    def finish(self):
        full_text = " ".join(self.visible_text)
        words = re.findall(r'\b\w+\b', full_text)
        self.word_count = len(words)


def audit_html_file(file_path):
    path = Path(file_path)
    if not path.exists():
        return {"error": f"File not found: {file_path}"}
        
    try:
        content = path.read_text(encoding='utf-8', errors='ignore')
    except Exception as e:
        return {"error": f"Could not read file: {e}"}
        
    parser = SEODocumentParser()
    parser.feed(content)
    parser.finish()
    
    issues = []
    passes = []
    warnings = []
    
    score = 100
    
    # 1. Document Title
    title = parser.title.strip()
    if not title:
        issues.append("Missing <title> tag")
        score -= 15
    else:
        title_len = len(title)
        if 40 <= title_len <= 65:
            passes.append(f"Title length is optimal ({title_len} chars): '{title[:50]}...'")
        elif title_len < 40:
            warnings.append(f"Title is short ({title_len} chars, recommended 40-65 chars): '{title}'")
            score -= 3
        else:
            warnings.append(f"Title is long ({title_len} chars, may be truncated on SERPs): '{title[:50]}...'")
            score -= 3
            
    # 2. Meta Description
    desc = parser.meta_description.strip()
    if not desc:
        issues.append("Missing <meta name=\"description\"> tag")
        score -= 12
    else:
        desc_len = len(desc)
        if 110 <= desc_len <= 165:
            passes.append(f"Meta description length is optimal ({desc_len} chars)")
        elif desc_len < 110:
            warnings.append(f"Meta description is short ({desc_len} chars, recommended 110-165 chars)")
            score -= 3
        else:
            warnings.append(f"Meta description is long ({desc_len} chars, recommended <= 165 chars)")
            score -= 2

    # 3. Canonical URL
    canonical = parser.canonical.strip()
    if not canonical:
        issues.append("Missing <link rel=\"canonical\"> tag")
        score -= 10
    else:
        passes.append(f"Canonical URL defined: {canonical}")
        if not canonical.startswith("https://"):
            warnings.append(f"Canonical URL is not secure HTTPS: {canonical}")
            score -= 4
            
    # 4. Viewport & Language
    if parser.meta_viewport:
        passes.append("Responsive mobile viewport meta tag present")
    else:
        issues.append("Missing <meta name=\"viewport\"> tag (Mobile-first indexing critical)")
        score -= 10
        
    if parser.html_lang:
        passes.append(f"HTML lang attribute specified: lang=\"{parser.html_lang}\"")
    else:
        warnings.append("Missing lang attribute on <html> element")
        score -= 2

    # 5. Open Graph & Social Cards
    og_keys = ['og:title', 'og:description', 'og:image', 'og:url']
    missing_og = [k for k in og_keys if k not in parser.og_tags]
    if not missing_og:
        passes.append("All primary Open Graph tags (title, description, image, url) present")
    else:
        warnings.append(f"Missing Open Graph tags: {', '.join(missing_og)}")
        score -= 4
        
    if 'twitter:card' in parser.twitter_tags:
        passes.append(f"Twitter card defined: {parser.twitter_tags['twitter:card']}")
    else:
        warnings.append("Missing twitter:card meta tag")
        score -= 2

    # 6. Heading Architecture (H1-H3)
    h1_list = [h for h in parser.headings if h[0] == 'h1']
    if len(h1_list) == 1:
        passes.append(f"Single <h1> present: '{h1_list[0][1][:60]}'")
    elif len(h1_list) == 0:
        issues.append("No <h1> heading found on the page")
        score -= 12
    else:
        issues.append(f"Multiple <h1> headings found ({len(h1_list)}). Must have exactly one <h1>")
        score -= 8

    # Heading hierarchy check
    prev_level = 0
    hierarchy_broken = False
    for tag, text in parser.headings:
        level = int(tag[1])
        if prev_level > 0 and level > prev_level + 1:
            hierarchy_broken = True
            warnings.append(f"Heading hierarchy skips level: <{tag}> follows <h{prev_level}> ('{text[:30]}...')")
            break
        prev_level = level
    if not hierarchy_broken and parser.headings:
        passes.append(f"Logical heading hierarchy maintained ({len(parser.headings)} headings parsed)")

    # 7. Images Audit (Alt attributes, dimensions for CLS)
    images = parser.images
    if images:
        missing_alt = [img for img in images if img['alt'] is None]
        missing_dims = [img for img in images if not img['width'] or not img['height']]
        
        if not missing_alt:
            passes.append(f"All {len(images)} images have descriptive 'alt' attributes")
        else:
            issues.append(f"{len(missing_alt)} of {len(images)} image(s) missing 'alt' attribute")
            score -= min(8, len(missing_alt) * 2)
            
        if not missing_dims:
            passes.append("All images declare explicit width and height (CLS safe)")
        else:
            warnings.append(f"{len(missing_dims)} of {len(images)} image(s) missing width/height attributes (potential CLS risk)")
            score -= min(5, len(missing_dims))
    else:
        passes.append("No <img> tags parsed")

    # 8. Schema.org JSON-LD
    json_lds = parser.scripts_json_ld
    if json_lds:
        syntax_errors = [j for j in json_lds if isinstance(j, dict) and '__error__' in j]
        if syntax_errors:
            issues.append(f"Syntax error in Schema.org JSON-LD: {syntax_errors[0]['__error__']}")
            score -= 12
        else:
            schema_types = []
            for j in json_lds:
                if isinstance(j, dict):
                    t = j.get('@type', 'Unknown')
                    if isinstance(t, list):
                        schema_types.extend(t)
                    else:
                        schema_types.append(t)
            passes.append(f"Valid Schema.org JSON-LD found ({', '.join(schema_types)})")
    else:
        issues.append("Missing Schema.org JSON-LD structured data (WebApplication / FAQPage / Article)")
        score -= 10

    # 9. Content Depth & Anti-Thin-Content check
    word_count = parser.word_count
    if word_count >= 1500:
        passes.append(f"High-depth content: ~{word_count} words (exceeds 1,500-word E-E-A-T standard)")
    elif word_count >= 800:
        passes.append(f"Moderate content depth: ~{word_count} words")
    elif word_count >= 300:
        warnings.append(f"Thin content warning: ~{word_count} words. Consider adding methodology, FAQ, and scenario breakdowns.")
        score -= 5
    else:
        warnings.append(f"Extremely thin content: ~{word_count} words. High risk of poor search indexing.")
        score -= 10

    # 10. Ad Container CLS Check (if ads exist)
    if parser.ad_slots:
        unreserved_ads = [ad for ad in parser.ad_slots if 'min-h-' not in ad.get('class', '') and 'min-height' not in ad.get('style', '').lower()]
        if not unreserved_ads:
            passes.append(f"All {len(parser.ad_slots)} AdSense slots have min-height reservation (Zero-CLS compliance)")
        else:
            warnings.append(f"{len(unreserved_ads)} ad container(s) missing min-height CSS reservation (CLS hazard)")
            score -= 4

    return {
        "file": str(path),
        "score": max(0, score),
        "passes": passes,
        "warnings": warnings,
        "issues": issues,
        "details": {
            "title": title,
            "meta_description": desc,
            "canonical": canonical,
            "h1": [h[1] for h in h1_list],
            "word_count": word_count,
            "schema_count": len(json_lds)
        }
    }


def print_report(audit):
    # Ensure stdout handles UTF-8 gracefully on Windows consoles
    if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except Exception:
            pass

    file_name = Path(audit["file"]).name
    score = audit["score"]
    
    print("\n" + "=" * 70)
    print(f" POCKETRULER SEO & CORE WEB VITALS AUDIT: {file_name}")
    print("=" * 70)
    print(f"Overall SEO Score: {score}/100")
    
    if audit["issues"]:
        print(f"\n[!] CRITICAL ISSUES ({len(audit['issues'])}):")
        for issue in audit["issues"]:
            print(f"  [X] {issue}")
            
    if audit["warnings"]:
        print(f"\n[-] WARNINGS & RECOMMENDATIONS ({len(audit['warnings'])}):")
        for warning in audit["warnings"]:
            print(f"  [!] {warning}")
            
    if audit["passes"]:
        print(f"\n[+] PASSED CHECKS ({len(audit['passes'])}):")
        for passed in audit["passes"]:
            print(f"  [OK] {passed}")
            
    print("\n" + "-" * 70)
    print(f"Summary: ~{audit['details']['word_count']} words | {audit['details']['schema_count']} Schema blocks | Canonical: {audit['details']['canonical'] or 'None'}")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python audit_page_seo.py <path-to-html-file-or-dir>")
        sys.exit(1)
        
    target = Path(sys.argv[1])
    if target.is_dir():
        html_files = list(target.glob("**/*.html"))
        print(f"Auditing {len(html_files)} HTML files in {target}...")
        for f in html_files:
            audit = audit_html_file(f)
            print_report(audit)
    else:
        audit = audit_html_file(target)
        print_report(audit)
        sys.exit(0 if audit["score"] >= 80 else 1)
