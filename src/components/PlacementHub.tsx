import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Filter, 
  Building2, 
  ExternalLink, 
  TrendingUp, 
  Code2, 
  Cpu, 
  GraduationCap, 
  ChevronRight, 
  Download,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Student, CompanyRequirement, PlacementStatus } from '../types/student';
import { RECRUITER_COMPANIES } from '../data/mockStudents';

interface PlacementHubProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal: (student: Student) => void;
  onExportCsv: (subset?: Student[]) => void;
}

export const PlacementHub: React.FC<PlacementHubProps> = ({
  students,
  onSelectStudent,
  onOpenInterventionModal,
  onExportCsv,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('All');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<CompanyRequirement | null>(null);

  // Placed students & stats
  const placedStudents = useMemo(() => students.filter((s) => s.placement?.status === 'Placed'), [students]);
  const tier1Students = useMemo(() => students.filter((s) => s.placement?.status === 'Tier-1 Ready'), [students]);
  const eligibleGapStudents = useMemo(() => students.filter((s) => s.placement?.status === 'Eligible with Skill Gaps'), [students]);
  const atRiskStudents = useMemo(() => students.filter((s) => s.placement?.status === 'Academic Risk / Ineligible'), [students]);

  // Overall campus placement index
  const campusPlacementIndex = useMemo(() => {
    const total = students.length;
    if (!total) return 0;
    const readyPoints = placedStudents.length * 100 + tier1Students.length * 90 + eligibleGapStudents.length * 60 + atRiskStudents.length * 20;
    return (readyPoints / (total * 100) * 100).toFixed(1);
  }, [students, placedStudents, tier1Students, eligibleGapStudents, atRiskStudents]);

  // Filtered Student List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      const searchMatch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.placement?.targetRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.placement?.skills.some((sk) => sk.name.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!searchMatch) return false;

      // Status
      if (selectedStatusFilter !== 'All' && s.placement?.status !== selectedStatusFilter) return false;

      // Company Eligibility Filter
      if (selectedCompanyFilter !== 'All') {
        const company = RECRUITER_COMPANIES.find((c) => c.name === selectedCompanyFilter);
        if (company) {
          const meetsCgpa = s.cgpa >= company.minCgpa;
          const meetsBacklogs = s.backlogs <= company.maxBacklogs;
          if (!meetsCgpa || !meetsBacklogs) return false;
        }
      }

      return true;
    });
  }, [students, searchTerm, selectedStatusFilter, selectedCompanyFilter]);

  // Calculate cohort skill demand gaps
  const skillGapStats = [
    { skill: 'Production System Design & Scalability', missingPct: 42, impact: 'Blocks Tier-1 Super Dream qualifications (Google, Microsoft)' },
    { skill: 'Docker Containerization & Cloud CI/CD', missingPct: 38, impact: 'Required across 7 out of 8 campus recruiters' },
    { skill: 'Advanced Dynamic Programming (DSA)', missingPct: 31, impact: 'Primary filter on initial online coding assessments' },
    { skill: 'Embedded RTOS & Microcontroller Firmware', missingPct: 28, impact: 'Core blocker for Qualcomm & Semiconductor drives' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="uppercase tracking-wider">Campus Career &amp; Placement Surveillance</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Recruitment Drive Season 2026-27</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Placement Analytics &amp; Skill Gap Intelligence
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track student employability telemetry, benchmark technical skill proficiencies against company criteria (Google, Microsoft, Qualcomm), and deploy fast-track academic &amp; coding bootcamps before campus drives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onExportCsv(filteredStudents)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Export Placement Audit CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Placement Index */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Placement Readiness Index</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{campusPlacementIndex}%</span>
            <span className="text-xs font-semibold text-emerald-400">+5.2% vs last term</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Weighted index across CGPA, DSA coding scores, and mock interview performance.
          </p>
        </div>

        {/* KPI 2: Super Dream Ready */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tier-1 &amp; Super Dream Ready</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400">{tier1Students.length + placedStudents.length}</span>
            <span className="text-xs text-slate-400">students ({placedStudents.length} placed)</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            CGPA &ge; 3.40, zero backlogs, DSA &ge; 80/100 verified on portal.
          </p>
        </div>

        {/* KPI 3: Highest Package */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Compensation Offer</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-amber-300">$165,000 / yr</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Sofia Chen &bull; Google SWE (Super Dream Tier). Avg campus offer: <strong className="text-slate-200">$126k</strong>.
          </p>
        </div>

        {/* KPI 4: Academic Ineligible Warning */}
        <div 
          onClick={() => setSelectedStatusFilter('Academic Risk / Ineligible')}
          className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-5 hover:border-rose-700/60 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Placement Ineligible Risk</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-400">{atRiskStudents.length}</span>
            <span className="text-xs text-slate-400">students blocked</span>
          </div>
          <p className="mt-2 text-xs text-rose-300/80 flex items-center justify-between">
            <span>Blocked by CGPA &lt; 3.0 or pending backlogs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>
      </div>

      {/* Campus Recruitment Partner Drives */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Campus Recruiter Profiles &amp; Qualification Gates</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact eligibility cutoffs (CGPA, backlogs, technical skill prerequisites, and compensation packages).
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {RECRUITER_COMPANIES.length} Active Enterprise Partners
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {RECRUITER_COMPANIES.map((company) => {
            const eligibleCount = students.filter(
              (s) => s.cgpa >= company.minCgpa && s.backlogs <= company.maxBacklogs
            ).length;

            return (
              <div
                key={company.id}
                onClick={() => setSelectedCompanyModal(company)}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-sky-500/50 hover:bg-slate-950 cursor-pointer transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-base">{company.name}</h3>
                      <div className="text-[11px] text-sky-400 font-medium">{company.targetRole}</div>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        company.tier === 'Super Dream'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          : company.tier === 'Dream'
                          ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {company.tier}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Package:</span>
                      <span className="font-bold text-emerald-400">{company.packageCtc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Min CGPA:</span>
                      <span className="font-mono font-bold text-white">&ge; {company.minCgpa.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Backlogs:</span>
                      <span className="font-mono text-slate-200">{company.maxBacklogs === 0 ? '0 (Zero allowed)' : `Max ${company.maxBacklogs}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Drive Date:</span>
                      <span className="font-mono text-slate-300">{company.driveDate}</span>
                    </div>
                  </div>

                  {/* Required skills tags */}
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-300">
                      {company.requiredSkills.slice(0, 3).map((sk, i) => (
                        <span key={i} className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                          {sk}
                        </span>
                      ))}
                      {company.requiredSkills.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{company.requiredSkills.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Cohort Eligible: <strong className="text-sky-400 font-bold">{eligibleCount}</strong> students
                  </span>
                  <span className="text-sky-400 font-semibold hover:underline flex items-center">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Gap Heatmap & Remediation Priorities */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Campus Skill Gap Diagnostics &amp; Priority Bootcamp Triggers</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Systemic competence gaps identified across enrolled engineering cohorts compared against industry job descriptions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {skillGapStats.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{item.skill}</span>
                <span className="text-amber-400 font-mono font-bold">{item.missingPct}% Cohort Deficit</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div style={{ width: `${item.missingPct}%` }} className="bg-amber-500 h-full rounded-full" />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{item.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Placement Roster & Filtering Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Student Employability &amp; Placement Roster
            </h2>
            <p className="text-xs text-slate-400">
              Filter by placement tier, target role, and corporate eligibility gates.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredStudents.length}</strong> candidates
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student, role, or technical skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
            >
              <option value="All">All Placement Statuses</option>
              <option value="Tier-1 Ready">Tier-1 Ready (Super Dream)</option>
              <option value="Placed">Placed Candidates</option>
              <option value="Eligible with Skill Gaps">Eligible with Skill Gaps</option>
              <option value="Academic Risk / Ineligible">Academic Risk / Ineligible</option>
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
            >
              <option value="All">Filter by Company Criteria (All)</option>
              {RECRUITER_COMPANIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} Cutoff (CGPA &ge; {c.minCgpa.toFixed(1)}, Backlogs &le; {c.maxBacklogs})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Placement Status</th>
                  <th className="py-3 px-4">Academic Cutoffs</th>
                  <th className="py-3 px-4">DSA &amp; Coding</th>
                  <th className="py-3 px-4">Aptitude &amp; Mock</th>
                  <th className="py-3 px-4">Target Role &amp; Skills</th>
                  <th className="py-3 px-4">Recruitment Destination</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No candidates match the specified criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const pl = student.placement;
                    return (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition">
                        {/* Student Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <button
                                onClick={() => onSelectStudent(student)}
                                className="font-bold text-white hover:text-sky-400 text-left transition"
                              >
                                {student.name}
                              </button>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {student.id} &bull; {student.major}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              pl?.status === 'Placed'
                                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800'
                                : pl?.status === 'Tier-1 Ready'
                                ? 'bg-amber-950/90 text-amber-300 border border-amber-800'
                                : pl?.status === 'Eligible with Skill Gaps'
                                ? 'bg-indigo-950/90 text-indigo-300 border border-indigo-800'
                                : 'bg-rose-950/90 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {pl?.status || 'Assessing'}
                          </span>
                        </td>

                        {/* CGPA & Backlogs */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{student.cgpa.toFixed(2)} CGPA</div>
                          <div className="text-[11px] text-slate-400">
                            Backlogs: <strong className={student.backlogs > 0 ? 'text-rose-400' : 'text-emerald-400'}>{student.backlogs}</strong>
                          </div>
                        </td>

                        {/* DSA Score */}
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-sky-400">{pl?.dsaScore || 50}/100</div>
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                            <div
                              style={{ width: `${pl?.dsaScore || 50}%` }}
                              className="bg-sky-500 h-full rounded-full"
                            />
                          </div>
                        </td>

                        {/* Aptitude & Mock */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">Mock: {pl?.mockInterviewScore || 50}/100</div>
                          <div className="text-[11px] text-slate-400">Aptitude: {pl?.aptitudeScore || 60}/100</div>
                        </td>

                        {/* Target Role & Skills */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{pl?.targetRole || student.major}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {pl?.skills.slice(0, 3).map((s) => s.name).join(', ') || 'Core coursework'}
                          </div>
                        </td>

                        {/* Company / Dream */}
                        <td className="py-3 px-4">
                          {pl?.placedCompany ? (
                            <div>
                              <div className="font-bold text-emerald-400">{pl.placedCompany}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{pl.placedPackage}</div>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[11px] text-slate-300 font-medium">
                                {pl?.dreamCompanies.slice(0, 2).join(', ') || 'Tech Titans'}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => onSelectStudent(student)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                            >
                              Placement 360°
                            </button>
                            {student.placement?.status === 'Academic Risk / Ineligible' && (
                              <button
                                onClick={() => onOpenInterventionModal(student)}
                                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition"
                              >
                                Clear Risk
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Company Drilldown Modal */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-extrabold text-white">{selectedCompanyModal.name}</h3>
                  <span className="bg-amber-950 border border-amber-800 text-amber-300 text-xs font-bold px-2 py-0.5 rounded">
                    {selectedCompanyModal.tier}
                  </span>
                </div>
                <p className="text-xs text-sky-400 font-medium mt-0.5">{selectedCompanyModal.targetRole}</p>
              </div>

              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Compensation CTC</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">{selectedCompanyModal.packageCtc}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">CGPA Cutoff</div>
                <div className="text-white font-bold text-sm mt-1">&ge; {selectedCompanyModal.minCgpa.toFixed(1)}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Max Backlogs Allowed</div>
                <div className="text-white font-bold text-sm mt-1">{selectedCompanyModal.maxBacklogs}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Open Positions</div>
                <div className="text-sky-400 font-bold text-sm mt-1">{selectedCompanyModal.openPositions} seats</div>
              </div>
            </div>

            {/* Required Skills Checklist */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Mandatory Technical Competencies:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCompanyModal.requiredSkills.map((sk, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200">
                    &bull; {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Preferred Bonus Competencies:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCompanyModal.preferredSkills.map((sk, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    + {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligible Students List */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">
                  Eligible Campus Candidates ({students.filter((s) => s.cgpa >= selectedCompanyModal.minCgpa && s.backlogs <= selectedCompanyModal.maxBacklogs).length}):
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5">
                {students
                  .filter((s) => s.cgpa >= selectedCompanyModal.minCgpa && s.backlogs <= selectedCompanyModal.maxBacklogs)
                  .map((cand) => (
                    <div
                      key={cand.id}
                      onClick={() => {
                        setSelectedCompanyModal(null);
                        onSelectStudent(cand);
                      }}
                      className="p-2 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <img src={cand.avatar} alt={cand.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-white font-medium">{cand.name}</span>
                        <span className="text-slate-400 text-[11px]">({cand.major})</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">{cand.cgpa.toFixed(2)} CGPA</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
