---
layout: layouts/blog-post.njk
title: "Precarious Infrastructure"
description: "Infrastructure teeters at the brink of collapse — but people carry on. Maybe that sounds like your team's software. Here's how to stop surviving and start building with intention."
date: 2026-02-08
keywords: "software infrastructure, requirements engineering, domain-driven design, clean architecture, software design, technical debt, AI engineering, software architecture, hard problems, Corewood"
readingTime: "4 min read"
ogType: "article"
ogImage: "/meta.png"
permalink: /blog/precarious-infrastructure/
---

The high-voltage wires tangle together precariously atop a teetering wooden pole, streamers reaching out to neighboring buildings.

Dirt roads tangle in and out, a complex maze of alleyways between paved thoroughfares.

Infrastructure teeters at the brink of collapse — but people carry on about their lives.

Maybe you're reading this, and you're thinking, "That sounds like my team's software."
Or maybe you're thinking: "I wish I had enough infrastructure to have that problem."

Either way, this situation is completely normal for software teams.

---

It happens because most of what the software team builds does not actually connect to user value. We call this the "80/20 rule" and the "Last Mile problem." The majority of engineering time gets spent on 20% of the work. And delivering the finished product to a customer presents the most expensive phase for many supply chains — digital ones included.

Naive minds rush to suggest the 80/20 rule means we could reduce time-to-market by 80% if we just skipped the waste. Naive, because the 80% "wasted effort" is the cost of discovering which 20% is actually critical. You cannot skip the exploration. You can only make it cheaper.

This is why Amazon builds distribution centers and warehousing infrastructure all over the United States. They don't try to make the last mile faster by driving trucks harder. They make the last mile shorter by investing in everything that comes before it. The warehouse in your city exists so the delivery van doesn't have to cross the country.

For your new or scaling software, the value proposition is the same: save money and time later by investing a bit more upfront effort. Pay now, save later. Or save now, pay later.

---

Many organizations choose to save now. We respect that.

But we also want you to have the choice.

We're your "do it right the first time" option. And doing it right doesn't mean doing it slow. It means doing the thinking before the building — so the building goes faster, and what you build actually holds up.

Of course, you do not need us to do this. Here's how.

---

Start with requirements engineering. Before your team writes code, figure out what the system actually needs to do for the business. Not a feature list. Not user stories on sticky notes. An honest assessment of what the software must accomplish, what constraints it operates under, and what "done" looks like. We have nothing but good things to say about the process laid out in the [Volere Requirements Process](https://volere.org). We've used it on several projects. It works because it forces you to surface information that was available but never gathered — eliminating the 80% of bugs that aren't software bugs at all, but requirements bugs. The code works fine. It just does the wrong thing.

Then, stop organizing your services by business function. Your "accounts" service does twelve of the same things as your "payments" service. Break things down by what they *do* — by capability — and then ask: what changes together? Those are your real boundaries. This is the core insight from Domain-Driven Design, and it addresses a problem that no amount of refactoring fixes if the boundaries are wrong.

Finally, learn the theory. Layered architecture. Clean architecture. Hexagonal architecture. These aren't academic exercises. They address real problems in how code communicates intention. When every engineer on the team can look at a module and immediately understand what it does, where its boundaries are, and how it fails — that's when your infrastructure stops teetering.

---

Maybe you're comfortable near the live wires. Maybe bumpy dirt roads don't bother you and you navigate the constant sense of catastrophic failure with grace.

Other people prefer intention. Order. A system that was built to hold up, not one that happens to still be standing.

The choice is yours. But you deserve to know there is one.

---

*If you want the deeper dive on requirements-first development, we wrote about that [here](/blog/product-engineering/).*

---

## Further Reading

- Juval Löwy, [*Righting Software*](https://rightingsoftware.org/) (Addison-Wesley, 2019) — System design based on volatility, not function. The best treatment of why service boundaries should reflect what changes together.
- Suzanne & James Robertson, *Mastering the Requirements Process* (Addison-Wesley, 3rd ed., 2012) — The Volere approach to requirements engineering. Practical, structured, and the process we reference in this post. [volere.org](https://volere.org)
- Dan Bergh Johnsson, Daniel Deogun & Daniel Sawano, *Secure by Design* (Manning, 2019) — Security as a design constraint, not a feature bolted on after the fact. The same principle applies to every non-functional requirement.
- Robert C. Martin, *The Clean Coder Blog* — [blog.cleancoder.com](https://blog.cleancoder.com) — Uncle Bob's writing on clean architecture, the dependency rule, and why the shape of your system should reflect its intent, not its frameworks.
