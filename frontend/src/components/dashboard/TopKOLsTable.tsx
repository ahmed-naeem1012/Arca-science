import { useState, useMemo } from "react";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useKOL } from "@/context/KOLContext";
import { KOL } from "@/types/kol";

interface TopKOLsTableProps {
  loading?: boolean;
}

export function TopKOLsTable({ loading }: TopKOLsTableProps) {
  const { kols } = useKOL();
  const [selectedKOL, setSelectedKOL] = useState<KOL | null>(null);

  // Get top 5 KOLs by h-index
  const topKOLs = useMemo(() => {
    return [...kols].sort((a, b) => b.hIndex - a.hIndex).slice(0, 5);
  }, [kols]);

  if (loading) {
    return (
      <div className="card-elevated p-6">
        <div className="h-5 w-32 rounded skeleton-shimmer mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full rounded skeleton-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (topKOLs.length === 0) {
    return (
      <div className="card-elevated p-6">
        <p className="text-muted-foreground">No KOL data available</p>
      </div>
    );
  }

  return (
    <div
      className="card-elevated animate-slide-up relative"
      style={{ animationDelay: "200ms" }}
    >
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Top KOLs
            </h3>
            <p className="text-sm text-muted-foreground">
              Ranked by h-index score
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors">
            View All
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Country</th>
              <th className="table-header-cell">Expertise</th>
              <th className="table-header-cell text-right">H-Index</th>
              <th className="table-header-cell text-right">Publications</th>
              <th className="table-header-cell text-right">Citations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {topKOLs.map((kol) => (
              <tr
                key={kol.id}
                className="table-row-interactive"
                onClick={() => setSelectedKOL(kol)}
              >
                <td className="table-body-cell">
                  <span className="font-medium">{kol.name}</span>
                </td>
                <td className="table-body-cell text-muted-foreground">
                  {kol.country}
                </td>
                <td className="table-body-cell">
                  <Badge variant="secondary" className="font-normal">
                    {kol.expertiseArea}
                  </Badge>
                </td>
                <td className="table-body-cell text-right font-semibold text-primary">
                  {kol.hIndex}
                </td>
                <td className="table-body-cell text-right text-muted-foreground">
                  {kol.publicationsCount}
                </td>
                <td className="table-body-cell text-right text-muted-foreground">
                  {kol.citations.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compact Side Panel */}
      {selectedKOL && (
        <div className="absolute top-0 right-0 w-64 h-full bg-card border-l border-border shadow-elevated animate-slide-in-right z-20 overflow-y-auto">
          <div className="p-3 border-b border-border flex items-center justify-between sticky top-0 bg-card">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ai-accent" />
              <span className="text-xs font-medium text-foreground">
                KOL Profile
              </span>
            </div>
            <button
              onClick={() => setSelectedKOL(null)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="p-3 space-y-3">
            <div>
              <h4 className="font-semibold text-sm text-foreground">
                {selectedKOL.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {selectedKOL.country}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedKOL.affiliation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/50 text-center">
                <p className="text-lg font-semibold text-foreground">
                  {selectedKOL.hIndex}
                </p>
                <p className="text-[10px] text-muted-foreground">H-Index</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50 text-center">
                <p className="text-lg font-semibold text-foreground">
                  {selectedKOL.publicationsCount}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Publications
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-ai-surface/50 border border-ai-border/50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3 h-3 text-ai-accent" />
                <span className="text-[10px] font-medium text-ai-accent uppercase tracking-wider">
                  Citation Ratio
                </span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                {(
                  selectedKOL.citations / selectedKOL.publicationsCount
                ).toFixed(1)}{" "}
                citations/pub in {selectedKOL.expertiseArea}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
