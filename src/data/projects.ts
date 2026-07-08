export interface Project {
  name: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
}

export const projects: Project[] = [
  {
    name: "ClaimsAI",
    description:
      "AI-powered insurance claims platform: 6 event-driven Spring Boot microservices, a Spring AI + pgvector RAG pipeline for claims chat, fraud risk scoring, and Elasticsearch semantic search — 14 containers, one-command Docker Compose deployment.",
    tags: ["Java", "Spring Boot", "Angular", "Kafka", "Elasticsearch", "PostgreSQL"],
    link: "https://pulkit2306.github.io/ClaimsAI",
    image: "/projects/claimsai.png",
  },
  {
    name: "QuantFrame",
    description:
      "Algo-trading data pipeline & backtesting engine: async market data ingestion from Alpaca (10+ symbols), a partitioned PostgreSQL time-series schema with sub-10ms range scans, an idempotent gap-fill orchestrator, and a C++ lock-free order book engine in progress.",
    tags: ["Python", "asyncio", "C++", "PostgreSQL", "Docker"],
    link: "https://pulkit2306.github.io/QuantFrame",
    image: "/projects/quantframe.png",
  },
];
