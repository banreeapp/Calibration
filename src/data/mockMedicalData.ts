import { 
  MedicalDevice, 
  Facility, 
  CalibrationRecord, 
  UserProfile, 
  SystemSettings, 
  AuditLogItem, 
  SystemNotification 
} from '../types/medical';

export const facilities: Facility[] = [
  {
    id: 'donphut-hospital',
    name: 'โรงพยาบาลดอนพุด',
    nameEn: 'Don Phut Community Hospital',
    type: 'Community Hospital (30 Beds)',
    location: 'ต.ดอนพุด อ.ดอนพุด จ.สระบุรี 18210',
    district: 'ดอนพุด',
    province: 'สระบุรี',
    phone: '036-395111',
    deviceCount: 18
  },
  {
    id: 'donphut-subdistrict',
    name: 'รพ.สต.ดอนพุด',
    nameEn: 'Don Phut Sub-district Health Promotion Hospital',
    type: 'Sub-district Health Center (รพ.สต.)',
    location: 'หมู่ 1 ต.ดอนพุด อ.ดอนพุด จ.สระบุรี',
    district: 'ดอนพุด',
    province: 'สระบุรี',
    phone: '036-395222',
    deviceCount: 6
  },
  {
    id: 'phailiu-subdistrict',
    name: 'รพ.สต.ไผ่หลิ่ว',
    nameEn: 'Phai Liu Sub-district Health Promotion Hospital',
    type: 'Sub-district Health Center (รพ.สต.)',
    location: 'หมู่ 3 ต.ไผ่หลิ่ว อ.ดอนพุด จ.สระบุรี',
    district: 'ดอนพุด',
    province: 'สระบุรี',
    phone: '036-395333',
    deviceCount: 4
  },
  {
    id: 'banluang-subdistrict',
    name: 'รพ.สต.บ้านหลวง',
    nameEn: 'Ban Luang Sub-district Health Promotion Hospital',
    type: 'Sub-district Health Center (รพ.สต.)',
    location: 'หมู่ 2 ต.บ้านหลวง อ.ดอนพุด จ.สระบุรี',
    district: 'ดอนพุด',
    province: 'สระบุรี',
    phone: '036-395444',
    deviceCount: 5
  },
  {
    id: 'dongnoi-subdistrict',
    name: 'รพ.สต.ดงน้อย',
    nameEn: 'Dong Noi Sub-district Health Promotion Hospital',
    type: 'Sub-district Health Center (รพ.สต.)',
    location: 'หมู่ 4 ต.ดงน้อย อ.ดอนพุด จ.สระบุรี',
    district: 'ดอนพุด',
    province: 'สระบุรี',
    phone: '036-395555',
    deviceCount: 4
  }
];

