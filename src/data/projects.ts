export interface Project {
  name: string;
  description: string;
  tags: string[];
  demoLink: string;
  repoLink: string;
  image: string;
}

export const projects: Project[] = [
  {
    name: "ClaimsAI",
    description:
      "AI-powered insurance claims platform: 6 event-driven Spring Boot microservices, a Spring AI + pgvector RAG pipeline for claims chat, fraud risk scoring, and Elasticsearch semantic search — 14 containers, one-command Docker Compose deployment.",
    tags: ["Java", "Spring Boot", "Angular", "Kafka", "Elasticsearch", "PostgreSQL"],
    demoLink: "https://pulkit2306.github.io/ClaimsAI",
    repoLink: "https://github.com/Pulkit2306/ClaimsAI",
    image: "/projects/claimsai.png",
  },
  {
    name: "QuantFrame",
    description:
      "Algo-trading data pipeline & backtesting engine: async market data ingestion in Python (10+ symbols, OHLCV/NBBO quotes) with concurrent batch fetching, a partitioned PostgreSQL schema with an idempotent recovery process for safe restarts, and a C++ order book engine with concurrent, multi-threaded data structures and nanosecond-precision timestamps.",
    tags: ["Python", "asyncio", "C++", "PostgreSQL", "Docker"],
    demoLink: "https://pulkit2306.github.io/QuantFrame",
    repoLink: "https://github.com/Pulkit2306/QuantFrame",
    image: "/projects/quantframe.png",
  },
];
