import { useState } from "react";
import { LucideIcon, TrendingUp, TrendingDown, Lightbulb, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  loading?: boolean;
  insight?: string;
  insightDetail?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  loading,
  insight,
  insightDetail 
}: KPICardProps) {
  const [showInsight, setShowInsight] = useState(false);

  if (loading) {
    return (
      <div className="kpi-card">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 w-24 rounded skeleton-shimmer" />
            <div className="h-8 w-20 rounded skeleton-shimmer" />
            <div className="h-3 w-32 rounded skeleton-shimmer" />
          </div>
          <div className="w-10 h-10 rounded-lg skeleton-shimmer" />
        </div>
      </div>
    );
  }

  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="kpi-card group animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {insight && (
              <button
                onClick={() => setShowInsight(!showInsight)}
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-all duration-200",
                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
                  "bg-ai-surface text-ai-accent hover:bg-ai-accent/10",
                  showInsight && "opacity-100 bg-ai-accent/10"
                )}
              >
                <Lightbulb className="w-3 h-3" />
                Why?
              </button>
            )}
          </div>
          <p className="mt-2 text-3xl font-semibold text-foreground tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-kpi-positive" />
              ) : (
                <TrendingDown className="w-4 h-4 text-kpi-negative" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-kpi-positive" : "text-kpi-negative"
                )}
              >
                {isPositive ? "+" : ""}{change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-muted-foreground">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 transition-transform duration-200 group-hover:scale-110">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* AI Insight Panel */}
      {showInsight && insight && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-ai-surface/50 border border-ai-border/50">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-ai-accent/10 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-ai-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ai-accent uppercase tracking-wider mb-1">
                AI Insight
              </p>
              <p className="text-sm text-foreground leading-relaxed">{insight}</p>
              {insightDetail && (
                <p className="text-xs text-muted-foreground mt-2">{insightDetail}</p>
              )}
            </div>
            <button 
              onClick={() => setShowInsight(false)}
              className="text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
