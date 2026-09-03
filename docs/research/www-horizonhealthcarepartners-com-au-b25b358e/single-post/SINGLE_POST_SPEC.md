# Single-post template — measured spec

Reference:
`https://www.horizonhealthcarepartners.com.au/article/why-weight-loss-is-difficult-to-maintain-and-what-actually-works-long-term/`

Captured with CDP at **375 / 480 / 767 / 991 / 1200 / 1534px**, reading computed
styles rather than the stylesheet, so what is written down is what the browser
actually did.

Implemented by `ArticleHeader.tsx`, `ArticleBody.tsx` and the article page.

## Page structure

| # | Block | Built as |
|---|---|---|
| 1 | Title, centred on white | `ArticleHeader` |
| 2 | Byline: 48px mark, author, date | `ArticleHeader` |
| 3 | Featured image, 1072px, 3:2 | `ArticleHeader` |
| 4 | Body, 715px measure | `ArticleBody` |
| 5 | Rule, then "Share this post" + 3 icons | `ArticleBody` |
| 6 | "Related Posts" | `BlogSection` |
| 7 | Closing CTA band | `FinalCtaSection` |

There is **no dark hero band and no breadcrumb trail** — the title sits directly
under the header. `BreadcrumbList` JSON-LD still ships from the page.

## Geometry at 1534px

| Element | x | width | notes |
|---|---:|---:|---|
| hero container | 231 | 1072 | flex column, `row-gap: 30px` (`--hhcp-space-m`) |
| h1 | 365 | 804 | centred; box holds at 804 from 991px up |
| byline | 615 | 304 | avatar 48px, `gap: 14px`, radius 22.5px |
| featured image | 231 | 1072 | 715 tall — **3:2**, radius 0 |
| body container | 410 | 715 | `row-gap: --hhcp-space-l`, `align-items: flex-start` |
| section padding | — | — | header block `… var(--hhcp-gutter) var(--hhcp-space-xl)`, body block `0 var(--hhcp-gutter) 90px` |

### The gap under the featured image

The body block has no top padding, so the whole gap between the image and the
opening paragraph is the header block's bottom padding: **67 / 59 / 44px** at
1534 / 991 / 375px. That is `--hhcp-space-xl` at all three.

## Typography

Every value below was fitted to a straight line through the six measured widths.
All of them top out at a **1340px viewport** — `--hhcp-content-width` — and the
clamp minimums are that same line at 360px.

**Four turned out to be tokens this site already had**, matching to the fourth
decimal at every width:

| Live value | Existing token |
|---|---|
| body copy, list items, paragraph spacing | `--hhcp-text-m` |
| article `h3` size | `--hhcp-text-l` |
| list margin | `--hhcp-space-m` |
| section side padding | `--hhcp-gutter` |

**Two needed new ones**, added to `globals.css` as `--hhcp-article-*`:

| Property | Value |
|---|---|
| h1 size | `clamp(24.7294px, calc(1.343685vw + 19.8922px), 37.8976px)` |
| h2 size | `clamp(20.4843px, calc(0.810812vw + 17.5654px), 28.4302px)` |
| space above h2 | `clamp(24.5812px, calc(0.972971vw + 21.0785px), 34.1163px)` |
| space above h3 | `clamp(20.3731px, calc(0.532711vw + 18.4553px), 25.5937px)` |
| space below either | `clamp(18.0828px, calc(0.195633vw + 17.3785px), 20px)` |
| list indent | `clamp(28.1572px, calc(0.392143vw + 26.745px), 32px)` |

Weights and colours:

| Element | weight | colour | letter-spacing |
|---|---|---|---|
| h1 | 400 | `--hhcp-primary` | -0.6px |
| body h2 | **700** | **#000000** | -0.42px |
| body h3 | **700** | **#000000** | -0.6px |
| p, li | 400 | `rgba(1, 49, 38, 0.8)` | — |
| author | 700 | #000000 | — |
| date | 400 | #000000, 0.9 × body size | — |

Headings are black and bold here, not brand green and regular as everywhere else
on this site. That is the reference, not an oversight. Letter-spacing is left to
the base layer, which already sets exactly these values.

## The closing disclaimer

Set apart from the body three ways at once, which is why it is its own block
kind (`note` in `articles.ts`) rather than another paragraph:

| | Value |
|---|---|
| rule above | `border-top: 2px solid #808080`, `margin: 1em 0 0` |
| size | **13px flat** — the one size on the page that does not scale |
| line-height | 19.5px (1.5) |
| style | italic |
| colour | `rgba(1, 49, 38, 0.8)` |
| space above | 13px, i.e. its own 1em |

The reference italicises it with an `<em>`; this uses `font-style` instead.
`<em>` means stress emphasis, and a disclaimer set in italic is a convention of
the form rather than a sentence being emphasised — so a screen reader reads it
plainly instead of leaning on every word.

## Paragraph spacing

`1em` above a paragraph that follows **a paragraph or a heading**, and nothing
above one that follows a **list** (the list already ends with its own 30px) or
one that opens the article. Verified paragraph by paragraph against the live
page.

Line spacing between list items is 8px.

## Known differences

- **Related-posts title line-height.** The live block sets a fluid line-height
  (22.78px at 991px); `BlogSection` uses a fixed 24.16px. They agree at 1534px.
  `BlogSection` is the clone component the homepage and `/home-v2/` also render,
  and `/home-v2/` is the pixel benchmark, so it was left alone rather than moved
  for this page's sake.
- **Money-page prompt.** Not on the live template, which is a plain WordPress
  post. Kept because the design spec has each article carry one link to the
  service it supports.
- **`object-fit`.** The live featured image uses `fill`; this uses `cover`. The
  images are already 3:2 so the two render identically, and `cover` is what stops
  a differently-shaped one being stretched.
- **Italics inside a paragraph.** The reference sets the journal name in the
  References line in italic. The block union is deliberately closed — plain text,
  no inline markup — so a phrase inside a paragraph cannot be styled without
  opening that up. Left as plain text.
