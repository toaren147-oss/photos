// โค้ดใช้ร่วมกันระหว่างหน้า admin และหน้าลูกค้า
(function () {
  var CFG = window.TAOREN || {};
  var MODEL_URL = CFG.MODEL_URL || 'https://cdn.jsdelivr.net/gh/vladmandic/face-api@1.7.12/model/';
  var ready = null;

  function loadModels() {
    if (ready) return ready;
    ready = (async function () {
      if (typeof faceapi === 'undefined') throw new Error('โหลดไลบรารีจดจำใบหน้าไม่สำเร็จ (เช็คอินเทอร์เน็ต)');
      if (faceapi.tf && faceapi.tf.setBackend) {
        try { await faceapi.tf.setBackend('webgl'); } catch (e) { /* ใช้ backend สำรอง */ }
        await faceapi.tf.ready();
      }
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    })();
    ready.catch(function () { ready = null; });
    return ready;
  }

  async function detectAll(input, minConfidence) {
    var opts = new faceapi.SsdMobilenetv1Options({ minConfidence: minConfidence || 0.5 });
    return await faceapi.detectAllFaces(input, opts).withFaceLandmarks().withFaceDescriptors();
  }

  // แปลง descriptor 128 ค่า เป็น base64 ขนาดเล็ก (int8) เพื่อให้ไฟล์ดัชนีเบา
  function encode(d) {
    var s = '';
    for (var i = 0; i < 128; i++) {
      var v = Math.round(d[i] * 200);
      if (v > 127) v = 127; else if (v < -127) v = -127;
      s += String.fromCharCode(v & 255);
    }
    return btoa(s);
  }

  function decode(b64) {
    var bin = atob(b64);
    var out = new Float32Array(128);
    for (var i = 0; i < 128; i++) {
      var v = bin.charCodeAt(i);
      if (v > 127) v -= 256;
      out[i] = v / 200;
    }
    return out;
  }

  function distance(a, b) {
    var s = 0;
    for (var i = 0; i < 128; i++) { var d = a[i] - b[i]; s += d * d; }
    return Math.sqrt(s);
  }

  // วาดรูปลง canvas โดยย่อขนาดด้านยาวไม่เกิน maxEdge (0 = ขนาดเดิม)
  function toCanvas(src, maxEdge) {
    var w = src.width, h = src.height;
    var scale = maxEdge ? Math.min(1, maxEdge / Math.max(w, h)) : 1;
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * scale));
    c.height = Math.max(1, Math.round(h * scale));
    var ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, c.width, c.height);
    return c;
  }

  window.TaorenFace = { loadModels: loadModels, detectAll: detectAll, encode: encode, decode: decode, distance: distance, toCanvas: toCanvas };
})();
