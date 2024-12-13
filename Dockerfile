# Use the official Deno image
FROM denoland/deno:latest

# Set the working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies (if any)
RUN deno cache src/Main/start.ts

# Expose the application port (e.g., 8000)
EXPOSE 8000

# Run the Deno application
CMD ["run", "--allow-net", "src/Main/start.ts"]