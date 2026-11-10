export type FacilityId = 
  | 'donphut-hospital' 
  | 'donphut-subdistrict' 
  | 'phailiu-subdistrict' 
  | 'banluang-subdistrict' 
  | 'dongnoi-subdistrict'
  | 'banree-subdistrict'
  | 'nongnmon-subdistrict';

export interface Facility {
  id: FacilityId;
  name: string;
  nameEn: string;
  type: 'Community Hospital (30 Beds)' | 'Sub-district Health Center (รพ.สต.)';
  location: string;
  district: string;
  province: string;
  phone: string;
  deviceCount: number;
}

export type Department = 
  | 'Cardiology Unit'
  | 'Cardiology Unit A'
  | 'Cardiology Unit B'
  | 'Intensive Care (ICU)'
  | 'Emergency Room (ER)'
  | 'Radiology'
  | 'Hematology Lab'
  | 'Oncology'
  | 'Pediatrics'
  | 'Surgery & OR'
  | 'Sub-district Primary Care';

export type DeviceStatus = 'Optimal' | 'Due Soon' | 'Expired' | 'In-Transit' | 'Decommissioned';

export type RiskClassification = 'Class III (Critical/Life Support)' | 'Class II (Moderate Risk)' | 'Class I (Low Risk)';

export interface ElectricalSafetyTest {
  earthBondOhm: number; // Limit < 0.20 Ohm
  earthBondPass: boolean;
  insulationMohm: number; // Limit > 2.0 MOhm
  insulationPass: boolean;
  chassisLeakageUa: number; // Limit < 100 uA
  chassisLeakagePass: boolean;
  patientLeakageUa?: number; // Limit < 10 uA (for applied parts)
  patientLeakagePass?: boolean;
}

export interface PerformanceTestParam {
  paramName: string;
  nominalValue: string;
  measuredValue: string;
  tolerance: string;
  pass: boolean;
}

export interface CalibrationRecord {
  id: string;
  deviceId: string;
  testDate: string;
  nextDueDate: string;
  standardRef: 'IEC 62353:2014' | 'IEC 60601-1' | 'ISO 13485:2016' | 'ISO/IEC 17025';
  testEquipment: string; // e.g. Fluke ESA620 Electrical Safety Analyzer
  testEquipmentCalDueDate: string;
  traceabilityId: string; // e.g. NIMT/TR-2024-8841
  electricalSafety: ElectricalSafetyTest;
  performanceParams: PerformanceTestParam[];
  overallResult: 'PASS' | 'FAIL' | 'CONDITIONAL';
  testedBy: string;
  certifiedBy: string;
  certificateNumber: string;
  notes: string;
  digitalSignature: string;
  verificationHash: string;
}

export interface AgingAnalysis {
  equipmentHealthScore: number; // 0 - 100%
  expectedLifespanYears: number;
  currentAgeYears: number;
  remainingLifespanMonths: number;
  failureProbabilityNext12m: number; // percentage e.g. 15%
  maintenanceCostTrend: 'Low' | 'Moderate' | 'High' | 'Critical';
  recommendedAction: 'Keep in service' | 'Plan overhaul' | 'Replace in upcoming budget' | 'Immediate decommission';
  mtbfHours: number; // Mean Time Between Failures
  degradationPoints: { year: number; health: number }[];
}

export interface MedicalDevice {
  id: string; // e.g. #DEF-9021, #CRD-9921
  name: string;
  nameTh: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  department: Department;
  facilityId: FacilityId;
  facilityName: string;
  room: string;
  riskClass: RiskClassification;
  installDate: string;
  lastCalibDate: string;
  calibIntervalMonths: number; // 6 or 12
  nextCalibDate: string;
  daysRemaining: number;
  status: DeviceStatus;
  safetyStandard: string;
  technician: string;
  aging: AgingAnalysis;
  lastRecord?: CalibrationRecord;
  photoUrl?: string;
  qrCodeUrl: string;
}

export type UserRole = 'ADMIN' | 'TECHNICIAN' | 'SUPERVISOR' | 'AUDITOR' | 'VIEWER';

export interface UserProfile {
  id: string;
  name: string;
  nameTh: string;
  title: string;
  role: UserRole;
  tier: string;
  avatarUrl: string;
  department: string;
  email: string;
}

export interface SystemSettings {
  telegramBotToken: string;
  adminChatId: string;
  notificationThresholdDays: number;
  autoSyncGoogleSheets: boolean;
  googleSpreadsheetId?: string;
  googleSpreadsheetUrl?: string;
  lastSyncedTimestamp?: string;
  audioAlertsEnabled: boolean;
  pdpaMaskingEnabled: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  integrityHash: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  deviceId?: string;
  read: boolean;
}
