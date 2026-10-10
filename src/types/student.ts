export type RiskLevel = 'Critical' | 'At-Risk' | 'Stable' | 'High-Performer';
export type RiskTrajectory = 'Deteriorating' | 'Stable' | 'Improving';

export type InterventionType =
  | 'Peer Tutoring'
  | 'Dean Academic Review'
  | 'Workload Adjustment'
  | 'Financial Support Grant'
  | 'Mental Wellness Referral'
  | 'Faculty Advisor Check-in'
  | 'Attendance Contract';

export type InterventionStatus = 'Recommended' | 'Dispatched' | 'In Progress' | 'Completed' | 'Dismissed';

export interface Intervention {
  id: string;
  studentId: string;
  studentName?: string;
  type: InterventionType;
  title: string;
  assignedTo: string;
  initiatedDate: string;
  status: InterventionStatus;
  targetMetric: string;
  notes: string;
  outcomeScoreChange?: number;
}

export interface ShapWeight {
  feature: string;
  impact: number; // positive increases risk, negative decreases risk
  description: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  major: string;
  department: 'Computer Science & AI' | 'Data Science' | 'Electrical Eng' | 'Mechanical Eng' | 'Business Analytics' | 'Bioengineering';
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  semester: number;
  
  // Academic Metrics
  cgpa: number; // 0.0 - 4.0
  previousSemesterGpa: number;
  midtermGpa: number;
  creditHoursCompleted: number;
  totalCredits: number;
  backlogs: number; // failed courses
  bottleneckCourse: string;
  
  // Attendance & Engagement Metrics
  attendanceRate: number; // percentage 0 - 100
  labAttendanceRate: number; // percentage 0 - 100
  lmsLoginsPerWeek: number;
  resourceDownloads: number;
  forumPosts: number;
  homeworkCompletionRate: number; // percentage 0 - 100
  assignmentPunctuality: number; // percentage 0 - 100
  
  // Socio-Economic & Lifestyle
  financialAidStatus: 'Full Need-Based Aid' | 'Partial Merit Grant' | 'Self-Financed' | 'Work-Study Dependent';
  workHoursPerWeek: number;
  residencyStatus: 'On-Campus Dorm' | 'Commuter (<30m)' | 'Commuter (>45m)';
  firstGenCollegeStudent: boolean;
  extracurricularScore: number; // 0 - 100
  mentalWellnessIndex: number; // 1 - 10
  
  // Early Warning & AI Prediction
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskTrajectory: RiskTrajectory;
  keyRiskFactors: string[];
  shapFeatureWeights: ShapWeight[];
  
  // Advising & Case Management
  assignedAdvisor: string;
  lastAdvisorNote: string;
  interventions: Intervention[];
}

export interface CampusMetrics {
  totalStudents: number;
  criticalCount: number;
  atRiskCount: number;
  stableCount: number;
  highPerformerCount: number;
  averageCgpa: number;
  averageAttendance: number;
  averageLmsActivity: number;
  retentionRate: number;
  projectedRetentionRate: number;
  activeInterventionsCount: number;
  estimatedTuitionProtected: number;
}

export interface AIRecoveryRoadmapStep {
  week: string;
  focus: string;
  actions: string[];
}

export interface AIStudentAnalysis {
  summaryDiagnosis: string;
  rootCauses: string[];
  positiveLeveragePoints: string[];
  personalizedRecoveryRoadmap: AIRecoveryRoadmapStep[];
  recommendedInterventionType: string;
  projectedGpaRecovery: string;
  dropoutRiskReduction: string;
  advisorEmailDraft: string;
}

export interface AISimulationResult {
  projectedRiskScore: number;
  projectedGpa: number;
  retentionProbability: number;
  confidenceScore: number;
  keyMechanisms: string[];
  simulationNarrative: string;
  recommendedMilestone: string;
}
