---
title: "Most Network Outages Aren’t Network Problems"
description: "In practice, most outages come down to DNS or something physical—not complex failures."
pubDate: 2026-05-01
tags: ["infrastructure", "Networking", "Reliability"]

author:
  name: "matt mcgowan"
  # role: "Founder — Dog House Cafe"
  # avatar: "matt.webp"
  # linkedin: "https://www.linkedin.com/in/matthewcmcgowan"

---

Most “network outages” aren’t actually network problems.

In my experience, ~80% of them come down to:

- DNS  
- something physical (cabling, ports, or power)

Not glamorous. Not complex. But real. I can’t count how many times I’ve heard:
> “Yeah, we checked - everything’s powered on.”

…and it wasn’t.

Or DNS was assumed “fine” without actually validating resolution end-to-end.

The interesting part isn’t the failure itself. It’s how we approach it.

Under pressure, people tend to skip the basics and jump straight to complexity.  

But the operators who consistently resolve issues quickly don’t do that.

They slow down just enough to ask:

- Can it resolve?  
- Can it route?  
- Is it actually on?  

Simple checks. Real signal.

---

I’ve been thinking a lot about how rarely we talk about this part of the work—the real debugging paths, the wrong assumptions, the “we swore we checked that” moments.

That’s part of why I started Dog House Cafe.

If this kind of work resonates, there’s a place for it:

https://community.doghouse.cafe

---