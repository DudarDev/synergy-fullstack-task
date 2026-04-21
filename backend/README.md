# Synergy Fullstack Task

This is a full-stack application built with FastAPI, React (TypeScript), and PostgreSQL.
It synchronizes data from DummyJSON and provides full CRUD operations.

## Technologies Used
* **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL
* **Frontend:** React, TypeScript, Vite, React Router, Axios
* **Deployment:** Docker, Docker Compose, Nginx

## How to Run the Project Locally

### Prerequisites
* Docker and Docker Compose installed.

### Steps to Run
1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   cd synergy-fullstack-task
   ```

2. Start the application using Docker Compose:
   ```bash
   docker compose up -d --build
   ```

3. Access the services:
   * **Frontend:** [http://localhost:80](http://localhost:80)
   * **Backend API (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

## Running Tests

To run the backend suite of tests, use the following command:
```bash
docker compose exec backend pytest