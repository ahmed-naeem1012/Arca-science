import { MainLayout } from "@/components/layout/MainLayout";
import { User, Database, Download, FileDown, FileJson } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useKOL } from "@/context/KOLContext";
import { useState } from "react";

const settingSections = [
  {
    icon: User,
    title: "Profile Settings",
    description: "Manage your account information and preferences",
    items: [
      { label: "Display Name", value: "Arca Science" },
      { label: "Email", value: "arca.science@gmail.com" },
      { label: "Role", value: "Team" },
    ],
  },
  {
    icon: Database,
    title: "Data Preferences",
    description: "Customize data display and export settings",
    toggles: [
      {
        label: "Auto-refresh data",
        description: "Keep dashboards updated automatically",
        enabled: true,
      },
      {
        label: "Include archived KOLs",
        description: "Show inactive profiles in search",
        enabled: false,
      },
    ],
  },
];

export default function Settings() {
  const { kols, stats } = useKOL();
  const [downloading, setDownloading] = useState<string | null>(null);

  /**
   * Export KOL data as CSV file
   */
  const exportKOLDataAsCSV = () => {
    setDownloading("csv");
    try {
      // CSV Headers
      const headers = [
        "ID",
        "Name",
        "Affiliation",
        "Country",
        "City",
        "Expertise Area",
        "Publications",
        "H-Index",
        "Citations",
        "Citation Ratio",
      ];

      // Convert KOLs to CSV rows
      const rows = kols.map((kol) => [
        kol.id,
        `"${kol.name}"`, // Wrap in quotes to handle commas
        `"${kol.affiliation}"`,
        kol.country,
        kol.city || "",
        kol.expertiseArea,
        kol.publicationsCount,
        kol.hIndex,
        kol.citations,
        (kol.citations / kol.publicationsCount).toFixed(2),
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `kol_data_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  /**
   * Export Analytics Report as JSON file
   */
  const exportAnalyticsReport = () => {
    setDownloading("json");
    try {
      if (!stats) return;

      const report = {
        generated_at: new Date().toISOString(),
        summary: {
          total_kols: stats.totalKOLs,
          total_publications: stats.totalPublications,
          countries_represented: stats.countriesRepresented,
          average_h_index: stats.avgHIndex,
          average_citations_per_publication: stats.avgCitationsPerPublication,
        },
        top_citation_ratio_kol: {
          name: stats.topCitationRatioKOL.kol.name,
          affiliation: stats.topCitationRatioKOL.kol.affiliation,
          country: stats.topCitationRatioKOL.kol.country,
          expertise: stats.topCitationRatioKOL.kol.expertiseArea,
          ratio: stats.topCitationRatioKOL.ratio,
          publications: stats.topCitationRatioKOL.kol.publicationsCount,
          citations: stats.topCitationRatioKOL.kol.citations,
          h_index: stats.topCitationRatioKOL.kol.hIndex,
        },
        geographic_distribution: stats.topCountries.map((c) => ({
          country: c.country,
          count: c.count,
          percentage: c.percentage,
        })),
        expertise_distribution: stats.expertiseDistribution.map((e) => ({
          expertise_area: e.expertiseArea,
          count: e.count,
          percentage: e.percentage,
        })),
        kol_list: kols.map((kol) => ({
          id: kol.id,
          name: kol.name,
          affiliation: kol.affiliation,
          country: kol.country,
          city: kol.city,
          expertise_area: kol.expertiseArea,
          publications_count: kol.publicationsCount,
          h_index: kol.hIndex,
          citations: kol.citations,
          citation_ratio: (kol.citations / kol.publicationsCount).toFixed(2),
        })),
      };

      // Create download link
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `analytics_report_${new Date().toISOString().split("T")[0]}.json`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  return (
    <MainLayout
      title="Settings"
      subtitle="Manage your account and application preferences"
    >
      <div className="max-w-3xl space-y-6">
        {settingSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div
              key={sectionIndex}
              className="card-elevated p-6 animate-slide-up"
              style={{ animationDelay: `${sectionIndex * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>

              {section.items && (
                <div className="space-y-4">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {section.toggles && (
                <div className="space-y-4">
                  {section.toggles.map((toggle, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {toggle.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {toggle.description}
                        </p>
                      </div>
                      <Switch defaultChecked={toggle.enabled} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Export Section */}
        <div
          className="card-elevated p-6 animate-slide-up"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
              <Download className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Data Export</h3>
              <p className="text-sm text-muted-foreground">
                Download your data and reports
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={exportKOLDataAsCSV}
              disabled={downloading === "csv"}
              className="gap-2"
            >
              <FileDown className="w-4 h-4" />
              {downloading === "csv"
                ? "Downloading..."
                : "Export KOL Data (CSV)"}
            </Button>
            <Button
              variant="outline"
              onClick={exportAnalyticsReport}
              disabled={downloading === "json"}
              className="gap-2"
            >
              <FileJson className="w-4 h-4" />
              {downloading === "json"
                ? "Downloading..."
                : "Export Analytics Report (JSON)"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            All exports include real-time data from the backend ({kols.length}{" "}
            KOLs)
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
