import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Download, 
  Send, 
  UserPlus, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Minus,
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';
import { Student, RiskLevel } from '../types/student';

interface StudentRosterProps {
  students: Student[];
  initialRiskFilter?: string;
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal: (student: Student) => void;
  onBatchIntervene: (selectedStudents: Student[]) => void;
  onExportCsv: (subset?: Student[]) => void;
}

export const StudentRoster: React.FC<StudentRosterProps> = ({
  students,
  initialRiskFilter,
  onSelectStudent,
  onOpenInterventionModal,
  onBatchIntervene,
  onExportCsv,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>(initialRiskFilter || 'All');
  const [filterLowAttendance, setFilterLowAttendance] = useState(false);
  const [filterHasBacklogs, setFilterHasBacklogs] = useState(false);
  const [filterHeavyWork, setFilterHeavyWork] = useState(false);
  const [filterFirstGen, setFilterFirstGen] = useState(false);

  const [sortBy, setSortBy] = useState<'risk' | 'cgpa' | 'attendance' | 'lms' | 'name'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter & Sort Logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      const searchMatch = 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.bottleneckCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.assignedAdvisor.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // Department
      if (selectedDept !== 'All' && s.department !== selectedDept) return false;

      // Year
      if (selectedYear !== 'All' && s.year !== selectedYear) return false;

      // Risk Tier
      if (selectedRiskTier !== 'All' && s.riskLevel !== selectedRiskTier) return false;

      // Toggles
      if (filterLowAttendance && s.attendanceRate >= 70) return false;
      if (filterHasBacklogs && s.backlogs === 0) return false;
      if (filterHeavyWork && s.workHoursPerWeek <= 15) return false;
      if (filterFirstGen && !s.firstGenCollegeStudent) return false;

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'risk') comparison = a.riskScore - b.riskScore;
      else if (sortBy === 'cgpa') comparison = a.cgpa - b.cgpa;
      else if (sortBy === 'attendance') comparison = a.attendanceRate - b.attendanceRate;
      else if (sortBy === 'lms') comparison = a.lmsLoginsPerWeek - b.lmsLoginsPerWeek;
      else if (sortBy === 'name') comparison = a.name.localeCompare(b.name);

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [
    students,
    searchTerm,
    selectedDept,
    selectedYear,
    selectedRiskTier,
    filterLowAttendance,
    filterHasBacklogs,
    filterHeavyWork,
    filterFirstGen,
    sortBy,
    sortOrder
  ]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectedStudentsList = useMemo(() => {
    return students.filter((s) => selectedIds.has(s.id));
  }, [students, selectedIds]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Student 360° Predictive Roster
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-dimensional surveillance across academic progress, digital LMS engagement, and attrition risk factors.
          </p>
        </div>

        {/* View Toggle & Count */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          <span className="text-xs font-medium text-slate-400">
            Showing <strong className="text-white">{filteredStudents.length}</strong> of {students.length} students
          </span>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs font-medium ${
                viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs font-medium ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, ID, major, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & AI">Computer Science &amp; AI</option>
              <option value="Data Science">Data Science</option>
              <option value="Electrical Eng">Electrical Eng</option>
              <option value="Mechanical Eng">Mechanical Eng</option>
              <option value="Business Analytics">Business Analytics</option>
              <option value="Bioengineering">Bioengineering</option>
            </select>
          </div>

          {/* Risk Tier Filter */}
          <div>
            <select
              value={selectedRiskTier}
              onChange={(e) => setSelectedRiskTier(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="All">All Risk Tiers</option>
              <option value="Critical">Critical Risk (≥ 70)</option>
              <option value="At-Risk">Moderate Watchlist (45-69)</option>
              <option value="Stable">Stable (25-44)</option>
              <option value="High-Performer">High Performers (&lt; 25)</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="All">All Class Years</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
        </div>

        {/* Quick Attribute Toggles & Sort Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium mr-1">Quick Attributes:</span>
            <button
              onClick={() => setFilterLowAttendance(!filterLowAttendance)}
              className={`px-2.5 py-1 rounded text-xs transition border ${
                filterLowAttendance
                  ? 'bg-rose-950/60 border-rose-700 text-rose-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Attendance &lt; 70%
            </button>

            <button
              onClick={() => setFilterHasBacklogs(!filterHasBacklogs)}
              className={`px-2.5 py-1 rounded text-xs transition border ${
                filterHasBacklogs
                  ? 'bg-amber-950/60 border-amber-700 text-amber-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Has Failed Courses / Backlogs
            </button>

            <button
              onClick={() => setFilterHeavyWork(!filterHeavyWork)}
              className={`px-2.5 py-1 rounded text-xs transition border ${
                filterHeavyWork
                  ? 'bg-sky-950/60 border-sky-700 text-sky-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Heavy Job (&gt; 15 hrs/wk)
            </button>

            <button
              onClick={() => setFilterFirstGen(!filterFirstGen)}
              className={`px-2.5 py-1 rounded text-xs transition border ${
                filterFirstGen
                  ? 'bg-indigo-950/60 border-indigo-700 text-indigo-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              First-Gen Student
            </button>
          </div>

          {/* Sort Controller */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
            >
              <option value="risk">Early Warning Score</option>
              <option value="cgpa">Cumulative GPA</option>
              <option value="attendance">Lecture Attendance</option>
              <option value="lms">LMS Weekly Logins</option>
              <option value="name">Student Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Batch Action Toolbar when students are selected */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-lg bg-sky-950/60 border border-sky-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-sky-200 font-medium">
            <CheckSquare className="w-4 h-4 text-sky-400" />
            <span>
              <strong>{selectedIds.size}</strong> student{selectedIds.size > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onBatchIntervene(selectedStudentsList)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Batch Dispatch Advisor Alerts ({selectedIds.size})</span>
            </button>

            <button
              onClick={() => onExportCsv(selectedStudentsList)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected CSV</span>
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-2 py-1.5 text-slate-400 hover:text-white"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 w-8">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                      {selectedIds.size === filteredStudents.length && filteredStudents.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-sky-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Major &amp; Year</th>
                  <th className="py-3 px-4">Early Warning Index</th>
                  <th className="py-3 px-4">GPA &amp; Midterm</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">LMS Logins</th>
                  <th className="py-3 px-4">Curricular Choke-point</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No students found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = selectedIds.has(student.id);
                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-slate-800/40 transition ${
                          isSelected ? 'bg-sky-950/20' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleSelectOne(student.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-sky-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Student Name & Avatar */}
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
                                {student.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Major & Year */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200">{student.major}</div>
                          <div className="text-[11px] text-slate-400">
                            {student.year} · Sem {student.semester}
                            {student.firstGenCollegeStudent && (
                              <span className="ml-1.5 text-indigo-400 font-medium">· 1st Gen</span>
                            )}
                          </div>
                        </td>

                        {/* Early Warning Risk Index */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`font-mono font-bold ${
                                  student.riskScore >= 70
                                    ? 'text-rose-400'
                                    : student.riskScore >= 45
                                    ? 'text-amber-400'
                                    : student.riskScore >= 25
                                    ? 'text-sky-300'
                                    : 'text-emerald-400'
                                }`}
                              >
                                {student.riskScore}/100
                              </span>

                              {/* Trajectory */}
                              {student.riskTrajectory === 'Deteriorating' && (
                                <span className="flex items-center text-[10px] text-rose-400 font-medium" title="Risk Deteriorating">
                                  <TrendingUp className="w-3 h-3 mr-0.5" /> High Risk
                                </span>
                              )}
                              {student.riskTrajectory === 'Improving' && (
                                <span className="flex items-center text-[10px] text-emerald-400 font-medium" title="Risk Improving">
                                  <TrendingDown className="w-3 h-3 mr-0.5" /> Improving
                                </span>
                              )}
                              {student.riskTrajectory === 'Stable' && (
                                <span className="flex items-center text-[10px] text-slate-400 font-medium" title="Risk Stable">
                                  <Minus className="w-3 h-3 mr-0.5" /> Stable
                                </span>
                              )}
                            </div>

                            <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                style={{ width: `${student.riskScore}%` }}
                                className={`h-full ${
                                  student.riskScore >= 70
                                    ? 'bg-rose-500'
                                    : student.riskScore >= 45
                                    ? 'bg-amber-500'
                                    : student.riskScore >= 25
                                    ? 'bg-sky-500'
                                    : 'bg-emerald-500'
                                }`}
                              />
                            </div>
                          </div>
                        </td>

                        {/* GPA & Midterm */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{student.cgpa.toFixed(2)}</div>
                          <div className="text-[11px] text-slate-400">
                            Midterm: <span className={student.midtermGpa < 2.0 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>{student.midtermGpa.toFixed(2)}</span>
                          </div>
                        </td>

                        {/* Attendance */}
                        <td className="py-3 px-4">
                          <div className={`font-semibold ${student.attendanceRate < 70 ? 'text-rose-400' : 'text-slate-200'}`}>
                            {student.attendanceRate}%
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Lab: {student.labAttendanceRate}%
                          </div>
                        </td>

                        {/* LMS Logins */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200">
                            {student.lmsLoginsPerWeek} / wk
                          </div>
                          <div className="text-[11px] text-slate-400">
                            HW: {student.homeworkCompletionRate}%
                          </div>
                        </td>

                        {/* Bottleneck Course */}
                        <td className="py-3 px-4">
                          <div className="font-mono text-xs text-sky-400 truncate max-w-[150px]" title={student.bottleneckCourse}>
                            {student.bottleneckCourse.split(':')[0]}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {student.bottleneckCourse.split(':')[1] || ''}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => onSelectStudent(student)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                            >
                              Dossier
                            </button>
                            <button
                              onClick={() => onOpenInterventionModal(student)}
                              className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition"
                            >
                              Intervene
                            </button>
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
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-white hover:text-sky-400 cursor-pointer" onClick={() => onSelectStudent(student)}>
                        {student.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 font-mono">{student.id}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-lg font-mono font-extrabold ${
                        student.riskScore >= 70
                          ? 'text-rose-400'
                          : student.riskScore >= 45
                          ? 'text-amber-400'
                          : student.riskScore >= 25
                          ? 'text-sky-300'
                          : 'text-emerald-400'
                      }`}
                    >
                      {student.riskScore}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {student.riskLevel}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Major:</span>
                    <span className="font-medium">{student.major}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Cumulative GPA:</span>
                    <span className="font-bold text-white">{student.cgpa} (Midterm: {student.midtermGpa})</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Attendance:</span>
                    <span className={student.attendanceRate < 70 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {student.attendanceRate}%
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Bottleneck:</span>
                    <span className="font-mono text-sky-400 text-[11px]">{student.bottleneckCourse.split(':')[0]}</span>
                  </div>
                </div>

                {student.keyRiskFactors.length > 0 && (
                  <div className="mt-3 p-2 rounded bg-slate-950/60 border border-slate-800 text-[11px] text-rose-300">
                    <span className="font-semibold text-rose-400">Key trigger:</span> {student.keyRiskFactors[0]}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Adv: {student.assignedAdvisor.split(' ')[1] || student.assignedAdvisor}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                  >
                    360° Dossier
                  </button>
                  <button
                    onClick={() => onOpenInterventionModal(student)}
                    className="px-2.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition"
                  >
                    Intervene
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
