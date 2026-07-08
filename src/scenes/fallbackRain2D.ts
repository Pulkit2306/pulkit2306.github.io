const CHARS =
  "アカサタナハマヤラワ0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function mountFallbackRain2D(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let w = 0;
  let h = 0;
  let drops: number[] = [];
  const fontSize = 16;

  function applyResize() {
    const newW = window.innerWidth;
    const newH = window.innerHeight;
    // Mobile browsers show/hide their address bar while scrolling, firing
    // resize events with only a height change — ignore those so the rain
    // doesn't reset mid-scroll. Only react to width changes or large height
    // jumps (orientation change, real window resize).
    if (w !== 0 && newW === w && Math.abs(newH - h) < 150) {
      return;
    }
    w = canvas.width = newW;
    h = canvas.height = newH;
    const columns = Math.floor(w / fontSize);
    drops = new Array(columns).fill(1);
  }

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyResize, 200);
  }
  window.addEventListener("resize", onResize);
  applyResize();

  function draw() {
    ctx!.fillStyle = "rgba(0,0,0,0.06)";
    ctx!.fillRect(0, 0, w, h);
    ctx!.fillStyle = "#00ff41";
    ctx!.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx!.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > h && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  let lastFrame = 0;
  let rafId: number;
  function loop(timestamp: number) {
    if (timestamp - lastFrame >= 40) {
      draw();
      lastFrame = timestamp;
    }
    rafId = requestAnimationFrame(loop);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      lastFrame = 0;
      rafId = requestAnimationFrame(loop);
    }
  }
  document.addEventListener("visibilitychange", onVisibilityChange);
  rafId = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(rafId);
    clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