export const userProfiles: UserProfile[] = [
  {
    id: 'u-admin',
    name: 'Dr. Aris Thorne',
    nameTh: 'ดร. อริส ธอร์น (หัวหน้าวิศวกรชีวการแพทย์)',
    title: 'Lead Biomedical Engineer',
    role: 'ADMIN',
    tier: 'Tier 4-Full',
    avatarUrl: '/assets/aistudio/Image_1_461a77f4.png',
    department: 'Biomedical Operations & Engineering',
    email: 'aris.thorne@donphut-hospital.go.th'
  },
  {
    id: 'u-tech',
    name: 'S. Mitchell',
    nameTh: 'ส. มิตเชลล์ (วิศวกรสอบเทียบเครื่องมือแพทย์)',
    title: 'Senior Clinical Engineering Tech',
    role: 'TECHNICIAN',
    tier: 'Tier 3-Service',
    avatarUrl: '/assets/aistudio/Image_10_419c76ba.png',
    department: 'Medical Calibration Center',
    email: 's.mitchell@donphut-hospital.go.th'
  },
  {
    id: 'u-nurse',
    name: 'พว. วราภรณ์ สุวรรณสิทธิ์',
    nameTh: 'พว. วราภรณ์ สุวรรณสิทธิ์ (หัวหน้าฝ่ายการพยาบาล)',
    title: 'Nursing Department Supervisor',
    role: 'SUPERVISOR',
    tier: 'Tier 2-Supervisor',
    avatarUrl: '/assets/aistudio/Image_3_cededaf8.png',
    department: 'Nursing & Clinical Quality Assurance',
    email: 'varaporn.s@donphut-hospital.go.th'
  },
  {
    id: 'u-auditor',
    name: 'ภก. สมชาย บริสุทธิ์',
    nameTh: 'ภก. สมชาย บริสุทธิ์ (ผู้ตรวจประเมินคุณภาพ ISO 13485 / HA)',
    title: 'Quality Auditor & Compliance Officer',
    role: 'AUDITOR',
    tier: 'Tier 1-Audit',
    avatarUrl: '/assets/aistudio/Image_8_e934abcb.png',
    department: 'Hospital Accreditation Committee',
    email: 'somchai.auditor@moph.mail.go.th'
  },
  {
    id: 'u-viewer',
    name: 'เจ้าหน้าที่สาธารณสุขอำเภอดอนพุด',
    nameTh: 'เจ้าหน้าที่คลินิกทั่วไป',
    title: 'General Clinical Staff',
    role: 'VIEWER',
    tier: 'Tier 0-Read Only',
    avatarUrl: '/assets/aistudio/Image_5_49633a89.png',
    department: 'District Health Information Network',
    email: 'staff@donphut-health.go.th'
  }
];

export const initialCalibrationRecords: CalibrationRecord[] = [
  {
    id: 'cal-rec-001',
    deviceId: '#CRD-9921',
    testDate: '2023-10-12',
    nextDueDate: '2024-10-12',
    standardRef: 'IEC 62353:2014',
    testEquipment: 'Fluke ESA620 Electrical Safety Analyzer',
    testEquipmentCalDueDate: '2025-06-30',
    traceabilityId: 'NIMT/TR-2023-7712',
    electricalSafety: {
      earthBondOhm: 0.14,
      earthBondPass: true,
      insulationMohm: 85.0,
      insulationPass: true,
      chassisLeakageUa: 42.0,
      chassisLeakagePass: true,
      patientLeakageUa: 6.2,
      patientLeakagePass: true
    },
    performanceParams: [
      { paramName: 'ECG Sensitivity (10mm/mV)', nominalValue: '10.0 mm', measuredValue: '10.1 mm', tolerance: '±5%', pass: true },
      { paramName: 'Paper Speed (25mm/s)', nominalValue: '25.0 mm/s', measuredValue: '24.9 mm/s', tolerance: '±2%', pass: true },
      { paramName: 'Frequency Response (0.05-150Hz)', nominalValue: '-3 dB', measuredValue: '-2.8 dB', tolerance: 'Pass', pass: true }
    ],
    overallResult: 'PASS',
    testedBy: 'S. Mitchell (BME Cert #442)',
    certifiedBy: 'Dr. Aris Thorne (PE #8819)',
    certificateNumber: 'DPH-CAL-2023-09921',
    notes: 'เครื่องผ่านเกณฑ์ความปลอดภัยทางไฟฟ้า IEC 62353 ปกติ แนะนำเปลี่ยนแผ่นรอง Lead Wire ภายใน 6 เดือน',
    digitalSignature: 'SIG_SHA256_ARIS_THORNE_CERT_OK',
    verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'cal-rec-002',
    deviceId: '#ICU-4412',
    testDate: '2024-05-15',
    nextDueDate: '2025-05-15',
    standardRef: 'IEC 62353:2014',
    testEquipment: 'Fluke ProSim 8 Vital Signs Simulator & ESA620',
    testEquipmentCalDueDate: '2025-08-15',
    traceabilityId: 'NIMT/TR-2024-9102',
    electricalSafety: {
      earthBondOhm: 0.08,
      earthBondPass: true,
      insulationMohm: 120.0,
      insulationPass: true,
      chassisLeakageUa: 28.5,
      chassisLeakagePass: true,
      patientLeakageUa: 3.8,
      patientLeakagePass: true
    },
    performanceParams: [
      { paramName: 'NIBP Accuracy (120/80 mmHg)', nominalValue: '120/80 mmHg', measuredValue: '121/79 mmHg', tolerance: '±3 mmHg', pass: true },
      { paramName: 'SpO2 Saturation (97%)', nominalValue: '97.0%', measuredValue: '97.2%', tolerance: '±1%', pass: true },
      { paramName: 'Heart Rate (60 BPM)', nominalValue: '60 BPM', measuredValue: '60 BPM', tolerance: '±1 BPM', pass: true }
    ],
    overallResult: 'PASS',
    testedBy: 'S. Mitchell (BME Cert #442)',
    certifiedBy: 'Dr. Aris Thorne (PE #8819)',
    certificateNumber: 'DPH-CAL-2024-04412',
    notes: 'สถานะเครื่องยอดเยี่ยม ผ่านเกณฑ์มาตรฐานโรงพยาบาลระดับสากล',
    digitalSignature: 'SIG_SHA256_ARIS_THORNE_CERT_OK',
    verificationHash: '7d793037a0760186574b0282f2f435e7b1e516b9cfd6f6ee4e515d18228ac9e8'
  }
];

