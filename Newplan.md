# corewood.io Implementation Specification
## Version 1.0 | February 2026

> Machine-optimized specification for coding agent implementation.
> Prioritize semantic accuracy over prose readability.

---

## 1. SITE ARCHITECTURE

```
/                   # Homepage (single-page, all selling content)
/contact            # Contact form with screening questions
/schedule-meeting   # Redirect to Calendly
/about              # Mickey bio, photo, personal interests
/profile            # Case studies index
/profile/landscope  # Case study: LandScope
/profile/masquer    # Case study: Masquer
/profile/llm-apis   # Case study: Self-hosted LLM APIs
/blog               # Content marketing, technical posts
/blog/:slug         # Individual blog posts
/privacy            # Privacy policy
/climate            # [PLANNED] Climate tech founder landing page
```

### Navigation
- **Header**: Fixed/floating, dark background (forest-900)
- **Logo**: Centered in header, cream variant on dark
- **Links**: "About" and "Blog" flanking logo
- **Desktop**: Consider blog sidebar for recent posts
- **Mobile**: Hamburger menu, standard behavior

---

## 2. TYPOGRAPHY

### Font Stack
```css
--font-display: 'Roca Two', system-ui, sans-serif;      /* h1-h3, headlines */
--font-body: 'HK Grotesk Pro', system-ui, sans-serif;   /* body, paragraphs */
--font-mono: ui-monospace, 'SF Mono', 'Cascadia Code', 'Fira Code', monospace;  /* code, labels */
```

### Scale
```css
--text-hero: 4.5rem;      /* 72px - main headline only */
--text-h1: 3rem;          /* 48px */
--text-h2: 2.25rem;       /* 36px */
--text-h3: 1.5rem;        /* 24px */
--text-body: 1.125rem;    /* 18px */
--text-small: 0.875rem;   /* 14px */
--text-micro: 0.75rem;    /* 12px - labels, metadata */
```

### Voice
- Short, simple sentences
- Offset technical density with whitespace
- Digestible chunks over walls of text
- Airy feel through generous spacing

---

## 3. COLOR SYSTEM

### Ecosystem-Named Palette
Five families, each with natural referent. Climate tech alignment makes green intentional.

```css
:root {
  /* FOREST - Primary backgrounds, surfaces */
  --forest-900: #06150D;  /* near-black, deepest bg */
  --forest-800: #0B2B1A;  /* primary dark bg */
  --forest-700: #0F3B24;
  --forest-600: #143D26;
  --forest-500: #1A5C35;
  --forest-400: #2D7A4A;  /* success state */
  --forest-300: #4A8F63;

  /* EARTH - Warm grounding, editorial accents */
  --bark-900: #1A120C;
  --bark-800: #2C1E14;
  --bark-700: #3D2B1F;    /* primary dark accent */
  --bark-600: #5C4033;
  --bark-500: #6B4D3A;
  --bark-400: #8B6F5E;

  /* MORPHO - Interactive states, links, emphasis (rare) */
  --morpho-deep: #0C3547;
  --morpho-700: #0F4C6B;
  --morpho-600: #16688E;
  --morpho-500: #1B7EB0;  /* primary interactive */
  --morpho-400: #2A95C8;  /* hover state */
  --morpho-300: #4AADDA;
  --morpho-glow: #6EC5E9;

  /* DART - Alerts, errors, critical states */
  --dart-deep: #5C1410;
  --dart-900: #7A1A14;
  --dart-800: #962118;
  --dart-700: #B5281C;
  --dart-600: #CC3022;
  --dart-500: #E23D28;    /* primary error */
  --dart-400: #E85A48;
  --dart-300: #ED7E6E;
  --dart-glow: #F2A093;

  /* CREAM - Text, light surfaces */
  --cream-50: #FAF7F0;
  --cream-100: #F5F0E6;   /* primary text on dark */
  --cream-200: #EBE4D4;
  --cream-300: #E0D6C2;
  --cream-400: #D4C9AE;
  --cream-500: #C4B899;
  --cream-600: #A69E86;   /* secondary text */
  --cream-700: #8A8370;   /* muted text */

  /* SEMANTIC */
  --color-success: var(--forest-400);
  --color-warning: #B87333;  /* copper */
  --color-error: var(--dart-500);
  --color-info: var(--morpho-500);
}
```

