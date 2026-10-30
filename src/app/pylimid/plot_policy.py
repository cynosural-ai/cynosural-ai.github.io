"""Recreate the PyLIMID quickstart's fitted-policy figure in the navy theme.

Run with ``MPLCONFIGDIR=/private/tmp/pylimid-matplotlib-cache
.venv/bin/python src/app/pylimid/plot_policy.py`` from the website repo.
The displayed probabilities, means, bounds, and scale match the quickstart.
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.ticker import PercentFormatter

NAVY = "#07182d"
TEXT = "#dcecfb"
MUTED = "#a9c6e2"
GRID = "#607b9b"
CYAN = "#7cc7e8"
GOLD = "#e5ce8e"
ORDER_SCALE_KG = 0.25
ORDER_MEANS_KG = (7.2, 21.0)
PROMOTION_PROBABILITIES = (0.00028, 0.99972)


def main() -> None:
    """Save the quickstart policies as a transparent, dark-theme figure."""
    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 9,
            "text.color": TEXT,
            "axes.labelcolor": MUTED,
            "axes.edgecolor": GRID,
            "xtick.color": MUTED,
            "ytick.color": MUTED,
        }
    )
    figure, (promotion_axes, order_axes) = plt.subplots(
        1,
        2,
        figsize=(10, 3.8),
        width_ratios=(1, 2.4),
        layout="constrained",
        facecolor="none",
    )

    bars = promotion_axes.bar(
        ("skip", "run"),
        PROMOTION_PROBABILITIES,
        color=(GRID, CYAN),
        width=0.6,
    )
    for bar, probability in zip(bars, PROMOTION_PROBABILITIES, strict=True):
        promotion_axes.text(
            bar.get_x() + bar.get_width() / 2,
            probability + 0.025,
            f"{probability:.3%}",
            ha="center",
            color=TEXT,
            fontsize=9,
        )
    promotion_axes.set(
        title="Evening: promotion",
        ylabel="Probability",
        ylim=(0, 1.14),
        facecolor="none",
    )
    promotion_axes.set_yticks(np.linspace(0, 1, 5))
    promotion_axes.yaxis.set_major_formatter(PercentFormatter(xmax=1))

    quantities = np.linspace(0.0, 40.0, 1601)
    for mean, label, color in zip(
        ORDER_MEANS_KG, ("Cloudy", "Sunny"), (CYAN, GOLD), strict=True
    ):
        standardized = (quantities - mean) / ORDER_SCALE_KG
        density = np.exp(-0.5 * standardized**2) / (
            ORDER_SCALE_KG * np.sqrt(2 * np.pi)
        )
        order_axes.plot(
            quantities,
            density,
            color=color,
            label=f"{label}: mean {mean:.1f} kg",
        )
        order_axes.fill_between(quantities, density, color=color, alpha=0.18)
    order_axes.set(
        title="Morning: order when the promotion runs",
        xlabel="Ice cream ordered (kg)",
        ylabel="Density",
        xlim=(0, 40),
        ylim=(0, None),
        facecolor="none",
    )
    order_axes.legend(frameon=False, labelcolor=TEXT, fontsize=9)

    for axes in (promotion_axes, order_axes):
        axes.spines[["top", "right"]].set_visible(False)
        axes.spines[["left", "bottom"]].set_alpha(0.5)
        axes.set_axisbelow(True)
        axes.grid(axis="y", color=GRID, alpha=0.24)
        axes.tick_params(length=0, pad=7)

    output = Path("public/pylimid/order_policy.png")
    figure.savefig(output, dpi=200, transparent=True)
    plt.close(figure)
    print(f"Saved {output}")


if __name__ == "__main__":
    main()
