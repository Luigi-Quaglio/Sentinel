# Sentinel

> ⚠️ **Project Status:** Early Development
>
> Sentinel is currently under active development. The architecture is stable, but new features and improvements are continuously being added.

> **Open Source IoT Device Management Platform**

Sentinel is an open-source platform for managing IoT devices at scale. It provides device provisioning, telemetry ingestion, MQTT communication, remote command execution, and alert management through a modern backend architecture.

Built with scalability, maintainability, and observability in mind, Sentinel aims to serve as a production-ready foundation for IoT applications.

---

## ✨ Features

- 📡 MQTT-based device communication
- 📊 Telemetry collection and storage
- 🖥️ Device management
- ⚡ Remote command execution
- 🚨 Alert engine
- 👥 Multi-user support
- 🗄️ PostgreSQL database
- 🔐 Authentication *(planned)*
- 📈 Observability *(planned)*
- 🐳 Docker Compose deployment
- 🧪 Static code analysis with Semgrep
- 🚀 CI/CD with GitHub Actions

---

## 🏗 Architecture

```
                   MQTT

 Devices ───────────────► Broker
                               │
                               ▼
                       Sentinel Backend
              ┌──────────┬──────────┬──────────┐
              │          │          │          │
          Devices   Telemetry   Alerts   Commands
              │
              ▼
         PostgreSQL Database
              │
              ▼
          REST API / Frontend
```

---

## 📂 Repository Structure

```
.
├── api/
│   └── services/          # Backend services (NestJS + Prisma)
│
├── app/                   # Frontend application
│
├── infra/
│   ├── database/
│   │   └── initdb/        # Database initialization scripts
│   └── docker/            # Docker Compose environment
│
├── semgrep/               # Static analysis rules
│
├── .githooks/             # Git hooks
│
└── docs/                  # Documentation (planned)
```

---

## 🛠 Technology Stack

### Backend

- NestJS
- TypeScript
- Prisma ORM

### Database

- PostgreSQL

### Messaging

- Eclipse Mosquitto (MQTT)

### Infrastructure

- Docker
- Docker Compose

### Code Quality

- GitHub Actions
- Semgrep

---

## 🚀 Quick Start

Clone the repository:

```bash
git clone https://github.com/<your-user>/sentinel.git
cd sentinel
```

Create an `.env` file inside `infra/docker`.

Example:

```env
POSTGRES_DB=sentinel
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432

ADMINER_PORT=8080

MQTT_PORT=1883
MQTT_WS_PORT=9001

BACKEND_PORT=3000
FRONTEND_PORT=3001
```

Start the entire stack:

```bash
cd infra/docker
docker compose up --build
```

After the containers are running, the services will be available at:

| Service | URL |
|---------|-----|
| Backend | http://localhost:3000 |
| Frontend | http://localhost:3001 |
| Adminer | http://localhost:8080 |

---

## 💻 Backend Development

Navigate to the backend project:

```bash
cd api/services
```

Install dependencies:

```bash
npm install
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Configure the database connection:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/sentinel"
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

---

## 🗄 Database

The Prisma schema is located at:

```
api/services/prisma/schema.prisma
```

Initialize or update the database:

```bash
npx prisma migrate dev
npx prisma generate
```

Database initialization scripts are automatically executed when PostgreSQL starts for the first time.

---

## 📡 MQTT

Sentinel follows a topic-based communication model.

Example topics:

```
devices/{deviceId}/telemetry
devices/{deviceId}/heartbeat
devices/{deviceId}/commands
devices/{deviceId}/ack
devices/{deviceId}/logs
```

---

## 🔒 Code Quality

This project includes:

- GitHub Actions
- Semgrep security rules
- Conventional Commits
- Git Hooks
- Pull Request validation

To enable local Git hooks:

```bash
git config core.hooksPath .githooks
```

---

## 📋 Commit Convention

Examples:

```
feat(device): register new device

fix(mqtt): reconnect after broker timeout

refactor(auth): simplify JWT validation

build: update Docker images
```

---

## 🗺 Roadmap

- [x] Docker environment
- [x] PostgreSQL integration
- [x] MQTT communication
- [x] Prisma ORM
- [ ] Authentication & Authorization
- [ ] Device Provisioning
- [ ] Remote Command Queue
- [ ] Alert Rule Engine
- [ ] OpenTelemetry
- [ ] Prometheus
- [ ] Grafana Dashboards
- [ ] Device Simulator
- [ ] BLE Support
- [ ] LoRa Support
- [ ] REST API Documentation

---

## 🤝 Contributing

Contributions are welcome!

Please:

- Create feature branches
- Follow the Conventional Commit specification
- Open a Pull Request
- Keep documentation up to date

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

Feel free to reach out if you'd like to collaborate or discuss the project.

- LinkedIn: https://linkedin.com/in/luigiquaglio
- Email: quagluigi@gmail.com

---

> *"Building reliable software for the physical world."*