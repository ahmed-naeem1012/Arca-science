import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  Lightbulb,
  AlertCircle,
  Sparkles,
  Info,
} from "lucide-react";
import { useKOL } from "@/context/KOLContext";

/**
 * Analytics Page - 100% DYNAMIC!
 * All data calculated from real backend KOL data
 */

interface TooltipPayload {
  publications: number;
  citations: number;
  hIndex: number;
  name: string;
  ratio: number;
  outlier?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TooltipPayload }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const citationRatio = (data.citations / data.publications).toFixed(1);

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-elevated max-w-xs">
        <p className="font-semibold text-foreground">{data.name}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
          <span className="text-muted-foreground">Publications:</span>
          <span className="font-medium text-foreground">
            {data.publications}
          </span>
          <span className="text-muted-foreground">Citations:</span>
          <span className="font-medium text-foreground">
            {data.citations.toLocaleString()}
          </span>
          <span className="text-muted-foreground">H-Index:</span>
          <span className="font-medium text-foreground">{data.hIndex}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-ai-accent" />
            <span className="text-xs text-ai-accent">
              {citationRatio} citations/pub (
              {parseFloat(citationRatio) > 70 ? "Exceptional" : "Above avg"})
            </span>
          </div>
        </div>
        {data.outlier && (
          <div className="mt-2 px-2 py-1 rounded bg-ai-surface/50 border border-ai-border/30">
            <span className="text-[10px] text-ai-accent uppercase tracking-wide">
              ⚡ Outlier detected
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { kols, stats, loading } = useKOL();
  const [showAIInsight, setShowAIInsight] = useState(false);

  // Calculate scatter plot data from real KOLs
  const scatterData = useMemo(() => {
    return kols.map((kol) => ({
      publications: kol.publicationsCount,
      citations: kol.citations,
      hIndex: kol.hIndex,
      name: kol.name,
      ratio: kol.citations / kol.publicationsCount,
      outlier:
        kol.citations / kol.publicationsCount >
        (stats?.avgCitationsPerPublication || 0) * 1.3,
    }));
  }, [kols, stats]);

  // Calculate averages
  const avgPublications = useMemo(
    () =>
      scatterData.reduce((sum, d) => sum + d.publications, 0) /
      (scatterData.length || 1),
    [scatterData]
  );
  const avgCitations = useMemo(
    () =>
      scatterData.reduce((sum, d) => sum + d.citations, 0) /
      (scatterData.length || 1),
    [scatterData]
  );

  // Calculate correlation coefficient for publications vs citations
  const correlation = useMemo(() => {
    if (scatterData.length < 2) return 0;
    const n = scatterData.length;
    const sumX = scatterData.reduce((sum, d) => sum + d.publications, 0);
    const sumY = scatterData.reduce((sum, d) => sum + d.citations, 0);
    const sumXY = scatterData.reduce(
      (sum, d) => sum + d.publications * d.citations,
      0
    );
    const sumX2 = scatterData.reduce((sum, d) => sum + d.publications ** 2, 0);
    const sumY2 = scatterData.reduce((sum, d) => sum + d.citations ** 2, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }, [scatterData]);

  // Find top performer (outlier)
  const topPerformer = useMemo(() => {
    return scatterData.reduce(
      (max, kol) => (kol.ratio > max.ratio ? kol : max),
      scatterData[0] || { name: "N/A", ratio: 0 }
    );
  }, [scatterData]);

  // Calculate dynamic insights
  const insights = useMemo(() => {
    if (!stats || !kols.length) return [];

    const top10Percent = Math.ceil(kols.length * 0.1);
    const sortedByRatio = [...scatterData].sort((a, b) => b.ratio - a.ratio);
    const topKOLs = sortedByRatio.slice(0, top10Percent);
    const avgTopRatio =
      topKOLs.reduce((sum, k) => sum + k.ratio, 0) / top10Percent;
    const efficiencyIncrease = (
      (avgTopRatio / stats.avgCitationsPerPublication - 1) *
      100
    ).toFixed(0);

    const topExpertise = stats.expertiseDistribution[0];
    const topCountries = stats.topCountries.slice(0, 3);
    const top3Percentage = topCountries.reduce(
      (sum, c) => sum + c.percentage,
      0
    );

    return [
      {
        icon: TrendingUp,
        title: "High Citation Efficiency",
        description: `Top ${top10Percent} KOLs show ${efficiencyIncrease}% higher citation-per-publication ratio than average (${stats.avgCitationsPerPublication.toFixed(
          1
        )}), indicating focused, high-impact research output.`,
        type: "positive" as const,
        aiAction: "Identify similar high-efficiency profiles",
      },
      {
        icon: Lightbulb,
        title: `${topExpertise?.expertiseArea} Concentration`,
        description: `${
          topExpertise?.expertiseArea
        } represents ${topExpertise?.percentage.toFixed(1)}% of all KOLs with ${
          topExpertise?.count
        } experts. Dataset spans ${
          stats.expertiseDistribution.length
        } distinct expertise areas.`,
        type: "neutral" as const,
        aiAction: "Explore expertise opportunities",
      },
      {
        icon: AlertCircle,
        title: "Geographic Concentration",
        description: `${top3Percentage.toFixed(
          0
        )}% of KOLs are concentrated in ${topCountries
          .map((c) => c.country)
          .join(
            ", "
          )}. Consider diversifying outreach for broader geographic coverage across ${
          stats.countriesRepresented
        } represented countries.`,
        type: "warning" as const,
        aiAction: "View geographic distribution",
      },
    ];
  }, [stats, kols, scatterData]);

  // Calculate median h-index
  const medianHIndex = useMemo(() => {
    if (kols.length === 0) return 0;
    const sorted = [...kols].sort((a, b) => a.hIndex - b.hIndex);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1].hIndex + sorted[mid].hIndex) / 2
      : sorted[mid].hIndex;
  }, [kols]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!stats) return [];

    return [
      {
        value: stats.avgCitationsPerPublication.toFixed(1),
        label: "Avg Citations/Pub",
        highlight: true,
      },
      { value: Math.abs(correlation).toFixed(2), label: "Correlation Coef." },
      { value: medianHIndex.toFixed(1), label: "Median H-Index" },
      {
        value: `${stats.totalKOLs}`,
        label: "Total KOLs",
        positive: true,
      },
    ];
  }, [stats, correlation, medianHIndex]);

  // Loading state
  if (loading.isLoading) {
    return (
      <MainLayout
        title="Analytics"
        subtitle="In-depth analysis of KOL performance and trends"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-ai-accent animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Calculating analytics...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Analytics"
      subtitle="In-depth analysis of KOL performance and trends"
    >
      {/* Scatter Plot */}
      <div className="card-elevated p-6 mb-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Publications vs Citations Analysis
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Bubble size represents H-Index score · Click points to explore
            </p>
          </div>
          <button
            onClick={() => setShowAIInsight(!showAIInsight)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              showAIInsight
                ? "bg-ai-accent/10 text-ai-accent"
                : "bg-muted hover:bg-ai-surface text-muted-foreground hover:text-ai-accent"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Analysis
          </button>
        </div>

        {/* Dynamic AI Insight Panel */}
        {showAIInsight && (
          <div className="my-4 p-4 rounded-lg bg-ai-surface/50 border border-ai-border/50 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ai-accent/10 flex-shrink-0">
                <Sparkles className="w-4 h-4 text-ai-accent" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-ai-accent uppercase tracking-wider mb-1">
                  Pattern Analysis
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {correlation > 0.7
                    ? "Strong"
                    : correlation > 0.4
                    ? "Moderate"
                    : "Weak"}{" "}
                  linear correlation (
                  <span className="font-semibold">
                    r={correlation.toFixed(2)}
                  </span>
                  ) between publications and citations.
                  {topPerformer && (
                    <>
                      {" "}
                      <span className="font-medium text-kpi-positive">
                        {topPerformer.name}
                      </span>{" "}
                      is a notable outlier with exceptional citation efficiency
                      ({topPerformer.ratio.toFixed(1)} citations/pub vs avg{" "}
                      {stats?.avgCitationsPerPublication.toFixed(1)}).
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {scatterData.filter((k) => k.outlier).length} KOLs above the
                  trend line show potential for high-impact engagement.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="h-96 relative">
          {/* Dynamic Chart Annotations */}
          {topPerformer && topPerformer.outlier && (
            <div className="absolute top-4 left-20 z-10 chart-annotation chart-annotation-ai">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Outlier: {topPerformer.ratio.toFixed(1)} cite/pub
              </span>
            </div>
          )}

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(214, 20%, 91%)"
              />
              <XAxis
                type="number"
                dataKey="publications"
                name="Publications"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(220, 15%, 46%)", fontSize: 12 }}
                label={{
                  value: "Publications",
                  position: "bottom",
                  fill: "hsl(220, 15%, 46%)",
                  fontSize: 12,
                }}
              />
              <YAxis
                type="number"
                dataKey="citations"
                name="Citations"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(220, 15%, 46%)", fontSize: 12 }}
                label={{
                  value: "Citations",
                  angle: -90,
                  position: "insideLeft",
                  fill: "hsl(220, 15%, 46%)",
                  fontSize: 12,
                }}
              />
              <ZAxis type="number" dataKey="hIndex" range={[100, 1000]} />
              {/* Average reference lines */}
              <ReferenceLine
                x={avgPublications}
                stroke="hsl(260, 60%, 58%)"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
              <ReferenceLine
                y={avgCitations}
                stroke="hsl(260, 60%, 58%)"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter
                data={scatterData}
                fill="hsl(175, 40%, 45%)"
                fillOpacity={0.7}
                style={{ cursor: "pointer" }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive hint */}
        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground">
          <Info className="w-3 h-3" />
          <span>
            Dashed lines show dataset averages · Hover for AI insights
          </span>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const borderColor = {
            positive: "border-l-kpi-positive",
            neutral: "border-l-secondary",
            warning: "border-l-destructive",
          }[insight.type];

          const iconBg = {
            positive: "bg-kpi-positive/10 text-kpi-positive",
            neutral: "bg-secondary/10 text-secondary",
            warning: "bg-destructive/10 text-destructive",
          }[insight.type];

          return (
            <div
              key={index}
              className={`card-interactive p-6 border-l-4 ${borderColor} animate-slide-up group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${iconBg} mb-4 transition-transform group-hover:scale-110`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-foreground mb-2">
                {insight.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {insight.description}
              </p>

              {/* AI Action Affordance */}
              <button className="flex items-center gap-1.5 text-xs font-medium text-ai-accent hover:text-ai-accent/80 transition-colors group/btn">
                <Sparkles className="w-3 h-3" />
                <span className="relative">
                  {insight.aiAction}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-ai-accent transition-all group-hover/btn:w-full" />
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Dynamic Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {summaryStats.map((stat, index) => (
          <div
            key={index}
            className={`card-elevated p-4 text-center hover-lift ${
              stat.highlight ? "ring-1 ring-ai-border" : ""
            }`}
          >
            <p
              className={`text-2xl font-semibold ${
                stat.positive ? "text-kpi-positive" : "text-foreground"
              }`}
            >
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            {stat.highlight && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <Sparkles className="w-3 h-3 text-ai-accent" />
                <span className="text-[10px] text-ai-accent">
                  Top performer metric
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
