/**
 * Knowledge hub articles.
 *
 * Migrated from the client's existing site, which the content document asks
 * for: "Existing articles on the current site (weight-loss maintenance, sleep
 * and chronic pain) are strong and should be migrated, refreshed, and pointed
 * at the relevant money page." The body copy is theirs, transcribed from the
 * live pages rather than rewritten.
 *
 * `moneyPage` is the link each article owes its money page. The document asks
 * for that link inside the first two paragraphs; it renders as a callout after
 * the opening, which is as close as the migrated copy allows without editing
 * sentences that have not been re-approved.
 *
 * Publication dates were carried across from her previous site and confirmed
 * by Ranjeeta on 2026-10-29 as unchanged, which is why they are now published
 * as machine-readable ISO rather than held back. They are identical because
 * the articles were migrated together.
 *
 * ⚠️ Read times are still estimates from the word count, not measured.
 *
 * The document also flags a decision for Ranjeeta: which existing articles to
 * migrate and which to retire, and any topics she wants covered. The launch
 * cluster of twelve new titles lives in the Sitemap & SEO Blueprint and is not
 * built here.
 */

import type { BlogPost } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/BlogSection";

const IMAGE_BASE =
  "/images/";

export type ArticleBlock =
  | { readonly kind: "h2"; readonly text: string }
  | { readonly kind: "h3"; readonly text: string }
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly string[] }
  /**
   * The closing disclaimer. Its own kind rather than another paragraph because
   * the live template sets it apart three ways at once — a rule above it, 13px
   * rather than body size, and italic — and because what it is matters: it is
   * the line that says this article is not medical advice.
   */
  | { readonly kind: "note"; readonly text: string };

export interface Article {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly topic: string;
  /**
   * ISO 8601, date only.
   *
   * Stored in the form schema.org takes and formatted for display, rather
   * than stored for display and parsed for schema. It was "26 Jan 2026"
   * until 2026-10-29, which schema.org cannot read — Google silently ignored
   * every publication date on the site.
   *
   * Date, not date-time. Ranjeeta confirmed the day these were published on
   * her previous site; she did not give a time, and inventing one would make
   * a precise claim nobody made.
   */
  readonly date: string;
  /**
   * ISO 8601, date only. Set when an article's content is substantively
   * revised, not when a typo is fixed.
   *
   * Optional, and absent means unrevised — the Article node then reports
   * `dateModified` equal to `datePublished`, which is true and is what
   * Google expects rather than a missing property.
   */
  readonly dateModified?: string;
  readonly readTime: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly moneyPage: { readonly label: string; readonly href: string };
  readonly blocks: readonly ArticleBlock[];
}

