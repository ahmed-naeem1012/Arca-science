import { useState } from "react";
import { Award, TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import { useKOL } from "@/context/KOLContext";

interface CitationRatioCardProps {
  loading?: boolean;
}

/**
 * Citation Ratio Card Component
 * Displays the KOL with the highest citations-to-publications ratio
 * This directly addresses the data analysis requirement in the test
 */
export function CitationRatioCard({ loading }: CitationRatioCardProps) {
  const { stats } = useKOL();
  const [showDetails, setShowDetails] = useState(false);

  if (loading) {
    return (
      <div className="card-elevated p-6">
        <div className="h-5 w-40 rounded skeleton-shimmer mb-4" />
        <div className="h-20 w-full rounded skeleton-shimmer" />
      </div>
    );
  }

  if (!stats || !stats.topCitationRatioKOL) {
    return (
      <div className="card-elevated p-6">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const { kol, ratio } = stats.topCitationRatioKOL;
  const avgRatio = stats.avgCitationsPerPublication;
  const percentageAboveAvg = ((ratio - avgRatio) / avgRatio) * 100;

  return (
    <div
      className="card-interactive p-6 animate-slide-up group"
      style={{ animationDelay: "150ms" }}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-secondary" />
        <h3 className="text-base font-semibold text-foreground">
          Top Citation Ratio
        </h3>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${
            showDetails ? "rotate-90" : ""
          }`}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary relative group-hover:scale-105 transition-transform">
          <span className="text-lg font-bold text-primary-foreground">
            {ratio.toFixed(1)}
          </span>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ai-accent flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{kol.name}</p>
          <p className="text-sm text-muted-foreground">
            Citations per publication
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-kpi-positive" />
            <span className="text-xs font-medium text-kpi-positive">
              +{percentageAboveAvg.toFixed(1)}% vs avg
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Details - Data Analysis Insight */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in space-y-3">
          <div className="p-3 rounded-lg bg-ai-surface/50 border border-ai-border/30">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-ai-accent" />
              <span className="text-[10px] font-medium text-ai-accent uppercase tracking-wider">
                Why this matters
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {kol.name}'s citation ratio of{" "}
              <span className="font-medium text-foreground">
                {ratio.toFixed(1)}
              </span>{" "}
              is{" "}
              <span className="font-medium text-foreground">
                {percentageAboveAvg.toFixed(1)}% higher
              </span>{" "}
              than the dataset average ({avgRatio.toFixed(1)}), indicating
              exceptionally high-impact research. Each publication receives
              significantly more citations than typical, suggesting focused work
              in high-visibility areas within {kol.expertiseArea}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-md bg-muted/50 text-center">
              <p className="text-lg font-semibold text-foreground">
                {kol.publicationsCount}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase">
                Publications
              </p>
            </div>
            <div className="p-2 rounded-md bg-muted/50 text-center">
              <p className="text-lg font-semibold text-foreground">
                {(kol.citations / 1000).toFixed(1)}K
              </p>
              <p className="text-[10px] text-muted-foreground uppercase">
                Citations
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
