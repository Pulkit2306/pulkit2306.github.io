import { projects } from "../data/projects";

export function renderProjects(): string {
  const cards = projects
    .map(
      (p) => `
        <div class="project-card">
          <img class="project-thumb" src="${p.image}" alt="${p.name} screenshot" loading="lazy" width="960" height="434">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="tags">
            ${p.tags.map((t) => `<span>${t}</span>`).join("")}
          </div>
          <div class="project-links">
            <a href="${p.demoLink}" target="_blank" rel="noopener">live demo &rarr;</a>
            <a href="${p.repoLink}" target="_blank" rel="noopener">source code &rarr;</a>
          </div>
        </div>
      `
    )
    .join("");

  return `
    <section id="projects">
      <h2>&gt; projects</h2>
      <div class="projects-grid">
        ${cards}
      </div>
    </section>
  `;
}

export function initProjectTilt(): void {
  document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -8;
      const rotateY = ((x - rect.width / 2) / rect.width) * 8;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
}
