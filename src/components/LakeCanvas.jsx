import { useRef, useEffect, useCallback } from 'react';

const FISH_COUNT = 8;
const WHALE_COUNT = 1;
const OCTOPUS_COUNT = 1;
const BUBBLE_COUNT = 15;
const RIPPLE_COUNT = 5;

function LakeCanvas() {
  const canvasRef = useRef(null);
  const fishRef = useRef([]);
  const whaleRef = useRef([]);
  const octopusRef = useRef([]);
  const bubblesRef = useRef([]);
  const ripplesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  const createFish = useCallback((width, height) => {
    const types = ['koi', 'catfish', 'bass', 'trout'];
    const type = types[Math.floor(Math.random() * types.length)];
    const direction = Math.random() > 0.5 ? 1 : -1;

    const configs = {
      koi: {
        bodyLength: Math.random() * 25 + 35,
        bodyHeight: Math.random() * 8 + 12,
        colors: [
          { base: '#FFFFFF', pattern: '#FF4500', patternType: 'spots' },
          { base: '#FF6B35', pattern: '#FFFFFF', patternType: 'spots' },
          { base: '#FFD700', pattern: '#FF6347', patternType: 'patches' },
        ],
        finSize: 0.25,
      },
      catfish: {
        bodyLength: Math.random() * 35 + 45,
        bodyHeight: Math.random() * 6 + 8,
        colors: [
          { base: '#4A6741', pattern: '#3D5636', patternType: 'gradient' },
          { base: '#5C7A52', pattern: '#4A6741', patternType: 'gradient' },
        ],
        finSize: 0.15,
        whiskers: true,
      },
      bass: {
        bodyLength: Math.random() * 20 + 30,
        bodyHeight: Math.random() * 10 + 14,
        colors: [
          { base: '#5B8C5A', pattern: '#3D6B3C', patternType: 'stripes' },
        ],
        finSize: 0.3,
      },
      trout: {
        bodyLength: Math.random() * 15 + 25,
        bodyHeight: Math.random() * 6 + 10,
        colors: [
          { base: '#C4A882', pattern: '#8B7355', patternType: 'spots' },
        ],
        finSize: 0.2,
      },
    };

    const config = configs[type];
    const colorSet = config.colors[Math.floor(Math.random() * config.colors.length)];

    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.4 + height * 0.25,
      vx: direction * (Math.random() * 0.6 + 0.3),
      vy: (Math.random() - 0.5) * 0.1,
      type,
      bodyLength: config.bodyLength,
      bodyHeight: config.bodyHeight,
      tailPhase: Math.random() * Math.PI * 2,
      tailSpeed: Math.random() * 0.08 + 0.05,
      baseColor: colorSet.base,
      patternColor: colorSet.pattern,
      patternType: colorSet.patternType,
      finSize: config.finSize,
      whiskers: config.whiskers || false,
      direction,
      wobble: Math.random() * 0.25 + 0.15,
      depth: Math.random() * 0.15 + 0.85,
      spots: Array.from({ length: Math.floor(Math.random() * 3 + 2) }, () => ({
        x: (Math.random() - 0.3) * 0.5,
        y: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 0.12 + 0.06,
      })),
    };
  }, []);

  const createWhale = useCallback((width, height) => {
    return {
      x: Math.random() * width,
      y: height * 0.7 + Math.random() * height * 0.15,
      vx: (Math.random() > 0.5 ? 1 : -1) * 0.3,
      vy: 0,
      size: Math.random() * 40 + 60,
      tailPhase: Math.random() * Math.PI * 2,
      tailSpeed: 0.03,
      direction: 1,
      blowPhase: 0,
      blowTimer: Math.random() * 300 + 200,
      depth: 0.6,
    };
  }, []);

  const createOctopus = useCallback((width, height) => {
    return {
      x: Math.random() * width,
      y: height * 0.75 + Math.random() * height * 0.1,
      vx: (Math.random() > 0.5 ? 1 : -1) * 0.4,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 15 + 20,
      tentaclePhase: Math.random() * Math.PI * 2,
      tentacleSpeed: 0.08,
      direction: 1,
      state: 'swimming',
      stateTimer: 0,
      inkParticles: [],
      camouflageLevel: 0,
      color: '#FF6B6B',
      depth: 0.7,
    };
  }, []);

  const createBubble = useCallback((width, height) => {
    return {
      x: Math.random() * width,
      y: height + Math.random() * 80,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 0.6 + 0.2,
      wobble: Math.random() * 2,
      opacity: Math.random() * 0.25 + 0.08,
    };
  }, []);

  const createRipple = useCallback((width, height) => {
    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.25 + height * 0.08,
      radius: 0,
      maxRadius: Math.random() * 25 + 12,
      speed: Math.random() * 0.3 + 0.15,
      opacity: Math.random() * 0.2 + 0.06,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    fishRef.current = Array.from({ length: FISH_COUNT }, () => createFish(width, height));
    whaleRef.current = Array.from({ length: WHALE_COUNT }, () => createWhale(width, height));
    octopusRef.current = Array.from({ length: OCTOPUS_COUNT }, () => createOctopus(width, height));
    bubblesRef.current = Array.from({ length: BUBBLE_COUNT }, () => createBubble(width, height));
    ripplesRef.current = Array.from({ length: RIPPLE_COUNT }, () => createRipple(width, height));

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function handleMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    function lightenColor(color, percent) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, (num >> 16) + amt);
      const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
      const B = Math.min(255, (num & 0x0000FF) + amt);
      return `rgb(${R},${G},${B})`;
    }

    function darkenColor(color, percent) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, (num >> 16) - amt);
      const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
      const B = Math.max(0, (num & 0x0000FF) - amt);
      return `rgb(${R},${G},${B})`;
    }

    function drawFish(fish, time) {
      const { x, y, bodyLength, bodyHeight, tailPhase, baseColor, patternColor, patternType, finSize, whiskers, direction, depth, spots, type } = fish;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(direction, 1);
      ctx.globalAlpha = depth;

      const tailWag = Math.sin(tailPhase) * bodyLength * 0.12;
      const bodyCurve = Math.sin(tailPhase * 0.5) * 1.5;

      const bodyGrad = ctx.createLinearGradient(0, -bodyHeight / 2, 0, bodyHeight / 2);
      bodyGrad.addColorStop(0, lightenColor(baseColor, 25));
      bodyGrad.addColorStop(0.3, baseColor);
      bodyGrad.addColorStop(0.7, baseColor);
      bodyGrad.addColorStop(1, darkenColor(baseColor, 15));

      ctx.beginPath();
      ctx.moveTo(-bodyLength * 0.4, 0);
      ctx.bezierCurveTo(
        -bodyLength * 0.3, -bodyHeight * 0.5 + bodyCurve,
        bodyLength * 0.1, -bodyHeight * 0.45 + bodyCurve,
        bodyLength * 0.35, -bodyHeight * 0.12
      );
      ctx.bezierCurveTo(
        bodyLength * 0.45, -bodyHeight * 0.04,
        bodyLength * 0.45, bodyHeight * 0.04,
        bodyLength * 0.35, bodyHeight * 0.12
      );
      ctx.bezierCurveTo(
        bodyLength * 0.1, bodyHeight * 0.45 + bodyCurve,
        -bodyLength * 0.3, bodyHeight * 0.5 + bodyCurve,
        -bodyLength * 0.4, 0
      );
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      ctx.save();
      ctx.clip();

      if (patternType === 'spots') {
        spots.forEach((spot) => {
          ctx.beginPath();
          ctx.ellipse(spot.x * bodyLength, spot.y * bodyHeight, spot.size * bodyLength, spot.size * bodyLength * 0.7, 0, 0, Math.PI * 2);
          ctx.fillStyle = patternColor;
          ctx.globalAlpha = depth * 0.6;
          ctx.fill();
          ctx.globalAlpha = depth;
        });
      } else if (patternType === 'stripes') {
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          const stripeX = -bodyLength * 0.15 + i * bodyLength * 0.1;
          ctx.moveTo(stripeX, -bodyHeight * 0.45);
          ctx.quadraticCurveTo(stripeX + 2, 0, stripeX, bodyHeight * 0.45);
          ctx.strokeStyle = patternColor;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = depth * 0.35;
          ctx.stroke();
          ctx.globalAlpha = depth;
        }
      }

      const scaleGrad = ctx.createLinearGradient(0, -bodyHeight * 0.25, 0, bodyHeight * 0.25);
      scaleGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
      scaleGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
      scaleGrad.addColorStop(1, 'rgba(0,0,0,0.08)');
      ctx.fillStyle = scaleGrad;
      ctx.fillRect(-bodyLength * 0.5, -bodyHeight * 0.55, bodyLength, bodyHeight * 1.1);

      ctx.restore();

      const tailGrad = ctx.createLinearGradient(-bodyLength * 0.35, 0, -bodyLength * 0.6, 0);
      tailGrad.addColorStop(0, baseColor);
      tailGrad.addColorStop(1, patternColor);

      ctx.beginPath();
      ctx.moveTo(-bodyLength * 0.3, 0);
      ctx.quadraticCurveTo(-bodyLength * 0.5, tailWag * 0.4 - bodyHeight * 0.15, -bodyLength * 0.65, tailWag - bodyHeight * 0.1);
      ctx.quadraticCurveTo(-bodyLength * 0.55, tailWag, -bodyLength * 0.65, tailWag + bodyHeight * 0.1);
      ctx.quadraticCurveTo(-bodyLength * 0.5, tailWag * 0.4 + bodyHeight * 0.15, -bodyLength * 0.3, 0);
      ctx.fillStyle = tailGrad;
      ctx.globalAlpha = depth * 0.8;
      ctx.fill();
      ctx.globalAlpha = depth;

      const dorsalGrad = ctx.createLinearGradient(0, -bodyHeight * 0.4, 0, -bodyHeight * 0.15);
      dorsalGrad.addColorStop(0, patternColor);
      dorsalGrad.addColorStop(1, baseColor);

      ctx.beginPath();
      ctx.moveTo(-bodyLength * 0.08, -bodyHeight * 0.3);
      ctx.quadraticCurveTo(bodyLength * 0.04, -bodyHeight * (0.45 + finSize * 0.5), bodyLength * 0.12, -bodyHeight * 0.25);
      ctx.quadraticCurveTo(bodyLength * 0.04, -bodyHeight * 0.2, -bodyLength * 0.08, -bodyHeight * 0.3);
      ctx.fillStyle = dorsalGrad;
      ctx.globalAlpha = depth * 0.7;
      ctx.fill();
      ctx.globalAlpha = depth;

      if (whiskers) {
        for (let i = 0; i < 4; i++) {
          const startX = bodyLength * 0.3 + i * 1.5;
          const startY = (i - 1.5) * 1.5;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(startX + bodyLength * 0.12, startY + Math.sin(time + i) * 1.5, startX + bodyLength * 0.25, startY + Math.sin(time * 1.2 + i) * 3);
          ctx.strokeStyle = darkenColor(baseColor, 25);
          ctx.lineWidth = 1;
          ctx.globalAlpha = depth * 0.5;
          ctx.stroke();
          ctx.globalAlpha = depth;
        }
      }

      const eyeX = bodyLength * 0.25;
      const eyeY = -bodyHeight * 0.06;
      const eyeRadius = bodyHeight * 0.1;

      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#111';
      ctx.globalAlpha = depth;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(eyeX + eyeRadius * 0.15, eyeY - eyeRadius * 0.15, eyeRadius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      ctx.restore();
    }

    function drawWhale(whale, time) {
      const { x, y, size, tailPhase, direction, depth, blowPhase } = whale;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(direction, 1);
      ctx.globalAlpha = depth;

      const bodyGrad = ctx.createLinearGradient(0, -size * 0.3, 0, size * 0.3);
      bodyGrad.addColorStop(0, '#4A90D9');
      bodyGrad.addColorStop(0.4, '#3A7BC8');
      bodyGrad.addColorStop(0.7, '#2E6AB0');
      bodyGrad.addColorStop(1, '#1E4A80');

      ctx.beginPath();
      ctx.moveTo(-size * 0.5, 0);
      ctx.bezierCurveTo(
        -size * 0.4, -size * 0.35,
        size * 0.1, -size * 0.4,
        size * 0.4, -size * 0.15
      );
      ctx.bezierCurveTo(
        size * 0.5, -size * 0.05,
        size * 0.5, size * 0.05,
        size * 0.4, size * 0.15
      );
      ctx.bezierCurveTo(
        size * 0.1, size * 0.35,
        -size * 0.4, size * 0.3,
        -size * 0.5, 0
      );
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      const bellyGrad = ctx.createLinearGradient(0, size * 0.1, 0, size * 0.35);
      bellyGrad.addColorStop(0, 'rgba(200,220,240,0.3)');
      bellyGrad.addColorStop(1, 'rgba(200,220,240,0)');
      ctx.fillStyle = bellyGrad;
      ctx.beginPath();
      ctx.ellipse(0, size * 0.15, size * 0.35, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      const tailWag = Math.sin(tailPhase) * size * 0.08;
      ctx.beginPath();
      ctx.moveTo(-size * 0.45, 0);
      ctx.quadraticCurveTo(-size * 0.6, tailWag - size * 0.1, -size * 0.75, tailWag - size * 0.05);
      ctx.quadraticCurveTo(-size * 0.65, tailWag, -size * 0.75, tailWag + size * 0.05);
      ctx.quadraticCurveTo(-size * 0.6, tailWag + size * 0.1, -size * 0.45, 0);
      ctx.fillStyle = '#2E6AB0';
      ctx.globalAlpha = depth * 0.85;
      ctx.fill();
      ctx.globalAlpha = depth;

      ctx.beginPath();
      ctx.moveTo(-size * 0.1, -size * 0.3);
      ctx.quadraticCurveTo(size * 0.05, -size * 0.5, size * 0.15, -size * 0.35);
      ctx.quadraticCurveTo(size * 0.05, -size * 0.2, -size * 0.1, -size * 0.3);
      ctx.fillStyle = '#3A7BC8';
      ctx.globalAlpha = depth * 0.7;
      ctx.fill();
      ctx.globalAlpha = depth;

      ctx.beginPath();
      ctx.arc(size * 0.25, -size * 0.08, size * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = '#111';
      ctx.globalAlpha = depth;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(size * 0.26, -size * 0.09, size * 0.015, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      if (blowPhase > 0) {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI - Math.PI / 2;
          const dist = blowPhase * 2;
          const bx = size * 0.35 + Math.cos(angle) * dist;
          const by = -size * 0.35 + Math.sin(angle) * dist * 1.5;
          const br = 3 + blowPhase * 0.3;

          ctx.beginPath();
          ctx.arc(bx, by, br, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 230, 255, ${0.6 - blowPhase * 0.02})`;
          ctx.fill();
        }
      }

      ctx.restore();
    }

    function drawOctopus(octopus, time) {
      const { x, y, size, tentaclePhase, direction, state, inkParticles, camouflageLevel, color, depth } = octopus;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(direction, 1);
      ctx.globalAlpha = depth * (1 - camouflageLevel * 0.7);

      const r = Math.min(255, parseInt(color.slice(1, 3), 16));
      const g = Math.min(255, parseInt(color.slice(3, 5), 16));
      const b = Math.min(255, parseInt(color.slice(5, 7), 16));

      const bodyColor = state === 'camouflage'
        ? `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 30)})`
        : color;

      const bodyGrad = ctx.createRadialGradient(0, -size * 0.2, 0, 0, 0, size * 0.5);
      bodyGrad.addColorStop(0, lightenColor(bodyColor, 20));
      bodyGrad.addColorStop(0.5, bodyColor);
      bodyGrad.addColorStop(1, darkenColor(bodyColor, 20));

      ctx.beginPath();
      ctx.ellipse(0, -size * 0.15, size * 0.35, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const tentacleWag = Math.sin(tentaclePhase + i * 0.8) * size * 0.15;
        const tentacleLength = size * (0.6 + Math.sin(tentaclePhase * 0.5 + i) * 0.1);

        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * size * 0.2, -size * 0.15 + Math.sin(angle) * size * 0.15);

        const cp1x = Math.cos(angle) * size * 0.4 + tentacleWag * 0.5;
        const cp1y = -size * 0.15 + Math.sin(angle) * size * 0.3 + tentacleLength * 0.3;
        const cp2x = Math.cos(angle) * size * 0.5 + tentacleWag;
        const cp2y = -size * 0.15 + Math.sin(angle) * size * 0.4 + tentacleLength * 0.7;
        const endX = Math.cos(angle) * size * 0.45 + tentacleWag * 1.2;
        const endY = -size * 0.15 + Math.sin(angle) * size * 0.35 + tentacleLength;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = size * 0.12;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(endX, endY, size * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = darkenColor(bodyColor, 15);
        ctx.fill();
      }

      const eyeY = -size * 0.2;
      const eyeSpacing = size * 0.12;

      ctx.beginPath();
      ctx.arc(-eyeSpacing, eyeY, size * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-eyeSpacing, eyeY, size * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = '#111';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(eyeSpacing, eyeY, size * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(eyeSpacing, eyeY, size * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = '#111';
      ctx.fill();

      ctx.restore();

      if (inkParticles.length > 0) {
        ctx.save();
        inkParticles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(20, 20, 30, ${p.opacity})`;
          ctx.fill();
        });
        ctx.restore();
      }
    }

    function drawBubble(bubble) {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 230, 255, ${bubble.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.4})`;
      ctx.fill();
    }

    function drawRipple(ripple) {
      if (ripple.radius > 0) {
        ctx.beginPath();
        ctx.ellipse(ripple.x, ripple.y, ripple.radius, ripple.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 230, 255, ${ripple.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    function drawWaterSurface(time) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height * 0.08);
      gradient.addColorStop(0, 'rgba(200, 240, 220, 0.18)');
      gradient.addColorStop(1, 'rgba(200, 240, 220, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height * 0.08);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= width; x += 5) {
        const y = Math.sin(x * 0.005 + time * 0.25) * 2.5 + Math.sin(x * 0.01 + time * 0.18) * 1.5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height * 0.05);
      ctx.lineTo(0, height * 0.05);
      ctx.closePath();
      ctx.fillStyle = 'rgba(200, 240, 220, 0.08)';
      ctx.fill();
    }

    function drawLightRays(time) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < 4; i++) {
        const x = (width / 4) * i + Math.sin(time * 0.08 + i) * 25;
        const gradient = ctx.createLinearGradient(x, 0, x + 80, height);
        gradient.addColorStop(0, 'rgba(255, 255, 220, 0.025)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 220, 0.008)');
        gradient.addColorStop(1, 'rgba(255, 255, 220, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 60, 0);
        ctx.lineTo(x + 180, height);
        ctx.lineTo(x + 50, height);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    function drawAquaticPlants(time) {
      const plantPositions = [
        { x: width * 0.02, height: 50 },
        { x: width * 0.06, height: 38 },
        { x: width * 0.94, height: 45 },
        { x: width * 0.98, height: 55 },
      ];

      plantPositions.forEach((plant, idx) => {
        ctx.save();
        ctx.translate(plant.x, height);

        for (let i = 0; i < 3; i++) {
          const sway = Math.sin(time * 0.35 + idx + i * 0.5) * 10;
          const plantHeight = plant.height + i * 10;

          ctx.beginPath();
          ctx.moveTo(i * 5 - 6, 0);
          ctx.quadraticCurveTo(i * 5 - 6 + sway * 0.3, -plantHeight * 0.5, i * 5 - 6 + sway, -plantHeight);
          ctx.quadraticCurveTo(i * 5 - 6 + sway * 0.3 + 3, -plantHeight * 0.5, i * 5 - 3, 0);
          ctx.closePath();

          const green = 90 + i * 12;
          ctx.fillStyle = `rgba(20, ${green}, 30, 0.45)`;
          ctx.fill();
        }

        ctx.restore();
      });
    }

    function animate() {
      timeRef.current += 0.016;
      const time = timeRef.current;

      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#87CEEB');
      bgGradient.addColorStop(0.2, '#6BB8D6');
      bgGradient.addColorStop(0.45, '#4A9EBF');
      bgGradient.addColorStop(0.7, '#3D8BA8');
      bgGradient.addColorStop(1, '#2D7A94');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      drawLightRays(time);
      drawWaterSurface(time);
      drawAquaticPlants(time);

      ripplesRef.current.forEach((ripple) => {
        ripple.radius += ripple.speed;
        if (ripple.radius > ripple.maxRadius) {
          ripple.radius = 0;
          ripple.x = Math.random() * width;
          ripple.y = Math.random() * height * 0.25 + height * 0.08;
        }
        drawRipple(ripple);
      });

      bubblesRef.current.forEach((bubble) => {
        bubble.y -= bubble.speed;
        bubble.x += Math.sin(time * 1.2 + bubble.wobble) * 0.25;

        if (bubble.y < -10) {
          bubble.y = height + 10;
          bubble.x = Math.random() * width;
        }

        drawBubble(bubble);
      });

      fishRef.current.forEach((fish) => {
        const dx = mouseRef.current.x - fish.x;
        const dy = mouseRef.current.y - fish.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const force = (120 - dist) / 120;
          fish.vx -= (dx / dist) * force * 0.25;
          fish.vy -= (dy / dist) * force * 0.15;
        }

        fish.vx += (Math.random() - 0.5) * 0.02;
        fish.vy += (Math.random() - 0.5) * 0.008;

        const maxSpeed = fish.type === 'catfish' ? 1 : 1.8;
        fish.vx = Math.max(-maxSpeed, Math.min(maxSpeed, fish.vx));
        fish.vy = Math.max(-0.5, Math.min(0.5, fish.vy));

        if (Math.abs(fish.vx) > 0.04) {
          fish.direction = fish.vx > 0 ? 1 : -1;
        }

        fish.x += fish.vx;
        fish.y += fish.vy + Math.sin(time * fish.wobble + fish.tailPhase) * 0.08;
        fish.tailPhase += fish.tailSpeed;

        if (fish.x < -60) fish.x = width + 60;
        if (fish.x > width + 60) fish.x = -60;
        if (fish.y < height * 0.1) fish.y = height * 0.1;
        if (fish.y > height * 0.8) fish.y = height * 0.8;

        drawFish(fish, time);
      });

      whaleRef.current.forEach((whale) => {
        whale.x += whale.vx;
        whale.tailPhase += whale.tailSpeed;
        whale.blowTimer--;

        if (whale.blowTimer <= 0) {
          whale.blowPhase = 1;
          whale.blowTimer = Math.random() * 400 + 300;
        }

        if (whale.blowPhase > 0) {
          whale.blowPhase -= 0.02;
        }

        if (whale.x < -150) whale.x = width + 150;
        if (whale.x > width + 150) whale.x = -150;

        if (Math.abs(whale.vx) > 0.01) {
          whale.direction = whale.vx > 0 ? 1 : -1;
        }

        drawWhale(whale, time);
      });

      octopusRef.current.forEach((octopus) => {
        octopus.stateTimer++;

        const dx = mouseRef.current.x - octopus.x;
        const dy = mouseRef.current.y - octopus.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100 && octopus.state === 'swimming') {
          octopus.state = 'ink';
          octopus.stateTimer = 0;

          for (let i = 0; i < 20; i++) {
            octopus.inkParticles.push({
              x: octopus.x,
              y: octopus.y,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              radius: Math.random() * 8 + 4,
              opacity: 0.8,
            });
          }
        }

        if (octopus.state === 'ink' && octopus.stateTimer > 60) {
          octopus.state = 'camouflage';
          octopus.stateTimer = 0;
        }

        if (octopus.state === 'camouflage' && octopus.stateTimer > 120) {
          octopus.state = 'swimming';
          octopus.stateTimer = 0;
          octopus.camouflageLevel = 0;
        }

        if (octopus.state === 'camouflage') {
          octopus.camouflageLevel = Math.min(1, octopus.camouflageLevel + 0.02);
        }

        if (octopus.state === 'swimming') {
          octopus.vx += (Math.random() - 0.5) * 0.03;
          octopus.vy += (Math.random() - 0.5) * 0.02;
          octopus.vx = Math.max(-0.8, Math.min(0.8, octopus.vx));
          octopus.vy = Math.max(-0.4, Math.min(0.4, octopus.vy));

          if (Math.abs(octopus.vx) > 0.02) {
            octopus.direction = octopus.vx > 0 ? 1 : -1;
          }
        }

        octopus.x += octopus.vx;
        octopus.y += octopus.vy;
        octopus.tentaclePhase += octopus.tentacleSpeed;

        if (octopus.x < -50) octopus.x = width + 50;
        if (octopus.x > width + 50) octopus.x = -50;
        if (octopus.y < height * 0.5) octopus.y = height * 0.5;
        if (octopus.y > height * 0.9) octopus.y = height * 0.9;

        octopus.inkParticles = octopus.inkParticles.filter((p) => p.opacity > 0);
        octopus.inkParticles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.radius += 0.3;
          p.opacity -= 0.015;
        });

        drawOctopus(octopus, time);
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [createFish, createWhale, createOctopus, createBubble, createRipple]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default LakeCanvas;
