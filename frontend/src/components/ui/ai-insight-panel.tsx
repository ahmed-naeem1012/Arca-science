import { useState } from "react";
import { X, Sparkles, Lightbulb, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightPanelProps {
  title: string;
  insight: string;
  details?: string;
  type?: "increase" | "decrease" | "neutral";
  onClose?: () => void;
  className?: string;
}

export function AIInsightPanel({ 
  title, 
  insight, 
  details,
  type = "neutral",
  onClose, 
  className 
}: AIInsightPanelProps) {
  return (
    <div className={cn(
      "ai-insight-panel rounded-lg p-4 border border-ai-border bg-ai-surface animate-scale-in",
      className
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="ai-glow-icon flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-ai-accent uppercase tracking-wider">
                AI Insight
              </span>
              {type === "increase" && <TrendingUp className="w-3.5 h-3.5 text-kpi-positive" />}
              {type === "decrease" && <TrendingDown className="w-3.5 h-3.5 text-kpi-negative" />}
            </div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
            {details && (
              <p className="text-xs text-muted-foreground/80 mt-2 pt-2 border-t border-border">
                {details}
              </p>
            )}
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface AIAffordanceProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "subtle";
}

export function AIAffordance({ 
  label = "Why?", 
  onClick, 
  className,
  variant = "default"
}: AIAffordanceProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "ai-affordance inline-flex items-center gap-1.5 text-xs font-medium transition-all",
        variant === "default" && "text-ai-accent hover:text-ai-accent/80 bg-ai-surface/50 hover:bg-ai-surface px-2 py-1 rounded-md",
        variant === "subtle" && "text-muted-foreground hover:text-ai-accent",
        className
      )}
    >
      <Lightbulb className="w-3 h-3" />
      {label}
    </button>
  );
}

interface AIMarkerProps {
  label: string;
  className?: string;
}

export function AIMarker({ label, className }: AIMarkerProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
      "bg-ai-surface text-ai-accent border border-ai-border",
      "animate-pulse-subtle",
      className
    )}>
      <Sparkles className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}