### Usage Rules
- Page background: `forest-900` or `forest-800`
- Primary text: `cream-100` on dark
- Secondary text: `cream-600` on dark
- Muted/labels: `cream-700`
- Interactive: `morpho-400` default, `morpho-300` hover
- Morpho usage: Max 10-15% of any page. Rare accent only.
- Dart usage: One full-intensity `dart-500` per screen max

---

## 4. VISUAL DESIGN SYSTEM

### Overall Feel
- Dark, clean, bold
- Organic palette + Architectural geometry
- Natural, comfortable, approachable
- Understated with technical content in digestible pieces

### 45° Chamfered Corners
Signature architectural element. Creates tension with organic palette.

```css
/* Chamfer sizes - proportional to element */
--chamfer-sm: 8px;   /* small elements, chips */
--chamfer-md: 16px;  /* cards, containers */
--chamfer-lg: 24px;  /* sections, hero elements */

/* Full chamfer (all 8 corners) */
.chamfer-full {
  clip-path: polygon(
    var(--chamfer) 0,
    calc(100% - var(--chamfer)) 0,
    100% var(--chamfer),
    100% calc(100% - var(--chamfer)),
    calc(100% - var(--chamfer)) 100%,
    var(--chamfer) 100%,
    0 calc(100% - var(--chamfer)),
    0 var(--chamfer)
  );
}

/* Diagonal emphasis (top-left, bottom-right only) */
.chamfer-diagonal {
  clip-path: polygon(
    var(--chamfer) 0,
    100% 0,
    100% calc(100% - var(--chamfer)),
    calc(100% - var(--chamfer)) 100%,
    0 100%,
    0 var(--chamfer)
  );
}
```

### Chamfer Hierarchy
- **Section containers**: Full chamfer (all corners)
- **Cards/panels**: Full chamfer
- **Buttons/CTAs**: Diagonal chamfer (top-left, bottom-right)
- **Background sections**: No chamfer (square)
- **The logo mark**: Stays organic/round (NO chamfer)

### Plates & Rivets Effect
Sections appear as sheet metal plates riveted to background.

```
STRUCTURE:
┌─────────────────────────────────────────────┐
│  Background layer (forest-900, light wash)  │
│  ┌─────────────────────────────────────┐    │
│  │  Dark plate (forest-800)            │    │
│  │  45° chamfered corners              │    │
│  │  Subtle inner shadow                │    │
│  │  ○ ○ ○ ○  rivet accents (corners)   │    │
│  │  Content here                       │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

Implementation notes:
- Background: Slight luminosity variation, not flat
- Plates: Elevated via subtle shadow or border
- Rivets: Small circles at corners, optional decorative
- Sections alternate: light-under → dark plate → light-under

### Whitespace
Generous spacing throughout. Let it breathe.

```css
--space-section: 120px;   /* between major sections */
--space-block: 64px;      /* between content blocks */
--space-element: 32px;    /* between related elements */
--space-tight: 16px;      /* within components */
```

---

## 5. LOGO

### Assets
- `corewood_symbol_transparent_ON-DARK.png` — Cream rings on transparent
- `corewood_symbol_transparent_ON-LIGHT.png` — Green rings on transparent

### Usage
- **Header (fixed)**: Centered, cream variant, scaled down
- **Hero section**: Background element, larger, cream variant, subtle
- **Dark backgrounds**: Cream variant always
- **Light backgrounds**: Green variant
- **The mark stays organic** — Does NOT adopt 45° chamfer language

### Hero Treatment
Logo centered in background of hero section, large scale, low opacity or subtle treatment. Text overlays.

---

## 6. HOMEPAGE STRUCTURE

### Section Flow
```
┌──────────────────────────────────────────────┐
│ HEADER (fixed, floating, dark)               │
│ [About]      ◉ COREWOOD MARK ◉      [Blog]   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ HERO (~100vh)                                │
│                                              │
│            ◉ [Large mark in bg]              │
│                                              │
│     Hard Problems.    Simple Solutions.      │
│                                              │
│         [scroll triggers split]              │
└──────────────────────────────────────────────┘
         ↓ scroll
