# EnviroSense API

This repository contains the source code for the EnviroSense API, which provides endpoints for managing buildings, rooms, devices, and device data.

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) (latest version)
- Docker (optional, for containerized deployment)

### Configuration

1. Create a `.env` file using the `.env.example` file and add the required values.

2. Add `firebase_credentials.json` to the root directory. This file can be found in your Firebase project settings.

### Running the Application

#### Using Deno

1. Clone the repository:
    ```sh
    git clone git@gitlab.ti.howest.be:ti/2024-2025/s5/ccett/projects/group-14/deno-server.git
    cd ccett_deno
    ```

2. Run the application:
    ```sh
    deno run start
    ```

3. The API will be available at `http://localhost:8101`.

#### Using Docker
1. Clone the repository:
    ```sh
    git clone git@gitlab.ti.howest.be:ti/2024-2025/s5/ccett/projects/group-14/deno-server.git
    cd ccett_deno
    ```
2. Build the Docker image:
    ```sh
    docker build -t envirosense-api .
    ```

3. Run the Docker container:
    ```sh
    docker run -p 8101:8101 envirosense-api
    ```

4. The API will be available at `http://localhost:8101`.

### Running Tests

To run the tests, use the following command:

```sh
deno test
```

## API endpoint Documentation

The API endpoint documentation is available [here](http://94.130.75.173:8101/).
