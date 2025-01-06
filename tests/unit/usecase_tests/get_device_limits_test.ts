import { assertEquals, assertRejects } from "@std/assert";
import { ShowRoomLimits } from "EnviroSense/Application/Room/ShowRoomLimits.ts";
import { Optional } from "EnviroSense/Domain/Shared/Optional.ts";
import { RoomQueryRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { Messaging, MessagingUseCaseRegistry } from "EnviroSense/Infrastructure/Messaging/mod.ts";

// Mock implementations
class MockOutputPort {
    private lastOutput: any;
    present(output: any): void {
        this.lastOutput = output;
    }
    getLastOutput(): any {
        return this.lastOutput;
    }
}

class MockRoomRepository implements RoomQueryRepository {
    private rooms = new Map();

    setRoom(id: string, room: any): void {
        this.rooms.set(id, room);
    }

    async find(id: string): Promise<Optional<any>> {
        return this.rooms.has(id) ?
            Optional.of(this.rooms.get(id)) :
            Optional.empty();
    }

    async all(): Promise<any[]> {
        return Array.from(this.rooms.values());
    }
}

class MockMessaging extends Messaging {
    private responses = new Map<string, string>();

    constructor() {
        const registry: MessagingUseCaseRegistry = {
            processDeviceDataUseCase: undefined,
            updateDeviceLimitUseCase: undefined,
            updateDeviceConfigUseCase: undefined
        };
        super(registry);
    }

    setResponse(topic: string, response: string): void {
        this.responses.set(topic, response);
    }

    override async waitForMessage(topic: string, _timeout: number): Promise<string | null> {
        return Promise.resolve(this.responses.get(topic) || null);
    }

    override async publish(_topic: string, _message: string): Promise<void> {
        return Promise.resolve();
    }

    override async subscribe(_topic: string): Promise<void> {
        return Promise.resolve();
    }

    override async connect(): Promise<void> {
        return Promise.resolve();
    }
}

class MockUpdateDeviceLimitUseCase {
    private updates: any[] = [];
    async execute(input: any): Promise<void> {
        this.updates.push(input);
    }
    getUpdates(): any[] {
        return this.updates;
    }
}

// Basic Functionality Tests
Deno.test("ShowRoomLimits - should get limits from single device", async () => {
    // Arrange
    const repo = new MockRoomRepository();
    const messaging = new MockMessaging();
    const output = new MockOutputPort();
    const updateLimit = new MockUpdateDeviceLimitUseCase();

    const room = {
        documentId: "room1",
        devices: [{ identifier: "device1", documentId: "doc1" }]
    };
    repo.setRoom("room1", room);
    messaging.setResponse(
        "devices/device1/limits/response",
        JSON.stringify({ temperature: 24 })
    );

    const useCase = new ShowRoomLimits(output, repo, messaging, updateLimit);

    // Act
    await useCase.execute({ roomDocumentId: "room1" });

    // Assert
    const result = output.getLastOutput();
    assertEquals(result.limits.temperature, 24);
    assertEquals(result.failedDevices.length, 0);
});

// Error Cases
Deno.test("ShowRoomLimits - should throw error when room not found", async () => {
    // Arrange
    const useCase = new ShowRoomLimits(
        new MockOutputPort(),
        new MockRoomRepository(),
        new MockMessaging(),
        new MockUpdateDeviceLimitUseCase()
    );

    // Act & Assert
    await assertRejects(
        () => useCase.execute({ roomDocumentId: "nonexistent" }),
        Error,
        "Room with ID nonexistent not found"
    );
});

Deno.test("ShowRoomLimits - should throw error when room has no devices", async () => {
    // Arrange
    const repo = new MockRoomRepository();
    repo.setRoom("empty-room", {
        documentId: "empty-room",
        devices: []
    });

    const useCase = new ShowRoomLimits(
        new MockOutputPort(),
        repo,
        new MockMessaging(),
        new MockUpdateDeviceLimitUseCase()
    );

    // Act & Assert
    await assertRejects(
        () => useCase.execute({ roomDocumentId: "empty-room" }),
        Error,
        "Room has no devices"
    );
});

// Device Synchronization Tests
Deno.test("ShowRoomLimits - should sync devices with different limits", async () => {
    // Arrange
    const repo = new MockRoomRepository();
    const messaging = new MockMessaging();
    const output = new MockOutputPort();
    const updateLimit = new MockUpdateDeviceLimitUseCase();

    const room = {
        documentId: "room1",
        devices: [
            { identifier: "device1", documentId: "doc1" },
            { identifier: "device2", documentId: "doc2" }
        ]
    };
    repo.setRoom("room1", room);

    messaging.setResponse(
        "devices/device1/limits/response",
        JSON.stringify({ temperature: 24 })
    );
    messaging.setResponse(
        "devices/device2/limits/response",
        JSON.stringify({ temperature: 26 })
    );

    const useCase = new ShowRoomLimits(output, repo, messaging, updateLimit);

    // Act
    await useCase.execute({ roomDocumentId: "room1" });

    // Assert
    const updates = updateLimit.getUpdates();
    assertEquals(updates.length, 1);
    assertEquals(updates[0].value, 24);
});

// Edge Cases
Deno.test("ShowRoomLimits - should handle non-responding devices", async () => {
    // Arrange
    const repo = new MockRoomRepository();
    const messaging = new MockMessaging();
    const output = new MockOutputPort();
    const updateLimit = new MockUpdateDeviceLimitUseCase();

    const room = {
        documentId: "room1",
        devices: [
            { identifier: "device1", documentId: "doc1" },
            { identifier: "device2", documentId: "doc2" }
        ]
    };
    repo.setRoom("room1", room);

    messaging.setResponse(
        "devices/device1/limits/response",
        JSON.stringify({ temperature: 24 })
    );
    // device2 doesn't respond

    const useCase = new ShowRoomLimits(output, repo, messaging, updateLimit);

    // Act
    await useCase.execute({ roomDocumentId: "room1" });

    // Assert
    const result = output.getLastOutput();
    assertEquals(result.failedDevices.includes("device2"), true);
    assertEquals(result.limits.temperature, 24);
});

Deno.test("ShowRoomLimits - should throw when room id is invalid", async () => {
    // Arrange
    const repo = new MockRoomRepository();
    const messaging = new MockMessaging();
    const output = new MockOutputPort();
    const updateLimit = new MockUpdateDeviceLimitUseCase();
    const useCase = new ShowRoomLimits(output, repo, messaging, updateLimit);

    // Act & Assert
    await assertRejects(
        () => useCase.execute({ roomDocumentId: "invalid-id" }),
        Error,
        "Room with ID invalid-id not found"
    );
});

Deno.test("ShowRoomLimits - should handle multiple devices with different limits", async () => {
    // Arrange
    const repo = new MockRoomRepository();
    const messaging = new MockMessaging();
    const output = new MockOutputPort();
    const updateLimit = new MockUpdateDeviceLimitUseCase();

    const room = {
        documentId: "room1",
        devices: [
            { identifier: "device1", documentId: "doc1" },
            { identifier: "device2", documentId: "doc2" },
            { identifier: "device3", documentId: "doc3" }
        ]
    };
    repo.setRoom("room1", room);

    messaging.setResponse(
        "devices/device1/limits/response",
        JSON.stringify({ temperature: 24 })
    );
    messaging.setResponse(
        "devices/device2/limits/response",
        JSON.stringify({ temperature: 26 })
    );
    messaging.setResponse(
        "devices/device3/limits/response",
        JSON.stringify({ temperature: 25 })
    );

    const useCase = new ShowRoomLimits(output, repo, messaging, updateLimit);

    // Act
    await useCase.execute({ roomDocumentId: "room1" });

    // Assert
    const updates = updateLimit.getUpdates();
    assertEquals(updates.length, 2); // Two devices need syncing
    assertEquals(updates[0].value, 24); // Should sync to first device's value
});

Deno.test("ShowRoomLimits - should handle mixed response types", async () => {
    // Arrange
    const repo = new MockRoomRepository();
    const messaging = new MockMessaging();
    const output = new MockOutputPort();
    const updateLimit = new MockUpdateDeviceLimitUseCase();

    const room = {
        documentId: "room1",
        devices: [
            { identifier: "device1", documentId: "doc1" },
            { identifier: "device2", documentId: "doc2" }
        ]
    };
    repo.setRoom("room1", room);

    messaging.setResponse(
        "devices/device1/limits/response",
        JSON.stringify({ temperature: 24, humidity: 60 })
    );
    // device2 doesn't respond

    const useCase = new ShowRoomLimits(output, repo, messaging, updateLimit);

    // Act
    await useCase.execute({ roomDocumentId: "room1" });

    // Assert
    const result = output.getLastOutput();
    assertEquals(result.limits.temperature, 24);
    assertEquals(result.limits.humidity, 60);
    assertEquals(result.failedDevices, ["device2"]);
});

Deno.test("ShowRoomLimits - should throw when all devices fail to respond", async () => {
    // Arrange
    const repo = new MockRoomRepository();
    const messaging = new MockMessaging();
    const output = new MockOutputPort();
    const updateLimit = new MockUpdateDeviceLimitUseCase();

    const room = {
        documentId: "room1",
        devices: [
            { identifier: "device1", documentId: "doc1" },
            { identifier: "device2", documentId: "doc2" }
        ]
    };
    repo.setRoom("room1", room);
    // No responses set for any device

    const useCase = new ShowRoomLimits(output, repo, messaging, updateLimit);

    // Act & Assert
    await assertRejects(
        () => useCase.execute({ roomDocumentId: "room1" }),
        Error,
        "No devices responded with limits"
    );
});

Deno.test("ShowRoomLimits - should sync multiple limit types correctly", async () => {
    // Arrange
    const repo = new MockRoomRepository();
    const messaging = new MockMessaging();
    const output = new MockOutputPort();
    const updateLimit = new MockUpdateDeviceLimitUseCase();

    const room = {
        documentId: "room1",
        devices: [
            { identifier: "device1", documentId: "doc1" },
            { identifier: "device2", documentId: "doc2" }
        ]
    };
    repo.setRoom("room1", room);

    messaging.setResponse(
        "devices/device1/limits/response",
        JSON.stringify({ temperature: 24, humidity: 60, co2: 800 })
    );
    messaging.setResponse(
        "devices/device2/limits/response",
        JSON.stringify({ temperature: 26, humidity: 65, co2: 850 })
    );

    const useCase = new ShowRoomLimits(output, repo, messaging, updateLimit);

    // Act
    await useCase.execute({ roomDocumentId: "room1" });

    // Assert
    const updates = updateLimit.getUpdates();
    assertEquals(updates.length, 3); // One update per limit type
    assertEquals(updates[0].value, 24); // Temperature
    assertEquals(updates[1].value, 60); // Humidity
    assertEquals(updates[2].value, 800); // CO2
});