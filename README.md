# NeoCRM

## Introduction

NeoCRM is a opensource CRM platform with a ton of AI features.

## Overview

This project combines:

- A React frontend (Vite + Tailwind CSS)
- A Node/Express backend API
- A custom database service built in Go
- Python-based AI microservices (FastAPI)

## Folder Structure

- **frontend/**: React application
- **backend/**: Express API server
- **db/**: Custom database service (Go)
- **ai/**: AI microservices (FastAPI)
- **.github/workflows/**: CI/CD pipeline configuration

## Getting Started

1. Install prerequisites: Docker, Node.js, Go, Python.
2. Clone the repository.
3. Run `docker-compose up --build` to start all services.

## API Endpoints

- **Backend:** `/api/test`
- **Custom DB:** `/set`, `/get`, `/delete`
- **AI Microservices:**
  - Sentiment: `/sentiment/?text=...`
  - Prediction: `/predict/?input=...`
  - NLP Query: `/nlp/?text=...`
  - Chat: `/chat/?message=...`

## Testing

- **Frontend:** Run `npm run test` in the `frontend` folder.
- **Backend:** Run `npm run test` in the `backend` folder.
- **Custom DB (Go):** Run `go test` in the `db` folder.
- **AI Microservices:** Run `pytest` in the `ai` folder.

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.
See [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) for details.

## Contributing

Please see CONTRIBUTING.md for guidelines.

## References

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Go Testing](https://golang.org/pkg/testing/)
