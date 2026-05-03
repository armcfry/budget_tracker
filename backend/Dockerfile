# -------------------------------------------------------
# Backend — FastAPI + Python
# -------------------------------------------------------

FROM python:3.12-slim

# Set working directory inside the container
WORKDIR /app

# Install dependencies first (separate layer so Docker caches this
# and only re-runs pip install when requirements.txt changes)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the source code
# (in dev this is overridden by the volume mount in docker-compose.yml,
# but it's here so the image works standalone too)
COPY . .

# Expose the port uvicorn will listen on
EXPOSE 8000

# Start the FastAPI app via uvicorn
# --reload enables hot-reloading when source files change (dev only)
# Remove --reload in a production image
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]