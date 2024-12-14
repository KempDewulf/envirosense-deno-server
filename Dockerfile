# Use the official Deno image
FROM denoland/deno:latest

# Set the working directory
WORKDIR /app

# Cache dependencies first
COPY deno.json* .

# Copy source files needed for caching
COPY src/ ./src/

# Install dependencies (if any)
RUN deno cache src/Main/start.ts

# Copy project files
COPY . .

# Expose the application port (e.g., 8000)
EXPOSE 8101

# Run the Deno application
CMD ["deno", "run", "start"]