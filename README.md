# EnviroSense API

This repository contains the source code for the EnviroSense API, which provides endpoints for managing buildings, rooms, devices, and device data.

## Runtime

### Deno

This project uses [Deno](https://deno.land/), a modern runtime for JavaScript and TypeScript. Deno was chosen for several reasons:

1. **Security**: Deno is secure by default. It requires explicit permission for file, network, and environment access, reducing the risk of unintended security vulnerabilities.
2. **TypeScript Support**: Deno has first-class support for TypeScript out of the box, allowing us to write type-safe code without additional configuration.
3. **Standard Library**: Deno provides a standard library that is audited and maintained by the Deno team, reducing the need for third-party dependencies.
4. **Simplicity**: Deno aims to be a simple and productive runtime, with a single executable and no package manager, making it easy to set up and use.

By using Deno, we ensure that our codebase is secure, maintainable, and easy to work with.

## Architecture

### Clean Architecture

This project follows the principles of Clean Architecture to ensure a scalable, maintainable, and testable codebase. Clean Architecture emphasizes the separation of concerns, making the codebase easier to understand and modify.

#### Key Concepts

1. **Entities**: Core business objects of the application. These are the most stable and independent parts of the system.
2. **Use Cases**: Application-specific business rules. They orchestrate the flow of data to and from the entities.
3. **Interface Adapters**: Convert data from the format most convenient for the use cases and entities to the format most convenient for external agencies such as databases and web services.
4. **Frameworks and Drivers**: External components such as databases, web frameworks, and user interfaces.

#### Implementation

- **Entities**: Located in the `Domain` layer. These are simple data classes or interfaces that represent the core business objects, such as `Device`.
- **Use Cases**: Located in the `Application` layer. These contain the business logic and interact with the entities. For example, `CreateDeviceUseCase` handles the creation of a new device.
- **Interface Adapters**: Located in the `Infrastructure` layer. These include repositories, controllers, and middleware. For instance, `DeviceRepositoryImpl` is responsible for saving and retrieving devices.
- **Frameworks and Drivers**: Located in the `Infrastructure` layer. These include the web server setup and external libraries. The `WebApiModule` sets up the web server and configures middleware and routes.

By following Clean Architecture, we ensure that our codebase remains flexible and easy to maintain as the project grows.

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
    git clone git@github.com:KempDewulf/envirosense-deno-server.git
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
