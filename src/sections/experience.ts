export function renderExperience(): string {
  return `
    <section id="experience">
      <div class="panel">
        <h2>&gt; experience</h2>
        <p class="body-text exp-note">
          I'm early in my career and actively looking for my first full-time Software Engineer role.
        </p>
        <div class="exp-entry">
          <div class="exp-header">
            <h3>Web Developer</h3>
            <span class="exp-dates">Jun 2026 &ndash; Present</span>
          </div>
          <div class="exp-company">
            John Molson MBA International Case Competition, Concordia University &middot;
            <a href="https://mbacasecomp.com" target="_blank" rel="noopener">mbacasecomp.com &rarr;</a>
          </div>
          <ul class="exp-bullets">
            <li>Shipped a fully responsive production website for the world's oldest MBA case competition (45 editions, 30+ schools across 5 continents).</li>
            <li>Architected a CMS-driven data layer across multiple collections, eliminating manual updates for recurring content.</li>
            <li>Engineered bilingual EN/FR UI and data-driven dynamic styling.</li>
            <li>Directed a full content audit against source data, resolving discrepancies through direct coordination with competition leadership.</li>
          </ul>
        </div>
        <div class="exp-entry">
          <div class="exp-header">
            <h3>Full Stack Developer Intern</h3>
            <span class="exp-dates">Jan 2024 &ndash; Jun 2024</span>
          </div>
          <div class="exp-company">Tech Mahindra COE, India</div>
          <ul class="exp-bullets">
            <li>Shipped RESTful APIs (Spring Boot/Python microservices) improving throughput by 20%; applied OOP design patterns (strategy, repository, factory) across a large Java codebase.</li>
            <li>Automated CI/CD with GitHub Actions + Docker, cutting deployment time by 40%; led code reviews resolving 30+ critical issues in Agile sprints.</li>
            <li>Implemented test suites across features using Selenium and Mockito, and designed database schemas in Oracle.</li>
          </ul>
        </div>
      </div>
    </section>
  `;
}
