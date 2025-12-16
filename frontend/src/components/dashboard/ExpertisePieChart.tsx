import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
} from "recharts";
import { Sparkles } from "lucide-react";
import { useKOL } from "@/context/KOLContext";

const COLORS = [
  "hsl(220, 60%, 35%)",
  "hsl(175, 40%, 45%)",
  "hsl(190, 45%, 50%)",
  "hsl(260, 45%, 55%)",
  "hsl(220, 35%, 50%)",
  "hsl(210, 20%, 70%)",
];

interface ExpertisePieChartProps {
  loading?: boolean;
}

interface ExpertiseData {
  name: string;
  value: number;
  percentage: number;
}

const renderActiveShape = (props: unknown) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props as {
      cx: number;
      cy: number;
      innerRadius: number;
      outerRadius: number;
      startAngle: number;
      endAngle: number;
      fill: string;
    };

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={innerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="hsl(260, 60%, 58%)"
      />
    </g>
  );
};

interface TooltipPayload {
  payload: ExpertiseData;
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
        <p className="font-semibold text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-medium text-foreground">{data.value}</span> KOLs
          <span className="text-xs ml-1">({data.percentage.toFixed(1)}%)</span>
        </p>
      </div>
    );
  }
  return null;
};

export function ExpertisePieChart({ loading }: ExpertisePieChartProps) {
  const { stats } = useKOL();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Transform stats data for the chart
  const data = useMemo(() => {
    if (!stats || !stats.expertiseDistribution) return [];
    return stats.expertiseDistribution.map((item) => ({
      name: item.expertiseArea,
      value: item.count,
      percentage: item.percentage,
    }));
  }, [stats]);

  const topExpertise = data[0];

  if (loading) {
    return (
      <div className="card-elevated p-6">
        <div className="h-5 w-40 rounded skeleton-shimmer mb-6" />
        <div className="h-64 w-full rounded skeleton-shimmer" />
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
    <div
      className="card-elevated p-6 animate-slide-up"
      style={{ animationDelay: "100ms" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            KOL Distribution by Expertise
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Primary therapeutic areas
          </p>
        </div>
      </div>

      {/* AI Quick Insight */}
      {topExpertise && (
        <div className="mb-4 flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-ai-surface/50 border border-ai-border/30 w-fit">
          <Sparkles className="w-3 h-3 text-ai-accent" />
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {topExpertise.name}
            </span>{" "}
            leads with {topExpertise.percentage.toFixed(1)}%
          </span>
        </div>
      )}

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_data, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {data.map((_item, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
