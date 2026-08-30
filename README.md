````markdown
# LATENT

> You were never just scrolling.

<p align="center">
  <a href="https://latent-thrive.vercel.app">
    <strong>↗ Enter LATENT</strong>
  </a>
</p>

---

## What is LATENT?

LATENT is an interactive experiment exploring how recommendation systems learn from the smallest details of human behavior.

A pause.

A click.

A skip.

A moment of hesitation.

To a person, these feel insignificant.

To an algorithm, they are signals.

LATENT puts the user inside that feedback loop and lets them experience what happens when those signals are collected, interpreted, and used to shape what comes next.

Instead of explaining algorithmic personalization through static information, LATENT makes the user **participate in the system**.

You scroll.

You choose.

The system observes.

The feed adapts.

A profile emerges.

Then the interface shows you what happened.

---

## The Core Idea

Most recommendation systems are designed to feel invisible.

You see a feed.

You interact with it.

The system learns.

The feed changes.

And the cycle repeats.

LATENT makes that invisible process visible.

```text
       USER
         │
         ▼
    INTERACTION
         │
         ▼
      SIGNALS
         │
         ▼
   SYSTEM LEARNS
         │
         ▼
    FEED ADAPTS
         │
         ▼
       USER
         │
         └───────────────┐
                         ▼
                      SIGNALS
````

The experience is built around one question:

> **How much can a system learn about you from the things you barely notice doing?**

---

## The Experience

LATENT unfolds as a progressive interactive journey.

### 01 - THE SURFACE

The experience begins as something familiar.

A feed.

Content.

Choices.

Nothing immediately tells the user exactly what is being measured.

The system begins observing.

---

### 02 - THE SIGNAL

Small interactions start becoming meaningful.

Attention.

Dwell time.

Selection.

Skipping.

Hesitation.

The interface gradually hints that something beneath the surface is responding to the user.

---

### 03 - THE CHOICE

The user is presented with competing pieces of content.

They choose naturally.

There is no correct answer.

The choice itself becomes a signal.

What feels like a simple decision to the user becomes information for the system.

---

### 04 - DIVERGING PATHWAYS

One decision creates different possible futures.

LATENT reveals the path the user experienced alongside the path they never saw.

The question becomes:

> **What would your feed have looked like if you had chosen differently?**

The user doesn't just hear about personalization.

They see its consequences.

---

### 05 - THE INTEREST FINGERPRINT

The system constructs an algorithmic representation of the user's behavior.

Signals such as:

* Curiosity
* Outrage
* Novelty
* Familiarity
* Dwell

are translated into an evolving interest fingerprint.

But the distinction is important:

> **This is not necessarily who you are.**
>
> **It is who the system thinks you are.**

---

### 06 - THE AUDIT

The experience eventually turns itself inside out.

The signals that were invisible during the journey become visible.

Actions are connected back to the profile they influenced.

What felt like ordinary browsing is revealed as continuous data generation.

And the experience arrives at its final realization:

# YOU WERE NEVER JUST SCROLLING.

---

## Why the Interaction Matters

LATENT does not use interaction merely as decoration.

The user's behavior is part of the narrative.

```text
ACTION
  ↓
SIGNAL
  ↓
INTERPRETATION
  ↓
ADAPTATION
  ↓
NEW CONTENT
  ↓
NEW ACTION
```

The interface therefore becomes part of the argument.

The website doesn't simply **talk about** algorithmic influence.

It **demonstrates** it.

---

## Design Philosophy

LATENT was intentionally designed to avoid the visual language of a conventional dashboard, SaaS product, or generic AI interface.

The visual system is built around restraint.

### Dark Environment

A near-black foundation creates depth and allows important signals to emerge.

### Controlled Color

Cyan acts as the primary system signal.

Red is reserved for emotional or opposing states.

The palette stays deliberately limited.

### Editorial Typography

Large typography establishes the narrative.

Monospace metadata represents the system layer.

The distinction creates a visual separation between:

```text
WHAT THE USER EXPERIENCES

and

WHAT THE SYSTEM SEES
```

### Thin Technical Surfaces

Borders, spacing and subtle surfaces create a technical atmosphere without turning the interface into a conventional developer dashboard.

### Motion With Purpose

Animation exists to communicate:

* progression
* state
* cause and effect
* system response
* spatial depth

Nothing moves simply because it can.

---

## Scroll as an Interaction

Scrolling is treated as part of the experience rather than simply a method of navigation.

As the user moves through LATENT, the visual environment evolves with them.

The experience uses:

* Scroll-linked transitions
* Layered parallax
* Atmospheric background changes
* Progressive visual states
* Depth
* Micro-interactions
* Section-aware motion

The goal is to make the user feel like they are moving through a continuously evolving system rather than a collection of disconnected pages.

---

## Behavioral Model

LATENT uses interaction signals to construct a simplified behavioral representation.

Conceptually:

```text
                USER
                 │
                 ▼
          ┌─────────────┐
          │ INTERACTION │
          └──────┬──────┘
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
     DWELL    SELECT     SKIP
        │        │        │
        └────────┼────────┘
                 ▼
          SIGNAL EXTRACTION
                 │
                 ▼
         BEHAVIORAL PROFILE
                 │
                 ▼
          CONTENT RESPONSE
                 │
                 ▼
              NEW FEED
