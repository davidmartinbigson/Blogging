import { siteConfig } from "./site";

export type PageSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type StaticPage = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  kicker: string;
  intro: string;
  sections: PageSection[];
  /** Shown in the footer / index of trust pages. */
  showInSidebar: boolean;
};

const updated = "2026-10-01";

export const staticPages: StaticPage[] = [
  {
    slug: "about",
    title: "About Sage & Story",
    description:
      "Who we are, how the publication works, and the standard every article has to meet before it goes live.",
    updated,
    kicker: "About",
    intro:
      "Sage & Story is an independent digital magazine about the practical side of everyday life — food, health, money, home, technology and travel — with a small fiction studio attached. We are deliberately slow: a handful of well-made pieces each week instead of a flood of thin ones.",
    sections: [
      {
        heading: "What we publish",
        paragraphs: [
          "We publish three kinds of work. Practical guides answer a specific question completely — the kind of piece you bookmark and come back to. Explainers make a complicated subject understandable without flattening it. And short fiction, from the Story Studio, gives readers something to enjoy between the useful things.",
          "Every piece is written for an intelligent adult who is short on time. If a paragraph does not add information, it does not survive the edit.",
        ],
      },
      {
        heading: "How the work gets made",
        paragraphs: [
          "Our process has three stages. Research comes first: we read primary sources — studies, official guidance, product documentation, interviews — and keep notes on anything contested. Drafting comes second; we use AI tools to help structure and rewrite long material, in the same way a newsroom uses a wire service. Editing comes last and is entirely human: a person decides what is published, checks the claims, and rewrites anything that reads like a machine.",
          "Authors and editors are named on every article. Where a piece relies on a study, we link to it directly rather than to a summary of a summary.",
        ],
      },
      {
        heading: "What we will not do",
        paragraphs: [
          "We do not publish medical diagnoses, legal advice or personalised financial recommendations. We do not run pop-ups, autoplay video or interstitial ads. We do not accept payment for a positive review, and we do not publish sponsored posts that pretend to be editorial — if we ever run sponsored content, it is labelled at the top of the page.",
        ],
      },
      {
        heading: "How the site is funded",
        paragraphs: [
          "Sage & Story is reader-supported. Revenue comes from display advertising (Google AdSense), occasional affiliate links, and — eventually — paid subscriptions. Advertising is served in fixed slots that never cover text. Affiliate links are disclosed in the article where they appear.",
        ],
      },
      {
        heading: "Get in touch",
        paragraphs: [
          `Corrections are the highest priority inbox we have. If something is wrong, email ${siteConfig.email} with the URL and the detail, and we will update the article with a visible revision note.`,
        ],
      },
    ],
    showInSidebar: true,
  },
  {
    slug: "editorial-policy",
    title: "Editorial policy",
    description:
      "Our sourcing standards, correction process, AI disclosure and the rules that govern advertising and affiliate links.",
    updated,
    kicker: "Standards",
    intro:
      "This page explains how Sage & Story is produced. It is written to be read by readers, advertisers and search engines alike — because a publication that cannot describe its own standards should not be trusted with yours.",
    sections: [
      {
        heading: "Sourcing",
        paragraphs: [
          "Health and science claims are checked against peer-reviewed research, national health bodies (for example the NHS, CDC, WHO or NIH) or systematic reviews. Where the evidence is mixed, we say so and describe the disagreement instead of picking the most dramatic finding.",
          "Money content relies on regulator and government publications — central banks, tax authorities, consumer finance regulators — plus plainly labelled expert comment. Product recommendations come from documented testing or clearly described hands-on use.",
        ],
      },
      {
        heading: "AI use and disclosure",
        paragraphs: [
          "We use AI tools for research summarisation, drafting, restructuring and copy-editing. AI is not credited as an author, because it cannot take responsibility for a claim. A named human editor is accountable for every published word.",
          "Story Studio fiction is explicitly AI-assisted. Each story page says so, and stories are edited for pacing, consistency and originality before publication.",
        ],
      },
      {
        heading: "Review and updates",
        paragraphs: [
          "Guides that depend on prices, software versions or regulations are reviewed at least twice a year. Articles display a last-updated date; when a change affects the substance of the piece, we add a dated note at the top rather than quietly editing the text.",
        ],
      },
      {
        heading: "Corrections",
        paragraphs: [
          "If we get something wrong, we fix it and say that we did. Send corrections to the address on the contact page with the article URL. Factual errors are corrected within two working days; anything with a safety implication is corrected immediately.",
        ],
      },
      {
        heading: "Advertising and independence",
        paragraphs: [
          "Advertising is sold and served by Google AdSense in defined slots. Advertisers have no influence over editorial content and never see articles before publication. Affiliate links are disclosed in the article and never change a recommendation: if a product is not worth buying, we say so.",
        ],
      },
      {
        heading: "Comments and community",
        paragraphs: [
          "We do not currently host open comments. Reader mail is welcome and, with permission, may be quoted in a follow-up piece.",
        ],
      },
    ],
    showInSidebar: true,
  },
  {
    slug: "privacy-policy",
    title: "Privacy policy",
    description:
      "What data this site collects, why, how long it is kept, and how to exercise your rights under GDPR and CCPA.",
    updated,
    kicker: "Legal",
    intro:
      "This policy explains what happens to your information when you visit Sage & Story. We collect as little as possible, and we do not sell personal data.",
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "You can read everything on this site without an account. We collect two categories of data: (1) information you give us voluntarily, such as your email address when you subscribe to the newsletter or a message you send through the contact form; and (2) technical information collected automatically by our hosting and analytics providers, such as your approximate location, browser type, referring page and pages viewed.",
        ],
      },
      {
        heading: "Cookies and similar technologies",
        paragraphs: [
          "We use a small number of cookies. A preference cookie remembers whether you chose light or dark mode. Analytics cookies (if analytics is enabled) tell us which articles are read. Advertising cookies, set by Google and its partners, are used to measure and personalise ads.",
          "You can block or delete cookies in your browser at any time; the site continues to work. Where required by law, advertising cookies are only set after you consent.",
        ],
      },
      {
        heading: "Advertising",
        paragraphs: [
          "We use Google AdSense. Google and its partners may use cookies or device identifiers to serve ads based on your prior visits to this or other websites. You can opt out of personalised advertising in Google's Ads Settings, or manage third-party cookies at aboutads.info and youronlinechoices.eu.",
          "We do not knowingly serve interest-based advertising to children, and we do not pass your email address or contact-form content to advertisers.",
        ],
      },
      {
        heading: "Analytics",
        paragraphs: [
          "If analytics is enabled, we use it to understand aggregate readership — which sections are useful, which pages are slow. We configure analytics with IP anonymisation where the provider supports it, and we do not attempt to identify individual readers.",
        ],
      },
      {
        heading: "Email",
        paragraphs: [
          "Newsletter addresses are stored with our email provider and used only to send the newsletter you asked for. Every issue includes a one-click unsubscribe link. We do not rent, sell or share the list.",
        ],
      },
      {
        heading: "Retention and your rights",
        paragraphs: [
          `Contact messages are kept for up to 24 months. Newsletter addresses are kept until you unsubscribe. Depending on where you live, you may have the right to access, correct, delete, restrict or port your data, and to object to processing. Write to ${siteConfig.email} and we will respond within 30 days.`,
        ],
      },
      {
        heading: "Children",
        paragraphs: [
          "This site is not directed at children under 13, and we do not knowingly collect their personal information. If you believe a child has provided data, contact us and we will delete it.",
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "If this policy changes materially, we will note the change on this page with a new effective date. Continued use of the site after an update means you accept the revised policy.",
        ],
      },
    ],
    showInSidebar: true,
  },
  {
    slug: "cookie-policy",
    title: "Cookie policy",
    description:
      "A plain-language list of the cookies this site uses, what each one does, and how to control them.",
    updated,
    kicker: "Legal",
    intro:
      "Cookies are small text files stored by your browser. This page lists the ones this site can set and why. You can remove them at any time from your browser settings.",
    sections: [
      {
        heading: "Strictly necessary",
        paragraphs: [
          "These keep the site working and are always active. Our theme preference is stored in your browser's local storage (key: theme) so the page does not flash the wrong colours. No personal data is stored.",
        ],
      },
      {
        heading: "Analytics",
        paragraphs: [
          "If analytics is enabled, first-party analytics cookies help us count visits and see which articles are read. Data is aggregated. Analytics is disabled when no measurement ID is configured.",
        ],
      },
      {
        heading: "Advertising",
        paragraphs: [
          "Google AdSense may set cookies to measure ad performance and, where you consent, to personalise advertising. Typical Google advertising cookies include IDE and NID. These are controlled by Google, not by us.",
        ],
      },
      {
        heading: "Third parties",
        paragraphs: [
          "Third-party services used on this site — hosting, email, analytics, advertising — operate under their own privacy policies. We choose providers that offer data-processing agreements and reasonable retention limits.",
        ],
      },
      {
        heading: "How to control cookies",
        paragraphs: [
          "Every major browser lets you view, block and delete cookies (Chrome, Safari, Firefox and Edge all have a Privacy or Content settings panel). Blocking advertising cookies does not affect your ability to read the site. For interest-based advertising opt-outs, see Google Ads Settings or aboutads.info.",
        ],
      },
    ],
    showInSidebar: true,
  },
  {
    slug: "terms",
    title: "Terms of use",
    description:
      "The rules for using this website, including content ownership, acceptable use and limitation of liability.",
    updated,
    kicker: "Legal",
    intro:
      "By using Sage & Story you agree to these terms. They exist to keep things clear for readers, contributors and the people who host this site.",
    sections: [
      {
        heading: "Use of the site",
        paragraphs: [
          "You may read, print and share our pages for personal, non-commercial use. You may quote short excerpts with clear attribution and a link to the original article. Republishing an article in full, scraping the site, or repackaging our content for commercial use is not permitted without written permission.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "All text, design and original artwork on this site is owned by the publisher unless stated otherwise. Recipe ingredients and basic facts are not copyrightable; our method text, photography and illustrations are.",
        ],
      },
      {
        heading: "Acceptable use",
        paragraphs: [
          "Do not attempt to disrupt the site, probe it for vulnerabilities without permission, or use automated tools to copy content at scale. Do not submit unlawful, abusive or misleading material through any form on the site.",
        ],
      },
      {
        heading: "No professional advice",
        paragraphs: [
          "Content is provided for general information. It is not medical, legal, accounting or investment advice and must not be relied on as a substitute for professional guidance tailored to your circumstances.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "The site is provided on an 'as is' basis. To the fullest extent permitted by law, we are not liable for loss arising from reliance on content, from downtime, or from third-party services linked from this site. Nothing in these terms limits liability that cannot be excluded by law.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These terms are governed by the laws applicable at the publisher's place of establishment. If any provision is found unenforceable, the remaining provisions stay in effect.",
        ],
      },
    ],
    showInSidebar: true,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    description:
      "Full disclosure of the limits of our content, including health, finance and affiliate relationships.",
    updated,
    kicker: "Legal",
    intro:
      "Sage & Story publishes general information, not professional advice. This page states that as plainly as we can, section by section.",
    sections: [
      {
        heading: "Health and wellness",
        paragraphs: [
          "Our health writing is educational. It is not a diagnosis, a treatment plan, or a substitute for a qualified clinician who knows your history. Do not start, stop or change a medication or exercise programme based on this site. If you are pregnant, managing a chronic condition, or taking prescription medication, speak to a professional first.",
          "Where we describe a study, we link to it so you can read the original. Study results are averages; they do not predict what will happen to any one person.",
        ],
      },
      {
        heading: "Money and finance",
        paragraphs: [
          "Personal finance content is general education. We are not a licensed adviser and we do not know your income, obligations or risk tolerance. Tax rules and contribution limits change and differ by jurisdiction. Verify anything that affects a decision with a qualified professional or the relevant authority.",
        ],
      },
      {
        heading: "Product recommendations",
        paragraphs: [
          "We may earn a commission when you buy through some links. This does not affect price or which products we recommend. Recommendations reflect our editorial judgement at the time of writing; products change, and so do our opinions.",
        ],
      },
      {
        heading: "Fiction",
        paragraphs: [
          "Story Studio pieces are works of fiction drafted with AI assistance and edited by a human. Characters, businesses and events are invented. Any resemblance to real people or organisations is coincidental.",
        ],
      },
      {
        heading: "External links",
        paragraphs: [
          "We link to other websites when they are genuinely useful. We do not control them and are not responsible for their content, accuracy or privacy practices.",
        ],
      },
    ],
    showInSidebar: true,
  },
  {
    slug: "advertise",
    title: "Advertise with us",
    description:
      "Audience profile, ad formats and how to talk to us about sponsorship.",
    updated,
    kicker: "Work with us",
    intro:
      "Sage & Story reaches readers who are actively solving a problem — what to cook, how to save, how to fix — and who trust the source. That combination is what advertisers want, so long as it stays honest.",
    sections: [
      {
        heading: "Our audience",
        paragraphs: [
          "Readers are predominantly 25–54, search-driven, and arrive on a phone with a specific question. Sessions are long relative to the industry average because our guides are complete rather than teasers.",
        ],
      },
      {
        heading: "Formats",
        paragraphs: [
          "Display advertising is served by Google AdSense in fixed, viewable slots: one in-article unit, one sidebar unit on wide screens, and one footer unit. We do not run interstitials, pop-unders or autoplay audio.",
          "For direct partnerships we offer clearly labelled sponsored articles, newsletter placements, and category takeovers. Every paid placement is marked as such at the top of the page.",
        ],
      },
      {
        heading: "What we will not accept",
        paragraphs: [
          "No undisclosed paid reviews. No gambling, adult, or unlicensed financial products. No health claims that contradict the evidence. No placements that require us to remove words like 'may', 'can' or 'depends' from a sentence.",
        ],
      },
      {
        heading: "Get in touch",
        paragraphs: [
          `Email ${siteConfig.email} with the subject line "Advertising". We will send a current media pack with traffic, format specs and rates.`,
        ],
      },
    ],
    showInSidebar: false,
  },
];

export function getStaticPage(slug: string): StaticPage | undefined {
  return staticPages.find((page) => page.slug === slug);
}
