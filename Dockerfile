# Use Python 3.12 (required for opcut)
FROM python:3.12-slim

# Install system packages needed for opcut/pycairo
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libcairo2-dev \
    python3-dev \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy dependencies
COPY requirements.txt .

# Install deps
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Command to run FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
