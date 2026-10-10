import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { StudentRoster } from './components/StudentRoster';
import { StudentDetailModal } from './components/StudentDetailModal';
import { InterventionHub } from './components/InterventionHub';
import { DecisionCopilot } from './components/DecisionCopilot';
import { RoiForecaster } from './components/RoiForecaster';
import { AddStudentModal } from './components/AddStudentModal';
import { DispatchInterventionModal } from './components/DispatchInterventionModal';
import { DeanBriefingModal } from './components/DeanBriefingModal';
import { INITIAL_STUDENTS } from './data/mockStudents';
import { Student, Intervention, CampusMetrics } from './types/student';
import confetti from 'canvas-confetti';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('smart_campus_students_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STUDENTS;
      }
    }
    return INITIAL_STUDENTS;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'interventions' | 'copilot' | 'roi'>('overview');
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [targetStudentForDispatch, setTargetStudentForDispatch] = useState<Student | undefined>(undefined);
  const [isDeanBriefingModalOpen, setIsDeanBriefingModalOpen] = useState(false);
  const [rosterInitialRiskFilter, setRosterInitialRiskFilter] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    try {
      localStorage.setItem('smart_campus_students_v1', JSON.stringify(newStudents));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamically compute Campus Metrics
  const metrics: CampusMetrics = useMemo(() => {
    const total = students.length;
    const critical = students.filter((s) => s.riskLevel === 'Critical').length;
    const atRisk = students.filter((s) => s.riskLevel === 'At-Risk').length;
    const stable = students.filter((s) => s.riskLevel === 'Stable').length;
    const highPerformer = students.filter((s) => s.riskLevel === 'High-Performer').length;

    const avgCgpa = total ? Number((students.reduce((acc, s) => acc + s.cgpa, 0) / total).toFixed(2)) : 3.0;
    const avgAtt = total ? Number((students.reduce((acc, s) => acc + s.attendanceRate, 0) / total).toFixed(1)) : 80;
    const avgLms = total ? Number((students.reduce((acc, s) => acc + s.lmsLoginsPerWeek, 0) / total).toFixed(1)) : 5.0;

    const activeInterventions = students.reduce(
      (acc, s) => acc + s.interventions.filter((i) => i.status !== 'Completed').length,
      0
    );

    // Retention formula
    const safeStudents = stable + highPerformer + Math.round(atRisk * 0.7) + Math.round(critical * 0.3);
    const retentionRate = total ? Number(((safeStudents / total) * 100).toFixed(1)) : 86.4;
    const projectedRetentionRate = Math.min(96.5, Number((retentionRate + 4.8).toFixed(1)));
    const tuitionProtected = Math.round(critical * 18000 + atRisk * 8000);

    return {
      totalStudents: total,
      criticalCount: critical,
      atRiskCount: atRisk,
      stableCount: stable,
      highPerformerCount: highPerformer,
      averageCgpa: avgCgpa,
      averageAttendance: avgAtt,
      averageLmsActivity: avgLms,
      retentionRate,
      projectedRetentionRate,
      activeInterventionsCount: activeInterventions,
      estimatedTuitionProtected: tuitionProtected,
    };
  }, [students]);

  // Update single student
  const handleUpdateStudent = (updatedStudent: Student) => {
    const updated = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    updateStudents(updated);
    if (selectedStudentForDossier?.id === updatedStudent.id) {
      setSelectedStudentForDossier(updatedStudent);
    }
  };

  // Add new student
  const handleAddStudent = (newStudent: Student) => {
    const next = [newStudent, ...students];
    updateStudents(next);
    showToast(`New student profile ingested: ${newStudent.name} (${newStudent.id})`);
  };

  // Dispatch single intervention
  const handleDispatchIntervention = (studentId: string, intervention: Intervention) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          interventions: [intervention, ...s.interventions],
        };
      }
      return s;
    });
    updateStudents(updated);
    showToast(`Intervention "${intervention.title}" dispatched successfully.`);
  };

  // Batch dispatch to multiple students
  const handleBatchIntervene = (selectedStudents: Student[]) => {
    const updated = students.map((s) => {
      if (selectedStudents.some((target) => target.id === s.id)) {
        const newInt: Intervention = {
          id: `INT-${Math.floor(100 + Math.random() * 900)}`,
          studentId: s.id,
          studentName: s.name,
          type: 'Dean Academic Review',
          title: 'Batch Early Warning Advisory Review',
          assignedTo: s.assignedAdvisor,
          initiatedDate: new Date().toISOString().slice(0, 10),
          status: 'Dispatched',
          targetMetric: 'Schedule comprehensive academic stabilization check-in',
          notes: 'Automated batch dispatch triggered by Academic Affairs administration.',
        };
        return {
          ...s,
          interventions: [newInt, ...s.interventions],
        };
      }
      return s;
    });

    updateStudents(updated);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    showToast(`Batch advisor alerts dispatched to ${selectedStudents.length} students!`);
  };

  // CSV Export utility
  const handleExportCsv = (subset?: Student[]) => {
    const targetList = subset || students;
    const headers = [
      'Student ID',
      'Name',
      'Major',
      'Year',
      'CGPA',
      'Midterm GPA',
      'Attendance %',
      'Lab Attendance %',
      'LMS Logins/Wk',
      'Failed Courses',
      'Bottleneck Course',
      'Work Hours/Wk',
      'Risk Score',
      'Risk Tier',
      'Advisor',
    ];

    const rows = targetList.map((s) => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.major}"`,
      `"${s.year}"`,
      s.cgpa,
      s.midtermGpa,
      s.attendanceRate,
      s.labAttendanceRate,
      s.lmsLoginsPerWeek,
      s.backlogs,
      `"${s.bottleneckCourse}"`,
      s.workHoursPerWeek,
      s.riskScore,
      `"${s.riskLevel}"`,
      `"${s.assignedAdvisor}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Smart_Campus_Student_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${targetList.length} student records to CSV.`);
  };

  // Navigation helpers
  const handleNavigateToRoster = (riskFilter?: string) => {
    setRosterInitialRiskFilter(riskFilter);
    setActiveTab('roster');
  };

  const handleOpenInterventionModal = (student?: Student) => {
    setTargetStudentForDispatch(student);
    setIsDispatchModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalCount={metrics.criticalCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBriefingModal={() => setIsDeanBriefingModalOpen(true)}
        onExportCsv={() => handleExportCsv()}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-sky-500/50 shadow-2xl text-xs text-white flex items-center space-x-3 animate-fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'overview' && (
          <ExecutiveOverview
            metrics={metrics}
            students={students}
            onSelectStudent={(s) => setSelectedStudentForDossier(s)}
            onNavigateToRoster={handleNavigateToRoster}
            onOpenBriefingModal={() => setIsDeanBriefingModalOpen(true)}
            onOpenInterventionModal={handleOpenInterventionModal}
          />
        )}

        {activeTab === 'roster' && (
          <StudentRoster
            students={students}
            initialRiskFilter={rosterInitialRiskFilter}
            onSelectStudent={(s) => setSelectedStudentForDossier(s)}
            onOpenInterventionModal={handleOpenInterventionModal}
            onBatchIntervene={handleBatchIntervene}
            onExportCsv={handleExportCsv}
          />
        )}

        {activeTab === 'interventions' && (
          <InterventionHub
            students={students}
            onSelectStudent={(s) => setSelectedStudentForDossier(s)}
            onOpenInterventionModal={handleOpenInterventionModal}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {activeTab === 'copilot' && (
          <DecisionCopilot students={students} metrics={metrics} />
        )}

        {activeTab === 'roi' && <RoiForecaster />}
      </main>

      {/* Modals */}
      {selectedStudentForDossier && (
        <StudentDetailModal
          student={selectedStudentForDossier}
          onClose={() => setSelectedStudentForDossier(null)}
          onOpenInterventionModal={(s) => handleOpenInterventionModal(s)}
          onUpdateStudent={handleUpdateStudent}
        />
      )}

      {isAddModalOpen && (
        <AddStudentModal
          onClose={() => setIsAddModalOpen(false)}
          onAddStudent={handleAddStudent}
        />
      )}

      {isDispatchModalOpen && (
        <DispatchInterventionModal
          students={students}
          initialStudent={targetStudentForDispatch}
          onClose={() => {
            setIsDispatchModalOpen(false);
            setTargetStudentForDispatch(undefined);
          }}
          onDispatch={handleDispatchIntervention}
        />
      )}

      {isDeanBriefingModalOpen && (
        <DeanBriefingModal
          metrics={metrics}
          onClose={() => setIsDeanBriefingModalOpen(false)}
        />
      )}
    </div>
  );
}
