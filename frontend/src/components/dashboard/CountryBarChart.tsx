import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Sparkles, Info } from "lucide-react";
import { useKOL } from "@/context/KOLContext";

const COLORS = [
  "hsl(220, 60%, 35%)",
  "hsl(175, 40%, 45%)",
  "hsl(190, 45%, 50%)",
  "hsl(220, 45%, 45%)",
  "hsl(175, 35%, 50%)",
  "hsl(220, 55%, 40%)",
  "hsl(190, 40%, 45%)",
  "hsl(175, 45%, 40%)",
  "hsl(220, 50%, 50%)",
  "hsl(190, 35%, 55%)",
];

interface CountryBarChartProps {
  loading?: boolean;
}

interface ChartDataItem {
  country: string;
  count: number;
  percentage: number;
}

interface TooltipPayload {
  payload: ChartDataItem;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
        <p className="font-semibold text-foreground">{data.country}</p>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-medium text-foreground">{data.count}</span> KOLs
          <span className="text-xs ml-1">({data.percentage.toFixed(1)}%)</span>
        </p>
      </div>
    );
  }
  return null;
};

export function CountryBarChart({ loading }: CountryBarChartProps) {
  const { stats } = useKOL();
  const [showAIInsight, setShowAIInsight] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Get top 10 countries from stats
  const data = useMemo(() => {
    if (!stats || !stats.topCountries) return [];
    return stats.topCountries.slice(0, 10);
  }, [stats]);

  // Find top country
  const topCountry = data[0];

  if (loading) {
    return (
      <div className="card-elevated p-6">
        <div className="h-5 w-48 rounded skeleton-shimmer mb-6" />
        <div className="h-80 w-full rounded skeleton-shimmer" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card-elevated p-6">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6 animate-slide-up">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Top 10 Countries by KOL Count
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Geographic distribution of key opinion leaders
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
          Analyze
        </button>
      </div>

      {/* AI Insight Banner */}
      {showAIInsight && topCountry && (
        <div className="my-4 p-3 rounded-lg bg-ai-surface/50 border border-ai-border/50 animate-fade-in">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-ai-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground">
                <span className="font-medium text-ai-accent">
                  Geographic Distribution:
                </span>{" "}
                {topCountry.country} leads with{" "}
                <span className="font-semibold text-kpi-positive">
                  {topCountry.count} KOLs
                </span>{" "}
                ({topCountry.percentage.toFixed(1)}% of total).
                {data.length >= 3 &&
                  ` Top 3 countries represent ${(
                    data[0].percentage +
                    data[1].percentage +
                    data[2].percentage
                  ).toFixed(1)}% of all KOLs.`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Dataset shows concentration in major research institutions
                across these regions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 15%, 46%)", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="country"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 15%, 46%)", fontSize: 12 }}
              width={100}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "hsl(220, 15%, 95%)" }}
            />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              onMouseEnter={(_, index) => setHoveredBar(index)}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    hoveredBar === index
                      ? "hsl(260, 60%, 58%)"
                      : COLORS[index % COLORS.length]
                  }
                  style={{ transition: "fill 0.2s ease" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hover hint */}
      <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground">
        <Info className="w-3 h-3" />
        <span>Hover over bars for detailed information</span>
      </div>
    </div>
  );
}