export const ARTICLES: readonly Article[] = [
  {
    slug: "why-weight-loss-is-difficult-to-maintain-and-what-actually-works-long-term",
    title:
      "Why Weight Loss is Difficult to Maintain, and What Actually Works Long-Term",
    description:
      "Achieving weight loss is often possible, but maintaining that weight loss long-term is where most people struggle. This is not due to a lack of willpower. Re",
    topic: "Weight management",
    date: "2026-01-26",
    readTime: "6 min read",
    image: `${IMAGE_BASE}blog-weight-loss.jpeg`,
    imageAlt: "A person preparing a fresh meal at home.",
    moneyPage: {
      label: "Weight management",
      href: "/weight-management/",
    },
    blocks: [
      {
        kind: "p",
        text: "Achieving weight loss is often possible, but maintaining that weight loss long-term is where most people struggle. This is not due to a lack of willpower. Research shows that biological, behavioural, and environmental factors all play a role in why weight regain is common.",
      },
      {
        kind: "p",
        text: "At Horizon Health Care Partners Australia (HHCPA), we take a realistic, evidence-based, and comprehensive approach to long-term weight management.",
      },
      { kind: "h2", text: "Why Weight Regain May Occur" },
      { kind: "p", text: "Many individuals experience:" },
      {
        kind: "ul",
        items: [
          "Initial weight loss",
          "A plateau after several months",
          "Gradual weight regain over time",
        ],
      },
      {
        kind: "p",
        text: "Research shows that more than 50% of lost weight is regained within 2 years, and over 80% may return within 5 years.",
      },
      {
        kind: "p",
        text: "This pattern is extremely common, and importantly, it is driven by physiology, not personal failure.",
      },
      {
        kind: "h2",
        text: "Physiological Adaptation: The Body Fights Back Against Weight Loss",
      },
      {
        kind: "p",
        text: "When you lose weight, your body activates survival mechanisms:",
      },
      { kind: "h3", text: "1. Increased Hunger" },
      {
        kind: "ul",
        items: [
          "Appetite increases significantly after weight loss",
          "The body signals you to eat more",
        ],
      },
      { kind: "h3", text: "2. Slower Metabolism" },
      {
        kind: "ul",
        items: [
          "The body burns fewer calories",
          "Energy expenditure may decrease",
        ],
      },
      { kind: "h3", text: "3. Hormonal Changes" },
      {
        kind: "ul",
        items: [
          "Hormones regulating hunger and satiety shift",
          "Makes maintaining weight loss more difficult",
        ],
      },
      {
        kind: "p",
        text: "These changes are long-lasting and can persist for years, making weight maintenance challenging.",
      },
      { kind: "h2", text: "The Modern Environment Makes It Harder" },
      {
        kind: "p",
        text: "Weight management is also influenced by today’s environment:",
      },
      {
        kind: "ul",
        items: [
          "Easy access to highly processed, calorie-dense foods",
          "Larger portion sizes",
          "Increased sedentary lifestyles",
          "Reduced physical activity in daily life",
        ],
      },
      {
        kind: "p",
        text: "These factors create what researchers call an “obesogenic environment”, which promotes weight gain.",
      },
      { kind: "h2", text: "Why Diets Alone Often Fail" },
      { kind: "p", text: "There is no single “perfect diet.” Research shows:" },
      {
        kind: "ul",
        items: [
          "Low-carb and low-fat diets may produce similar long-term outcomes",
          "Sustainability is more important than strict dietary rules",
          "Extreme approaches may be difficult to maintain",
        ],
      },
      {
        kind: "p",
        text: "While some diets may work short-term, long-term success depends on consistency and behavioural change, not quick fixes.",
      },
      {
        kind: "h2",
        text: "What Actually Works for Long-Term Weight Management",
      },
      {
        kind: "p",
        text: "Evidence supports a multi-factor, long-term approach:",
      },
      { kind: "h3", text: "1. Ongoing Support is Essential" },
      {
        kind: "ul",
        items: [
          "Regular follow-ups may improve outcomes",
          "Weight management requires continuous care, not one-off interventions",
        ],
      },
      { kind: "h3", text: "2. Behavioural Strategies" },
      { kind: "p", text: "Successful long-term strategies include:" },
      {
        kind: "ul",
        items: [
          "Regular self-monitoring (e.g. weight tracking)",
          "Consistent eating patterns",
          "Increased physical activity",
          "Reduced reliance on takeaway/processed foods",
        ],
      },
      { kind: "h3", text: "3. Realistic Expectations" },
      {
        kind: "ul",
        items: [
          "Typical sustainable weight loss is 5 to 10% of body weight",
          "Even small weight loss may lead to significant health benefits",
        ],
      },
      { kind: "h3", text: "4. Addressing Psychology & Habits" },
      {
        kind: "ul",
        items: [
          "Managing emotional eating",
          "Building sustainable routines",
          "Developing flexible, realistic approaches",
        ],
      },
      { kind: "h2", text: "A Comprehensive Approach to Weight Management" },
      {
        kind: "p",
        text: "At HHCPA, we recognise that weight management is not just about diet. It involves:",
      },
      {
        kind: "ul",
        items: [
          "Metabolic health",
          "Sleep and stress",
          "Mental wellbeing",
          "Medical conditions",
          "Individual lifestyle factors",
        ],
      },
      { kind: "p", text: "Our approach focuses on:" },
      {
        kind: "ul",
        items: [
          "Personalised care",
          "Evidence-based treatment options",
          "Long-term support and follow-up",
        ],
      },
      { kind: "h2", text: "Key Takeaway" },
      {
        kind: "p",
        text: "Weight regain is common, expected, and biologically driven. Long-term success comes from:",
      },
      {
        kind: "ul",
        items: [
          "Ongoing support",
          "Sustainable lifestyle changes",
          "Realistic expectations",
          "A personalised, comprehensive care plan",
        ],
      },
      { kind: "h2", text: "References" },
      {
        kind: "p",
        text: "Hall KD, Kahan S. (2018). Maintenance of lost weight and long-term management of obesity. Medical Clinics of North America.",
      },
      {
        kind: "note",
        text: "Disclaimer: This article provides general health information only and is not intended as medical advice. Individual circumstances vary, and readers should consult a qualified health practitioner for personalised assessment and guidance.",
      },
    ],
  },
  {
    slug: "why-sleep-is-essential-for-chronic-pain-weight-and-overall-health",
    title:
      "Why Sleep is Essential for Chronic Pain, Weight, and Overall Health",
    description:
      "Sleep is a fundamental component of health and plays an active role in multiple physiological processes. It is one of the most critical pillars of health. Em",
    topic: "Sleep and recovery",
    date: "2026-01-26",
    readTime: "6 min read",
    image: `${IMAGE_BASE}blog-sleep-health.jpg`,
    imageAlt: "A person resting comfortably in bed.",
    moneyPage: {
      label: "Mental health support",
      href: "/online-doctor/mental-health/",
    },
    blocks: [
      {
        kind: "p",
        text: "Sleep is a fundamental component of health and plays an active role in multiple physiological processes. It is one of the most critical pillars of health. Emerging research shows that sleep is not just a passive state. It plays an active role in pain regulation, metabolism, mental health, and chronic disease prevention.",
      },
      {
        kind: "p",
        text: "At Horizon Health Care Partners Australia (HHCPA), we take a comprehensive approach, recognising that improving sleep can significantly impact overall wellbeing and long-term health outcomes.",
      },
      {
        kind: "h2",
        text: "The Link Between Sleep and Chronic Health Conditions",
      },
      {
        kind: "p",
        text: "Sleep affects multiple systems in the body. Insufficient or poor-quality sleep has been associated with:",
      },
      {
        kind: "ul",
        items: [
          "Chronic pain conditions",
          "Mental health disorders (anxiety, depression)",
          "Cardiovascular disease",
          "Metabolic disorders such as obesity and diabetes",
        ],
      },
      {
        kind: "p",
        text: "Research highlights that sleep deprivation contributes to both the development and worsening of chronic diseases, making it a key modifiable risk factor.",
      },
      { kind: "h2", text: "Sleep and Chronic Pain: A Two-Way Relationship" },
      {
        kind: "p",
        text: "There is a strong bidirectional relationship between sleep and pain:",
      },
      { kind: "h3", text: "1. Poor Sleep Increases Pain Sensitivity" },
      {
        kind: "ul",
        items: [
          "Reduced ability to regulate pain",
          "Increases inflammation and stress responses",
          "Impairs recovery and healing",
        ],
      },
      {
        kind: "p",
        text: "Studies show that sleep disturbances may even precede and predict chronic pain conditions.",
      },
      { kind: "h3", text: "2. Chronic Pain Disrupts Sleep" },
      {
        kind: "ul",
        items: [
          "Causes frequent awakenings",
          "Reduces deep, restorative sleep",
          "Leads to fatigue and reduced function",
        ],
      },
      {
        kind: "p",
        text: "This creates a cycle where pain worsens sleep, and poor sleep worsens pain.",
      },
      { kind: "h2", text: "The Role of Sleep in Weight and Metabolic Health" },
      { kind: "p", text: "Sleep plays a key role in regulating:" },
      {
        kind: "ul",
        items: [
          "Appetite hormones (ghrelin and leptin)",
          "Blood sugar levels",
          "Energy metabolism",
        ],
      },
      { kind: "p", text: "Insufficient sleep is associated with:" },
      {
        kind: "ul",
        items: [
          "Increased hunger and cravings",
          "Weight gain",
          "Higher risk of type 2 diabetes",
        ],
      },
      {
        kind: "p",
        text: "Modern lifestyles, particularly increased screen time and irregular sleep patterns, are contributing to widespread sleep deprivation across all age groups.",
      },
      { kind: "h2", text: "Sleep and Mental Health" },
      { kind: "p", text: "Sleep and mental health are deeply interconnected:" },
      {
        kind: "ul",
        items: [
          "Poor sleep may increase the risk of anxiety and depression",
          "Mental health conditions may also affect sleep quality",
        ],
      },
      {
        kind: "p",
        text: "In adolescents and adults, insufficient sleep has been linked to:",
      },
      {
        kind: "ul",
        items: [
          "Low mood",
          "Reduced cognitive function",
          "Increased stress and emotional dysregulation",
        ],
      },
      { kind: "h2", text: "How Sleep Affects the Body" },
      {
        kind: "p",
        text: "Sleep supports critical biological processes, including:",
      },
      {
        kind: "ul",
        items: [
          "Brain restoration and memory consolidation",
          "Immune system regulation",
          "Hormonal balance",
          "Reduction of inflammation",
        ],
      },
      { kind: "p", text: "Disrupted sleep can lead to:" },
      {
        kind: "ul",
        items: [
          "Increased inflammatory markers",
          "Reduced recovery capacity",
          "Heightened sensitivity to pain",
        ],
      },
      {
        kind: "p",
        text: "Shared biological mechanisms, such as neuroinflammation and stress system dysregulation, help explain why sleep and chronic conditions are closely linked.",
      },
      { kind: "h2", text: "Why This Matters Across the Lifespan" },
      { kind: "p", text: "Sleep impacts health at every stage of life:" },
      {
        kind: "ul",
        items: [
          "Children & Adolescents: Poor sleep can affect brain development and increase future risk of chronic pain and mental health conditions",
          "Adults: Lifestyle, stress, and work patterns influence sleep and chronic disease risk",
          "Older Adults: Sleep disturbances contribute to increased risk of chronic illness, cognitive decline, and reduced quality of life",
        ],
      },
      {
        kind: "p",
        text: "Improving sleep early may help prevent long-term health issues.",
      },
      { kind: "h2", text: "Improving Sleep as Part of Comprehensive Care" },
      {
        kind: "p",
        text: "At HHCPA, we support patients through a comprehensive and individualised approach, which may include:",
      },
      {
        kind: "ul",
        items: [
          "Sleep education and behavioural strategies",
          "Addressing underlying medical conditions",
          "Lifestyle optimisation (nutrition, activity, stress management)",
          "Coordinated care with healthcare providers",
        ],
      },
      {
        kind: "p",
        text: "Improving sleep is not just about rest. It is about enhancing overall health, function, and quality of life.",
      },
      { kind: "h2", text: "Conclusion" },
      {
        kind: "p",
        text: "Sleep is a powerful, modifiable factor in managing:",
      },
      {
        kind: "ul",
        items: [
          "Chronic pain",
          "Weight and metabolic health",
          "Mental wellbeing",
        ],
      },
      {
        kind: "p",
        text: "Addressing sleep disturbances can help break the cycle of chronic conditions and support long-term health outcomes.",
      },
      { kind: "h2", text: "References" },
      {
        kind: "p",
        text: "Ramos AR, Wheaton AG, Johnson DA. (2023). Sleep Deprivation, Sleep Disorders, and Chronic Disease. Preventing Chronic Disease.",
      },
      {
        kind: "note",
        text: "Disclaimer: This article provides general health information only and is not intended as medical advice. Individual circumstances vary, and readers should consult a qualified health practitioner for personalised assessment and guidance.",
      },
    ],
  },
] as const;

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/**
 * Articles as blog cards.
 *
 * Two pages list the same articles the same way — the homepage's teaser and the
 * knowledge hub index — so both read them from here. Before this they did not:
 * the homepage carried the target's own hardcoded copy of these three, which
 * called them all "General · 3 minutes · May 05, 2026" while the article pages
 * called them "Weight management · 6 min read · 26 Jan 2026". Same three
 * articles, two sets of facts about them, on one site.
 *
 * `limit` is for the teaser, which shows the newest few rather than all of them.
 */
/**
 * The ISO date, rendered the way the cards and the article header show it.
 *
 * "2026-01-26" becomes "26 Jan 2026". Formatted here rather than stored that
 * way so one value feeds both the display and the `datePublished` in the
 * schema, and they cannot disagree.
 *
 * Fixed en-AU and UTC: the output is part of the page, so it must not change
 * with the machine that renders it. A build in another timezone shifting a
 * publication date by a day is the kind of fault nobody looks for.
 */
export function formatArticleDate(iso: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function articleCards(limit?: number): readonly BlogPost[] {
  return ARTICLES.slice(0, limit).map((article) => ({
    topic: article.topic,
    readTime: article.readTime,
    date: formatArticleDate(article.date),
    title: article.title,
    href: `/article/${article.slug}/`,
    image: article.image,
    alt: article.imageAlt,
  }));
}
