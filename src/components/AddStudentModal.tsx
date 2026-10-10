import React, { useState } from 'react';
import { X, UserPlus, Sparkles, AlertTriangle, Check } from 'lucide-react';
import { Student, RiskLevel, RiskTrajectory } from '../types/student';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAddStudent }) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Student['department']>('Computer Science & AI');
  const [year, setYear] = useState<Student['year']>('Sophomore');
  const [cgpa, setCgpa] = useState<number>(2.45);
  const [midtermGpa, setMidtermGpa] = useState<number>(2.10);
  const [attendanceRate, setAttendanceRate] = useState<number>(64);
  const [labAttendanceRate, setLabAttendanceRate] = useState<number>(68);
  const [lmsLoginsPerWeek, setLmsLoginsPerWeek] = useState<number>(3.2);
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState<number>(20);
  const [bottleneckCourse, setBottleneckCourse] = useState('CS201: Data Structures & Algorithms');
  const [financialAidStatus, setFinancialAidStatus] = useState<Student['financialAidStatus']>('Work-Study Dependent');
  const [firstGenCollegeStudent, setFirstGenCollegeStudent] = useState(true);
  const [residencyStatus, setResidencyStatus] = useState<Student['residencyStatus']>('Commuter (>45m)');
  const [assignedAdvisor, setAssignedAdvisor] = useState('Dr. Sarah Reynolds');

  // Compute live risk score
  const computedRisk = React.useMemo(() => {
    let score = 50;
    // attendance
    if (attendanceRate < 60) score += 25;
    else if (attendanceRate < 75) score += 12;
    else score -= 15;

    // gpa
    if (cgpa < 2.2) score += 20;
    else if (cgpa < 2.8) score += 8;
    else if (cgpa > 3.5) score -= 22;

    // work hours
    if (workHoursPerWeek > 20) score += 14;
    else if (workHoursPerWeek > 10) score += 5;

    // lms
    if (lmsLoginsPerWeek < 3) score += 10;
    else if (lmsLoginsPerWeek > 7) score -= 12;

    return Math.max(8, Math.min(96, Math.round(score)));
  }, [attendanceRate, cgpa, workHoursPerWeek, lmsLoginsPerWeek]);

  const riskTier: RiskLevel = 
    computedRisk >= 70 ? 'Critical' : computedRisk >= 45 ? 'At-Risk' : computedRisk >= 25 ? 'Stable' : 'High-Performer';

  const handleFillDemo = (type: 'critical' | 'stable') => {
    if (type === 'critical') {
      setName('Julian Vance');
      setDepartment('Computer Science & AI');
      setYear('Sophomore');
      setCgpa(2.08);
      setMidtermGpa(1.85);
      setAttendanceRate(54);
      setLabAttendanceRate(50);
      setLmsLoginsPerWeek(1.8);
      setWorkHoursPerWeek(28);
      setBottleneckCourse('CS201: Data Structures & Algorithms');
      setFinancialAidStatus('Work-Study Dependent');
      setFirstGenCollegeStudent(true);
      setResidencyStatus('Commuter (>45m)');
    } else {
      setName('Seraphina Valente');
      setDepartment('Data Science');
      setYear('Junior');
      setCgpa(3.84);
      setMidtermGpa(3.90);
      setAttendanceRate(96);
      setLabAttendanceRate(98);
      setLmsLoginsPerWeek(9.4);
      setWorkHoursPerWeek(6);
      setBottleneckCourse('DS320: Machine Learning Fundamentals');
      setFinancialAidStatus('Partial Merit Grant');
      setFirstGenCollegeStudent(false);
      setResidencyStatus('On-Campus Dorm');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudentId = `STU-2024-${Math.floor(100 + Math.random() * 900)}`;

    const newStudent: Student = {
      id: newStudentId,
      name: name.trim(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      major: department,
      department,
      year,
      semester: year === 'Freshman' ? 1 : year === 'Sophomore' ? 3 : year === 'Junior' ? 5 : 7,
      cgpa,
      previousSemesterGpa: cgpa + 0.15,
      midtermGpa,
      creditHoursCompleted: year === 'Freshman' ? 15 : year === 'Sophomore' ? 45 : year === 'Junior' ? 75 : 105,
      totalCredits: 120,
      backlogs: cgpa < 2.2 ? 2 : 0,
      bottleneckCourse,
      attendanceRate,
      labAttendanceRate,
      lmsLoginsPerWeek,
      resourceDownloads: Math.round(lmsLoginsPerWeek * 6),
      forumPosts: Math.round(lmsLoginsPerWeek * 1.5),
      homeworkCompletionRate: Math.round(attendanceRate * 0.95),
      assignmentPunctuality: Math.round(attendanceRate * 0.9),
      financialAidStatus,
      workHoursPerWeek,
      residencyStatus,
      firstGenCollegeStudent,
      extracurricularScore: Math.round(100 - computedRisk * 0.8),
      mentalWellnessIndex: Math.max(2, Math.round(10 - computedRisk / 12)),
      riskScore: computedRisk,
      riskLevel: riskTier,
      riskTrajectory: (computedRisk >= 60 ? 'Deteriorating' : computedRisk >= 35 ? 'Stable' : 'Improving') as RiskTrajectory,
      keyRiskFactors: [
        attendanceRate < 70 ? `Attendance rate (${attendanceRate}%) is under institutional safe margin` : 'Standard attendance',
        cgpa < 2.5 ? `CGPA (${cgpa}) triggers early warning benchmark` : 'Satisfactory GPA',
        workHoursPerWeek > 15 ? `Heavy employment load (${workHoursPerWeek} hrs/week)` : 'Manageable work load'
      ],
      shapFeatureWeights: [
        { feature: `Lecture Attendance (${attendanceRate}%)`, impact: attendanceRate < 70 ? 28 : -18, description: 'Class presence correlation' },
        { feature: `GPA Trajectory (${cgpa})`, impact: cgpa < 2.5 ? 24 : -22, description: 'Grade benchmark' },
        { feature: `Off-Campus Work (${workHoursPerWeek}h)`, impact: workHoursPerWeek > 15 ? 18 : -8, description: 'Time allocation burden' }
      ],
      assignedAdvisor,
      lastAdvisorNote: 'New student profile created in system via administrative telemetry ingestion.',
      placement: {
        status: cgpa >= 3.4 && computedRisk < 40 ? 'Tier-1 Ready' : cgpa >= 2.8 ? 'Eligible with Skill Gaps' : 'Academic Risk / Ineligible',
        targetRole: `${department} Engineer`,
        skills: [
          { name: 'Core Computing Fundamentals', category: 'Core CS', level: cgpa >= 3.0 ? 'Intermediate' : 'Beginner', score: Math.round(cgpa * 22) },
          { name: 'Applied Programming & Scripting', category: 'Languages', level: 'Intermediate', score: 65 },
          { name: 'Database & SQL', category: 'Core CS', level: 'Intermediate', score: 60 }
        ],
        dsaScore: Math.round(Math.min(95, Math.max(30, cgpa * 22 + (100 - computedRisk) * 0.2))),
        aptitudeScore: Math.round(Math.min(95, Math.max(40, cgpa * 20 + 20))),
        mockInterviewScore: Math.round(Math.min(95, Math.max(40, (100 - computedRisk) * 0.7))),
        projectsCount: 2,
        internshipExperience: cgpa > 3.2,
        certifications: [],
        dreamCompanies: ['Microsoft', 'Amazon', 'Deloitte'],
        resumeScore: Math.round(cgpa * 20)
      },
      interventions: []
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add New Student Profile</h2>
              <p className="text-xs text-slate-400">Telemetry engine will automatically compute Early Warning Index</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleFillDemo('critical')}
              className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold hover:bg-rose-900/60 transition"
            >
              Demo: At-Risk
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('stable')}
              className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition"
            >
              Demo: Honor
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Live Early Warning Banner */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Real-time Computed Risk Index:</span>
            <div className="flex items-center space-x-2">
              <span className={`font-mono font-bold text-sm ${computedRisk >= 70 ? 'text-rose-400' : computedRisk >= 45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {computedRisk} / 100
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                computedRisk >= 70 ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                computedRisk >= 45 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {riskTier}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Mitchell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Department &amp; Major</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-sky-500 focus:outline-none"
              >
                <option value="Computer Science & AI">Computer Science &amp; AI</option>
                <option value="Data Science">Data Science</option>
                <option value="Electrical Eng">Electrical Eng</option>
                <option value="Mechanical Eng">Mechanical Eng</option>
                <option value="Business Analytics">Business Analytics</option>
                <option value="Bioengineering">Bioengineering</option>
              </select>
            </div>
          </div>

          {/* Academic Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Class Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
              >
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Cumulative GPA (0-4.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={cgpa}
                onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Midterm Exam GPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={midtermGpa}
                onChange={(e) => setMidtermGpa(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Attendance & Digital Engagement */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Lecture Attendance %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={attendanceRate}
                onChange={(e) => setAttendanceRate(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Lab Attendance %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={labAttendanceRate}
                onChange={(e) => setLabAttendanceRate(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">LMS Logins / Week</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="25"
                value={lmsLoginsPerWeek}
                onChange={(e) => setLmsLoginsPerWeek(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Socio-economic */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Work Hours / Week</label>
              <input
                type="number"
                min="0"
                max="40"
                value={workHoursPerWeek}
                onChange={(e) => setWorkHoursPerWeek(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Bottleneck Course</label>
              <input
                type="text"
                value={bottleneckCourse}
                onChange={(e) => setBottleneckCourse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Assigned Faculty Advisor</label>
              <select
                value={assignedAdvisor}
                onChange={(e) => setAssignedAdvisor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
              >
                <option value="Dr. Sarah Reynolds">Dr. Sarah Reynolds</option>
                <option value="Prof. David Chen">Prof. David Chen</option>
              </select>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition shadow-sm"
            >
              Save Student &amp; Ingest Telemetry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
