import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useKOL, useKOLFilterOptions } from "@/context/KOLContext";
import { KOL } from "@/types/kol";

type SortField =
  | "name"
  | "country"
  | "publicationsCount"
  | "citations"
  | "hIndex";
type SortDirection = "asc" | "desc";

/**
 * KOL Explorer Page
 * Provides advanced filtering and searching capabilities using Context API
 * Implements client-side filtering, sorting, and search
 */
export default function KOLExplorer() {
  const { kols } = useKOL();
  const { countries, expertiseAreas } = useKOLFilterOptions();

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [expertiseArea, setExpertiseArea] = useState<string>("all");
  const [hIndexRange, setHIndexRange] = useState([0, 100]);
  const [sortField, setSortField] = useState<SortField>("hIndex");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedKOL, setSelectedKOL] = useState<KOL | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      search !== "" ||
      country !== "all" ||
      expertiseArea !== "all" ||
      hIndexRange[0] !== 0 ||
      hIndexRange[1] !== 100
    );
  }, [search, country, expertiseArea, hIndexRange]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCountry("all");
    setExpertiseArea("all");
    setHIndexRange([0, 100]);
    setCurrentPage(1);
  };

  // Filter and sort KOLs
  const filteredKOLs = useMemo(() => {
    return kols
      .filter((kol) => {
        // Search filter (name or affiliation)
        if (search) {
          const searchLower = search.toLowerCase();
          const matchesSearch =
            kol.name.toLowerCase().includes(searchLower) ||
            kol.affiliation.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        // Country filter
        if (country !== "all" && kol.country !== country) return false;

        // Expertise area filter
        if (expertiseArea !== "all" && kol.expertiseArea !== expertiseArea)
          return false;

        // H-Index range filter
        if (kol.hIndex < hIndexRange[0] || kol.hIndex > hIndexRange[1])
          return false;

        return true;
      })
      .sort((a, b) => {
        const multiplier = sortDirection === "asc" ? 1 : -1;
        if (sortField === "name" || sortField === "country") {
          return multiplier * a[sortField].localeCompare(b[sortField]);
        }
        return multiplier * (a[sortField] - b[sortField]);
      });
  }, [
    kols,
    search,
    country,
    expertiseArea,
    hIndexRange,
    sortField,
    sortDirection,
  ]);

  // Apply pagination only when NO filters are active
  const paginatedKOLs = useMemo(() => {
    if (hasActiveFilters) {
      // Show all filtered results when filters are active
      return filteredKOLs;
    }
    // Apply pagination when no filters are active
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredKOLs.slice(startIndex, endIndex);
  }, [filteredKOLs, hasActiveFilters, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredKOLs.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, country, expertiseArea, hIndexRange]);

  return (
    <MainLayout
      title="KOL Explorer"
      subtitle="Search and explore key opinion leaders"
    >
      {/* Search and Filter Controls */}
      <div className="card-elevated p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or affiliation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Toggle Filters Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border animate-fade-in">
            {/* Country Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Country
              </label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expertise Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Expertise Area
              </label>
              <Select value={expertiseArea} onValueChange={setExpertiseArea}>
                <SelectTrigger>
                  <SelectValue placeholder="All Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expertise</SelectItem>
                  {expertiseAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* H-Index Range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                H-Index Range: {hIndexRange[0]} - {hIndexRange[1]}
              </label>
              <Slider
                value={hIndexRange}
                onValueChange={setHIndexRange}
                min={0}
                max={100}
                step={1}
                className="mt-3"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Summary with AI Insight */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">
          {hasActiveFilters ? (
            <>
              Showing all{" "}
              <span className="font-medium text-foreground">
                {filteredKOLs.length}
              </span>{" "}
              matching results
            </>
          ) : (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredKOLs.length)}
              </span>{" "}
              of {kols.length} KOLs
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 h-7 text-xs"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </Button>
          )}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-ai-surface/50 border border-ai-border/30">
            <Sparkles className="w-3.5 h-3.5 text-ai-accent" />
            <span className="text-xs text-muted-foreground">
              {hasActiveFilters
                ? `Filtered from ${kols.length} total KOLs`
                : `Page ${currentPage} of ${totalPages}`}
            </span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card-elevated overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th
                  className="table-header-cell cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  className="table-header-cell cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("country")}
                >
                  <div className="flex items-center gap-1">
                    Country
                    <SortIcon field="country" />
                  </div>
                </th>
                <th className="table-header-cell">Expertise</th>
                <th
                  className="table-header-cell text-right cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("publicationsCount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Publications
                    <SortIcon field="publicationsCount" />
                  </div>
                </th>
                <th
                  className="table-header-cell text-right cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("citations")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Citations
                    <SortIcon field="citations" />
                  </div>
                </th>
                <th
                  className="table-header-cell text-right cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort("hIndex")}
                >
                  <div className="flex items-center justify-end gap-1">
                    H-Index
                    <SortIcon field="hIndex" />
                  </div>
                </th>
                <th className="table-header-cell w-28"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedKOLs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No KOLs found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedKOLs.map((kol) => (
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
                    <td className="table-body-cell text-right">
                      {kol.publicationsCount}
                    </td>
                    <td className="table-body-cell text-right">
                      {kol.citations.toLocaleString()}
                    </td>
                    <td className="table-body-cell text-right font-semibold text-primary">
                      {kol.hIndex}
                    </td>
                    <td className="table-body-cell">
                      {/* Can add tags based on citation ratio or h-index */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results Footer with Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters ? (
              <>Showing all {filteredKOLs.length} matching results</>
            ) : (
              <>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredKOLs.length)} of{" "}
                {kols.length} total KOLs
              </>
            )}
          </p>

          {/* Pagination Controls - Only show when no filters are active */}
          {!hasActiveFilters && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, idx, arr) => {
                    // Add ellipsis if there's a gap
                    const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsis && (
                          <span className="text-sm text-muted-foreground px-1">
                            ...
                          </span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="h-8 w-8 p-0"
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Side Panel */}
        {selectedKOL && (
          <div className="absolute top-0 right-0 w-80 h-full bg-card border-l border-border shadow-elevated animate-slide-in-right z-20">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ai-accent" />
                <span className="text-sm font-medium text-foreground">
                  KOL Profile
                </span>
              </div>
              <button
                onClick={() => setSelectedKOL(null)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground">
                  {selectedKOL.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedKOL.country} · {selectedKOL.expertiseArea}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedKOL.affiliation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-semibold text-foreground">
                    {selectedKOL.hIndex}
                  </p>
                  <p className="text-xs text-muted-foreground">H-Index</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-semibold text-foreground">
                    {selectedKOL.publicationsCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Publications</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-ai-surface/50 border border-ai-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-ai-accent" />
                  <span className="text-xs font-medium text-ai-accent uppercase tracking-wider">
                    Citation Ratio
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {(
                    selectedKOL.citations / selectedKOL.publicationsCount
                  ).toFixed(1)}{" "}
                  citations per publication. Active in{" "}
                  {selectedKOL.expertiseArea} research.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Total citations: {selectedKOL.citations.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
