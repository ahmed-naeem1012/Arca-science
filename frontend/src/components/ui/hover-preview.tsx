import { ReactNode } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface HoverPreviewProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
}

export function HoverPreview({ 
  children, 
  content, 
  className,
  align = "center",
  side = "top"
}: HoverPreviewProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        align={align} 
        side={side}
        className={cn(
          "w-80 p-4 bg-card border-border shadow-elevated",
          className
        )}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  );
}

interface KOLPreviewContentProps {
  name: string;
  country: string;
  expertise: string;
  publications: number;
  citations: number;
  hIndex: number;
  trend?: "up" | "down" | "stable";
}

export function KOLPreviewContent({ 
  name, 
  country, 
  expertise, 
  publications, 
  citations, 
  hIndex,
  trend = "stable"
}: KOLPreviewContentProps) {
  const citationRatio = (citations / publications).toFixed(1);
  
  return (
    <div className="space-y-3">
      <div>
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{country} · {expertise}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-md bg-muted/50">
          <p className="text-lg font-semibold text-foreground">{hIndex}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">H-Index</p>
        </div>
        <div className="p-2 rounded-md bg-muted/50">
          <p className="text-lg font-semibold text-foreground">{publications}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Pubs</p>
        </div>
        <div className="p-2 rounded-md bg-muted/50">
          <p className="text-lg font-semibold text-foreground">{citationRatio}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Cite/Pub</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {trend === "up" && "📈 Citation velocity increasing 12% QoQ"}
        {trend === "down" && "📉 Recent publication rate declining"}
        {trend === "stable" && "➡️ Consistent research output"}
      </p>
    </div>
  );
}
