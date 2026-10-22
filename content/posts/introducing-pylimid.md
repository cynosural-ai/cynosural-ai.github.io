---
title: "Introducing PyLIMID"
date: "2026-10-22"
description: "A Python library for modeling decisions under uncertainty with limited-memory influence diagrams"
author: "Fernando Rodriguez"
links:
  - label: "GitHub"
    url: "https://github.com/cynosural-ai/pylimid"
    icon: "github"
---

![PyLIMID logo](/blog/pylimid-readme.svg)

As AI agents take on more responsibility, they need flexible tools to evaluate decisions under uncertainty. This matters especially for high-stakes choices, such as investing in a new factory or deciding how to evacuate an area after a disaster.

This led us to decision theory and [influence diagrams](https://en.wikipedia.org/wiki/Influence_diagram). We're now introducing **PyLIMID**, an open-source Python library for building and solving limited-memory influence diagrams. Rather than requiring every chance and utility node to be represented as a table, PyLIMID uses [NumPyro](https://num.pyro.ai/) distributions, [JAX](https://docs.jax.dev/en/latest/) functions, and sampling. A model can then combine discrete and continuous uncertainty, Bayesian priors, and utility functions that capture thresholds, nonlinearities, or risk preferences.

## Modeling decisions under uncertainty

Influence diagrams bring together three elements:

- **Chance variables** describe uncertain quantities and their dependencies.
- **Decisions** specify the available actions and the information known when choosing.
- **Utilities** describe how outcomes are valued, including costs, benefits, and risk preferences.

![PyLIMID workflow: a model combines chance distributions, decisions, and utility functions; the engine simulates outcomes and optimizes decisions; results include a policy and estimated expected utility.](/blog/pylimid-overview-v2.svg)

PyLIMID simulates outcomes and optimizes decisions to produce a **policy**, i.e., a rule for choosing actions given the available information. It also reports the **estimated expected utility**, the average value of following that policy under the model.

Interpretability is a key part of this approach. Assumptions,  available information, and objectives are explicit, so agents and humans can inspect and challenge the basis of a recommendation. We see this as particularly useful for problems where explainability of a decision is essential. Additionally, it can draw on prior knowledge and assumptions when training data or verifiable feedback for approaches such as reinforcement learning are scarce.

## Getting started

Install PyLIMID with Python 3.12:

```bash
pip install pylimid
```

Visit the [GitHub repository](https://github.com/cynosural-ai/pylimid) for an overview, or follow the [quickstart](https://pylimid.readthedocs.io/en/latest/getting_started/quickstart.html) to build and solve your first diagram.
