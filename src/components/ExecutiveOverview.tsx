import React from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  GraduationCap, 
  ArrowUpRight, 
  Clock, 
  BookOpen, 
  UserX, 
  Zap, 
  Sparkles,
  ChevronRight,
  Target
} from 'lucide-react';
import { Student, CampusMetrics } from '../types/student';
import { BOTTLENECK_COURSES_STATS, DEPARTMENT_RETENTION_METRICS } from '../data/mockStudents';

interface ExecutiveOverviewProps {
  metrics: CampusMetrics;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onNavigateToRoster: (filterRisk?: string) => void;
  onOpenBriefingModal: () => void;
  onOpenInterventionModal: (student: Student) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  metrics,
  students,
  onSelectStudent,
  onNavigateToRoster,
  onOpenBriefingModal,
  onOpenInterventionModal,
}) => {
  const criticalStudents = students.filter(s => s.riskLevel === 'Critical');
  const atRiskStudents = students.filter(s => s.riskLevel === 'At-Risk');
  const stableStudents = students.filter(s => s.riskLevel === 'Stable');
  const highPerformers = students.filter(s => s.riskLevel === 'High-Performer');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Institutional Context */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="uppercase tracking-wider">Predictive Telemetry Active</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Mid-Semester Retention Surveillance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Early Intervention &amp; Campus Decision Intelligence
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Synthesizing learning management telemetry, attendance velocities, and socio-academic factors to detect attrition vulnerabilities up to 3 weeks before conventional midterm warnings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenBriefingModal}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate AI Dean Briefing</span>
            </button>
            <button
              onClick={() => onNavigateToRoster('Critical')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-rose-700/60 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 text-xs font-semibold transition"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Review {criticalStudents.length} Critical Alerts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Baseline Retention</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{metrics.retentionRate}%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.8% target
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Projected to reach <span className="text-slate-200 font-medium">{metrics.projectedRetentionRate}%</span> upon full intervention completion.
          </p>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigateToRoster('Critical')}
          className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-5 hover:border-rose-700/60 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Early Warning Roster</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-400">{criticalStudents.length}</span>
            <span className="text-xs font-medium text-slate-400">critical / {atRiskStudents.length} watchlist</span>
          </div>
          <p className="mt-2 text-xs text-rose-300/80 flex items-center justify-between">
            <span>Requires same-day advisor action</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Interventions</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{metrics.activeInterventionsCount}</span>
            <span className="text-xs text-slate-400">in execution</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Tutoring, workload relief, and dean consultations active.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Protected Tuition</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">${(metrics.estimatedTuitionProtected).toLocaleString()}</span>
            <span className="text-xs font-medium text-teal-400">est. value</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Institutional revenue saved through dropout prevention.
          </p>
        </div>
      </div>

      {/* Cohort Risk Spectrum & Urgent Triage Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Spectrum Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight">Cohort Risk Spectrum</h2>
              <span className="text-xs text-slate-400">{students.length} students monitored</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-variable AI index combining GPA velocity, attendance %, and digital LMS engagement.
            </p>

            {/* Segmented Distribution Bar */}
            <div className="mt-6 h-3 rounded-full overflow-hidden flex bg-slate-800">
              <div 
                style={{ width: `${(criticalStudents.length / students.length) * 100}%` }} 
                className="bg-rose-500 hover:opacity-90 transition" 
                title={`Critical Risk: ${criticalStudents.length}`} 
              />
              <div 
                style={{ width: `${(atRiskStudents.length / students.length) * 100}%` }} 
                className="bg-amber-500 hover:opacity-90 transition" 
                title={`At-Risk: ${atRiskStudents.length}`} 
              />
              <div 
                style={{ width: `${(stableStudents.length / students.length) * 100}%` }} 
                className="bg-sky-500 hover:opacity-90 transition" 
                title={`Stable: ${stableStudents.length}`} 
              />
              <div 
                style={{ width: `${(highPerformers.length / students.length) * 100}%` }} 
                className="bg-emerald-500 hover:opacity-90 transition" 
                title={`High Performers: ${highPerformers.length}`} 
              />
            </div>

            {/* Detailed Spectrum List */}
            <div className="mt-6 space-y-3">
              <div 
                onClick={() => onNavigateToRoster('Critical')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 hover:border-rose-700/60 cursor-pointer transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-semibold text-rose-300">Critical Intervention Needed (Risk &ge; 70)</span>
                </div>
                <span className="text-xs font-bold text-rose-400">{criticalStudents.length} students</span>
              </div>

              <div 
                onClick={() => onNavigateToRoster('At-Risk')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 hover:border-amber-700/60 cursor-pointer transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-amber-300">Moderate Watchlist (Risk 45-69)</span>
                </div>
                <span className="text-xs font-bold text-amber-400">{atRiskStudents.length} students</span>
              </div>

              <div 
                onClick={() => onNavigateToRoster('Stable')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 cursor-pointer transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-xs font-medium text-slate-300">Stable Progression (Risk 25-44)</span>
                </div>
                <span className="text-xs font-bold text-slate-300">{stableStudents.length} students</span>
              </div>

              <div 
                onClick={() => onNavigateToRoster('High-Performer')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 hover:border-emerald-700/60 cursor-pointer transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-300">Honors / Potential Peer Mentors (&lt; 25)</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">{highPerformers.length} students</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToRoster()}
            className="mt-4 w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-white border-t border-slate-800 transition"
          >
            Explore Complete Student Dossier Table &rarr;
          </button>
        </div>

        {/* Rapid Action Queue (Urgent Cases) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
                  <span>Urgent Administrative Intervention Queue</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-950/80 border border-rose-800/70 text-rose-300 rounded">
                    Action Priority
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Highest-risk students flagged by predictive modeling requiring direct outreach.
                </p>
              </div>
              <button
                onClick={() => onNavigateToRoster('Critical')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                View all ({criticalStudents.length})
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {criticalStudents.slice(0, 3).map((student) => (
                <div
                  key={student.id}
                  className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white">{student.name}</span>
                          <span className="text-xs text-slate-400">{student.id}</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {student.major} · {student.year} · Advisor: {student.assignedAdvisor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-rose-400">
                          Risk {student.riskScore}/100
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Att: {student.attendanceRate}% · GPA: {student.cgpa}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                        >
                          View 360°
                        </button>
                        <button
                          onClick={() => onOpenInterventionModal(student)}
                          className="px-2.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition"
                        >
                          Intervene
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Root cause kicker */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="text-slate-500 font-medium">Trigger:</span>
                    <span className="text-rose-300/90 font-medium">{student.keyRiskFactors[0]}</span>
                    {student.bottleneckCourse && (
                      <>
                        <span className="text-slate-600">·</span>
                        <span className="text-amber-300/80 font-mono text-[11px]">{student.bottleneckCourse}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Average turnaround time from alert to advisor contact: <strong className="text-slate-200">2.1 days</strong></span>
            <span className="text-emerald-400 font-medium">Retention recovery rate: 78%</span>
          </div>
        </div>
      </div>

      {/* Bottleneck Courses Analysis & Departmental Retention Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Bottleneck Courses Radar */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Curricular Choke-Points (Bottleneck Courses)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Gateway courses driving the highest volume of early warning signals and probation risks.
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-2">Course</th>
                  <th className="pb-2">Department</th>
                  <th className="pb-2 text-right">Fail/D Rate</th>
                  <th className="pb-2 text-right">Avg Attendance</th>
                  <th className="pb-2 text-right">At-Risk Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {BOTTLENECK_COURSES_STATS.map((course) => (
                  <tr key={course.courseCode} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 font-medium text-white">
                      <div className="font-mono text-sky-400 font-bold">{course.courseCode}</div>
                      <div className="text-[11px] text-slate-300">{course.courseName}</div>
                    </td>
                    <td className="py-2.5 text-slate-300">{course.department}</td>
                    <td className="py-2.5 text-right font-bold text-rose-400">
                      {course.failRate}%
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-300">
                      {course.attendanceAvg}%
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="font-bold text-amber-400">{course.affectedStudents}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-sky-950/20 border border-sky-900/40 text-xs text-sky-300 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Institutional Recommendation:</strong> Mandating supplemental instruction and peer tutoring in <span className="font-mono font-semibold">CS201</span> and <span className="font-mono font-semibold">EE204</span> is projected to reduce sophomore attrition by 3.2%.
            </div>
          </div>
        </div>

        {/* Departmental Retention Matrix */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Departmental Retention Benchmarks</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cross-department comparative performance and at-risk density.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {DEPARTMENT_RETENTION_METRICS.map((dept) => (
              <div 
                key={dept.department} 
                className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-white">{dept.department}</div>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span>Enrolled: <strong className="text-slate-200">{dept.enrolledCount}</strong></span>
                    <span>Avg GPA: <strong className="text-slate-200">{dept.avgGpa}</strong></span>
                    <span className="text-emerald-400 font-semibold">{dept.retentionRate}% Retained</span>
                  </div>
                </div>

                <div className="mt-2 w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                  <div 
                    style={{ width: `${dept.retentionRate}%` }} 
                    className="bg-emerald-500 rounded-full" 
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>At-Risk Ratio: <strong className={dept.atRiskPct > 18 ? 'text-rose-400' : 'text-amber-400'}>{dept.atRiskPct}%</strong></span>
                  <span>Avg Lecture Attendance: <strong className="text-slate-300">{dept.avgAttendance}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
