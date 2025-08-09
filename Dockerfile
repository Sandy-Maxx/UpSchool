# Stage 1: Build the frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN yarn build

# Stage 2: Build the backend
FROM python:3.11-slim AS backend-builder
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev
COPY backend/requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt
COPY backend/ .

# Stage 3: Final image
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev && rm -rf /var/lib/apt/lists/*
COPY --from=backend-builder /wheels /wheels
COPY --from=backend-builder /app/requirements.txt .
RUN pip install --no-cache /wheels/*
COPY --from=frontend-builder /app/frontend/build /app/frontend/build
COPY backend/ .
EXPOSE 8000
CMD ["gunicorn", "school_platform.wsgi:application", "--bind", "0.0.0.0:8000"]