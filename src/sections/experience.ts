export function renderExperience(): string {
  return `
    <section id="experience">
      <div class="panel">
        <h2>&gt; experience</h2>
        <p class="body-text exp-note">
          One professional internship to date — nothing else yet. I'm early in my career
          and actively looking for my first full-time Software Engineer role.
        </p>
        <div class="exp-entry">
          <div class="exp-header">
            <h3>Full Stack Developer Intern</h3>
            <span class="exp-dates">Jan 2024 &ndash; Jun 2024</span>
          </div>
          <div class="exp-company">Tech Mahindra COE, India</div>
          <ul class="exp-bullets">
            <li>Shipped RESTful APIs (Spring Boot/Python microservices) improving throughput by 20%; applied OOP design patterns (strategy, repository, factory) across a large Java codebase.</li>
            <li>Automated CI/CD with GitHub Actions + Docker, cutting deployment time by 40%; led code reviews resolving 30+ critical issues in Agile sprints.</li>
          </ul>
        </div>
      </div>
    </section>
  `;
}
