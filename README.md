# MyProgress

Приложения для отслеживания прогресса в поставленных целях.
Можно создавать 

## Структура

apps/
  web/                  Next.js
  api/                  Node.js BFF

services/
  tracker/              Go
    internal/
      auth/
      activities/
      plans/
      timer/
      goals/
      stats/
    migrations/

packages/
  contracts/            OpenAPI и сгенерированные TS-типы

infra/
  docker-compose.yml