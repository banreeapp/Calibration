import { MedicalDevice, CalibrationRecord } from '../types/medical';
import { getAccessToken } from './firebaseAuth';

export interface SyncResult {
  success: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  message: string;
  timestamp: string;
  itemCount: number;
}

export async function exportToGoogleSheets(
  devices: MedicalDevice[],
  calibrationRecords: CalibrationRecord[],
  existingSpreadsheetId?: string
): Promise<SyncResult> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('กรุณาลงชื่อเข้าใช้ Google Workspace ก่อนเริ่มซิงค์ข้อมูล (Authentication Required)');
  }

  const timestamp = new Date().toLocaleString('th-TH');

  try {
    let targetSpreadsheetId = existingSpreadsheetId;

    // 1. Create spreadsheet if not provided
    if (!targetSpreadsheetId) {
      const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: `MediCal Systems - ทะเบียนสอบเทียบเครื่องมือแพทย์ อ.ดอนพุด (${new Date().toISOString().split('T')[0]})`
          },
          sheets: [
            { properties: { title: 'Devices_DonPhut', tabColor: { red: 0, green: 0.8, blue: 0.82 } } },
            { properties: { title: 'Calibration_Records', tabColor: { red: 0.28, green: 0.92, blue: 0.93 } } },
            { properties: { title: 'Audit_Summary', tabColor: { red: 0.64, green: 0.86, blue: 1.0 } } }
          ]
        })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error?.message || 'Failed to create Google Spreadsheet');
      }

      const created = await createResponse.json();
      targetSpreadsheetId = created.spreadsheetId;
    }

    // 2. Prepare Data for Devices_DonPhut Tab
    const deviceHeader = [
      'Asset ID',
      'Device Name (EN)',
      'Device Name (TH)',
      'Model Number',
      'Serial Number (SN)',
      'Department',
      'Facility',
      'Risk Classification',
      'Status',
      'Last Calib Date',
      'Next Calib Due',
      'Days Remaining',
      'Health Index (%)',
      'Safety Standard',
      'Assigned Technician'
    ];

    const deviceRows = devices.map(d => [
      d.id,
      d.name,
      d.nameTh,
      d.model,
      d.serialNumber,
      d.department,
      d.facilityName,
      d.riskClass,
      d.status,
      d.lastCalibDate,
      d.nextCalibDate,
      d.daysRemaining,
      `${d.aging.equipmentHealthScore}%`,
      d.safetyStandard,
      d.technician
    ]);

    // 3. Prepare Data for Calibration_Records Tab
    const recordHeader = [
      'Certificate No.',
      'Asset ID',
      'Test Date',
      'Next Due Date',
      'Standard Reference',
      'Earth Bond (Ω)',
      'Insulation (MΩ)',
      'Chassis Leakage (µA)',
      'Overall Result',
      'Tested By',
      'Certified By',
      'Traceability Ref'
    ];

    const recordRows = calibrationRecords.map(r => [
      r.certificateNumber,
      r.deviceId,
      r.testDate,
      r.nextDueDate,
      r.standardRef,
      r.electricalSafety.earthBondOhm,
      r.electricalSafety.insulationMohm,
      r.electricalSafety.chassisLeakageUa,
      r.overallResult,
      r.testedBy,
      r.certifiedBy,
      r.traceabilityId
    ]);

    // 4. Prepare Data for Audit_Summary Tab
    const normalCount = devices.filter(d => d.status === 'Optimal').length;
    const pendingCount = devices.filter(d => d.status === 'Due Soon').length;
    const expiredCount = devices.filter(d => d.status === 'Expired').length;
    const complianceRate = Math.round((normalCount / (devices.length || 1)) * 100);

    const summaryRows = [
      ['Metric', 'Value', 'Unit / Note'],
      ['Total Medical Devices', devices.length, 'Units in Don Phut District'],
      ['Optimal Status (Normal)', normalCount, 'Compliant with IEC 62353'],
      ['Pending Calibration (<60 days)', pendingCount, 'Scheduled for service'],
      ['Expired / Out of Spec', expiredCount, 'CRITICAL - Urgent attention required'],
      ['District Calibration Compliance Rate', `${complianceRate}%`, 'Target > 90% (ISO 13485:2016)'],
      ['District Facilities Covered', '5', 'รพ.ดอนพุด, รพ.สต.ดอนพุด, ไผ่หลิ่ว, บ้านหลวง, ดงน้อย'],
      ['Last Synchronized By', 'MediCal Systems Automation', timestamp]
    ];

    // 5. Write to Sheets using batchUpdate values
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: [
            {
              range: 'Devices_DonPhut!A1:O' + (deviceRows.length + 1),
              values: [deviceHeader, ...deviceRows]
            },
            {
              range: 'Calibration_Records!A1:L' + (recordRows.length + 1),
              values: [recordHeader, ...recordRows]
            },
            {
              range: 'Audit_Summary!A1:C' + summaryRows.length,
              values: summaryRows
            }
          ]
        })
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.error?.message || 'Error updating spreadsheet values');
    }

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}/edit`;

    return {
      success: true,
      spreadsheetId: targetSpreadsheetId,
      spreadsheetUrl,
      message: `ซิงค์ข้อมูลสำเร็จ! อัปเดตอุปกรณ์การแพทย์ ${devices.length} รายการ และประวัติสอบเทียบ ${calibrationRecords.length} ฉบับ`,
      timestamp,
      itemCount: devices.length
    };
  } catch (err: any) {
    console.error('Google Sheets sync error:', err);
    throw err;
  }
}
