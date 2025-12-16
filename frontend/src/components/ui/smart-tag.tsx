import { cn } from "@/lib/utils";
import { TrendingUp, Star, Zap, Award } from "lucide-react";

type TagVariant = "top-performer" | "rising" | "high-impact" | "outlier" | "default";

interface SmartTagProps {
  variant: TagVariant;
  className?: string;
}

const tagConfig: Record<TagVariant, { icon: typeof Star; label: string; className: string }> = {
  "top-performer": {
    icon: Award,
    label: "Top Performer",
    className: "bg-kpi-positive/10 text-kpi-positive border-kpi-positive/20",
  },
  "rising": {
    icon: TrendingUp,
    label: "Rising",
    className: "bg-secondary/10 text-secondary border-secondary/20",
  },
  "high-impact": {
    icon: Zap,
    label: "High Impact",
    className: "bg-ai-accent/10 text-ai-accent border-ai-accent/20",
  },
  "outlier": {
    icon: Star,
    label: "Outlier",
    className: "bg-accent/10 text-accent border-accent/20",
  },
  "default": {
    icon: Star,
    label: "",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function SmartTag({ variant, className }: SmartTagProps) {
  const config = tagConfig[variant];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border",
      "transition-all hover:scale-105",
      config.className,
      className
    )}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
