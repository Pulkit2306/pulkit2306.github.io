function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function looksLowEnd(): boolean {
  const cores = navigator.hardwareConcurrency ?? 4;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  return isCoarsePointer && cores <= 4;
}

export type RenderTier = "3d" | "2d";

export function decideRenderTier(): RenderTier {
  if (!hasWebGL() || prefersReducedMotion() || looksLowEnd()) {
    return "2d";
  }
  return "3d";
}
