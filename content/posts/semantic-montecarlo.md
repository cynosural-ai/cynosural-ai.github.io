---
title: "Semantic Monte Carlo"
date: "2026-08-11"
description: "A short introduction to exploring meaning through probabilistic sampling"
author: ["Alberto Sánchez", "Carlos Pujades", "Fernando Rodriguez"]
---

# Abstract

Current internet search agents perform well on determinate numerical questions, where the answer is already available in existing sources (e.g. the reported revenue of a company). They are, however, less useful for non-determinate numerical questions whose correct answer is mostly unknown (e.g. the future revenue of a company).

We created Semantic Monte Carlo, a simple method for producing probabilistic numerical estimates from internet evidence. Given a numerical question, we generate $n$ paraphrased variants, query multiple internet search agents and aggregate the resulting answers using confidence-weighted bootstrapping. This produces a distribution over plausible numerical answers rather than a single point estimate.

Since non-determinate questions cannot be evaluated using standard question-answer benchmarks, we additionally introduce a confidence-calibration benchmark: we measure the absolute error between expected and estimated confidence.

From the 80-row benchmark split, Semantic Monte Carlo achieves a mean absolute confidence error of 0.288, with substantially better calibration at the extremes: 0.084 error at 95% expected confidence and 0.155 at 5%, versus 0.492 at 35%.

# Architecture

![Semantic Monte Carlo architecture](/blog/smc-1.png)

