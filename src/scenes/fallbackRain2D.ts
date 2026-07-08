const CHARS =
  "アカサタナハマヤラワ0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function mountFallbackRain2D(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let w: number, h: number, drops: number[];
  const fontSize = 16;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const columns = Math.floor(w / fontSize);
    drops = new Array(columns).fill(1);
  }
  window.addEventListener("resize", resize);
  resize();

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
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
