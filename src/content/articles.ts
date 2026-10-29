/**
 * Knowledge hub articles.
 *
 * Migrated from the client's existing site, which the content document asks
 * for: "Existing articles on the current site (weight-loss maintenance, sleep
 * and chronic pain) are strong and should be migrated, refreshed, and pointed
 * at the relevant money page." The body copy is theirs, transcribed from the
 * live pages rather than rewritten.
 *
 * ─── ADDING AN ARTICLE ─────────────────────────────────────────────────────
 *
 * Publish what the supplied document says and nothing else. The markdown
 * carries its own slug, meta title, meta description, excerpt and image
 * filenames in a block at the end; use those rather than writing new ones.
 *
 * ⚠️ `moneyPage` is OPTIONAL and should be left out unless it is asked for.
 *
 * It renders a standing callout after the opening — "Considering your
 * options? Read about X, or start with the free pre-screening quiz" — in
 * wording this file owns, not the article's. The two migrated articles have
 * one because the content document required each article to link its money
 * page inside the first two paragraphs, and a callout was the only way to
 * meet that without editing sentences that had not been re-approved.
 *
 * Articles supplied since are published as written. Bilal's instruction,
 * 2026-10-29: keep it on the two that had it, and do not add it to new
 * articles unless he says so. Setting it silently puts copy nobody wrote
 * into the top of someone's article.
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

/**
 * A link inside body copy, matched by the exact phrase it wraps.
 *
 * The phrase rather than an offset or a marker in the string, so the copy
 * stays readable as copy and a link cannot silently land in the middle of a
 * word when a sentence is edited. If the phrase is no longer present the link
 * is dropped rather than misplaced, and `article-links.test.ts` fails on it.
 *
 * Internal hrefs are site-relative. External ones are written in full and
 * `externalLinkProps` decides the tab and rel from the host, so no author has
 * to remember the rule.
 */
export interface ArticleLink {
  readonly text: string;
  readonly href: string;
}

export type ArticleBlock =
  | { readonly kind: "h2"; readonly text: string }
  | { readonly kind: "h3"; readonly text: string }
  | {
      readonly kind: "p";
      readonly text: string;
      readonly links?: readonly ArticleLink[];
    }
  | {
      readonly kind: "ul";
      readonly items: readonly string[];
      readonly links?: readonly ArticleLink[];
    }
  /** An ordered list, for steps where the order is the point. */
  | {
      readonly kind: "ol";
      readonly items: readonly string[];
      readonly links?: readonly ArticleLink[];
    }
  /**
   * A pull-out panel. The source documents use a blockquote for two distinct
   * jobs — a "quick answer" summary at the top and a support-numbers panel
   * near the end — and both read as asides rather than quotations.
   */
  | {
      readonly kind: "callout";
      readonly title: string;
      readonly text: string;
      readonly links?: readonly ArticleLink[];
    }
  /** A body image. The hero is separate; these sit between sections. */
  | {
      readonly kind: "image";
      readonly src: string;
      readonly alt: string;
    }
  /**
   * An FAQ block, rendered with the site's accordion.
   *
   * The questions were h3/p pairs when this article was first published,
   * which read as a wall of text at the foot of a long page. The accordion is
   * the same component the service pages and /faqs/ use, so a reader meets
   * one FAQ pattern across the site.
   */
  | {
      readonly kind: "faq";
      readonly items: readonly {
        readonly q: string;
        readonly a: string;
      }[];
    }
  /**
   * A simple data table with a header row.
   *
   * Rendered inside its own horizontally scrollable container, because a
   * three-column table does not fit a 360px phone and the page body must
   * never scroll sideways.
   */
  | {
      readonly kind: "table";
      readonly head: readonly string[];
      readonly rows: readonly (readonly string[])[];
    }
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
  /**
   * The service page this article points at, shown as a callout after the
   * opening paragraphs.
   *
   * Optional. The two migrated articles carry one because the content
   * document required each article to link its money page in the opening.
   * Articles supplied since are published as written, so this is set only
   * when it is asked for.
   */
  readonly moneyPage?: { readonly label: string; readonly href: string };
  readonly blocks: readonly ArticleBlock[];
}

