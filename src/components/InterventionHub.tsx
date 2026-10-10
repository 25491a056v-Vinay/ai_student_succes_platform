import React, { useState } from 'react';
import { 
  Workflow, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Filter, 
  User, 
  ArrowRight, 
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, Intervention, InterventionType, InterventionStatus } from '../types/student';

interface InterventionHubProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal: (student?: Student) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export const InterventionHub: React.FC<InterventionHubProps> = ({
  students,
  onSelectStudent,
  onOpenInterventionModal,
  onUpdateStudent,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');

  // Extract all interventions across all students
  const allInterventions = React.useMemo(() => {
    const list: { intervention: Intervention; student: Student }[] = [];
    students.forEach((s) => {
      s.interventions.forEach((int) => {
        list.push({ intervention: int, student: s });
      });
    });
    return list;
  }, [students]);

  const filteredInterventions = React.useMemo(() => {
    if (selectedTypeFilter === 'All') return allInterventions;
    return allInterventions.filter((item) => item.intervention.type === selectedTypeFilter);
  }, [allInterventions, selectedTypeFilter]);

  // Group by status
  const recommendedItems = filteredInterventions.filter((i) => i.intervention.status === 'Recommended');
  const dispatchedItems = filteredInterventions.filter((i) => i.intervention.status === 'Dispatched');
  const inProgressItems = filteredInterventions.filter((i) => i.intervention.status === 'In Progress');
  const completedItems = filteredInterventions.filter((i) => i.intervention.status === 'Completed');

  const handleAdvanceStatus = (student: Student, intId: string, nextStatus: InterventionStatus) => {
    const updatedInterventions = student.interventions.map((int) => {
      if (int.id === intId) {
        return { 
          ...int, 
          status: nextStatus,
          outcomeScoreChange: nextStatus === 'Completed' ? -18 : int.outcomeScoreChange 
        };
      }
      return int;
    });

    let newRisk = student.riskScore;
    if (nextStatus === 'Completed') {
      newRisk = Math.max(12, student.riskScore - 18);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    const updatedStudent: Student = {
      ...student,
      interventions: updatedInterventions,
      riskScore: newRisk,
      riskLevel: (newRisk >= 70 ? 'Critical' : newRisk >= 45 ? 'At-Risk' : newRisk >= 25 ? 'Stable' : 'High-Performer') as any,
      riskTrajectory: nextStatus === 'Completed' ? 'Improving' : student.riskTrajectory,
    };

    onUpdateStudent(updatedStudent);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Workflow className="w-6 h-6 text-emerald-400" />
            <span>Intervention Operations &amp; Retention Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking lifecycle deployment of peer tutoring, schedule adjustments, and academic amnesty actions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenInterventionModal()}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Dispatch New Intervention</span>
          </button>
        </div>
      </div>

      {/* Operational KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Active In-Flight</div>
          <div className="mt-2 text-2xl font-extrabold text-sky-400">
            {dispatchedItems.length + inProgressItems.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Tutoring &amp; dean reviews underway</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Turnaround Success</div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400">78.4%</div>
          <div className="text-xs text-slate-400 mt-1">Students stabilized within 3 weeks</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Avg Risk Reduction</div>
          <div className="mt-2 text-2xl font-extrabold text-teal-400">-22.4 pts</div>
          <div className="text-xs text-slate-400 mt-1">Post-intervention early warning drop</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Resolved This Term</div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {completedItems.length} Cases
          </div>
          <div className="text-xs text-slate-400 mt-1">Retention confirmed</div>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="flex items-center space-x-3 text-xs bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-slate-400 font-medium">Filter by Action Type:</span>
        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
        >
          <option value="All">All Types ({allInterventions.length})</option>
          <option value="Peer Tutoring">Peer Tutoring</option>
          <option value="Dean Academic Review">Dean Academic Review</option>
          <option value="Workload Adjustment">Workload Adjustment</option>
          <option value="Financial Support Grant">Financial Support Grant</option>
          <option value="Mental Wellness Referral">Mental Wellness Referral</option>
          <option value="Attendance Contract">Attendance Contract</option>
        </select>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Column 1: Recommended */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-900/40 text-xs font-bold text-amber-300">
            <span>1. Triggered &amp; Recommended</span>
            <span className="bg-amber-950 border border-amber-800 px-1.5 py-0.2 rounded text-[10px]">
              {recommendedItems.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {recommendedItems.length === 0 ? (
              <div className="p-4 text-center rounded-lg border border-dashed border-slate-800 text-[11px] text-slate-500">
                No pending recommendations
              </div>
            ) : (
              recommendedItems.map(({ intervention: int, student }) => (
                <div
                  key={int.id}
                  className="p-3.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 transition space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white">{int.title}</span>
                    <span className="text-[10px] font-mono text-amber-400">{student.id}</span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Student: <strong className="text-slate-200 cursor-pointer hover:underline" onClick={() => onSelectStudent(student)}>{student.name}</strong>
                  </div>

                  <p className="text-[11px] text-slate-300">{int.notes}</p>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="text-[11px] text-sky-400 hover:underline"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => handleAdvanceStatus(student, int.id, 'Dispatched')}
                      className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-semibold"
                    >
                      Dispatch &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Dispatched */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-900/40 text-xs font-bold text-sky-300">
            <span>2. Dispatched to Advisor</span>
            <span className="bg-sky-950 border border-sky-800 px-1.5 py-0.2 rounded text-[10px]">
              {dispatchedItems.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {dispatchedItems.length === 0 ? (
              <div className="p-4 text-center rounded-lg border border-dashed border-slate-800 text-[11px] text-slate-500">
                No newly dispatched cases
              </div>
            ) : (
              dispatchedItems.map(({ intervention: int, student }) => (
                <div
                  key={int.id}
                  className="p-3.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 transition space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white">{int.title}</span>
                    <span className="text-[10px] font-mono text-sky-400">{student.id}</span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Student: <strong className="text-slate-200 cursor-pointer hover:underline" onClick={() => onSelectStudent(student)}>{student.name}</strong>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Assigned: <strong className="text-slate-200">{int.assignedTo}</strong>
                  </div>

                  <p className="text-[11px] text-slate-300">{int.notes}</p>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="text-[11px] text-sky-400 hover:underline"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => handleAdvanceStatus(student, int.id, 'In Progress')}
                      className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-semibold"
                    >
                      Start Session &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: In Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-900/40 text-xs font-bold text-indigo-300">
            <span>3. In Progress (Active Tutoring)</span>
            <span className="bg-indigo-950 border border-indigo-800 px-1.5 py-0.2 rounded text-[10px]">
              {inProgressItems.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {inProgressItems.length === 0 ? (
              <div className="p-4 text-center rounded-lg border border-dashed border-slate-800 text-[11px] text-slate-500">
                No active in-progress items
              </div>
            ) : (
              inProgressItems.map(({ intervention: int, student }) => (
                <div
                  key={int.id}
                  className="p-3.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 transition space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white">{int.title}</span>
                    <span className="text-[10px] font-mono text-indigo-400">{student.id}</span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Student: <strong className="text-slate-200 cursor-pointer hover:underline" onClick={() => onSelectStudent(student)}>{student.name}</strong>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    Target: <strong className="text-indigo-400">{int.targetMetric}</strong>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="text-[11px] text-sky-400 hover:underline"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => handleAdvanceStatus(student, int.id, 'Completed')}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold"
                    >
                      ✓ Mark Resolved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Resolved */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-900/40 text-xs font-bold text-emerald-300">
            <span>4. Resolved &amp; Retained</span>
            <span className="bg-emerald-950 border border-emerald-800 px-1.5 py-0.2 rounded text-[10px]">
              {completedItems.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {completedItems.length === 0 ? (
              <div className="p-4 text-center rounded-lg border border-dashed border-slate-800 text-[11px] text-slate-500">
                No resolved cases yet
              </div>
            ) : (
              completedItems.map(({ intervention: int, student }) => (
                <div
                  key={int.id}
                  className="p-3.5 rounded-lg border border-emerald-900/50 bg-emerald-950/20 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-emerald-200">{int.title}</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </div>

                  <div className="text-[11px] text-slate-300">
                    Student: <strong className="text-white cursor-pointer hover:underline" onClick={() => onSelectStudent(student)}>{student.name}</strong>
                  </div>

                  <div className="text-[11px] text-emerald-300 font-semibold">
                    Turnaround Impact: {int.outcomeScoreChange ? `${int.outcomeScoreChange} Risk Points` : '-18 Risk Points'}
                  </div>

                  <div className="pt-2 border-t border-emerald-900/50 flex justify-between items-center">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="text-[11px] text-emerald-300 hover:underline"
                    >
                      View Updated Dossier
                    </button>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold">Retained</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
