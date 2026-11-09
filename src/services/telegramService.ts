export interface TelegramSendResult {
  success: boolean;
  message: string;
  timestamp: string;
}

export async function sendTelegramAlert(
  token: string,
  chatId: string,
  messageText: string
): Promise<TelegramSendResult> {
  const timestamp = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  // If token is missing or placeholder, simulate successful local dispatch with notification
  if (!token || token.trim() === '' || token.includes('AAFl-Hk9z2X8qM8-Lp9Vz_XjRk_A9yM2L')) {
    // Demo mode: Return successful dispatch
    await new Promise(r => setTimeout(r, 600));
    return {
      success: true,
      message: 'ส่งแจ้งเตือน Telegram (Demo Gateway) สำเร็จ: ' + messageText.slice(0, 60) + '...',
      timestamp
    };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.description || 'Telegram API request failed');
    }

    return {
      success: true,
      message: 'แจ้งเตือนผ่าน Telegram Bot Gateway เรียบร้อยแล้ว',
      timestamp
    };
  } catch (error: any) {
    console.warn('Telegram send failed:', error);
    // Still report gracefully so the UI doesn't crash
    return {
      success: false,
      message: error.message || 'ไม่สามารถเชื่อมต่อ Telegram API ได้',
      timestamp
    };
  }
}

export function formatCalibrationExpiringMessage(
  deviceName: string,
  assetId: string,
  department: string,
  daysRemaining: number
): string {
  if (daysRemaining <= 0) {
    return `🚨 <b>[MediCal CRITICAL ALERT] เครื่องมือหมดอายุสอบเทียบ!</b>\n\n` +
      `<b>อุปกรณ์:</b> ${deviceName}\n` +
      `<b>Asset ID:</b> ${assetId}\n` +
      `<b>แผนก/สถานที่:</b> ${department} (รพ.ดอนพุด)\n` +
      `<b>สถานะ:</b> EXPIRED / Out of Spec\n` +
      `<i>โปรดดำเนินการงดใช้ชั่วคราวและส่งสอบเทียบ IEC 62353 ทันที</i>`;
  }

  return `⚠️ <b>[MediCal Alert] ใกล้ถึงกำหนดสอบเทียบเครื่องมือแพทย์</b>\n\n` +
    `<b>อุปกรณ์:</b> ${deviceName}\n` +
    `<b>Asset ID:</b> ${assetId}\n` +
    `<b>แผนก:</b> ${department}\n` +
    `<b>กำหนดส่งตรวจใน:</b> ${daysRemaining} วัน\n` +
    `<i>กรุณานัดหมายช่างชีวการแพทย์หรือทีมบำรุงรักษา</i>`;
}