export const ARTICLES: readonly Article[] = [
  {
    /*
     * Published 2026-10-29 from the supplied markdown. Its own metadata block
     * gave the slug, meta title, meta description, excerpt and the three
     * image filenames, and those are used verbatim rather than rewritten.
     *
     * The title here is the meta title, which is shorter than the document's
     * H1 and is what belongs in <title> and the card. The H1 the page renders
     * comes from this same field.
     */
    slug: "why-weight-comes-back-after-a-diet",
    title: "Why Weight Comes Back After Dieting: What Research Shows",
    description:
      "Why weight comes back after dieting: hunger hormones, metabolism and daily habits all play a part. Explore the research and when to speak to a practitioner.",
    topic: "Weight management",
    date: "2026-10-29",
    readTime: "8 min read",
    image: `${IMAGE_BASE}why-weight-comes-back-after-dieting-hero.webp`,
    imageAlt:
      "Open blank notebook, pen and cup of herbal tea beside eucalyptus on linen",
    blocks: [
      {
        kind: "p",
        text: "You lost the weight, felt proud, and then the kilos crept back. If you are wondering why weight comes back after dieting, you are not alone, and it is not simply a matter of effort. This article explains what happens in your body, which other factors can play a part, and where professional support fits in Australia.",
      },
      {
        kind: "callout",
        title: "Quick answer:",
        text: "After weight loss, your body tends to raise hunger signals and use less energy at rest. In one Australian study, hunger-related hormone changes were still present a year later. Habits, sleep, stress and medical conditions can also play a part. Results vary, so speak with a registered health practitioner about your situation.",
      },
      {
        kind: "h2",
        text: "Why weight comes back after dieting, and how common it is",
      },
      {
        kind: "p",
        text: "Regaining weight after a diet is common, and it usually reflects how your body responds to weight loss, not a lack of effort. Researchers describe a high rate of weight regain after diet-induced weight loss (Source: Sumithran et al., New England Journal of Medicine, 2011).",
      },
      {
        kind: "p",
        text: "Estimates of exactly how many people regain vary between studies and sources, so treat any single number with care. Repeated loss and regain has a name: weight cycling, or yo-yo dieting.",
      },
      {
        kind: "p",
        text: "The group affected is large. According to the Australian Institute of Health and Welfare's overweight and obesity report, about 67% of adults, around 13.2 million people, lived with overweight or obesity in 2022-24 (Source: AIHW, Overweight and obesity, 2026).",
        links: [
          {
            text: "Australian Institute of Health and Welfare's overweight and obesity report",
            href: "https://www.aihw.gov.au/reports/overweight-obesity/overweight-and-obesity/contents/how-many",
          },
        ],
      },
      {
        kind: "p",
        text: "Among adults, abdominal obesity rose from 41% to 48% between 2017-18 and 2022-24, and overweight and obesity was the biggest risk factor for ill health and death in Australia in 2024 (Source: AIHW, 2026).",
      },
      {
        kind: "h2",
        text: "What happens in your body after you lose weight",
      },
      {
        kind: "image",
        src: `${IMAGE_BASE}why-weight-comes-back-after-dieting-body-response.webp`,
        alt: "Simple diagram showing hunger signals rising and energy use falling after weight loss",
      },
      {
        kind: "p",
        text: "After weight loss, your body tends to push back. Hunger signals rise and the energy you use at rest can fall, which makes regain more likely.",
      },
      {
        kind: "p",
        text: "In a University of Melbourne and Austin Health study, 50 adults with overweight or obesity lost about 13 kg on a 10-week very-low-energy diet. Hormones that influence hunger shifted in ways expected to increase appetite, and the changes were still present a year later (Source: Sumithran et al., New England Journal of Medicine, 2011). The university's release reported that participants regained about 5 kg over that year (Source: University of Melbourne, 2011).",
      },
      { kind: "h3", text: "Appetite and hunger signals" },
      {
        kind: "p",
        text: "Leptin is a hormone that signals fullness, and ghrelin signals hunger. After weight loss, leptin tends to fall and ghrelin tends to rise, so you may feel hungrier and less satisfied by the same meal (Source: Sumithran et al., 2011).",
      },
      { kind: "h3", text: "Energy use" },
      {
        kind: "p",
        text: "Your basal metabolic rate is the energy your body uses at rest. After weight loss it can fall by more than your smaller body size alone would explain, a process called metabolic adaptation. How much it happens varies between people, and research is still developing.",
      },
      {
        kind: "h3",
        text: "The set point idea: what is established and what is debated",
      },
      {
        kind: "p",
        text: "Set point theory suggests the hypothalamus, the part of the brain that helps control weight, works to defend a weight range your body is used to. Researchers have measured changes in hunger and energy use after weight loss. Scientists still debate whether your body defends one fixed number.",
      },
      {
        kind: "table",
        head: [
          "What shifts",
          "How it can feel",
          "Why a diet alone may not address it",
        ],
        rows: [
          [
            "Appetite hormones (leptin, ghrelin)",
            "Hungrier, and less full after meals",
            "In the Melbourne study, hunger-related changes were still present a year later",
          ],
          [
            "Basal metabolic rate",
            "Weight creeps up on the amount that once held it steady",
            "Eating as you did at your old weight can lead to regain",
          ],
          [
            "Brain weight regulation (hypothalamus, set point)",
            "Weight drifts back towards a previous range",
            "Researchers are still working out how strongly this applies, so experiences differ",
          ],
          [
            "Habits and surroundings",
            "Old routines return when the diet ends",
            "A diet with an end date may not include a plan for what follows",
          ],
        ],
      },
      { kind: "h2", text: "Why the way a diet ends may matter" },
      {
        kind: "p",
        text: "Some diets focus on the weight-loss phase and say little about what comes after. That gap may be part of why weight comes back after dieting.",
      },
      {
        kind: "p",
        text: "Strict, all-or-nothing rules can be hard to keep. When one slips, it can feel like the whole diet has failed, and old habits return. A short plan with no maintenance phase can leave you without a guide for the weeks after the last weigh-in.",
      },
      {
        kind: "p",
        text: "Your surroundings matter too. Large portions, easy access to processed, calorie-dense food and less daily movement can all push in the other direction.",
      },
      {
        kind: "p",
        text: "These are features of the modern food and activity environment, not personal faults. Researchers call this the obesogenic environment. For a shorter read on the maintenance side, see our guide to keeping weight off over the long term.",
        links: [
          {
            text: "our guide to keeping weight off over the long term",
            href: "/article/why-weight-loss-is-difficult-to-maintain-and-what-actually-works-long-term/",
          },
        ],
      },
      { kind: "h2", text: "Other factors a diet alone will not fix" },
      {
        kind: "p",
        text: "Sometimes the answer sits outside your food diary. Health conditions and life factors can affect weight and appetite, and they are worth raising with a registered health practitioner.",
      },
      {
        kind: "p",
        text: "Examples include thyroid conditions, polycystic ovary syndrome (PCOS), sleep apnoea, depression and anxiety, and the hormonal changes of perimenopause and menopause. Some medicines can also affect weight. If you take any, do not stop them without advice, and ask your practitioner or pharmacist about it.",
      },
      {
        kind: "p",
        text: "Poor sleep and ongoing stress can influence appetite. Some people also eat in response to stress or low mood. Both are worth raising with your practitioner.",
      },
      {
        kind: "p",
        text: "A practitioner may also order pathology tests, such as thyroid function, glucose and cholesterol, to look for contributors.",
      },
      {
        kind: "h2",
        text: "What Australian sources say about keeping weight stable",
      },
      {
        kind: "image",
        src: `${IMAGE_BASE}why-weight-comes-back-after-dieting-guidance.webp`,
        alt: "Three closed books and a glass of water on a concrete surface",
      },
      {
        kind: "p",
        text: "In Australia, the RACGP describes obesity as a long-term health matter that needs ongoing management (Source: RACGP, 2025).",
      },
      {
        kind: "p",
        text: "The RACGP released an updated obesity position statement in March 2025. It calls for more government funding for longer GP consultations and fairer access to care, and describes obesity as a condition that can involve periods of relapse and remission (Source: RACGP, 2025).",
      },
      {
        kind: "p",
        text: "The NHMRC rescinded its 2013 clinical guidelines. A draft update to those guidelines, led by Deakin University, went to public consultation in 2024 (Source: Deakin University and the Department of Health and Aged Care, 2024). The National Obesity Strategy 2022-2032 lists tackling weight stigma as one of its principles.",
      },
      {
        kind: "p",
        text: "Dietitians Australia notes that both weight-focused and weight-neutral approaches have established health benefits (Source: Dietitians Australia, media release, 2021).",
      },
      {
        kind: "p",
        text: "No approach works the same for everyone, and no one can promise a result. Results vary, and a registered health practitioner can help you decide what is right for you.",
      },
      {
        kind: "h2",
        text: "Planning for after the diet: a maintenance checklist",
      },
      {
        kind: "p",
        text: "A maintenance plan is a set of decisions you make before a diet ends, so you are not guessing afterwards. Once you understand why weight comes back after dieting, you can plan around it.",
      },
      {
        kind: "ol",
        items: [
          "Expect hunger and energy changes. A slip afterwards is information, not failure.",
          "Define “after” before you finish. Decide which meal, movement and sleep routines you can keep.",
          "Consider check-ins. If it suits you, arrange periodic reviews with your GP, an Accredited Practising Dietitian or another registered practitioner.",
          "Plan for triggers. Think ahead about stress, travel, celebrations and low mood.",
          "Notice regain early. If weight starts returning, consider talking with your practitioner before reacting with a stricter diet.",
          "Revisit your goals. Ask your practitioner what a realistic, health-focused target looks like for you.",
        ],
      },
      {
        kind: "p",
        text: "Results vary and individual circumstances differ, so a registered health practitioner can help you adapt these steps. You can read more about our weight management service on our site.",
        links: [{ text: "weight management", href: "/weight-management/" }],
      },
      { kind: "h2", text: "Where professional support fits in Australia" },
      {
        kind: "p",
        text: "Support can come from several places, including your GP, an Accredited Practising Dietitian, a psychologist and a telehealth practitioner. The right mix depends on your health and goals.",
      },
      {
        kind: "p",
        text: "Understanding why weight comes back after dieting is a useful first step, and you do not have to work out the rest alone. A GP can review your health, order tests and refer you on. An Accredited Practising Dietitian, found through Dietitians Australia, can look at your eating patterns. A psychologist can support your relationship with food and weight.",
        links: [
          {
            text: "Dietitians Australia",
            href: "https://dietitiansaustralia.org.au/find-dietitian",
          },
        ],
      },
      {
        kind: "p",
        text: "Practitioners at Horizon Health Care Partners consult by video or phone across Australia. They review your history and goals and talk through options that are clinically appropriate for you.",
        links: [
          {
            text: "Practitioners at Horizon Health Care Partners",
            href: "/our-practitioners/",
          },
        ],
      },
      {
        kind: "p",
        text: "You and your practitioner decide on any treatment together in a consultation, and a consultation does not promise a particular outcome. Telehealth does not suit everyone, so your practitioner may recommend an in-person review or further tests. Consultation fees apply.",
      },
      {
        kind: "p",
        text: "If you would like to talk through your situation with an AHPRA-registered medical or nurse practitioner anywhere in Australia, the team at Horizon Health Care Partners is happy to help, and you can book a consultation when it suits you.",
        links: [{ text: "book a consultation", href: "/contact/" }],
      },
      { kind: "h2", text: "When to speak to a health professional sooner" },
      {
        kind: "p",
        text: "Speak with a registered health practitioner sooner if regain comes with other symptoms or worry about food.",
      },
      {
        kind: "ul",
        items: [
          "Your weight rises quickly and nothing in your routine has changed.",
          "You have new or unexplained symptoms, such as ongoing tiredness or other changes you cannot explain.",
          "Your weight or appetite changed after you started a new medicine. Do not stop it without advice.",
          "Dieting has become cycles of strict restriction and bingeing, or food and weight fill much of your thinking.",
          "Your mood is low, or you feel hopeless.",
        ],
      },
      {
        kind: "p",
        text: "This article is for adults. If you are pregnant or breastfeeding, speak with your GP before changing how you eat. If you are unsure whether telehealth suits you, how a telehealth consultation works explains when you may need an in-person review or emergency care.",
        links: [
          {
            text: "how a telehealth consultation works",
            href: "/how-it-works/",
          },
        ],
      },
      {
        kind: "callout",
        title: "Need support?",
        text: "In an emergency, call 000. For emotional support at any hour, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636. For eating or body image concerns, the Butterfly Foundation National Helpline is open 8am to midnight (AEST/AEDT), seven days a week, on 1800 33 4673. It is not a crisis line and is closed on national public holidays.",
      },
      { kind: "h2", text: "Frequently asked questions" },
      {
        kind: "faq",
        items: [
          {
            q: "Is it normal to regain weight after dieting?",
            a: "Yes, regaining weight after a diet is common, and researchers describe a high rate of regain after diet-induced weight loss (Source: Sumithran et al., 2011). Hunger and energy changes help explain why weight comes back after dieting. Estimates of exactly how many people regain vary between sources. Results vary, and a registered health practitioner can talk through your situation.",
          },
          {
            q: "Why do I regain weight after dieting?",
            a: "After weight loss, hunger hormones such as leptin and ghrelin tend to shift towards stronger appetite, and your basal metabolic rate can fall. Habits, sleep, stress, medical conditions and the food environment can add to this. In an Australian study, hunger-related hormone changes were still present a year after weight loss (Source: Sumithran et al., 2011).",
          },
          {
            q: "How much weight do people regain after dieting?",
            a: "It varies. In one Melbourne study of adults with overweight or obesity, people lost about 13 kg on a very-low-energy diet and regained about 5 kg during the year of follow-up (Source: University of Melbourne, 2011). Estimates of how many people regain differ between sources. Your own experience depends on your health, history and circumstances, so speak with a registered health practitioner rather than relying on averages.",
          },
          {
            q: "Does metabolism slow after weight loss?",
            a: "It can. Your basal metabolic rate, the energy you use at rest, may fall by more than your smaller body size alone would explain, which researchers call metabolic adaptation. How much this happens varies between people, and research is still developing. Appetite, habits and medical factors also matter, so metabolism is rarely the whole story.",
          },
          {
            q: "How long does metabolic adaptation last?",
            a: "The timing is not settled. A key Australian finding is about appetite hormones, which were still altered a year after weight loss in the Melbourne study (Source: Sumithran et al., 2011). Researchers are still studying how long changes in energy use last, and it may vary between people. A registered health practitioner can explain what this may mean for you.",
          },
          {
            q: "Is weight regain my fault?",
            a: "Weight regain is not a sign of personal failure. It reflects a mix of biology, habits, health conditions and the environment around you. The National Obesity Strategy 2022-2032 names tackling weight stigma as a principle (Source: National Obesity Strategy 2022-2032). If you feel stuck in a cycle of blame, your GP, a dietitian or a psychologist can support you.",
          },
          {
            q: "How do I stop gaining weight back after a diet?",
            a: "No single approach works for everyone, and no one can promise a result. Planning for the period after a diet, considering check-ins with a registered practitioner, and looking at sleep, stress and medical factors may help. Speak with a registered health practitioner, such as your GP or an Accredited Practising Dietitian, about what suits your circumstances. Results vary.",
          },
        ],
      },
      {
        kind: "note",
        text: "This article provides general information only and is not medical advice. Individual circumstances and results vary, so speak with a registered health practitioner about your own situation.",
      },
    ],
  },
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