┌──────────────────────────────────────────────┐
│ TICKERS (~80vh)                              │
│                                              │
│   PROBLEMS ↑         │    SOLUTIONS ↓        │
│   ─────────────      │    ─────────────      │
│   identity           │    secure design      │
│   security           │    architectural...   │
│   deployments        │    requirements...    │
│   poor performance   │    rapid POC...       │
│   complexity         │    production-first   │
│   ...                │    ...                │
│                                              │
│              [Light CTA]                     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ FOUNDER TIER + TESTIMONIAL                   │
│                                              │
│ "You are the pioneer tree..."                │
│ [Full founder copy - see Section 7]          │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ "Mickey is a rare kind of visionary..."│   │
│ │ — Mitch Rawlyk, CEO, LandScope         │   │
│ └────────────────────────────────────────┘   │
│                                              │
│              [Medium CTA]                    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ SCALING TIER + TESTIMONIAL                   │
│                                              │
│ [Scaling copy - TBD]                         │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ "What makes Mickey invaluable..."      │   │
│ │ — Ranjan Subbiah, Eng Manager, Uplight │   │
│ └────────────────────────────────────────┘   │
│                                              │
│              [Medium CTA]                    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ ENTERPRISE TIER + TESTIMONIAL                │
│                                              │
│ [Enterprise copy - TBD]                      │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ "In RECORD TIME, he both produced..."  │   │
│ │ — Alisha "Bee", Wind, Bees & Earth     │   │
│ └────────────────────────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ CLOSING CTA (~60vh)                          │
│                                              │
│             Get unstuck →                    │
│                                              │
│        mickey@corewood.dev                   │
│                                              │
│   Climate-aligned teams get preferred        │
│   pricing.                                   │
└──────────────────────────────────────────────┘
```

### CTA System

**Two paths based on readiness:**
- **Primary:** "Get unstuck →" → `/contact` (form with screening questions)
- **Secondary:** "Schedule a meeting →" → `/schedule-meeting` (redirects to Calendly)

**Rule: CTA every 150vh maximum**

| Location | Type | Copy | Destination |
|----------|------|------|-------------|
| After tickers | Light | "Get unstuck →" | /contact |
| After Founder tier | Medium | "Get unstuck →" | /contact |
| After Scaling tier | Medium | "Schedule a conversation →" | /schedule-meeting |
| After Enterprise tier | Light | "Schedule a conversation →" | /schedule-meeting |
| Closing section | Both | Primary + Secondary | See below |

**Closing section layout:**
```
How we work:

Free consultation (30 min) — We talk through your situation
and pain points. No commitment, just fit.

         [Schedule a meeting →]

If we're aligned, we move to discovery — scoping the actual
engagement, defining requirements, and determining whether
you need a project or ongoing support.

Some teams skip discovery and move directly into a consulting
retainer. For project work, we need discovery to pin down your
requirements and price your offer effectively.

How we help:

Project — Scoped work, fixed price, clear handoff. You own
everything we build.

Retainer — Ongoing access for architecture decisions, code
review, team support, and the problems that come up at 2am.

Pricing:

Discovery starts at $120/hour for expert-level consultation.
Project and retainer pricing is scoped from discovery.

Climate tech and nonprofits get preferred pricing.

         ──────────

         Get unstuck →
         [Primary button → /contact]

         Two-week discovery. Fixed scope.
         You own everything we build.

         mickey@corewood.dev
```

---

## 7. AGREED COPY

### Hero
```
COREWOOD
Hard Problems. Simple Solutions.
```

### Ticker Content

**Hard Problems (left column, scrolling up):**
- identity
- security
- deployments
- poor performance
- complexity
- sprawl
- observability
- monitoring & alerting
- geographic information systems
- API integrations
- self-hosted LLMs / ML models
- retrieval augmented generation
- cloud infrastructure

**Simple Solutions (right column, scrolling down):**
- Secure, consistent, reliable systems
- Secure design
- Architectural planning
- Requirements engineering
- Rapid POC / prototyping
- Production-first mindset
- Thoughtful observability
- Fast iterations
- Extensive documentation & design detail
- Architecture
- As-fast-as-possible languages
- Automation
- LLM-assisted automation ("agentic")

### Founder Tier (FINAL COPY)
```
Founder.

You are the "pioneer tree" of the business ecosystem. Quick and
light, you fall on barren soil and either perish or take root
and thrive.

Pioneer trees grow where other trees cannot. After catastrophes
like a landslide or a hurricane. Disruption becomes opportunity.

Their seeds catch in the wind, and they condition the land to
grow more durable, impactful vegetation. Small plants take hold
and thrive in the shade provided by the fast growing tree. But
pioneer trees face risk, too. Eager to grow, they can be
weak-rooted and easily blown down.

Corewood focuses on the forest of tomorrow by helping founders
contextualize, define, and create the software systems you need
to ground your business; your stabilizing roots. Forward looking
to concerns like integrated monitoring dashboards. Integration
tests and deployment automation. Fast moving enough to enable
you to grow instead of perish.

