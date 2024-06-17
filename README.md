## Pre-requisites

- Node.js v18
- Docker

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Run

### Development

```bash
npm run dev
```

### Production

```bash
npm run start
```

## Database

### Build and run

```bash
docker-compose up
```

### Initialize/create new migration

Run this command after changing the schema.prisma file to create a new
migration, update the database and generate updated the Prisma client.

```bash
npx prisma migrate dev
```

## Miscelaneous

### Generate Prisma client

```bash
npx prisma generate
```

### Generate Prisma migration

```bash
npx prisma migrate dev
```

### Run Prisma Studio

```bash
npx prisma studio
```


## Miscelaneous

### Hash RabbitMQ password
  
```bash 
rabbitmqctl hash_password <password>
```
