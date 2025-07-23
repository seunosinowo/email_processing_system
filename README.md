# Email Processing System

A two-microservice system built to process and store email messages using a message queue architecture. The system consists of an **API Service** for handling HTTP requests to queue and retrieve messages, and a **Worker Service** for processing queued messages. It uses Node.js with TypeScript, MongoDB for persistent storage, Redis with BullMQ for message queuing, and Docker for containerization.

## Project Structure
- `api-service/`: Handles HTTP requests to queue messages (POST /messages) and retrieve messages (GET /messages).
- `worker-service/`: Processes messages from the Redis queue and logs them.
- `docker-compose.yml`: Defines services for API, Worker, MongoDB, and Redis.

## Technologies
- **Node.js**: Backend runtime for both services.
- **TypeScript**: For type-safe development.
- **MongoDB**: Stores message data.
- **Redis & BullMQ**: Manages the message queue.
- **Docker & Docker Compose**: Containerizes and orchestrates services.