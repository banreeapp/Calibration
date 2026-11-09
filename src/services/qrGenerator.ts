import QRCode from 'qrcode';
import { MedicalDevice } from '../types/medical';

export interface QRCodeGenerateOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

/**
 * Generate standard QR Code as a base64 Data URL using the 'qrcode' library
 */
export async function generateDeviceQRCodeDataURL(
  device: MedicalDevice,
  assetUrl: string,
  options?: QRCodeGenerateOptions
): Promise<string> {
  const payload = JSON.stringify({
    assetId: device.id,
    name: device.name,
    model: device.model,
    serialNumber: device.serialNumber,
    facility: device.facilityName,
    department: device.department,
    status: device.status,
    nextCalib: device.nextCalibDate,
    standard: device.safetyStandard,
    url: assetUrl
  });

  return QRCode.toDataURL(payload, {
    width: options?.width || 360,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.darkColor || '#000000',
      light: options?.lightColor || '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });
}

/**
 * Generate a standalone QR code Data URL containing just the direct Asset URL
 */
export async function generateAssetUrlQRCodeDataURL(
  assetUrl: string,
  options?: QRCodeGenerateOptions
): Promise<string> {
  return QRCode.toDataURL(assetUrl, {
    width: options?.width || 360,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.darkColor || '#000000',
      light: options?.lightColor || '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });
}

/**
 * Generate a complete, high-resolution Clinical Asset Label Sticker PNG
 * featuring the QR Code, Device ID, Asset URL, and Equipment Specifications.
 */
export async function generateDownloadableAssetTagPNG(
  device: MedicalDevice,
  assetUrl: string,
  styleTheme: 'medical-dark' | 'clinical-white' = 'medical-dark'
): Promise<string> {
  // Generate high-res QR code data URL first
  const qrDataUrl = await QRCode.toDataURL(assetUrl, {
    width: 240,
    margin: 1,
    color: styleTheme === 'medical-dark' 
      ? { dark: '#002020', light: '#ffffff' }
      : { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'H'
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');

  // Standard clinical equipment tag dimensions (width 700px, height 380px)
  canvas.width = 700;
  canvas.height = 380;

  // Background
  if (styleTheme === 'medical-dark') {
    // Deep dark medical-tech gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 700, 380);
    bgGrad.addColorStop(0, '#0e1515');
    bgGrad.addColorStop(1, '#161d1d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 700, 380);

    // Border
    ctx.strokeStyle = '#47eaed';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 692, 372);

    // Top Brand Banner
    ctx.fillStyle = '#005354';
    ctx.fillRect(4, 4, 692, 54);

    ctx.fillStyle = '#47eaed';
    ctx.font = 'bold 20px "Manrope", sans-serif';
    ctx.fillText('โรงพยาบาลดอนพุด • เครือข่ายบริการสุขภาพอำเภอดอนพุด', 24, 38);

    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#dde4e3';
    ctx.fillText('DON PHUT HEALTH NETWORK', 500, 37);
  } else {
    // Clean clinical white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 700, 380);

    ctx.strokeStyle = '#005354';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 692, 372);

    ctx.fillStyle = '#00ced1';
    ctx.fillRect(4, 4, 692, 54);

    ctx.fillStyle = '#002020';
    ctx.font = 'bold 20px "Manrope", sans-serif';
    ctx.fillText('โรงพยาบาลดอนพุด • เครือข่ายบริการสุขภาพอำเภอดอนพุด', 24, 38);

    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#002020';
    ctx.fillText('DON PHUT HEALTH NETWORK', 500, 37);
  }

  // Draw QR Code image onto canvas
  const qrImage = new Image();
  await new Promise((resolve, reject) => {
    qrImage.onload = resolve;
    qrImage.onerror = reject;
    qrImage.src = qrDataUrl;
  });

  // White backing for QR code
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(460, 80, 210, 210, [12]);
  ctx.fill();
  ctx.drawImage(qrImage, 470, 90, 190, 190);

  // QR Code Subtitle
  ctx.fillStyle = styleTheme === 'medical-dark' ? '#bac9c9' : '#555555';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN TO VERIFY CALIBRATION', 565, 305);
  ctx.textAlign = 'left';

  // Left Section Details
  // Device ID Badge
  ctx.fillStyle = styleTheme === 'medical-dark' ? '#47eaed' : '#005354';
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillText(device.id, 28, 106);

  // Status Badge
  const statusX = 28 + ctx.measureText(device.id).width + 16;
  ctx.fillStyle = device.status === 'Optimal' ? '#34A853' : device.status === 'Due Soon' ? '#4bc5ff' : '#ffb4ab';
  ctx.beginPath();
  ctx.roundRect(statusX, 86, 110, 26, [13]);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText(device.status.toUpperCase(), statusX + 16, 103);

  // Device Name
  ctx.fillStyle = styleTheme === 'medical-dark' ? '#dde4e3' : '#111111';
  ctx.font = 'bold 19px "Manrope", sans-serif';
  ctx.fillText(device.name, 28, 142);

  // Thai Name
  ctx.fillStyle = styleTheme === 'medical-dark' ? '#bac9c9' : '#444444';
  ctx.font = '14px "Sarabun", sans-serif';
  ctx.fillText(device.nameTh, 28, 168);

  // Specification Details Grid
  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillStyle = styleTheme === 'medical-dark' ? '#47eaed' : '#005354';
  ctx.fillText(`MODEL: ${device.model}`, 28, 202);
  ctx.fillText(`SERIAL NO: ${device.serialNumber}`, 28, 226);

  ctx.fillStyle = styleTheme === 'medical-dark' ? '#dde4e3' : '#222222';
  ctx.fillText(`DEPT: ${device.department}`, 28, 250);
  ctx.fillText(`FACILITY: ${device.facilityName}`, 28, 274);

  // Next Calibration / Standards
  ctx.fillStyle = styleTheme === 'medical-dark' ? '#4bc5ff' : '#00696b';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.fillText(`NEXT CALIB DUE: ${device.nextCalibDate} (${device.safetyStandard})`, 28, 302);

  // Bottom Footer Bar (Asset URL + Digital Signature)
  ctx.fillStyle = styleTheme === 'medical-dark' ? 'rgba(255,255,255,0.06)' : '#f0f0f0';
  ctx.fillRect(4, 326, 692, 50);

  ctx.fillStyle = styleTheme === 'medical-dark' ? '#bac9c9' : '#333333';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillText(`ASSET URL: ${assetUrl}`, 24, 354);

  ctx.fillStyle = styleTheme === 'medical-dark' ? '#47eaed' : '#005354';
  ctx.textAlign = 'right';
  ctx.fillText('IEC 62353 & ISO 13485 CERTIFIED', 676, 354);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

/**
 * Trigger immediate browser download of the generated PNG file
 */
export function downloadPNGDataURL(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