1. We first take the input question.
2. We use an LLM to paraphrase the question into $n$ variants. The goal is to preserve the underlying question while changing its phrasing to trigger different searches from different sources.
3. We send each question variant to an [internet search agents](https://openrouter.ai/docs/guides/features/plugins/web-search). We also vary the agent used (deepseek native search, Exa API, Firecrawl, Parallel, Perplexity) to introduce additional diversity in retrieval and source selection.
4. We get the estimated numerical answer and the confidence in the cited sources (leaving an option for the LLM to not answer).
5. We then aggregate the resulting numerical estimates using confidence-weighted bootstrapping. The final output is a probability distribution over plausible numerical answers. If the searches strongly converge, the final distribution becomes concentrated. If they disagree or retrieve a large number of not answers, the distribution becomes more spread.

# Benchmarking Impossible Questions

For determinate questions, evaluation is straightforward: the model's prediction can be compared against a known ground-truth answer, and several existing benchmarks already cover this setting (e.g. [SimpleQA](https://arxiv.org/abs/2411.04368), [TriviaQA](https://arxiv.org/abs/1705.03551)). The main value of our model, however, lies in estimating non-determinate questions, where the answer is unknown. We therefore want these questions to be a central part of the benchmark. The difficulty is that, by definition, they cannot be assigned reliable target answers at evaluation time.

Because of that, we propose a different benchmarking method. Instead of defining a target answer for each question, we define a target confidence.

Determinate, well-known questions such as: "What was Apple's total revenue in the last fiscal quarter?" should have a very high target confidence.
Non-determinate or highly uncertain questions such as "How many gold medals will the leading country win at the 2040 Summer Olympics?" should instead have a very low target confidence.

Thus, rather than evaluating whether the model predicts an unknowable answer correctly, we evaluate how well calibrated the model is about the uncertainty of its answer.

Based on this idea, we created a [benchmark](https://huggingface.co/datasets/cynosural/semantic-montecarlo-benchmark) containing 300 questions, each with a corresponding expected confidence and domain. We include the domain because it likely has an impact on confidence: some domains are inherently more predictable than others.

# The Metric

The proposed metric to measure confidence in our bootstrapped distributions is a variation of [normalized variance](https://en.wikipedia.org/wiki/Coefficient_of_variation). It measures how concentrated the numeric probability mass is relative to a uniform distribution, and then scales that score by the probability of obtaining a numeric answer.

$$
C=P_{\mathrm{answer}}\left(1-\frac{\sum_i p_i(x_i-\mu)^2}{\frac{1}{N}\sum_i(x_i-\bar{x})^2}\right)
$$

- $C$: distribution confidence score (bounded to $[0,1]$).
- $P_{\mathrm{answer}}$: normalized probability that a search returns a numeric answer.
- $x_i$: each unique numeric answer.
- $p_i$: normalized probability assigned to $x_i$.
- $\mu$: probability-weighted mean of the numeric answers.
- $\bar{x}$: ordinary mean of the unique numeric answers.
- $N$: number of unique numeric answers.

Intuitively, if the different searches produce answers concentrated around the same value, the distribution receives a higher confidence. If they produce very different values or non answers, confidence decreases.

We then define our main benchmark metric as the absolute difference between the model confidence and the expected confidence assigned to each question:

$$
\text{Absolute Difference}=|C-\text{Expected Confidence}|
$$

Here, a lower score indicates better calibration of our distribution.

# Hyperparameter Search

One of the most critical hyperparameters to optimize for this system is the number of paraphrases —and therefore consecutive searches— that we perform.

In practice, this defines the tradeoff between cost and performance: more searches require more token spending, but also provides more datapoints to refine the final distribution.

For the hyperparameter search, we evaluate the absolute difference between expected and calculated confidence over a 20-row split of our dataset with a search over $\text{number of paraphrases} \in \{0,2,5,10\}$

![Hyperparameter search](/blog/smc-2.png)

We can see that, except in the extreme case of 0 paraphrases, which shows clear degradation, there is not a large amount of variability across this hyperparameter.
However, with 5 or more paraphrases, we see better performance on questions with high expected confidence (>50%). Meanwhile, with only 2 paraphrases, we see better overall performance on questions with lower expected confidence.

Our interpretation is that additional searches are more useful when there is a real underlying answer for the agents to converge toward, while on highly uncertain questions additional searches may introduce correlated evidence or artificial agreement.

Because of this, we use 3 paraphrases as a practical tradeoff between cost, search diversity, and performance.

# Final Benchmark

After finding an optimum number of paraphrases (3, ,as we previously discussed), we run our system on an 80-row split of our benchmark.

![Absolute confidence error by expected confidence](/blog/smc-3.png)

The model appears to recover a meaningful confidence signal.

Confidence aligns with the expected confidence particularly well at the extremes: really hard to answer and really easy to answer questions. The middle of the range shows less calibration. These are questions where some useful evidence exists, but where the answer is still uncertain enough that different searches can reasonably disagree.

Even in these medium-confidence regions, however, the mean absolute confidence error generally remains below roughly $0.5$. This is still far from perfect calibration, but it suggests that disagreement across search trajectories contains useful information about the underlying uncertainty of the question.

![Absolute confidence error by domain](/blog/smc-4.png)

A more fine-grained look shows that performance varies considerably across domains.

For example, within economy and business, labor and macroeconomic questions appear substantially harder than real-estate questions. Technology and media also show significant variation: streaming questions have particularly high confidence error, while cloud and space questions perform much better.

This suggests that calibration is not only a property of the model. It also depends on the information environment of each domain: how much relevant information exists, how correlated the available sources are, how predictable the underlying process is, and how much disagreement exists between reasonable forecasts.

# Limitations

There are several important limitations in the current version of the method.

1. The samples are not truly independent. Different paraphrases and search agents can still retrieve the same articles, the same underlying datasets, or sources derived from one another. This can make the final distribution appear more concentrated than the underlying evidence actually is.
2. The confidence metric is heuristic. Low variance does not necessarily imply that an estimate is correct: several correlated sources can agree and still be systematically wrong.
3. The expected-confidence labels in the benchmark are themselves subjective. They are easier to define than future numerical ground truth, but they are still an approximation of how uncertain a question should be.
4. The current experimental splits are small because of the budget. More experimentation is needed to show robustness.

# Future Research Lines

The current version of Semantic Monte Carlo shows some good results but still can be improved and used for new usecases. We here show some directions we can explore in the future for improving both the quality of the distributions and their usefulness in downstream models.

- Use Semantic Monte Carlo to generate priors for Bayesian models.
- Use Semantic Monte Carlo, sampled over time, to generate exogenous variables for time-series models.
- Fine-tune smaller models for this task, since the underlying extraction and aggregation problem is not especially complicated.
- Measure correlation across sources to better refine the resulting distribution and avoid treating correlated sources as independent evidence.
- Dynamic sampling: perform more searches on harder or less-converged questions, and fewer searches when the distribution stabilizes quickly.
- See whether there is a correlation between the generated distributions and prediction-market odds.
- Use Semantic Monte Carlo to estimate unknown parameters for mathematical models (e.g. financial, demographic, or population models).
