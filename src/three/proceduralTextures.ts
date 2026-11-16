import * as THREE from 'three';

function applyAnisotropy(tex: THREE.CanvasTexture, maxAniso: number, isColor: boolean): THREE.CanvasTexture {
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = Math.min(8, Math.max(1, maxAniso));
  tex.needsUpdate = true;
  return tex;
}

export function createRangoliFloorTexture(maxAniso: number): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size / 2;

  const bg = ctx.createRadialGradient(cx, cy, 40, cx, cy, 520);
  bg.addColorStop(0, '#fcf7ec');
  bg.addColorStop(0.62, '#f1e3c8');
  bg.addColorStop(1, '#dcc8a4');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1800; i++) {
    const x = (i * 7919) % size;
    const y = (i * 6271) % size;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(130,108,74,0.06)' : 'rgba(255,255,255,0.22)';
    ctx.fillRect(x, y, 2, 2);
  }

  const ringRadii = [448, 412, 340, 245, 152];
  const ringColors = ['#8b261d', '#d97706', '#eab308', '#967332', '#8b261d'];
  ringRadii.forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = ringColors[idx];
    ctx.lineWidth = idx === 0 ? 7 : 4;
    ctx.stroke();
  });

  const petals = 16;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, -342);
    ctx.quadraticCurveTo(40, -390, 0, -442);
    ctx.quadraticCurveTo(-40, -390, 0, -342);
    ctx.fillStyle = i % 2 === 0 ? '#e07a16' : '#8b261d';
    ctx.fill();
    ctx.strokeStyle = '#faf7f0';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -392, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#faf7f0';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -158);
    ctx.quadraticCurveTo(28, -205, 0, -238);
    ctx.quadraticCurveTo(-28, -205, 0, -158);
    ctx.fillStyle = i % 2 === 0 ? '#eab308' : '#d97706';
    ctx.fill();

    ctx.restore();
  }

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.quadraticCurveTo(28, -94, 0, -144);
    ctx.quadraticCurveTo(-28, -94, 0, -40);
    ctx.fillStyle = i % 2 === 0 ? '#8b261d' : '#d97706';
    ctx.fill();
    ctx.strokeStyle = '#f6e7c1';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 44, 0, Math.PI * 2);
  ctx.fillStyle = '#b4832c';
  ctx.fill();
  ctx.strokeStyle = '#faf7f0';
  ctx.lineWidth = 4;
  ctx.stroke();

  return applyAnisotropy(new THREE.CanvasTexture(canvas), maxAniso, true);
}

export function createAntarpatClothTexture(maxAniso: number): THREE.CanvasTexture {
  const width = 1024;
  const height = 640;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#7c1d16');
  grad.addColorStop(0.5, '#99271e');
  grad.addColorStop(1, '#6f1811');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(235, 198, 120, 0.16)';
  ctx.lineWidth = 2;
  for (let y = 12; y < height; y += 10) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#d4af5a';
  ctx.lineWidth = 26;
  ctx.strokeRect(22, 22, width - 44, height - 44);
  ctx.strokeStyle = '#f4de9c';
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, width - 88, height - 88);

  const corners = [
    [94, 94],
    [width - 94, 94],
    [94, height - 94],
    [width - 94, height - 94],
  ];
  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af5a';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#8b261d';
    ctx.fill();
  });

  const cx = width / 2;
  const cy = height / 2 - 18;
  ctx.beginPath();
  ctx.arc(cx, cy, 118, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(250, 240, 210, 0.14)';
  ctx.fill();
  ctx.strokeStyle = '#e6c36d';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 98, 0, Math.PI * 2);
  ctx.strokeStyle = '#f5dea2';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = '#f8e4a8';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  const r = 42;
  ctx.beginPath();
  ctx.moveTo(cx - r, cy);
  ctx.lineTo(cx + r, cy);
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx, cy + r);
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy - r);
  ctx.moveTo(cx + r, cy);
  ctx.lineTo(cx + r, cy + r);
  ctx.moveTo(cx, cy + r);
  ctx.lineTo(cx - r, cy + r);
  ctx.moveTo(cx - r, cy);
  ctx.lineTo(cx - r, cy - r);
  ctx.stroke();

  [
    [-20, -20],
    [20, -20],
    [-20, 20],
    [20, 20],
  ].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(cx + dx, cy + dy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f8e4a8';
    ctx.fill();
  });

  ctx.fillStyle = '#fae7b4';
  ctx.textAlign = 'center';
  ctx.font = '600 38px Georgia, serif';
  ctx.fillText('॥ शुभमंगल सावधान ॥', cx, cy + 165);
  ctx.font = 'italic 28px Georgia, serif';
  ctx.fillStyle = '#f0d28b';
  ctx.fillText('Vinayak  &  Ruchi', cx, cy + 208);

  return applyAnisotropy(new THREE.CanvasTexture(canvas), maxAniso, true);
}

export function createRosewoodGrainTexture(maxAniso: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#4e271b';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 64; i++) {
    const x = (i / 64) * size;
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(32, 14, 8, 0.38)' : 'rgba(112, 62, 42, 0.22)';
    ctx.lineWidth = 2 + (i % 4);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 8, size * 0.35, x - 8, size * 0.65, x, size);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 3);
  return applyAnisotropy(tex, maxAniso, true);
}

export function createBrassHammerBumpTexture(maxAniso: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 420; i++) {
    const x = (i * 97) % size;
    const y = (i * 151) % size;
    const radius = 5 + (i % 7);
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, 'rgba(215, 215, 215, 0.35)');
    g.addColorStop(1, 'rgba(90, 90, 90, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return applyAnisotropy(tex, maxAniso, false);
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const g = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  g.addColorStop(0, 'rgba(31, 20, 12, 0.45)');
  g.addColorStop(0.55, 'rgba(31, 20, 12, 0.16)');
  g.addColorStop(1, 'rgba(31, 20, 12, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