By introducing holistic infrastructure early, we provide the
deep roots to withstand the forces of nature.
```

### Scaling Tier (FINAL COPY)
```
Scaling.

Have you seen a young forest growing? It isn't orderly.

Plants compete for sunlight, water, nutrients. Vines tangle,
branches collide, and the understory is chaos — which is fine,
because chaos means life is finding space to grow.

We help you break out of the brush and into the canopy by
identifying your friction points, accelerating new standards
with minimal current-system rework, and providing the
organizational support your team needs.
```

### Enterprise Tier (FINAL COPY)
```
Enterprise.

Massive ecosystems sometimes struggle to change quickly enough.
Complex feedback loops can lead to entrenched patterns.
Entrenched patterns undermine agility.

To combat this, Corewood employs a multi-stakeholder business
context assessment. From this, we employ requirement
engineering techniques to identify the product use cases.

This is where Corewood differs: Product use cases inform an
architectural discovery process. The architectural requirements
determine the infrastructure.

The effect? Features "fall into place."
We can help you adapt structurally because we think-and-act
structurally.
```

### Testimonials

**With Founder tier — Mitch Rawlyk, CEO & Founder, LandScope:**
```
"Mickey is a rare kind of visionary because he has an
extraordinary ability to understand and realize your vision, and
enmesh it within his own. This gift comes from genuine empathy
and a deep understanding of what founders and creators are
really trying to build.

When I first met Mickey, I was doing everything myself: cobbling
together a front-end, figuring out back-end architecture,
handling marketing, creating content, and trying to sell—all at
once. I had the bare bones of an MVP and enough determination to
probably get it off the ground. It would have worked for a
while, but it wouldn't have been scalable. It probably wouldn't
have been secure either, because I know next to nothing about it.

Not only did Mickey take what I had and cleaned it up, but he
took my vision and transformed it into something built on a
foundation of scalability, security, and agility. He understood
not just what I was trying to build, but why it needed to be
built. The product that emerged is sustainable and positioned
for real growth.

If you're looking for someone who can take an idea and turn it
into a reality that's built to last, I can't recommend Mickey
highly enough. He's the partner every founder wishes they had,
and comes with an infectiously high level of energy."
```

**With Scaling tier — Ranjan Subbiah, Engineering Manager, Uplight Inc:**
```
"What makes Mickey invaluable as a technology leader is his
ability and desire to see the big picture. When designing a
system he prioritizes understanding the problem from a
functional and non-functional perspective and building a
conceptual model for the solution; all of this before diving
into the technical details.

In my experience, Mickey's approach to system design has yielded:
- Early delivery, under budget!
- Shared understanding across the team; leveling-up junior team members
- Detailed documentation that speaks to technical and non-technical audiences
- A system that effectively models and encapsulates hairy, real world complexity
- A system that is designed to scale with the number of users, stakeholders and even engineers

Mickey is a force of nature; his approach to leadership and
technical rigor has not only resulted in strong and reliable
software but has also elevated the skills and confidence of
those on his team. His contributions have set a benchmark for
what strong technical leadership looks like."
```

**With Enterprise tier or Closing — Alisha "Bee", Founder, Wind, Bees & Earth:**
```
"This is my pleasure to recommend Mickey for both his high-level
technical acumen and lighting-fast laser focus! Starting this
Summer 2025, I was fortunate to observe Mickey's abilities
in-action.

More specifically, Micky was the first instrument in taking a
novel software and streamlining it into a more perfected state.
This software he improved, called LandScope, was the life's work
of its originator. The software was in soft launch when Mickey
took it on with his full energy and commitment.

In RECORD TIME, he both produced and oversaw the completion of
its next iteration. From integrated functionality inside a
common Internet browser, to ensuring FAST-running data sets into
visuals, demonstrations of the improved LandScope have literally
impressed everyone who sees it.