export const initialDevices: MedicalDevice[] = [
  {
    id: '#DEF-9021',
    name: 'GE Healthcare MRI Unit',
    nameTh: 'เครื่องตรวจคลื่นแม่เหล็กไฟฟ้า MRI 1.5T',
    model: 'SIGNA Explorer 1.5T',
    serialNumber: 'MR-9021-GE',
    manufacturer: 'GE HealthCare',
    department: 'Radiology',
    facilityId: 'donphut-hospital',
    facilityName: 'โรงพยาบาลดอนพุด',
    room: 'ห้องตรวจรังสีวินิจฉัย ชั้น 1',
    riskClass: 'Class III (Critical/Life Support)',
    installDate: '2018-03-10',
    lastCalibDate: '2023-04-10',
    calibIntervalMonths: 12,
    nextCalibDate: '2024-04-10',
    daysRemaining: -210,
    status: 'Expired',
    safetyStandard: 'IEC 60601-2-33 / IEC 62353',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 54,
      expectedLifespanYears: 10,
      currentAgeYears: 6.8,
      remainingLifespanMonths: 38,
      failureProbabilityNext12m: 38,
      maintenanceCostTrend: 'High',
      recommendedAction: 'Plan overhaul',
      mtbfHours: 1420,
      degradationPoints: [
        { year: 2018, health: 100 },
        { year: 2020, health: 88 },
        { year: 2022, health: 75 },
        { year: 2024, health: 54 },
        { year: 2026, health: 35 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=DEF-9021-DONPHUT-HOSPITAL'
  },
  {
    id: '#CRD-9921',
    name: 'MAC 5500 Resting ECG System',
    nameTh: 'เครื่องตรวจคลื่นไฟฟ้าหัวใจ 12 ลีด',
    model: 'MAC-5500-HD',
    serialNumber: 'SN-45091-B',
    manufacturer: 'GE HealthCare',
    department: 'Cardiology Unit A',
    facilityId: 'donphut-hospital',
    facilityName: 'โรงพยาบาลดอนพุด',
    room: 'ห้องตรวจหัวใจและหลอดเลือด',
    riskClass: 'Class II (Moderate Risk)',
    installDate: '2019-06-15',
    lastCalibDate: '2023-10-12',
    calibIntervalMonths: 12,
    nextCalibDate: '2024-10-12',
    daysRemaining: -28,
    status: 'Expired',
    safetyStandard: 'IEC 62353:2014',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 68,
      expectedLifespanYears: 8,
      currentAgeYears: 5.4,
      remainingLifespanMonths: 31,
      failureProbabilityNext12m: 24,
      maintenanceCostTrend: 'Moderate',
      recommendedAction: 'Keep in service',
      mtbfHours: 2800,
      degradationPoints: [
        { year: 2019, health: 100 },
        { year: 2021, health: 91 },
        { year: 2023, health: 78 },
        { year: 2024, health: 68 },
        { year: 2026, health: 48 }
      ]
    },
    lastRecord: initialCalibrationRecords[0],
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=CRD-9921-DONPHUT-HOSPITAL'
  },
  {
    id: '#VNT-4402',
    name: 'Puritan Bennett 980',
    nameTh: 'เครื่องช่วยหายใจชนิดควบคุมด้วยปริมาตรและความดัน',
    model: 'PB-980-UNIVERSAL',
    serialNumber: 'VNT-4402-980',
    manufacturer: 'Medtronic',
    department: 'Intensive Care (ICU)',
    facilityId: 'donphut-hospital',
    facilityName: 'โรงพยาบาลดอนพุด',
    room: 'หออภิบาลผู้ป่วยหนัก ICU เตียง 2',
    riskClass: 'Class III (Critical/Life Support)',
    installDate: '2021-01-20',
    lastCalibDate: '2024-05-20',
    calibIntervalMonths: 6,
    nextCalibDate: '2024-11-20',
    daysRemaining: 11,
    status: 'Due Soon',
    safetyStandard: 'IEC 60601-1 / IEC 62353',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 84,
      expectedLifespanYears: 10,
      currentAgeYears: 3.8,
      remainingLifespanMonths: 74,
      failureProbabilityNext12m: 9,
      maintenanceCostTrend: 'Low',
      recommendedAction: 'Keep in service',
      mtbfHours: 4800,
      degradationPoints: [
        { year: 2021, health: 100 },
        { year: 2022, health: 95 },
        { year: 2023, health: 90 },
        { year: 2024, health: 84 },
        { year: 2026, health: 72 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=VNT-4402-DONPHUT-HOSPITAL'
  },
  {
    id: '#INF-1182',
    name: 'Precision Infusion Pump',
    nameTh: 'เครื่องควบคุมการให้สารละลายทางหลอดเลือดดำ',
    model: 'ALARIS-8100-V4',
    serialNumber: 'SN-99201-B',
    manufacturer: 'BD CareFusion',
    department: 'Oncology',
    facilityId: 'donphut-hospital',
    facilityName: 'โรงพยาบาลดอนพุด',
    room: 'หน่วยเคมีบำบัด',
    riskClass: 'Class II (Moderate Risk)',
    installDate: '2020-04-14',
    lastCalibDate: '2023-11-28',
    calibIntervalMonths: 12,
    nextCalibDate: '2024-11-28',
    daysRemaining: 19,
    status: 'Due Soon',
    safetyStandard: 'IEC 60601-2-24 / IEC 62353',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 79,
      expectedLifespanYears: 7,
      currentAgeYears: 4.5,
      remainingLifespanMonths: 30,
      failureProbabilityNext12m: 14,
      maintenanceCostTrend: 'Moderate',
      recommendedAction: 'Keep in service',
      mtbfHours: 3200,
      degradationPoints: [
        { year: 2020, health: 100 },
        { year: 2021, health: 94 },
        { year: 2023, health: 85 },
        { year: 2024, health: 79 },
        { year: 2026, health: 58 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=INF-1182-DONPHUT-HOSPITAL'
  },
  {
    id: '#ICU-4412',
    name: 'Patient Monitor Elite',
    nameTh: 'เครื่องติดตามสัญญาณชีพผู้ป่วยข้างเตียงชนิดหลายพารามิเตอร์',
    model: 'PH-MX800-REV3',
    serialNumber: 'SN-99102-MX',
    manufacturer: 'Philips Healthcare',
    department: 'Intensive Care (ICU)',
    facilityId: 'donphut-hospital',
    facilityName: 'โรงพยาบาลดอนพุด',
    room: 'ICU-Ward-4 เตียง 1',
    riskClass: 'Class II (Moderate Risk)',
    installDate: '2022-08-10',
    lastCalibDate: '2024-05-15',
    calibIntervalMonths: 12,
    nextCalibDate: '2025-05-15',
    daysRemaining: 187,
    status: 'Optimal',
    safetyStandard: 'IEC 62353:2014',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 94,
      expectedLifespanYears: 8,
      currentAgeYears: 2.2,
      remainingLifespanMonths: 70,
      failureProbabilityNext12m: 3,
      maintenanceCostTrend: 'Low',
      recommendedAction: 'Keep in service',
      mtbfHours: 6500,
      degradationPoints: [
        { year: 2022, health: 100 },
        { year: 2023, health: 97 },
        { year: 2024, health: 94 },
        { year: 2026, health: 85 },
        { year: 2028, health: 70 }
      ]
    },
    lastRecord: initialCalibrationRecords[1],
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=ICU-4412-DONPHUT-HOSPITAL'
  },
  {
    id: '#LAB-1024',
    name: 'Centrifuge 5425 R',
    nameTh: 'เครื่องปั่นเหวี่ยงตกตะกอนควบคุมอุณหภูมิ',
    model: 'Centrifuge 5425 R',
    serialNumber: 'SN-22841-EP',
    manufacturer: 'Eppendorf',
    department: 'Hematology Lab',
    facilityId: 'donphut-hospital',
    facilityName: 'โรงพยาบาลดอนพุด',
    room: 'ห้องปฏิบัติการเทคนิคการแพทย์ Lab A-4',
    riskClass: 'Class I (Low Risk)',
    installDate: '2021-03-01',
    lastCalibDate: '2024-01-05',
    calibIntervalMonths: 12,
    nextCalibDate: '2025-01-05',
    daysRemaining: 57,
    status: 'Due Soon',
    safetyStandard: 'IEC 61010-2-020 / IEC 62353',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 88,
      expectedLifespanYears: 10,
      currentAgeYears: 3.6,
      remainingLifespanMonths: 76,
      failureProbabilityNext12m: 6,
      maintenanceCostTrend: 'Low',
      recommendedAction: 'Keep in service',
      mtbfHours: 5200,
      degradationPoints: [
        { year: 2021, health: 100 },
        { year: 2022, health: 96 },
        { year: 2023, health: 92 },
        { year: 2024, health: 88 },
        { year: 2026, health: 79 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=LAB-1024-DONPHUT-HOSPITAL'
  },
  {
    id: '#CRD-5501',
    name: 'Affiniti 70 Ultrasound',
    nameTh: 'เครื่องตรวจคลื่นเสียงความถี่สูงระบบดิจิทัล',
    model: 'Affiniti-70-G',
    serialNumber: 'SN-71203-US',
    manufacturer: 'Philips Healthcare',
    department: 'Cardiology Unit B',
    facilityId: 'donphut-hospital',
    facilityName: 'โรงพยาบาลดอนพุด',
    room: 'ห้องตรวจเอคโค่หัวใจ (Echocardiogram)',
    riskClass: 'Class II (Moderate Risk)',
    installDate: '2019-11-15',
    lastCalibDate: '2023-11-15',
    calibIntervalMonths: 12,
    nextCalibDate: '2024-11-15',
    daysRemaining: 6,
    status: 'Due Soon',
    safetyStandard: 'IEC 60601-2-37 / IEC 62353',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 71,
      expectedLifespanYears: 7,
      currentAgeYears: 5.0,
      remainingLifespanMonths: 24,
      failureProbabilityNext12m: 19,
      maintenanceCostTrend: 'Moderate',
      recommendedAction: 'Keep in service',
      mtbfHours: 3100,
      degradationPoints: [
        { year: 2019, health: 100 },
        { year: 2021, health: 89 },
        { year: 2023, health: 77 },
        { year: 2024, health: 71 },
        { year: 2026, health: 50 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=CRD-5501-DONPHUT-HOSPITAL'
  },
  {
    id: '#DF-3010',
    name: 'Zoll R Series Defibrillator',
    nameTh: 'เครื่องกระตุกหัวใจด้วยไฟฟ้าพร้อมระบบติดตามสัญญาณชีพ',
    model: 'R-Series-ALS',
    serialNumber: 'ZR-3010-09',
    manufacturer: 'Zoll Medical',
    department: 'Emergency Room (ER)',
    facilityId: 'donphut-hospital',
    facilityName: 'โรงพยาบาลดอนพุด',
    room: 'ห้องฉุกเฉินและกู้ชีพ (CPR Room)',
    riskClass: 'Class III (Critical/Life Support)',
    installDate: '2022-02-15',
    lastCalibDate: '2024-06-10',
    calibIntervalMonths: 6,
    nextCalibDate: '2024-12-10',
    daysRemaining: 31,
    status: 'Due Soon',
    safetyStandard: 'IEC 60601-2-4 / IEC 62353',
    technician: 'Dr. Aris Thorne',
    aging: {
      equipmentHealthScore: 92,
      expectedLifespanYears: 8,
      currentAgeYears: 2.7,
      remainingLifespanMonths: 63,
      failureProbabilityNext12m: 4,
      maintenanceCostTrend: 'Low',
      recommendedAction: 'Keep in service',
      mtbfHours: 5900,
      degradationPoints: [
        { year: 2022, health: 100 },
        { year: 2023, health: 96 },
        { year: 2024, health: 92 },
        { year: 2026, health: 82 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=DF-3010-DONPHUT-HOSPITAL'
  },
  {
    id: '#RST-101',
    name: 'Welch Allyn Connex Spot Monitor',
    nameTh: 'เครื่องตรวจวัดสัญญาณชีพพื้นฐานอัตโนมัติ',
    model: 'CSM-7100',
    serialNumber: 'WA-7100-DP1',
    manufacturer: 'Hillrom / Welch Allyn',
    department: 'Sub-district Primary Care',
    facilityId: 'donphut-subdistrict',
    facilityName: 'รพ.สต.ดอนพุด',
    room: 'ห้องคัดกรองผู้ป่วย',
    riskClass: 'Class II (Moderate Risk)',
    installDate: '2023-01-10',
    lastCalibDate: '2024-03-12',
    calibIntervalMonths: 12,
    nextCalibDate: '2025-03-12',
    daysRemaining: 123,
    status: 'Optimal',
    safetyStandard: 'IEC 62353:2014',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 96,
      expectedLifespanYears: 7,
      currentAgeYears: 1.8,
      remainingLifespanMonths: 62,
      failureProbabilityNext12m: 2,
      maintenanceCostTrend: 'Low',
      recommendedAction: 'Keep in service',
      mtbfHours: 7200,
      degradationPoints: [
        { year: 2023, health: 100 },
        { year: 2024, health: 96 },
        { year: 2025, health: 90 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=RST-101-DONPHUT-SUBDISTRICT'
  },
  {
    id: '#RST-102',
    name: 'Bionet CardioTouch 3000',
    nameTh: 'เครื่องตรวจคลื่นไฟฟ้าหัวใจ 12 ลีดประจำ รพ.สต.',
    model: 'CT-3000',
    serialNumber: 'BN-3000-PL1',
    manufacturer: 'Bionet',
    department: 'Sub-district Primary Care',
    facilityId: 'phailiu-subdistrict',
    facilityName: 'รพ.สต.ไผ่หลิ่ว',
    room: 'ห้องตรวจรักษา 1',
    riskClass: 'Class II (Moderate Risk)',
    installDate: '2020-09-01',
    lastCalibDate: '2023-11-20',
    calibIntervalMonths: 12,
    nextCalibDate: '2024-11-20',
    daysRemaining: 11,
    status: 'Due Soon',
    safetyStandard: 'IEC 62353:2014',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 78,
      expectedLifespanYears: 7,
      currentAgeYears: 4.1,
      remainingLifespanMonths: 35,
      failureProbabilityNext12m: 12,
      maintenanceCostTrend: 'Low',
      recommendedAction: 'Keep in service',
      mtbfHours: 3900,
      degradationPoints: [
        { year: 2020, health: 100 },
        { year: 2022, health: 88 },
        { year: 2024, health: 78 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=RST-102-PHAILIU-SUBDISTRICT'
  },
  {
    id: '#RST-103',
    name: 'Nidek Nuvo Lite 5L',
    nameTh: 'เครื่องผลิตออกซิเจนทางการแพทย์ 5 ลิตร',
    model: 'Nuvo-Lite-525',
    serialNumber: 'ND-525-BL1',
    manufacturer: 'Nidek Medical',
    department: 'Sub-district Primary Care',
    facilityId: 'banluang-subdistrict',
    facilityName: 'รพ.สต.บ้านหลวง',
    room: 'ห้องจ่ายอุปกรณ์การแพทย์ดูแลผู้ป่วยที่บ้าน',
    riskClass: 'Class II (Moderate Risk)',
    installDate: '2022-05-18',
    lastCalibDate: '2024-04-18',
    calibIntervalMonths: 12,
    nextCalibDate: '2025-04-18',
    daysRemaining: 160,
    status: 'Optimal',
    safetyStandard: 'ISO 80601-2-69 / IEC 62353',
    technician: 'S. Mitchell',
    aging: {
      equipmentHealthScore: 91,
      expectedLifespanYears: 6,
      currentAgeYears: 2.5,
      remainingLifespanMonths: 42,
      failureProbabilityNext12m: 5,
      maintenanceCostTrend: 'Low',
      recommendedAction: 'Keep in service',
      mtbfHours: 6000,
      degradationPoints: [
        { year: 2022, health: 100 },
        { year: 2023, health: 95 },
        { year: 2024, health: 91 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=RST-103-BANLUANG-SUBDISTRICT'
  },
  {
    id: '#RST-104',
    name: 'Yuwell 7F-5A Oxygen Unit',
    nameTh: 'เครื่องผลิตออกซิเจนเคลื่อนที่',
    model: '7F-5A-Compact',
    serialNumber: 'YW-7F5A-DN1',
    manufacturer: 'Yuwell Medical',
    department: 'Sub-district Primary Care',
    facilityId: 'dongnoi-subdistrict',
    facilityName: 'รพ.สต.ดงน้อย',
    room: 'ศูนย์ยืมคืนอุปกรณ์การแพทย์ชุมชน',
    riskClass: 'Class II (Moderate Risk)',
    installDate: '2022-09-10',
    lastCalibDate: '2024-06-14',
    calibIntervalMonths: 12,
    nextCalibDate: '2025-06-14',
    daysRemaining: 217,
    status: 'Optimal',
    safetyStandard: 'ISO 80601-2-69 / IEC 62353',
    technician: 'Dr. Aris Thorne',
    aging: {
      equipmentHealthScore: 89,
      expectedLifespanYears: 6,
      currentAgeYears: 2.1,
      remainingLifespanMonths: 46,
      failureProbabilityNext12m: 6,
      maintenanceCostTrend: 'Low',
      recommendedAction: 'Keep in service',
      mtbfHours: 5800,
      degradationPoints: [
        { year: 2022, health: 100 },
        { year: 2023, health: 94 },
        { year: 2024, health: 89 }
      ]
    },
    qrCodeUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=RST-104-DONGNOI-SUBDISTRICT'
  }
];

export const initialSystemSettings: SystemSettings = {
  telegramBotToken: '734918237:AAFl-Hk9z2X8qM8-Lp9Vz_XjRk_A9yM2L',
  adminChatId: '-1001847592301',
  notificationThresholdDays: 14,
  autoSyncGoogleSheets: true,
  audioAlertsEnabled: true,
  pdpaMaskingEnabled: true
};

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'log-001',
    timestamp: '09:42 AM',
    actor: 'Dr. Aris Thorne',
    role: 'ADMIN',
    action: 'Settings Modified',
    details: 'ปรับเปลี่ยนค่า Notification Threshold เป็น 14 วัน และบันทึก Token ประตูเชื่อมต่อ Telegram',
    ipAddress: '192.168.10.45 (Don Phut Hospital Intranet)',
    integrityHash: 'a7c93e4bf120d8f074'
  },
  {
    id: 'log-002',
    timestamp: '08:15 AM',
    actor: 'Dr. Aris Thorne',
    role: 'ADMIN',
    action: 'Telegram Bot Gateway',
    details: 'ทดสอบส่งข้อความแจ้งเตือนผ่าน Telegram Bot Gateway: SUCCESSFUL',
    ipAddress: '192.168.10.45',
    integrityHash: 'b8d04f5ca231e9f185'
  },
  {
    id: 'log-003',
    timestamp: 'Yesterday 16:30',
    actor: 'S. Mitchell',
    role: 'TECHNICIAN',
    action: 'Calibration Recorded',
    details: 'บันทึกผลการสอบเทียบเครื่องตรวจสัญญาณชีพ #ICU-4412 ผ่านเกณฑ์มาตรฐาน IEC 62353',
    ipAddress: '192.168.10.82',
    integrityHash: 'c9e15a6db342fa0296'
  },
  {
    id: 'log-004',
    timestamp: 'Yesterday 14:10',
    actor: 'ภก. สมชาย บริสุทธิ์',
    role: 'AUDITOR',
    action: 'PDPA Compliance Audit',
    details: 'ตรวจสอบการเข้าถึงทะเบียนเครื่องมือแพทย์และข้อมูลสถานพยาบาลตามเกณฑ์ PDPA ม.26',
    ipAddress: '10.24.1.15',
    integrityHash: 'd0f26b7ec453ab1307'
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'หมดอายุการสอบเทียบ (Critical Expiry)',
    message: 'เครื่องตรวจคลื่นแม่เหล็กไฟฟ้า MRI Unit #DEF-9021 แผนกรังสีวิทยา หมดอายุการสอบเทียบเกิน 200 วัน',
    timestamp: '10 นาทีที่แล้ว',
    severity: 'critical',
    deviceId: '#DEF-9021',
    read: false
  },
  {
    id: 'notif-2',
    title: 'หมดอายุการสอบเทียบ (Expired Asset)',
    message: 'เครื่องตรวจคลื่นไฟฟ้าหัวใจ #CRD-9921 แผนกหัวใจ หมดอายุการสอบเทียบเมื่อ 28 วันก่อน',
    timestamp: '1 ชั่วโมงที่แล้ว',
    severity: 'critical',
    deviceId: '#CRD-9921',
    read: false
  },
  {
    id: 'notif-3',
    title: 'ใกล้ถึงกำหนดสอบเทียบ (Due in 11 Days)',
    message: 'เครื่องช่วยหายใจ PB 980 #VNT-4402 หอผู้ป่วยหนัก ICU ถึงกำหนดรอบทดสอบความปลอดภัย IEC 62353 ในอีก 11 วัน',
    timestamp: '3 ชั่วโมงที่แล้ว',
    severity: 'warning',
    deviceId: '#VNT-4402',
    read: false
  },
  {
    id: 'notif-4',
    title: 'การเตรียมพร้อมรับการตรวจประเมิน ISO 13485:2016',
    message: 'กำหนดการตรวจประเมินระบบการจัดการคุณภาพเครื่องมือแพทย์จะเริ่มในอีก 14 วัน กรุณาจัดเตรียมเอกสาร Calibration Pack',
    timestamp: '1 วันที่แล้ว',
    severity: 'info',
    read: true
  }
];
