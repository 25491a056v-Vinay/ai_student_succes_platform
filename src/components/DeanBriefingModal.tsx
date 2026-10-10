import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  FileText, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import { CampusMetrics } from '../types/student';

interface DeanBriefingModalProps {
  metrics: CampusMetrics;
  onClose: () => void;
}

interface BriefingData {
  title: string;
  semesterTerm: string;
  keyMetricsSummary: {
    totalMonitored: string;
    projectedGraduationRate: string;
    atRiskIdentified: string;
    institutionalSavings: string;
  };
  executiveNarrative: string;
  strategicPriorities: string[];
}

export const DeanBriefingModal: React.FC<DeanBriefingModalProps> = ({ metrics, onClose }) => {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function fetchBriefing() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/ai/generate-dean-briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campusData: metrics }),
        });
        const data = await response.json();
        if (data.briefing) {
          setBriefing(data.briefing);
        }
      } catch (err) {
        console.error('Failed to load briefing:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBriefing();
  }, [metrics]);

  const handleCopy = () => {
    if (!briefing) return;
    const memo = `
${briefing.title}
Term: ${briefing.semesterTerm}

KEY METRICS:
- Total Monitored: ${briefing.keyMetricsSummary.totalMonitored}
- Retention / Graduation Projection: ${briefing.keyMetricsSummary.projectedGraduationRate}
- At-Risk Identified: ${briefing.keyMetricsSummary.atRiskIdentified}
- Institutional Savings: ${briefing.keyMetricsSummary.institutionalSavings}

EXECUTIVE NARRATIVE:
${briefing.executiveNarrative}

STRATEGIC PRIORITIES:
${briefing.strategicPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}
`;
    navigator.clipboard.writeText(memo);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Executive Dean &amp; Provost Briefing</h2>
              <p className="text-xs text-slate-400">Synthesized retention memo powered by Gemini 3.8 Flash</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              disabled={isLoading || !briefing}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center space-x-1"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy Memo'}</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={isLoading || !briefing}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="text-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-white">Synthesizing Campus Retention Intelligence...</p>
              <p className="text-xs text-slate-400">Extracting institutional signals and forecasting graduation yield</p>
            </div>
          ) : briefing ? (
            <div className="space-y-6 text-xs text-slate-300">
              {/* Memo Letterhead */}
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-white">{briefing.title}</h3>
                  <p className="text-slate-400 text-xs font-medium">{briefing.semesterTerm}</p>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded self-start sm:self-auto">
                  CONFIDENTIAL · ACADEMIC SENATE &amp; DEANS
                </div>
              </div>

              {/* Key Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Tracked Cohort</div>
                  <div className="text-sm font-bold text-white mt-1">{briefing.keyMetricsSummary.totalMonitored}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Retention Yield</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">{briefing.keyMetricsSummary.projectedGraduationRate}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Warnings</div>
                  <div className="text-sm font-bold text-rose-400 mt-1">{briefing.keyMetricsSummary.atRiskIdentified}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Revenue Protected</div>
                  <div className="text-sm font-bold text-teal-400 mt-1">{briefing.keyMetricsSummary.institutionalSavings}</div>
                </div>
              </div>

              {/* Executive Narrative */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Executive Analytical Assessment
                </h4>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                  {briefing.executiveNarrative}
                </div>
              </div>

              {/* Strategic Priorities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Immediate Strategic Mandates for Academic Affairs
                </h4>
                <div className="space-y-2">
                  {briefing.strategicPriorities.map((priority, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-800 text-sky-400 font-mono font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                        {index + 1}
                      </span>
                      <span className="text-slate-200 leading-snug">{priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Unable to load executive briefing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