The next phase of the LandScope software is currently being
produced by Mickey and I am so excited and cannot wait to see
what he does next for our team."
```

---

## 8. INTERACTIONS & ANIMATIONS

### Hero Split Animation
On scroll past hero fold:
1. "Hard Problems." translates left
2. "Simple Solutions." translates right
3. Creates two-column frame for ticker section
4. Mark remains centered (stable point)

### Tickers
- Two independent columns
- Problems scroll upward (continuous)
- Solutions scroll downward (continuous)
- Speed: Gentle, readable (~30px/s)
- Pause on hover
- CSS-only if possible, minimal JS

### Morpho Shift (Interactive elements)
```css
.interactive {
  background: var(--morpho-500);
  transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.interactive:hover {
  background: var(--morpho-400);
}
.interactive:focus {
  background: var(--morpho-300);
  box-shadow: 0 0 0 3px rgba(42, 149, 200, 0.25);
}
```

### Animation Budget
- Max 2 animations per page
- Allowed: Hero split, ticker scroll
- Everything else: Static
- Use `IntersectionObserver` for scroll activation
- No scroll-jacking — user controls speed

---

## 9. RESPONSIVE BEHAVIOR

### Breakpoints
```css
--bp-mobile: 480px;
--bp-tablet: 768px;
--bp-desktop: 1024px;
--bp-wide: 1280px;
```

### Mobile Considerations
- Tickers become single column, alternating
- Header: Hamburger menu
- Chamfer sizes reduce proportionally
- Touch targets: 44px minimum
- Performance critical (40% abandon >3s)

---

## 10. PERFORMANCE REQUIREMENTS

### Targets
- LCP: < 1.0s
- FID: < 100ms
- CLS: < 0.1
- Total page weight: < 500KB

### Implementation Notes
- No framework bloat (the site proves the engineering philosophy)
- Static generation preferred
- System fonts for mono
- Self-host display fonts (Roca Two, HK Grotesk Pro)
- SVG for logo and icons
- Lazy load below-fold images
- Minimal JavaScript

---

## 11. ACCESSIBILITY

### Requirements
- WCAG 2.1 AA minimum
- All color combinations pass contrast ratios
- Focus states visible
- Keyboard navigable
- Screen reader compatible
- Reduce motion respected

### Tested Contrast Ratios
- cream-100 on forest-800: 11.2:1 ✓ AAA
- cream-100 on forest-900: 14.8:1 ✓ AAA
- morpho-400 on forest-800: 4.7:1 ✓ AA Large
- dart-400 on forest-800: 4.4:1 ✓ AA Large

---

## 12. STRATEGIC NOTES

### Target Audience Priority
**Primary: Founders** — Lower return, greater impact. Speaking to them directly.

### Climate Tech
- Substantial discount for climate-aligned teams
- Mentioned in closing CTA
- Dedicated landing page planned (/climate)
- Green palette is intentional signal, not accidental

### Brand Voice
- Direct without hedging
- Technical without performing
- Opinionated but evidence-based
- Never: "cutting-edge," "next-gen," "revolutionary," "leverage," "synergy"

---

## 13. PAGES DETAIL

### About Page
- Mickey bio (general, not exhaustive)
- Photo
- Personal interests
- Humanization without oversharing
- Maintains dark theme

### Blog Page
- Desktop: Sidebar with post list, main reading pane
- Post list: Chamfered cards
- Reading pane: Clean typography, generous whitespace
- Dark theme continues
- Code blocks styled with palette

### Contact Page (/contact)
Screening form using PostHog Surveys (inline display).

**Form Fields:**
```
1. Name
   [text field, required]

2. Email
   [email field, required]

3. What best describes your stage?
   [select, required]
   - Pre-launch — building toward first customers
   - Early traction — some customers, finding fit
   - Scaling — product works, growing fast
   - Established — optimizing what exists

4. What's the problem you're trying to solve?
   [textarea, required, 2-3 sentences prompt]

5. What's your timeline?
   [select, required]
   - Urgent — need to move in the next 2 weeks
   - Soon — next month or two
   - Planning — exploring options for later
   - Not sure yet

6. How did you find Corewood?
   [text field, optional]
```

**Implementation:** PostHog Surveys with inline display mode. Responses flow into PostHog alongside analytics. Session replays tie to form submissions automatically.

**Below form — escape hatch:**
```
──────────

Rather talk live?
Schedule a meeting → [link to /schedule-meeting]
```

**Design:**
- Dark theme consistent with site
- Chamfered container for form
- Generous field spacing
- Labels above fields, not placeholder text
- Focus states use morpho-400 outline

### Schedule Meeting Page (/schedule-meeting)
Simple redirect to Calendly URL. No intermediate content needed.

```
HTTP 302 redirect → [Calendly URL]
```

If JS-based routing, immediate `window.location.replace()` to Calendly.

---

## 14. FUTURE CONSIDERATIONS

### Planned
- `/climate` — Climate tech founder landing page
- Case studies (when content exists)
- Service detail pages (if needed)

### Not Now
- Pricing page (handled in conversation)
- Complex service taxonomy
- Team page (single operator)

## 15. PRICING & ENGAGEMENT MODEL

### Engagement Flow
```
Free consultation (30 min)
         ↓
    Agree to proceed?
         ↓
    ┌────┴────┐
    ↓         ↓
Retainer   Discovery ($120/hr)
    ↓         ↓
 Start    Proposal
             ↓
          Project
```

### Copy Block (for homepage closing section or /contact)
```
How we work:

Free consultation (30 min) — We talk through your situation
and pain points. No commitment, just fit.

         [Schedule a meeting →]

If we're aligned, we move to discovery — scoping the actual
engagement, defining requirements, and determining whether
you need a project or ongoing support.

Some teams skip discovery and move directly into a consulting
retainer. For project work, we need discovery to pin down your
requirements and price your offer effectively.

How we help:

Project — Scoped work, fixed price, clear handoff. You own
everything we build.

Retainer — Ongoing access for architecture decisions, code
review, team support, and the problems that come up at 2am.

Pricing:

Discovery starts at $120/hour for expert-level consultation.
Project and retainer pricing is scoped from discovery.

Climate tech and nonprofits get preferred pricing.
```

### Definitions

**Free consultation (30 min)**
- Determine fit
- Discuss pain points and situation
- No commitment, no cost
- CTA: Schedule a meeting → /schedule-meeting (Calendly)

**Discovery (paid, $120/hr)**
- Requirements engineering
- Architectural scoping
- Determine engagement shape (project vs retainer)
- Produces: proposal with fixed pricing for project work

**Project**
- Defined scope, fixed deliverables, fixed price
- Has clear end and handoff
- Client owns all work product

**Retainer**
- Ongoing access
- Architecture decisions, code review, team support
- Advisory/fractional-CTO relationship
- Can start immediately without discovery phase

### Preferred Pricing
- Climate tech companies
- Nonprofits
- Specific discount/terms handled in conversation, not published

---

## 16. ANALYTICS & PRIVACY

### Analytics
**Platform:** PostHog

**Features used:**
- Product analytics (page views, events)
- Session replay
- Surveys (contact form)

**Free tier:** 1M events, 5K recordings, 250 survey responses/month

### Privacy Policy
**Location:** /privacy (linked from footer)

**Discloses:**
- PostHog usage for analytics
- Session replay
- Survey/form data collection
- No third-party ad tracking
- No data sold

**Footer links:**
- Privacy Policy → /privacy

---

## 17. CTA COPY

### Light CTA (after tickers)
```
Research before you build.
Get unstuck →
```

### Medium CTA (after Founder tier)
```
Building software is the most expensive way to discover
your requirements.

Get unstuck →
```

### Medium CTA (after Scaling tier)
```
The tangle doesn't untangle itself.

Schedule a conversation →
```

### Medium CTA (after Enterprise tier)
```
Research before you build.

Schedule a conversation →
```

### Closing Section CTA
```
Building software is the most expensive way to discover
your requirements.

Research before you build.

Schedule a meeting →

Get unstuck →

mickey@corewood.dev

Limited engagements per quarter.
```

---

## 18. FOOTER

### Content
```
──────────────────────────────────────────────────────────

Privacy                                    mickey@corewood.dev

LinkedIn    GitHub                         © 2026 Corewood LLC

──────────────────────────────────────────────────────────
```

### Links
- **Privacy** → /privacy
- **LinkedIn** → https://www.linkedin.com/in/kylemickey/
- **GitHub** → https://github.com/orgs/corewood-tech
- **Email** → mailto:mickey@corewood.dev

### Design
- Dark background (forest-900)
- Minimal, single line or two lines max
- No chamfer on footer (it's the ground, not a plate)
- Cream-600 for text, morpho-400 for links on hover
- Copyright: © 2026 Corewood LLC

---

## 19. 404 PAGE

### Content
```
Not found.

The page you're looking for doesn't exist.

Return home →
```

### Design
- Branded, dark theme consistent with site
- Centered content
- Tree-ring mark above text (subtle, low opacity)
- "Return home →" links to /

---

## 20. BLOG

### Architecture
SPA, no server. Static generation or client-side rendering.

### List View (/blog)
- Tiles/cards for each post
- Chamfered cards consistent with site
- Filters by tag/category
- Order by date (newest first default)
- Search (optional, client-side)

### Card Content
- Title
- Date
- Excerpt or first ~150 chars
- Tags (if any)
- Read time (optional)

### Post View (/blog/:slug)
- Full post content
- Date and read time at top
- Back to blog link
- Typography optimized for reading (larger line-height, constrained width)
- Code blocks styled with palette (forest-800 bg, cream text, morpho for syntax highlights)
- Images: full-width within content container

### Sidebar (desktop)
- Sticky post list or recent posts
- Current post highlighted
- Quick nav between posts without returning to list

---

## 21. FORM STATES

### Contact Form (/contact)

**Success state:**
```
Thank you, we will be in touch very soon.
```
- Replaces form after successful submit
- Centered, simple
- Optional: "Schedule a meeting →" link below for immediacy

**Error state:**
- Inline field validation (red border, error text below field)
- General error message if submission fails:
```
Something went wrong. Please try again or email mickey@corewood.dev directly.
```
- No page reload on error

---

## 22. ABOUT PAGE

### Content
```
About

Corewood

"Hard problems. Simple solutions."

That's not a catchphrase. It's a tried, tempered approach.

Simple does not mean easy or primitive. Simple solutions only
emerge when the problem space gets deeply understood. The
simple solution is like a magic eye in the noise.

Simple solutions take more care and planning than complex
noise. Why make the investment?

Operations. Complex solutions introduce operations risk.

We play the long game. Simple solutions that last.

──────────

Founder

[PHOTO: Mickey headshot]

Our founder, Mickey, got obsessed with software and solving
technical problems. Self-taught and unconventional, Mickey
spent over a decade taking on hard problems across
organizational silos.

Many engineers stick on a team and do similar work for months
on end. Mickey never did that. As a full stack engineer he
developed testing frameworks. As an API engineer he learned
infrastructure automation.

Mickey quickly learned that silos kill efficiency. The best
solutions require infrastructure, app code, and data handling
systems to coordinate. How can we do that when each concern
is a different team? Quick features quickly get mired in
inter-team bureaucracy.

The way out? Know what you're doing. Take the time to win over
the stakeholders. Drive to a simpler, more effective solution.

──────────

Technologies

Clouds: AWS. GCP. DigitalOcean. Azure.

Backends: GoLang, Rust. Some Python or TypeScript for
serverless. For most problem spaces we recommend binary.

Frontends: React and Svelte. Or whatever you're using.

Data: Postgres, graph, key-value, document, big-table.
```

### Layout
- Dark theme consistent with site
- Centered content, constrained width (same as blog post reading width)
- Photo: Circular or chamfered crop, positioned with Founder section
- Technologies: Can be styled as subtle grid or inline list
- Dividers between sections (subtle rule or whitespace)

### Photo Specs
- Headshot of Mickey
- Hexagon frame (organic geometry, natural structure)
- Border: cream-400 or bark-500, subtle styling
- No drop shadow or glow
- Sized appropriately for web (200-300px display width)

---

## 23. MOBILE NAVIGATION

### Hamburger Menu Contents
```
About
Blog
Contact
Schedule a meeting
```

### Behavior
- Hamburger icon in header (right side)
- Opens full-screen or slide-in overlay
- Dark background (forest-900)
- Links in cream-100, morpho-400 on tap/hover
- Close button or tap-outside to dismiss

---

## 24. CASE STUDIES (/profile)

### Index Page (/profile)
- List of case study cards
- Chamfered card design consistent with site
- Each card: title, one-line summary, tech tags, link to full study

---

### Case Study: LandScope (/profile/landscope)

**Client:** LandScope (GIS/geospatial platform)
**Role:** CTO, Platform Architect
**Timeline:** 10 weeks from MVP to production

**The Problem:**
Mitch Rawlyk had built LandScope as a proof of concept running on Google Earth Pro. Customers wanted it in a browser. The MVP worked but wasn't scalable.

**The Approach:**
Instead of thinking "frontend," "backend," "data," "DevOps" as separate concerns, I thought about The System. What does this thing need to do, end to end, and how do we make it fast and reliable from day one?

**Architecture:**
- Frontend: React + Tailwind + TypeScript + CesiumJS (3D globe)
- Admin Panel: Svelte, gRPC/connect-rpc
- Backend: GoLang + gRPC, no frameworks
- Auth: OpenPolicyAgent, Zitadel v3
- Observability: OpenTelemetry
- Data: Postgres (not PostGIS — business logic on app server)
- Storage: S3-compatible object store
- Processing: All binary, no Python. Direct cgo and pipe integration with open source geospatial tools.
- Full deployment automation and observability out-of-the-box.

**Key Decisions:**
- Binary processing pipeline instead of Python: speed and operational simplicity
- Postgres without PostGIS: keep GIS logic in application layer for flexibility
- OpenTelemetry from day one: production observability isn't optional
- No frameworks: Google-style simplicity, direct control

**Results:**
- Under 20 minutes to process 2,000 acres (most layers in under 3 minutes)
- Production-grade from launch
- Platform handles real customers, real payments, real data
- Architecture scales from 1 to infinity

**Testimonial:**
"Mickey took my vision and transformed it into something built on a foundation of scalability, security, and agility." — Mitch Rawlyk, CEO & Founder, LandScope

**Tech Stack:**
`GoLang` `React` `CesiumJS` `gRPC` `OpenTelemetry` `Postgres` `Zitadel` `OPA`

---

### Case Study: Masquer (/profile/masquer)

**Product:** Masquer (Corewood flagship product)
**Type:** Data privacy infrastructure

**The Problem:**
Organizations handling sensitive data (healthcare, finance) face an impossible workflow: copy production data, scrub PII, re-upload, repeat. Every copy increases security risk. Every scrub takes time. Cloud providers charge by data volume. The whole process is slow, expensive, and backwards.

**The Approach:**
What if you didn't copy the data at all? What if privacy happened at read-time, on the fly, at the point of data access?

**Architecture:**
- Transparent PostgreSQL wire protocol proxy
- Real-time masking at read-time — no data duplication
- ML-powered PII detection (ONNX runtime, DeBERTa)
- Deterministic masking: same PII value → same masked output (referential integrity preserved)
- Format-preserving transformations: masked data still works in applications
- Runs entirely on-premise — zero data leaves your infrastructure

**Technical Differentiators:**
- Go-native tensor operations: 90% memory reduction vs Python implementations
- Binary tokenizer: 10-100x faster startup than JSON tokenizers (standard)
- Session pooling with 512-token slicing for concurrent inference
- Up to 700 tok/sec on CPU

**Compliance Value:**
Masquer gives customers an easy way for auditors to see that the org is protecting private data from third-party contractors. From the contract to the tech systems — demonstrable, auditable protection.

Relevant frameworks:
- SOC 2 CC6.1, CC6.3
- ISO 27001 A.9, A.18
- NIST AC-1, AC-3, AC-6, SC-28
- HIPAA, CCPA, GDPR

**Use Cases:**
- Development against production-like data without exposure risk
- QA testing with realistic data shapes
- Analytics on sensitive datasets
- Third-party integrations with privacy guarantees

**Tech Stack:**
`GoLang` `ONNX` `PostgreSQL` `DeBERTa` `OpenPolicyAgent` `gRPC`

---

### Case Study: Self-Hosted LLM APIs (/profile/llm-apis)

**Project:** Custom LLM Inference Engine
**Type:** R&D / Internal Product
**Status:** In development

**The Problem:**
Companies using OpenAI/Anthropic APIs face three concerns:
1. Cost volatility — providers can raise prices anytime
2. Data privacy — your prompts and data flow through third-party systems
3. Control — operational consistency depends on someone else's infrastructure

The standard self-hosted alternatives (vLLM, llama.cpp server) are Python-based or bring their own operational complexity.

**The Approach:**
ML should be an engineering concern like databases or caching. No Python. Single binary. Custom GPU kernels.

**What We're Building:**
- GoLang API server with CGo bindings to llama.cpp
- Custom binary tokenizer (written from scratch)
- Custom GPU kernels (Metal first, portable to CUDA):
  - Concurrent Q/K/V dispatch
  - Fused QKV projection
  - Quantized KV cache (Q8)
  - Function constant specialization
- Dynamic KV cache management (vs static preallocation in vLLM/llama.cpp)
- Batched attention with continuous batching
- Single binary deployment

**Why Custom Kernels:**
The existing frameworks make tradeoffs we don't want. We're optimizing for decode latency (the constraint that matters for interactive use), dynamic memory management, and operational simplicity.

**Status:**
R&D. Not yet deployed to production. Available for early adopter engagements.

**Tech Stack:**
`GoLang` `CGo` `Metal` `CUDA` `llama.cpp` `GGUF` `Custom GPU Kernels`

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-05 | Initial spec from conversation |

---

*End of specification*