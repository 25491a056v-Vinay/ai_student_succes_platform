import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  Workflow, 
  Bot, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Sparkles,
  Download,
  Briefcase
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'roster' | 'interventions' | 'placement' | 'copilot' | 'roi';
  setActiveTab: (tab: 'overview' | 'roster' | 'interventions' | 'placement' | 'copilot' | 'roi') => void;
  criticalCount: number;
  tier1PlacementCount?: number;
  onOpenAddModal: () => void;
  onOpenBriefingModal: () => void;
  onExportCsv: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  criticalCount,
  tier1PlacementCount,
  onOpenAddModal,
  onOpenBriefingModal,
  onExportCsv,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-white tracking-tight">Smart Campus</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-sky-400 bg-sky-950/80 border border-sky-800/60 px-1.5 py-0.5 rounded">AI Analytics</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Predictive Student Success &amp; Intervention Intelligence</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
              <span>Executive Command</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'roster'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Student 360° Roster</span>
              {criticalCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {criticalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('interventions')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'interventions'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Workflow className="w-4 h-4 text-emerald-400" />
              <span>Intervention Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('placement')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'placement'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Career &amp; Placements</span>
              {tier1PlacementCount !== undefined && tier1PlacementCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {tier1PlacementCount} Ready
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'copilot'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>AI Decision Copilot</span>
            </button>

            <button
              onClick={() => setActiveTab('roi')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'roi'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>Retention ROI</span>
            </button>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenBriefingModal}
              title="Generate Executive Dean Briefing"
              className="hidden lg:flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Dean Briefing</span>
            </button>

            <button
              onClick={onExportCsv}
              title="Export Current Student Cohort Data as CSV"
              className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-t border-slate-800 bg-slate-900/90 overflow-x-auto px-2 py-1.5 space-x-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1 text-xs rounded font-medium whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Executive
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-3 py-1 text-xs rounded font-medium whitespace-nowrap ${
            activeTab === 'roster' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Roster ({criticalCount} alerts)
        </button>
        <button
          onClick={() => setActiveTab('interventions')}
          className={`px-3 py-1 text-xs rounded font-medium whitespace-nowrap ${
            activeTab === 'interventions' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Interventions
        </button>
        <button
          onClick={() => setActiveTab('placement')}
          className={`px-3 py-1 text-xs rounded font-medium whitespace-nowrap ${
            activeTab === 'placement' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Placements
        </button>
        <button
          onClick={() => setActiveTab('copilot')}
          className={`px-3 py-1 text-xs rounded font-medium whitespace-nowrap ${
            activeTab === 'copilot' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          AI Copilot
        </button>
        <button
          onClick={() => setActiveTab('roi')}
          className={`px-3 py-1 text-xs rounded font-medium whitespace-nowrap ${
            activeTab === 'roi' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Retention ROI
        </button>
      </div>
    </header>
  );
};
