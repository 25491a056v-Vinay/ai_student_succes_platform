import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle, Shield } from 'lucide-react';
import { Student, Intervention, InterventionType } from '../types/student';

interface DispatchInterventionModalProps {
  students: Student[];
  initialStudent?: Student;
  onClose: () => void;
  onDispatch: (studentId: string, intervention: Intervention) => void;
}

export const DispatchInterventionModal: React.FC<DispatchInterventionModalProps> = ({
  students,
  initialStudent,
  onClose,
  onDispatch,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || (students[0]?.id ?? '')
  );

  const targetStudent = students.find((s) => s.id === selectedStudentId);

  const [interventionType, setInterventionType] = useState<InterventionType>('Peer Tutoring');
  const [title, setTitle] = useState('1-on-1 Supplemental Peer Instruction');
  const [assignedTo, setAssignedTo] = useState('Sofia Chen (Senior Peer Mentor)');
  const [targetMetric, setTargetMetric] = useState('Improve bottleneck course midterm/quiz score >= 75%');
  const [notes, setNotes] = useState(
    'Scheduled for 2 hours weekly in Department Study Lounge. Focusing on algorithmic problem breakdown.'
  );

  // Auto update title and presets based on type
  const handleTypeChange = (type: InterventionType) => {
    setInterventionType(type);
    if (type === 'Peer Tutoring') {
      setTitle('1-on-1 Supplemental Peer Instruction');
      setAssignedTo('Sofia Chen (Senior Peer Mentor)');
      setTargetMetric('Improve bottleneck course midterm/quiz score >= 75%');
      setNotes('Scheduled for 2 hours weekly in Department Study Lounge. Focus on core concepts.');
    } else if (type === 'Dean Academic Review') {
      setTitle('Dean & Advisor Retention Case Conference');
      setAssignedTo('Dr. Sarah Reynolds (Academic Advisor)');
      setTargetMetric('Sign official academic probation recovery pact');
      setNotes('Mandatory meeting to rebalance credit load and examine course drop alternatives.');
    } else if (type === 'Workload Adjustment') {
      setTitle('Work-Study & Coursework Schedule Rebalancing');
      setAssignedTo('Campus Employment Coordinator');
      setTargetMetric('Cap employment hours at 12 hrs/wk & shift to daytime desk slots');
      setNotes('Coordinate with supervisor to eliminate evening closing shifts that conflict with rest and study.');
    } else if (type === 'Financial Support Grant') {
      setTitle('Emergency Student Retention Micro-Grant');
      setAssignedTo('Financial Aid Emergency Taskforce');
      setTargetMetric('Provide $1,000 semester textbook and living expense stipend');
      setNotes('Relieve immediate economic pressure to reduce off-campus commercial shift requirements.');
    } else if (type === 'Mental Wellness Referral') {
      setTitle('Wellness Center De-Stress & Test Anxiety Consultation');
      setAssignedTo('Dr. Helen Kim (Student Counseling)');
      setTargetMetric('Complete 2 counseling sessions & develop stress mitigation toolkit');
      setNotes('Student experiencing high test anxiety and academic burnout symptoms.');
    } else if (type === 'Attendance Contract') {
      setTitle('Formal Attendance Compact & Recitation Check-in');
      setAssignedTo('Prof. David Chen');
      setTargetMetric('Maintain >= 80% lecture and lab presence for 4 consecutive weeks');
      setNotes('Student will check in with TA at conclusion of each lecture period.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !targetStudent) return;

    const newIntervention: Intervention = {
      id: `INT-${Math.floor(100 + Math.random() * 900)}`,
      studentId: selectedStudentId,
      studentName: targetStudent.name,
      type: interventionType,
      title,
      assignedTo,
      initiatedDate: new Date().toISOString().slice(0, 10),
      status: 'Dispatched',
      targetMetric,
      notes,
    };

    onDispatch(selectedStudentId, newIntervention);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dispatch Student Intervention</h2>
              <p className="text-xs text-slate-400">Initiate targeted administrative retention action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Target Student Selector */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Target Student *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:border-sky-500 focus:outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id}) · {s.major} · Risk: {s.riskScore}/100 ({s.riskLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Student Quick Pill */}
          {targetStudent && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Current Risk Index:</span>{' '}
                <strong className={targetStudent.riskScore >= 70 ? 'text-rose-400' : 'text-amber-400'}>
                  {targetStudent.riskScore}/100
                </strong>
                <span className="text-slate-500 mx-2">·</span>
                <span className="text-slate-400">Attendance:</span>{' '}
                <strong className="text-slate-200">{targetStudent.attendanceRate}%</strong>
              </div>
              <div className="text-[11px] text-sky-400 font-mono">
                {targetStudent.bottleneckCourse.split(':')[0]}
              </div>
            </div>
          )}

          {/* Intervention Type */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Action Protocol Type</label>
            <select
              value={interventionType}
              onChange={(e) => handleTypeChange(e.target.value as InterventionType)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold focus:border-sky-500 focus:outline-none"
            >
              <option value="Peer Tutoring">Peer Tutoring (1-on-1 Academic Support)</option>
              <option value="Dean Academic Review">Dean Academic Review (Probation / Workload)</option>
              <option value="Workload Adjustment">Workload Adjustment (Schedule Rebalancing)</option>
              <option value="Financial Support Grant">Financial Support Grant (Emergency Relief)</option>
              <option value="Mental Wellness Referral">Mental Wellness Referral (Counseling)</option>
              <option value="Attendance Contract">Attendance Contract (Mandatory Check-in)</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Intervention Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
            />
          </div>

          {/* Assigned Staff */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Assigned Personnel / Mentor</label>
            <input
              type="text"
              required
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
            />
          </div>

          {/* Target Metric Milestone */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Target Verification Milestone</label>
            <input
              type="text"
              required
              value={targetMetric}
              onChange={(e) => setTargetMetric(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
            />
          </div>

          {/* Operational Notes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Instructions &amp; Implementation Details</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
            />
          </div>

          {/* Footer */}
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
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
            >
              Confirm &amp; Dispatch Intervention
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
