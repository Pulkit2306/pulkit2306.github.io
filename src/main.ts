import "./style.css";
import { decideRenderTier } from "./utils/capabilities";
import { mountFallbackRain2D } from "./scenes/fallbackRain2D";
import { renderHero } from "./sections/hero";
import { renderAbout } from "./sections/about";
import { renderExperience } from "./sections/experience";
import { renderProjects, initProjectTilt } from "./sections/projects";
import { renderResume } from "./sections/resume";
import { renderContact } from "./sections/contact";

const app = document.getElementById("app")!;

app.innerHTML = `
  <canvas id="rain"></canvas>
  <nav class="sitenav">
    <a href="#hero">home</a>
    <a href="#about">about</a>
    <a href="#experience">experience</a>
    <a href="#projects">projects</a>
    <a href="#resume">resume</a>
    <a href="#contact">contact</a>
  </nav>
  <div class="site">
    ${renderHero()}
    ${renderAbout()}
    ${renderExperience()}
    ${renderProjects()}
    ${renderResume()}
    ${renderContact()}
  </div>
  <footer>built with <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> &amp; <a href="https://threejs.org/" target="_blank" rel="noopener">Three.js</a></footer>
`;

initProjectTilt();

const canvas = document.getElementById("rain") as HTMLCanvasElement;
const tier = decideRenderTier();

if (tier === "3d") {
  import("./scenes/matrixRain3D")
    .then(({ mountMatrixRain3D }) => {
      try {
        mountMatrixRain3D(canvas);
      } catch (err) {
        console.error("3D scene failed, falling back to 2D rain", err);
        mountFallbackRain2D(canvas);
      }
    })
    .catch((err) => {
      console.error("Failed to load 3D scene, falling back to 2D rain", err);
      mountFallbackRain2D(canvas);
    });
} else {
  mountFallbackRain2D(canvas);
}
