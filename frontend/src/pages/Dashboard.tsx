import { Users, FileText, Globe, Award } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { CountryBarChart } from "@/components/dashboard/CountryBarChart";
import { ExpertisePieChart } from "@/components/dashboard/ExpertisePieChart";
import { TopKOLsTable } from "@/components/dashboard/TopKOLsTable";
import { CitationRatioCard } from "@/components/dashboard/CitationRatioCard";
import { useKOL } from "@/context/KOLContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * Dashboard Component
 * Main analytics dashboard using Context API for state management
 * Displays KOL summary statistics and visualizations
 */
export default function Dashboard() {
  const { stats, loading, isAPIAvailable } = useKOL();

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Overview of KOL analytics and insights"
    >
      {/* API Status Alert */}
      {!isAPIAvailable && !loading.isLoading && (
        <Alert className="mb-4 border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Backend API not available. Displaying data from local mock dataset.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {loading.error && (
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {loading.error}
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total KOLs"
          value={stats?.totalKOLs ?? 0}
          icon={Users}
          loading={loading.isLoading}
          insight="Dataset includes KOLs from major research institutions worldwide."
          insightDetail="Focus on dermatology and vitiligo research specialists."
        />
        <KPICard
          title="Total Publications"
          value={stats?.totalPublications ?? 0}
          icon={FileText}
          loading={loading.isLoading}
          insight="Combined publication count across all KOLs in the dataset."
          insightDetail="Average of ~90 publications per KOL."
        />
        <KPICard
          title="Countries Represented"
          value={stats?.countriesRepresented ?? 0}
          icon={Globe}
          loading={loading.isLoading}
          insight="Global representation across major research hubs."
          insightDetail="Strong concentration in US, Europe, and Asia."
        />
        <KPICard
          title="Average H-Index"
          value={stats?.avgHIndex ?? 0}
          icon={Award}
          loading={loading.isLoading}
          insight="Average h-index indicates mid-to-senior career researchers."
          insightDetail="H-index range: 22-51 across the dataset."
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <CountryBarChart loading={loading.isLoading} />
        </div>
        <div className="space-y-6">
          <ExpertisePieChart loading={loading.isLoading} />
          <CitationRatioCard loading={loading.isLoading} />
        </div>
      </div>

      {/* Top KOLs Table */}
      <TopKOLsTable loading={loading.isLoading} />
    </MainLayout>
  );
}