```

The model is intentionally presented as an **algorithmic interpretation**, not as an objective psychological assessment.

---

## The Interest Fingerprint

The fingerprint represents what the system has inferred from the user's interactions.

It is not intended to answer:

> "Who are you?"

It answers:

> **"What does the system think you are interested in?"**

This distinction is central to the experience.

A user may behave differently in a controlled environment than they would in real life.

The fingerprint therefore represents **observed behavior within the experiment**, not a definitive description of a person.

---

## The Counterfactual

One of LATENT's central ideas is the feed you **didn't** receive.

Every choice creates a possible alternative.

```text
                    START
                      │
                      ●
                     / \
                    /   \
                   /     \
                PATH A   PATH B
                  │         │
                  ▼         ▼
               FEED A     FEED B
                  │         │
                  ▼         ▼
              PROFILE A  PROFILE B
```

The user experiences only one branch.

The other remains a counterfactual:

> **A different feed created by a different version of the same user.**

---

## Telemetry

LATENT uses telemetry as part of the storytelling system.

Signals can include interaction patterns such as:

* Selection
* Dwell
* Skipping
* Attention
* Preference
* Progression

The purpose is not to create an elaborate analytics dashboard.

It is to make invisible system behavior understandable.

The final audit connects:

**what you did → what the system observed → what the system inferred.**

---

## Technical Stack

| Technology              | Purpose                             |
| ----------------------- | ----------------------------------- |
| React                   | UI architecture                     |
| TypeScript              | Type-safe application logic         |
| Vite                    | Development and build tooling       |
| CSS                     | Layout, visual system and animation |
| JavaScript / TypeScript | Interaction and behavioral logic    |
| Vercel                  | Deployment                          |

---

## Architecture

```text
src/
│
├── assets/
│   └── Visual and media assets
│
├── components/
│   └── Reusable interface components
│
├── sections/
│   └── Experience stages
│
├── styles/
│   └── Global and component styling
│
├── App.tsx
│   └── Application composition
│
└── main.tsx
    └── Application entry point
```

---

## Engineering Principles

### Interaction should have consequences

When the user does something, the system should respond meaningfully.

### Complexity should remain understandable

The implementation can be complex.

The user's mental model should not be.

### Motion should communicate

Animations should reinforce state, hierarchy or progression.

### Performance is part of design

A visually immersive experience should still feel immediate and responsive.

### Responsive by design

The experience should retain its hierarchy and intent across screen sizes rather than simply shrinking the desktop interface.

---

## Accessibility

LATENT aims to make the experience accessible without compromising its visual identity.

Considerations include:

* Semantic structure
* Keyboard navigation
* Visible focus states
* Readable contrast
* Touch-friendly controls
* Reduced-motion support
* Non-color-dependent states
* Audio-independent interaction

The goal:

> **Immersive, not exclusive.**

---

## Performance

Visual ambition should never become visual friction.

The experience is designed with attention to:

* Efficient animations
* GPU-friendly transforms
* Optimized assets
* Controlled rendering
* Responsive layouts
* Reduced unnecessary computation

The objective is simple:

> **Make it feel expensive without making it feel heavy.**

---

## Responsive Experience

LATENT is designed to adapt across:

* Desktop
* Laptop
* Tablet
* Mobile

The experience adjusts:

* Layout
* Typography
* Visual density
* Interaction patterns
* Motion
* Background complexity

while preserving the core identity of the experience.

---

## Running Locally

### Requirements

* Node.js
* npm

### Clone the repository

```bash
git clone <repository-url>
cd latent
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## Environment Variables

If environment variables are required, create:

```text
.env.local
```

and add the required values.

Never commit secrets, credentials or API keys to the repository.

---

## Deployment

LATENT is deployed using Vercel.

### Live Experience

[https://latent-thrive.vercel.app](https://latent-thrive.vercel.app)

---

## Project Status

**Live · Actively refined**

Current development focuses on:

* Interaction design
* Scroll-driven experiences
* Visual transitions
* Responsive behavior
* Accessibility
* Performance
* Narrative clarity

---

## The Question Behind LATENT

Recommendation systems don't need to ask who you are.

They can infer it from what you do.

A pause can become a signal.

A choice can become a preference.

A preference can influence a recommendation.

A recommendation can influence your next choice.

LATENT makes that loop visible.

---

<p align="center">

# LATENT

### You were never just scrolling.

<br />

<sub>
An interactive exploration of attention, behavioral signals and algorithmic personalization.
</sub>

<br /><br />

<a href="https://latent-thrive.vercel.app">
<strong>ENTER THE EXPERIENCE ↗</strong>
</a>

</p>
```


See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
