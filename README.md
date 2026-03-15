# BusPoint API

> REST API backend for tourist bus ticket management — built with Java 17, Spring Boot 3, MongoDB and deployed on Railway.

[![CI/CD](https://github.com/choflixu/buspoint-api/actions/workflows/ci.yml/badge.svg)](https://github.com/choflixu/buspoint-api/actions)

---

## What is BusPoint?

BusPoint is a platform that centralises ticket management for tourist bus companies. Passengers can browse routes, purchase tickets and receive confirmation by email. Operators and admins get a full sales statistics dashboard.

This repository contains the **backend API**, migrated from a JavaFX desktop application to a cloud-native REST service.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.2 |
| Database | MongoDB (Spring Data) |
| Auth | JWT (stateless) |
| Documentation | Swagger / OpenAPI 3 |
| Testing | JUnit 5 + Mockito + JaCoCo |
| Containerisation | Docker |
| CI/CD | GitHub Actions |
| Deployment | Railway |

---

## Features

- **JWT Authentication** — register, login, stateless token auth
- **Password recovery** — secure token sent by email (1h expiry)
- **Route management** — CRUD for tourist routes, filterable by city
- **Ticket purchasing** — automatic price calculation, QR code generation, email confirmation
- **Ticket cancellation** — with ownership validation
- **Admin stats** — global revenue, tickets by route, date-range reports
- **Role-based access** — CLIENT, OPERATOR, ADMIN
- **Full API docs** — Swagger UI at `/swagger-ui.html`

---

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.9+
- MongoDB (local or Atlas)
- Docker (optional)

### Run locally

```bash
# Clone the repo
git clone https://github.com/choflixu/buspoint-api.git
cd buspoint-api

# Set environment variables (or create application-local.properties)
export MONGODB_URI=mongodb://localhost:27017/buspoint
export JWT_SECRET=your-256-bit-secret-key-here

# Run
mvn spring-boot:run
```

API will be available at `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Run with Docker

```bash
docker build -t buspoint-api .
docker run -p 8080:8080 \
  -e MONGODB_URI=your_mongo_uri \
  -e JWT_SECRET=your_secret \
  buspoint-api
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset with token |

### Routes
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/routes` | Any |
| GET | `/api/routes/{id}` | Any |
| GET | `/api/routes/city/{city}` | Any |
| POST | `/api/routes` | ADMIN |
| PUT | `/api/routes/{id}` | ADMIN |
| DELETE | `/api/routes/{id}` | ADMIN |

### Tickets
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/tickets` | User |
| GET | `/api/tickets/my` | User |
| GET | `/api/tickets/{id}` | User |
| PATCH | `/api/tickets/{id}/cancel` | User |

### Admin Stats
| Method | Endpoint |
|---|---|
| GET | `/api/admin/stats` |
| GET | `/api/admin/stats/route/{routeId}` |
| GET | `/api/admin/stats/range?from=&to=` |

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key (min 32 chars) | ✅ |
| `MAIL_USERNAME` | Gmail address for sending emails | ✅ |
| `MAIL_PASSWORD` | Gmail app password | ✅ |
| `PORT` | Server port (Railway sets this automatically) | Auto |

---

## Deployment on Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Add a MongoDB plugin in Railway
4. Set environment variables in Railway dashboard
5. Railway auto-detects the Dockerfile and deploys

---

## Running Tests

```bash
mvn test                    # run all tests
mvn verify                  # tests + JaCoCo coverage report
# report available at: target/site/jacoco/index.html
```

---

## Project Structure

```
src/
├── main/java/com/buspoint/api/
│   ├── controller/     # REST controllers
│   ├── service/        # Business logic
│   ├── repository/     # MongoDB repositories
│   ├── model/          # Document entities
│   ├── dto/            # Request/response DTOs
│   ├── config/         # Security, JWT, Swagger
│   └── exception/      # Custom exceptions + global handler
└── test/
    └── java/com/buspoint/api/
        ├── AuthServiceTest.java
        └── TicketServiceTest.java
```

---

## Author

**Sofia Utrera Castro** — Backend Developer  
[LinkedIn](https://www.linkedin.com/in/sofía-valentina-utrera-castro-50006b1b8) · sofia.utrera02@gmail.com
