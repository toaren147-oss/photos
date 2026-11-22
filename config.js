// แก้ไฟล์นี้ไฟล์เดียวหลังติดตั้ง Apps Script เสร็จ
window.TAOREN = {
  // วาง Web app URL จาก Apps Script (ลงท้ายด้วย /exec)
  API_URL: 'https://script.google.com/macros/s/AKfycbxIfVxifUGevgH7vQv97IASb3QX8cmsOXpzN0ySUFTXgTvKh8-aUnUMZyL-wvRhKVVE/exec',

  BRAND: 'TAOREN',

  // ค่าความเหมือนของใบหน้า (ยิ่งน้อยยิ่งเข้ม) 0.45 = เข้มขึ้น เหมาะกับหน้าคนเอเชีย
  MATCH_THRESHOLD: 0.45,
  // รูปที่ "อาจจะเป็นคุณ" (แสดงเมื่อลูกค้ากดเปิดเอง)
  MAYBE_THRESHOLD: 0.5,

  // ที่เก็บโมเดลจดจำใบหน้า (ไม่ต้องแก้)
  MODEL_URL: 'https://cdn.jsdelivr.net/gh/vladmandic/face-api@1.7.12/model/'
};
