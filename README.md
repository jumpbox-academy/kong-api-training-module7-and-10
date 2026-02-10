# 🚀 Troubleshooting and Debugging APIs with Kong API Gateway

This section will:
- Start the stack (Kong, hello-api, Grafana, Loki/Mimir if included)
- Enable Prometheus metrics on Kong (`/metrics`)
- Create **Service + Routes** for `/v1` and `/v2`
- Generate traffic to produce **logs + metrics**
- Validate everything before opening Grafana

## 📁 Prerequisites

Make sure you have installed:

- Docker
- Docker Compose
- Git

---

You can verify your Docker installation with:
```bash
docker --version

docker compose version
```

## ✅ Getting Started
### 1.Create a Docker Network

Create a dedicated network for Kong:
```bash
docker network create kong-net
```

To check existing Docker networks, run:
```bash
docker network ls
```

You should see kong-net listed.

---

### 2.Start Kong Gateway + Metrics + Routing (Hello API)

Start all services using Docker Compose:
```bash
docker compose up -d
docker compose ps
```

**Enable Prometheus plugin (required for /metrics)**
```bash
curl -sS -i -X POST http://localhost:8001/plugins --data name=prometheus
```
After enabling this plugin, Kong will expose metrics at: http://localhost:8100/metrics

**Create Service + Routes to hello-api (v1/v2)**
```bash
curl -sS -X POST http://localhost:8001/services \
  --data name=hello-api \
  --data url=http://hello-api:4000 | jq .
```

**Create a Route for /v1:**
```bash
curl -sS -X POST http://localhost:8001/services/hello-api/routes \
  --data name=hello-v1 \
  --data 'paths[]=/v1' \
  --data strip_path=false | jq .
```

**Create a Route for /v2:**
```bash
curl -sS -X POST http://localhost:8001/services/hello-api/routes \
  --data name=hello-v2 \
  --data 'paths[]=/v2' \
  --data strip_path=false | jq .
```

**Test traffic through Kong Proxy**
```bash
curl -sS http://localhost:8000/v1/hello | jq .
curl -sS http://localhost:8000/v2/hello | jq .
```
Expected (example):
```
{
  "version": "v1",
  "message": "Hello from Backend V1",
  "request_id": "..."
}
```
**Generate traffic (to produce logs + metrics)**
```bash
for i in {1..50}; do
  curl -sS http://localhost:8000/v1/hello > /dev/null
done
```

**Validate metrics & logs before opening Grafana**

Check that metrics are available:
```bash
curl -sS http://localhost:8100/metrics | head
```

Check Kong logs:
```bash
docker logs --tail 50 kong
```

**View in Grafana (UI)**

Open Grafana:
```bash
URL: http://localhost:3000
```
```
Login: admin / admin
```

Logs

Explore → datasource Loki
```
Query: {app="kong"}
```

Metrics

Explore → datasource Mimir
```
Total requests rate: rate(kong_http_requests_total[1m])
```

---
## 🧹 3.Cleanup (Stop and Remove Containers)
When you are done, you can stop and remove all running containers:
```bash
docker compose down
```

If you also want to remove the custom network:
```bash
docker network rm kong-net
```