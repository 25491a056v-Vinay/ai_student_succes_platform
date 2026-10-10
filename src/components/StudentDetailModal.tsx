import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Briefcase, 
  Home, 
  Award, 
  Send, 
  Copy, 
  Sliders, 
  Layers, 
  MessageSquare,
  BookOpen,
  ArrowRight,
  Shield,
  Loader2,
  Check,
  Code2,
  Building2,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, AIStudentAnalysis, AISimulationResult, Intervention, AIPlacementAnalysis } from '../types/student';
import { RECRUITER_COMPANIES } from '../data/mockStudents';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
  onOpenInterventionModal: (student: Student) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onOpenInterventionModal,
  onUpdateStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'placement' | 'ai-plan' | 'simulation' | 'interventions'>('overview');
  
  // Placement AI Analysis state
  const [placementAi, setPlacementAi] = useState<AIPlacementAnalysis | null>(null);
  const [isPlacementAiLoading, setIsPlacementAiLoading] = useState(false);

  // AI Recovery Roadmap state
  const [aiAnalysis, setAiAnalysis] = useState<AIStudentAnalysis | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [emailSentAlert, setEmailSentAlert] = useState(false);

  // What-If Simulation Sliders
  const [simAttendance, setSimAttendance] = useState<number>(student.attendanceRate);
  const [simWorkHours, setSimWorkHours] = useState<number>(student.workHoursPerWeek);
  const [simTutoring, setSimTutoring] = useState<boolean>(true);
  const [simLmsActivity, setSimLmsActivity] = useState<number>(Math.max(6, Math.round(student.lmsLoginsPerWeek * 1.5)));
  const [aiSimResult, setAiSimResult] = useState<AISimulationResult | null>(null);
  const [isSimLoading, setIsSimLoading] = useState(false);

  // Calculate live heuristic what-if risk score
  const calculatedSimRisk = React.useMemo(() => {
    let base = student.riskScore;
    // attendance impact
    const attDiff = simAttendance - student.attendanceRate;
    base -= attDiff * 0.55;
    // work hours impact
    const workDiff = student.workHoursPerWeek - simWorkHours;
    base -= workDiff * 0.7;
    // tutoring
    if (simTutoring) base -= 18;
    // lms activity
    const lmsDiff = simLmsActivity - student.lmsLoginsPerWeek;
    base -= lmsDiff * 1.2;

    return Math.max(10, Math.min(98, Math.round(base)));
  }, [student, simAttendance, simWorkHours, simTutoring, simLmsActivity]);

  const calculatedSimGpa = React.useMemo(() => {
    const riskDiff = student.riskScore - calculatedSimRisk;
    const gpaGain = (riskDiff / 100) * 0.9;
    return Math.min(4.0, Math.max(student.cgpa, Number((student.cgpa + gpaGain).toFixed(2))));
  }, [student, calculatedSimRisk]);

  // Request AI Recovery Plan from Backend
  const handleGenerateAiPlan = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Failed to generate AI plan:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Request AI Placement Readiness Analysis
  const handleGeneratePlacementAi = async () => {
    setIsPlacementAiLoading(true);
    try {
      const response = await fetch('/api/ai/analyze-placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student }),
      });
      const data = await response.json();
      if (data.analysis) {
        setPlacementAi(data.analysis);
      }
    } catch (err) {
      console.error('Failed to analyze placement readiness:', err);
    } finally {
      setIsPlacementAiLoading(false);
    }
  };

  // Run AI Simulation
  const handleRunAiSimulation = async () => {
    setIsSimLoading(true);
    try {
      const response = await fetch('/api/ai/simulate-intervention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          interventionType: simTutoring ? 'Embedded Peer Tutoring & Work Rebalancing' : 'Attendance Tracking Contract',
          parameters: {
            simAttendance,
            simWorkHours,
            simTutoring,
            simLmsActivity,
          },
        }),
      });
      const data = await response.json();
      if (data.simulation) {
        setAiSimResult(data.simulation);
      }
    } catch (err) {
      console.error('Failed to run simulation:', err);
    } finally {
      setIsSimLoading(false);
    }
  };

  const handleCopyEmail = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendEmailSimulation = () => {
    setEmailSentAlert(true);
    setTimeout(() => setEmailSentAlert(false), 3000);
  };

  const handleCompleteIntervention = (intId: string) => {
    const updatedInterventions = student.interventions.map((int) => {
      if (int.id === intId) {
        return { ...int, status: 'Completed' as const, outcomeScoreChange: -18 };
      }
      return int;
    });

    const newRisk = Math.max(15, student.riskScore - 18);
    const updated = {
      ...student,
      interventions: updatedInterventions,
      riskScore: newRisk,
      riskLevel: (newRisk >= 70 ? 'Critical' : newRisk >= 45 ? 'At-Risk' : newRisk >= 25 ? 'Stable' : 'High-Performer') as any,
      riskTrajectory: 'Improving' as const,
    };

    onUpdateStudent(updated);

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-extrabold text-white">{student.name}</h2>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {student.id}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    student.riskScore >= 70
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      : student.riskScore >= 45
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      : student.riskScore >= 25
                      ? 'bg-sky-950/80 text-sky-300 border border-sky-800'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  Risk {student.riskScore}/100 · {student.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {student.major} · {student.year} (Sem {student.semester}) · Advisor: <strong className="text-slate-200">{student.assignedAdvisor}</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center space-x-2 self-end md:self-auto">
            <button
              onClick={() => onOpenInterventionModal(student)}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition"
            >
              + Dispatch Intervention
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="border-b border-slate-800 bg-slate-950/40 px-6 flex space-x-4 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-sky-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>360° Profile &amp; Explainable AI</span>
          </button>

          <button
            onClick={() => setActiveTab('placement')}
            className={`py-3 border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'placement'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Placement &amp; Skills Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-plan')}
            className={`py-3 border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'ai-plan'
                ? 'border-sky-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Recovery Roadmap &amp; Advisor Script</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`py-3 border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'simulation'
                ? 'border-sky-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-teal-400" />
            <span>What-If Scenario Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('interventions')}
            className={`py-3 border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'interventions'
                ? 'border-sky-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Active Interventions ({student.interventions.length})</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 360° OVERVIEW & EXPLAINABLE AI */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Pillar 1: Academic */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Academic Standing</span>
                    <Award className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">{student.cgpa.toFixed(2)} CGPA</div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Midterm GPA: <strong className="text-slate-200">{student.midtermGpa.toFixed(2)}</strong></div>
                    <div>Prior Term GPA: <strong className="text-slate-200">{student.previousSemesterGpa.toFixed(2)}</strong></div>
                    <div>Backlogs: <strong className={student.backlogs > 0 ? 'text-rose-400' : 'text-emerald-400'}>{student.backlogs} failed</strong></div>
                    <div>Credits: <strong className="text-slate-200">{student.creditHoursCompleted} / {student.totalCredits}</strong></div>
                  </div>
                </div>

                {/* Pillar 2: Attendance */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Attendance &amp; Labs</span>
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className={`text-2xl font-extrabold ${student.attendanceRate < 70 ? 'text-rose-400' : 'text-white'}`}>
                    {student.attendanceRate}%
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Lab Attendance: <strong className="text-slate-200">{student.labAttendanceRate}%</strong></div>
                    <div>Commute Status: <strong className="text-slate-200">{student.residencyStatus}</strong></div>
                    <div>Alert Status: <strong className={student.attendanceRate < 70 ? 'text-rose-400' : 'text-emerald-400'}>
                      {student.attendanceRate < 70 ? 'Below Safety Threshold' : 'Compliant'}
                    </strong></div>
                  </div>
                </div>

                {/* Pillar 3: LMS Digital Telemetry */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>LMS Engagement</span>
                    <Clock className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">{student.lmsLoginsPerWeek} / wk</div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>HW Completion: <strong className="text-slate-200">{student.homeworkCompletionRate}%</strong></div>
                    <div>On-Time Rate: <strong className="text-slate-200">{student.assignmentPunctuality}%</strong></div>
                    <div>Resource Downloads: <strong className="text-slate-200">{student.resourceDownloads}</strong></div>
                    <div>Forum Interaction: <strong className="text-slate-200">{student.forumPosts} posts</strong></div>
                  </div>
                </div>

                {/* Pillar 4: Socio-Economic */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Socio-Economic Factors</span>
                    <Briefcase className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">{student.workHoursPerWeek} hrs/wk</div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Aid Status: <strong className="text-slate-200">{student.financialAidStatus}</strong></div>
                    <div>First-Generation: <strong className="text-slate-200">{student.firstGenCollegeStudent ? 'Yes' : 'No'}</strong></div>
                    <div>Wellness Index: <strong className="text-slate-200">{student.mentalWellnessIndex} / 10</strong></div>
                    <div>Campus Activity: <strong className="text-slate-200">{student.extracurricularScore} / 100</strong></div>
                  </div>
                </div>
              </div>

              {/* Explainable AI: SHAP-Style Factor Attribution Breakdown */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-sky-400" />
                      <span>Explainable AI: Feature Attribution (SHAP-Style Risk Decomposition)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Quantifying exactly how each academic and behavioral attribute contributed to {student.name}&apos;s current Risk Score of {student.riskScore}.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {student.shapFeatureWeights.map((weight, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{weight.feature}</span>
                        <span className={`font-mono font-bold ${weight.impact > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {weight.impact > 0 ? `+${weight.impact}% Risk Increase` : `${weight.impact}% Risk Reduction`}
                        </span>
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                        {weight.impact > 0 ? (
                          <div
                            style={{ width: `${Math.min(100, weight.impact * 2.5)}%` }}
                            className="bg-rose-500 rounded-full"
                          />
                        ) : (
                          <div
                            style={{ width: `${Math.min(100, Math.abs(weight.impact) * 2.5)}%` }}
                            className="bg-emerald-500 rounded-full"
                          />
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400">{weight.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curricular Bottleneck & Advisor Case Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Primary Academic Choke-Point
                  </div>
                  <div className="mt-2 text-sm font-bold text-sky-400 font-mono">
                    {student.bottleneckCourse}
                  </div>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    This course serves as a prerequisite lock for upper-level progression. Performance deficits here trigger compound degree completion delays.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Assigned Advisor Case Log
                  </div>
                  <div className="mt-1 text-xs font-bold text-white">
                    {student.assignedAdvisor}
                  </div>
                  <p className="mt-2 text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded border border-slate-800">
                    &ldquo;{student.lastAdvisorNote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PLACEMENT & SKILLS INTELLIGENCE */}
          {activeTab === 'placement' && (
            <div className="space-y-6">
              {/* Target Career Banner */}
              <div className="p-5 rounded-xl border border-indigo-900/50 bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      Target Career Specialization
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        student.placement?.status === 'Placed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : student.placement?.status === 'Tier-1 Ready'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : student.placement?.status === 'Eligible with Skill Gaps'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {student.placement?.status || 'Assessing'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    {student.placement?.targetRole || 'Software Development Engineer'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dream Companies:{' '}
                    <strong className="text-slate-200">
                      {student.placement?.dreamCompanies.join(', ') || 'Google, Microsoft, Amazon'}
                    </strong>
                  </p>
                </div>

                {student.placement?.placedCompany ? (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-right self-start md:self-auto">
                    <div className="text-[10px] uppercase font-bold text-emerald-400">Secured Campus Offer</div>
                    <div className="text-base font-extrabold text-white">{student.placement.placedCompany}</div>
                    <div className="text-xs font-mono font-bold text-emerald-300">{student.placement.placedPackage}</div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 self-start md:self-auto">
                    <button
                      onClick={handleGeneratePlacementAi}
                      className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Run AI Placement Diagnostic</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 4 Pillar Placement Scorecards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">DSA &amp; Coding Ability</div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-sky-400">{student.placement?.dsaScore || 50}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
                    <div style={{ width: `${student.placement?.dsaScore || 50}%` }} className="bg-sky-500 h-full rounded-full" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">LeetCode / Algorithmic benchmark</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Mock Interview Score</div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-emerald-400">{student.placement?.mockInterviewScore || 60}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
                    <div style={{ width: `${student.placement?.mockInterviewScore || 60}%` }} className="bg-emerald-500 h-full rounded-full" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Technical + Behavioral panels</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Quantitative Aptitude</div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-amber-400">{student.placement?.aptitudeScore || 65}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
                    <div style={{ width: `${student.placement?.aptitudeScore || 65}%` }} className="bg-amber-500 h-full rounded-full" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Logical &amp; numerical reasoning</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Verified Projects &amp; Exp</div>
                  <div className="mt-2 text-2xl font-extrabold text-white">
                    {student.placement?.projectsCount || 2} Projects
                  </div>
                  <div className="text-[11px] text-indigo-400 mt-2 font-medium">
                    {student.placement?.internshipExperience ? '✓ Has Prior Internship' : 'Seeking First Internship'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Resume Score: {student.placement?.resumeScore || 65}/100</div>
                </div>
              </div>

              {/* Technical Skills Inventory */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-sky-400" />
                    <span>Verified Technical Skills Portfolio</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    {student.placement?.skills?.length || 0} skills assessed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {(student.placement?.skills || []).map((sk, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{sk.name}</span>
                        <span className="text-[10px] font-mono font-semibold bg-slate-800 px-2 py-0.5 rounded text-sky-300">
                          {sk.level} ({sk.score}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          style={{ width: `${sk.score}%` }}
                          className={`h-full rounded-full ${
                            sk.score >= 80 ? 'bg-emerald-500' : sk.score >= 60 ? 'bg-sky-500' : 'bg-amber-500'
                          }`}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">Category: {sk.category}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Qualification & Cutoff Matrix */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>Corporate Recruiter Qualification Checker</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Real-time assessment of {student.name}&apos;s academic standing against campus hiring cutoffs.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {RECRUITER_COMPANIES.map((company) => {
                    const meetsCgpa = student.cgpa >= company.minCgpa;
                    const meetsBacklogs = student.backlogs <= company.maxBacklogs;
                    const isQualified = meetsCgpa && meetsBacklogs;

                    return (
                      <div
                        key={company.id}
                        className={`p-3.5 rounded-lg border text-xs space-y-2 transition ${
                          isQualified
                            ? 'bg-emerald-950/20 border-emerald-900/50'
                            : 'bg-slate-900/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{company.name}</span>
                            <span className="text-[10px] text-slate-400">({company.targetRole.split('(')[0]})</span>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isQualified
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {isQualified ? '✓ Cutoffs Met' : 'Ineligible'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>
                            CGPA Gate: <strong className={meetsCgpa ? 'text-slate-200' : 'text-rose-400'}>&ge; {company.minCgpa.toFixed(1)}</strong> (Yours: {student.cgpa.toFixed(2)})
                          </span>
                          <span>
                            Backlog Gate: <strong className={meetsBacklogs ? 'text-slate-200' : 'text-rose-400'}>&le; {company.maxBacklogs}</strong> (Yours: {student.backlogs})
                          </span>
                        </div>

                        {!isQualified && (
                          <div className="text-[11px] text-rose-300 bg-rose-950/50 p-1.5 rounded border border-rose-900/40">
                            Fails gate: {meetsCgpa ? '' : `CGPA is ${(company.minCgpa - student.cgpa).toFixed(2)} below cutoff. `}{meetsBacklogs ? '' : `${student.backlogs} active backlogs must be cleared.`}
                          </div>
                        )}

                        {isQualified && (
                          <div className="text-[11px] text-emerald-300">
                            Package: <strong>{company.packageCtc}</strong> &bull; Drive date: {company.driveDate}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gemini AI Career & Interview Coach */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Gemini AI Career Readiness &amp; 4-Week Prep Coach</span>
                  </h4>
                  {!placementAi && !isPlacementAiLoading && (
                    <button
                      onClick={handleGeneratePlacementAi}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                    >
                      Generate AI Action Plan
                    </button>
                  )}
                </div>

                {isPlacementAiLoading && (
                  <div className="text-center py-12 space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-white">Synthesizing candidate profile with Gemini 3.8 Flash...</p>
                    <p className="text-xs text-slate-400">Comparing technical competencies against competitive corporate hiring benchmarks</p>
                  </div>
                )}

                {placementAi && (
                  <div className="space-y-5 text-xs">
                    {/* Diagnostic Summary */}
                    <div className="p-4 rounded-xl border border-indigo-900/60 bg-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-indigo-400">Employability Readiness Index</div>
                        <div className="text-2xl font-extrabold text-white mt-0.5">{placementAi.overallReadinessIndex} / 100</div>
                        <div className="text-xs text-indigo-300 font-medium">{placementAi.readinessCategory}</div>
                      </div>
                      <div className="text-right sm:max-w-xs text-[11px] text-slate-300">
                        {placementAi.cgpaAssessment}
                      </div>
                    </div>

                    {/* Strong Match vs Reach Companies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 space-y-2">
                        <div className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">
                          High Probability Match Recruiters:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {placementAi.strongMatchCompanies.map((c, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-200 font-semibold text-xs">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-amber-900/40 bg-amber-950/20 space-y-2">
                        <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                          Target Reach Opportunities:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {placementAi.reachCompanies.map((c, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-amber-950 border border-amber-800 text-amber-200 font-semibold text-xs">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Missing Skills Gap */}
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-2">
                      <div className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">
                        Priority Technical Gaps to Remediate:
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {placementAi.topMissingSkills.map((gap, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <ArrowRight className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 4-Week Prep Sprint */}
                    <div className="space-y-3">
                      <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                        Personalized 4-Week Placement Prep Roadmap:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {placementAi.fourWeekActionPlan.map((wk, idx) => (
                          <div key={idx} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                            <div className="font-mono font-bold text-sky-400">{wk.week}</div>
                            <div className="font-bold text-white text-[11px]">{wk.focus}</div>
                            <ul className="space-y-1 text-[11px] text-slate-300">
                              {wk.tasks.map((t, ti) => (
                                <li key={ti} className="flex items-start space-x-1">
                                  <span className="text-sky-400 font-bold">&bull;</span>
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Project & Interview Strategy */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Recommended Capstone Project</div>
                        <p className="text-slate-200 leading-relaxed">{placementAi.recommendedCapstoneProject}</p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Strategic Interview Advisory</div>
                        <p className="text-slate-200 leading-relaxed">{placementAi.interviewAdvice}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GEMINI AI RECOVERY ROADMAP & ADVISOR SCRIPT */}
          {activeTab === 'ai-plan' && (
            <div className="space-y-6">
              {!aiAnalysis && !isAiLoading && (
                <div className="text-center py-12 px-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-base font-bold text-white">
                      Generate AI-Powered Academic Recovery Blueprint
                    </h3>
                    <p className="text-xs text-slate-400">
                      Our Gemini 3.8 Flash intelligence model will analyze {student.name}&apos;s full academic history, attendance curves, and employment burdens to produce an individual 6-week turnaround roadmap.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateAiPlan}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run Gemini 3.8 Flash Analysis</span>
                  </button>
                </div>
              )}

              {isAiLoading && (
                <div className="text-center py-16 space-y-3">
                  <Loader2 className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-white">Synthesizing multi-variable student profile...</p>
                  <p className="text-xs text-slate-400">Running Gemini 3.8 Flash cognitive diagnostic engine</p>
                </div>
              )}

              {aiAnalysis && (
                <div className="space-y-6">
                  {/* Summary Diagnosis */}
                  <div className="p-4 rounded-xl border border-sky-900/60 bg-sky-950/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-sky-400">
                      <span className="flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Executive Diagnostic Summary</span>
                      </span>
                      <span className="text-[10px] uppercase font-mono bg-sky-900/60 px-2 py-0.5 rounded text-sky-200">
                        Gemini 3.8 Flash Verified
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {aiAnalysis.summaryDiagnosis}
                    </p>
                  </div>

                  {/* Root Causes vs Positive Strengths */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-rose-900/40 bg-rose-950/20 space-y-3">
                      <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Identified Friction Points</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {aiAnalysis.rootCauses.map((cause, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 space-y-3">
                      <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Latent Strengths &amp; Positive Anchors</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {aiAnalysis.positiveLeveragePoints.map((strength, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 6-Week Structured Recovery Roadmap */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-sky-400" />
                        <span>6-Week Actionable Academic Turnaround Roadmap</span>
                      </h4>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-emerald-400 font-semibold">{aiAnalysis.projectedGpaRecovery}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-sky-400 font-semibold">{aiAnalysis.dropoutRiskReduction}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {aiAnalysis.personalizedRecoveryRoadmap.map((step, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-sky-400">{step.week}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Phase {idx + 1}</span>
                          </div>
                          <div className="text-xs font-bold text-white">{step.focus}</div>
                          <ul className="space-y-1.5 text-[11px] text-slate-300">
                            {step.actions.map((act, i) => (
                              <li key={i} className="flex items-start space-x-1.5">
                                <ArrowRight className="w-3 h-3 text-sky-400 flex-shrink-0 mt-0.5" />
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compassionate Advisor Outreach Email Draft */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-white">
                          Tailored Advisor Check-In Script
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyEmail(aiAnalysis.advisorEmailDraft)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                        >
                          {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedEmail ? 'Copied!' : 'Copy Script'}</span>
                        </button>
                        <button
                          onClick={handleSendEmailSimulation}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch to Student Portal</span>
                        </button>
                      </div>
                    </div>

                    {emailSentAlert && (
                      <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Message successfully queued to {student.email} and logged in advisor case timeline!</span>
                      </div>
                    )}

                    <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {aiAnalysis.advisorEmailDraft}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WHAT-IF SCENARIO SIMULATOR */}
          {activeTab === 'simulation' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-teal-900/40 bg-teal-950/20 text-xs text-teal-300">
                <strong>Administrative Simulation Engine:</strong> Adjust key levers below to test hypothetical policy interventions (tutoring assignment, work-hour reduction, attendance improvements) and observe real-time predicted trajectory changes.
              </div>

              {/* Simulation Controls & Output */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sliders Form */}
                <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950/60 p-6">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-teal-400" />
                    <span>Intervention Levers</span>
                  </h4>

                  {/* Lever 1: Attendance */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Target Lecture Attendance</span>
                      <span className="font-mono font-bold text-teal-400">{simAttendance}% (Current: {student.attendanceRate}%)</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={simAttendance}
                      onChange={(e) => setSimAttendance(parseInt(e.target.value, 10))}
                      className="w-full accent-teal-400"
                    />
                  </div>

                  {/* Lever 2: Work Hours */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Off-Campus Work Hours</span>
                      <span className="font-mono font-bold text-teal-400">{simWorkHours} hrs/wk (Current: {student.workHoursPerWeek}h)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="35"
                      value={simWorkHours}
                      onChange={(e) => setSimWorkHours(parseInt(e.target.value, 10))}
                      className="w-full accent-teal-400"
                    />
                  </div>

                  {/* Lever 3: LMS Activity */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">LMS Study Sessions / Week</span>
                      <span className="font-mono font-bold text-teal-400">{simLmsActivity} sessions (Current: {student.lmsLoginsPerWeek})</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={simLmsActivity}
                      onChange={(e) => setSimLmsActivity(parseInt(e.target.value, 10))}
                      className="w-full accent-teal-400"
                    />
                  </div>

                  {/* Lever 4: Peer Tutoring */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Assign Dedicated Peer Tutor</span>
                    <button
                      onClick={() => setSimTutoring(!simTutoring)}
                      className={`px-3 py-1.5 rounded-md font-semibold transition ${
                        simTutoring
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {simTutoring ? '✓ Assigned (2h/wk)' : 'Not Assigned'}
                    </button>
                  </div>

                  <button
                    onClick={handleRunAiSimulation}
                    className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center space-x-2"
                  >
                    {isSimLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Run Deep AI Simulation Model</span>
                  </button>
                </div>

                {/* Simulated Outcome Display */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Projected Trajectory Impact</h4>
                      <span className="text-[10px] font-mono text-teal-400 bg-teal-950 border border-teal-800 px-2 py-0.5 rounded">
                        Confidence 89%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Risk Score */}
                      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[11px] text-slate-400 uppercase font-semibold">Simulated Risk Score</div>
                        <div className="mt-2 flex items-baseline space-x-2">
                          <span className={`text-3xl font-extrabold ${calculatedSimRisk < 45 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {calculatedSimRisk}
                          </span>
                          <span className="text-xs text-emerald-400 font-bold">
                            -{student.riskScore - calculatedSimRisk} pts
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">From baseline {student.riskScore}</div>
                      </div>

                      {/* Forecasted GPA */}
                      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[11px] text-slate-400 uppercase font-semibold">Forecasted GPA</div>
                        <div className="mt-2 flex items-baseline space-x-2">
                          <span className="text-3xl font-extrabold text-white">{calculatedSimGpa}</span>
                          <span className="text-xs text-emerald-400 font-bold">
                            +{(calculatedSimGpa - student.cgpa).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">From current {student.cgpa}</div>
                      </div>
                    </div>

                    {/* AI Simulation Narrative */}
                    {aiSimResult ? (
                      <div className="p-3.5 rounded-lg bg-teal-950/30 border border-teal-900/60 text-xs space-y-2">
                        <div className="font-bold text-teal-300">AI Narrative Assessment:</div>
                        <p className="text-slate-300 leading-relaxed">{aiSimResult.simulationNarrative}</p>
                        <div className="text-[11px] text-teal-400 font-medium">
                          Next Verification Milestone: {aiSimResult.recommendedMilestone}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                        Click &ldquo;Run Deep AI Simulation Model&rdquo; to generate qualitative causal explanations and timeline milestones.
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onOpenInterventionModal(student);
                    }}
                    className="mt-4 w-full py-2 text-center text-xs font-semibold text-teal-400 hover:text-teal-300 border-t border-slate-800"
                  >
                    Commit this plan to Active Interventions &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVE INTERVENTIONS */}
          {activeTab === 'interventions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Logged Administrative Interventions</h4>
                  <p className="text-xs text-slate-400">History of actions taken by advisors, professors, and financial aid.</p>
                </div>
                <button
                  onClick={() => onOpenInterventionModal(student)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition"
                >
                  + Log New Intervention
                </button>
              </div>

              {student.interventions.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-slate-800 bg-slate-950/40 text-slate-400 text-xs space-y-2">
                  <p>No interventions currently logged for {student.name}.</p>
                  <button
                    onClick={() => onOpenInterventionModal(student)}
                    className="text-sky-400 font-semibold hover:underline"
                  >
                    Initiate an early alert intervention now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {student.interventions.map((int) => (
                    <div
                      key={int.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{int.title}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {int.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Type: <strong className="text-slate-200">{int.type}</strong> · Assigned: <strong className="text-slate-200">{int.assignedTo}</strong>
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              int.status === 'Completed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : int.status === 'In Progress'
                                ? 'bg-sky-950 text-sky-300 border border-sky-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {int.status}
                          </span>

                          {int.status !== 'Completed' && (
                            <button
                              onClick={() => handleCompleteIntervention(int.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1">
                        <div>Target Milestone: <strong className="text-sky-400">{int.targetMetric}</strong></div>
                        <p className="text-slate-400 italic bg-slate-900 p-2 rounded border border-slate-800">
                          &ldquo;{int.notes}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
