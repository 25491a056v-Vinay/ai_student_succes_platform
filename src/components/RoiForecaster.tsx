import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  GraduationCap, 
  Sliders, 
  Download, 
  CheckCircle,
  FileText
} from 'lucide-react';

export const RoiForecaster: React.FC = () => {
  const [totalEnrolled, setTotalEnrolled] = useState<number>(1840);
  const [tuitionPerStudent, setTuitionPerStudent] = useState<number>(14500);
  const [baselineAttritionRate, setBaselineAttritionRate] = useState<number>(13.6);
  const [interventionSuccessRate, setInterventionSuccessRate] = useState<number>(72);
  const [programCost, setProgramCost] = useState<number>(85000);

  // Financial Calculations
  const calculatedMetrics = useMemo(() => {
    const unmitigatedDropouts = Math.round((totalEnrolled * baselineAttritionRate) / 100);
    const studentsRetained = Math.round((unmitigatedDropouts * interventionSuccessRate) / 100);
    const grossRevenueProtected = studentsRetained * tuitionPerStudent;
    const netSavings = grossRevenueProtected - programCost;
    const roiMultiplier = (grossRevenueProtected / (programCost || 1)).toFixed(1);
    const graduationRateUplift = ((studentsRetained / totalEnrolled) * 100).toFixed(1);

    return {
      unmitigatedDropouts,
      studentsRetained,
      grossRevenueProtected,
      netSavings,
      roiMultiplier,
      graduationRateUplift,
    };
  }, [totalEnrolled, tuitionPerStudent, baselineAttritionRate, interventionSuccessRate, programCost]);

  const handleDownloadReport = () => {
    const reportText = `SMART CAMPUS ANALYTICS: INSTITUTIONAL RETENTION & ROI REPORT
Generated: ${new Date().toLocaleDateString()}
Target Cohort: ${totalEnrolled.toLocaleString()} Enrolled Undergraduates

MODEL PARAMETERS:
- Annual Tuition & Fees per Student: $${tuitionPerStudent.toLocaleString()}
- Baseline Historical Attrition Rate: ${baselineAttritionRate}%
- AI Early Warning Intervention Success Rate: ${interventionSuccessRate}%
- Annual Campus Support Investment: $${programCost.toLocaleString()}

PREDICTED INSTITUTIONAL IMPACT:
- Students at Risk of Dropout: ${calculatedMetrics.unmitigatedDropouts} students
- Students Projected to be Retained: ${calculatedMetrics.studentsRetained} students
- Gross Tuition Revenue Protected: $${calculatedMetrics.grossRevenueProtected.toLocaleString()}
- Net Institutional Savings: $${calculatedMetrics.netSavings.toLocaleString()}
- Return on Academic Support Investment: ${calculatedMetrics.roiMultiplier}x
- Estimated 4-Year Graduation Rate Gain: +${calculatedMetrics.graduationRateUplift}%

SUMMARY:
Deploying multi-source predictive analytics and rapid automated interventions generates significant positive retention yield, transforming early warning data into preserved student futures and sustainable campus finances.
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Smart_Campus_ROI_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-teal-400" />
            <span>Institutional ROI &amp; Retention Forecaster</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate the campus-wide financial and graduation yield of proactive early warning and peer support interventions.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Board ROI Report</span>
        </button>
      </div>

      {/* Main ROI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-teal-400" />
            <span>Campus Parameters</span>
          </h2>

          {/* Control 1: Total Enrolled */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Total Enrolled Students</span>
              <span className="font-mono font-bold text-white">{totalEnrolled.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="50"
              value={totalEnrolled}
              onChange={(e) => setTotalEnrolled(parseInt(e.target.value, 10))}
              className="w-full accent-teal-400"
            />
          </div>

          {/* Control 2: Tuition per Student */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Annual Tuition &amp; Fees / Student</span>
              <span className="font-mono font-bold text-white">${tuitionPerStudent.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="4000"
              max="50000"
              step="500"
              value={tuitionPerStudent}
              onChange={(e) => setTuitionPerStudent(parseInt(e.target.value, 10))}
              className="w-full accent-teal-400"
            />
          </div>

          {/* Control 3: Baseline Attrition */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Baseline Annual Attrition Rate</span>
              <span className="font-mono font-bold text-white">{baselineAttritionRate}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="0.5"
              value={baselineAttritionRate}
              onChange={(e) => setBaselineAttritionRate(parseFloat(e.target.value))}
              className="w-full accent-teal-400"
            />
          </div>

          {/* Control 4: Intervention Turnaround Success */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Intervention Turnaround Success Rate</span>
              <span className="font-mono font-bold text-teal-400">{interventionSuccessRate}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              step="1"
              value={interventionSuccessRate}
              onChange={(e) => setInterventionSuccessRate(parseInt(e.target.value, 10))}
              className="w-full accent-teal-400"
            />
          </div>

          {/* Control 5: Support Budget */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Academic Support &amp; Tutoring Budget</span>
              <span className="font-mono font-bold text-white">${programCost.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="5000"
              value={programCost}
              onChange={(e) => setProgramCost(parseInt(e.target.value, 10))}
              className="w-full accent-teal-400"
            />
          </div>
        </div>

        {/* Results Cards (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Big Callout Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-teal-900/60 bg-teal-950/20 space-y-2">
              <div className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider">
                Gross Revenue Protected
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">
                ${(calculatedMetrics.grossRevenueProtected / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-slate-400">
                Preserved annual tuition and state funding
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Students Retained
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {calculatedMetrics.studentsRetained}
              </div>
              <div className="text-xs text-slate-400">
                Out of {calculatedMetrics.unmitigatedDropouts} predicted dropouts
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Support Investment ROI
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {calculatedMetrics.roiMultiplier}x
              </div>
              <div className="text-xs text-slate-400">
                Net savings of ${(calculatedMetrics.netSavings / 1000).toFixed(0)}k
              </div>
            </div>
          </div>

          {/* Narrative Breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <span>Institutional Value Synthesis</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                At a campus baseline of <strong className="text-white">{totalEnrolled.toLocaleString()} students</strong>, an unmitigated attrition rate of <strong className="text-white">{baselineAttritionRate}%</strong> would lead to approximately <strong className="text-rose-400">{calculatedMetrics.unmitigatedDropouts} students withdrawing</strong> prior to graduation.
              </p>
              <p>
                By deploying the Smart Campus AI Early Warning platform, students requiring academic, financial, or attendance interventions are identified up to <strong className="text-teal-400">3 weeks prior to midterm failures</strong>. Achieving a <strong className="text-white">{interventionSuccessRate}% turnaround rate</strong> saves <strong className="text-emerald-400">{calculatedMetrics.studentsRetained} students</strong> from departure.
              </p>
              <p>
                This outcome preserves <strong className="text-teal-300 font-bold">${calculatedMetrics.grossRevenueProtected.toLocaleString()}</strong> in student tuition while increasing the university&apos;s overall 4-year graduation rate by <strong className="text-sky-300 font-bold">+{calculatedMetrics.graduationRateUplift}%</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">Ready for board presentation?</span>
              <button
                onClick={handleDownloadReport}
                className="text-teal-400 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Download Executive Summary Memo</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
