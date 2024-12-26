import { assertEquals, assertThrows } from "@std/assert";
import {
    Building,
    Device,
    DomainException,
    Room,
    RoomState,
    RoomType,
} from "EnviroSense/Domain/mod.ts";

Deno.test("Room - create method with valid parameters", () => {
    // Arrange
    const id = "1";
    const name = "Conference Room";
    const building = Building.create("1", "Main Building", "123 Main St");
    const roomType = RoomType.create("1", "Meeting Room", "icon.png");

    // Act
    const room = Room.create(id, name, building, roomType);

    // Assert
    assertEquals(room.documentId, id);
    assertEquals(room.name, name);
    assertEquals(room.building, building);
    assertEquals(room.roomType, roomType);
});

Deno.test("Room - create method with empty name throws error", () => {
    // Arrange
    const id = "1";
    const name = "";
    const building = Building.create("1", "Main Building", "123 Main St");
    const roomType = RoomType.create("1", "Meeting Room", "icon.png");

    // Act & Assert
    assertThrows(
        () => {
            Room.create(id, name, building, roomType);
        },
        DomainException,
        "Room name is required."
    );
});

Deno.test("Room - create method with null roomType throws error", () => {
    // Arrange
    const id = "1";
    const name = "Conference Room";
    const building = Building.create("1", "Main Building", "123 Main St");
    const roomType = null;

    // Act & Assert
    assertThrows(
        () => {
            Room.create(id, name, building, roomType as unknown as RoomType);
        },
        DomainException,
        "Room type is required."
    );
});

Deno.test("Room - load method with valid state", () => {
    // Arrange
    const state: RoomState = {
        documentId: "1",
        name: "Conference Room",
        building: Building.create("1", "Main Building", "123 Main St"),
        roomType: RoomType.create("1", "Meeting Room", "icon.png"),
        devices: [],
    };

    // Act
    const room = Room.load(state);

    // Assert
    assertEquals(room.documentId, state.id);
    assertEquals(room.name, state.name);
    assertEquals(room.building, state.building);
    assertEquals(room.roomType, state.roomType);
    assertEquals(room.devices, state.devices);
});

Deno.test("Room - load method with empty name in state throws error", () => {
    // Arrange
    const state: RoomState = {
        documentId: "1",
        name: "",
        building: Building.create("1", "Main Building", "123 Main St"),
        roomType: RoomType.create("1", "Meeting Room", "icon.png"),
        devices: [],
    };

    // Act & Assert
    assertThrows(
        () => {
            Room.load(state);
        },
        DomainException,
        "Room name is required."
    );
});

Deno.test("Room - load method with null roomType in state throws error", () => {
    // Arrange
    const state: RoomState = {
        documentId: "1",
        name: "Conference Room",
        building: Building.create("1", "Main Building", "123 Main St"),
        roomType: null as unknown as RoomType,
        devices: [],
    };

    // Act & Assert
    assertThrows(
        () => {
            Room.load(state);
        },
        DomainException,
        "Room type cannot be null."
    );
});

Deno.test("Room - addDevice adds device successfully", () => {
    // Arrange
    const building = Building.create("2", "Main Building", "123 Main St");
    const roomType = RoomType.create("2", "Meeting Room", "icon.png");
    const room = Room.create("2", "Conference Room", building, roomType);
    const device = Device.create("2", "TestDevice", room);

    // Act
    room.addDevice(device);

    // Assert
    assertEquals(room.devices.length, 1);
    assertEquals(room.devices[0], device);
});

Deno.test("Room - addDevice with duplicate device throws error", () => {
    // Arrange
    const building = Building.create("3", "Main Building", "123 Main St");
    const roomType = RoomType.create("3", "Meeting Room", "icon.png");
    const room = Room.create("3", "Conference Room", building, roomType);
    const device = Device.create("3", "TestDevice", room);
    room.addDevice(device);

    // Act & Assert
    assertThrows(
        () => {
            room.addDevice(device);
        },
        DomainException,
        "Device already exists in this room."
    );
});

Deno.test("Room - removeDevice removes device successfully", () => {
    // Arrange
    const building = Building.create("4", "Main Building", "123 Main St");
    const roomType = RoomType.create("4", "Meeting Room", "icon.png");
    const room = Room.create("4", "Conference Room", building, roomType);
    const device = Device.create("4", "TestDevice", room);
    room.addDevice(device);

    // Act
    room.removeDevice(device.id);

    // Assert
    assertEquals(room.devices.length, 0);
});

Deno.test("Room - removeDevice with non-existent device throws error", () => {
    // Arrange
    const building = Building.create("5", "Main Building", "123 Main St");
    const roomType = RoomType.create("5", "Meeting Room", "icon.png");
    const room = Room.create("5", "Conference Room", building, roomType);

    // Act & Assert
    assertThrows(
        () => {
            room.removeDevice("non-existent-id");
        },
        DomainException,
        "Device does not exist in this room."
    );
});

Deno.test("Room - updateName updates name successfully", () => {
    // Arrange
    const building = Building.create("6", "Main Building", "123 Main St");
    const roomType = RoomType.create("6", "Meeting Room", "icon.png");
    const room = Room.create("6", "Conference Room", building, roomType);
    const newName = "Updated Room";

    // Act
    room.updateName(newName);

    // Assert
    assertEquals(room.name, newName);
});

Deno.test("Room - updateName with empty name throws error", () => {
    // Arrange
    const building = Building.create("7", "Main Building", "123 Main St");
    const roomType = RoomType.create("7", "Meeting Room", "icon.png");
    const room = Room.create("7", "Conference Room", building, roomType);

    // Act & Assert
    assertThrows(
        () => {
            room.updateName("");
        },
        DomainException,
        "Room name is required."
    );
    assertEquals(room.name, "Conference Room");
});

Deno.test("Room - load method with null building", () => {
    // Arrange
    const state: RoomState = {
        documentId: "8",
        name: "Conference Room",
        building: null,
        roomType: RoomType.create("8", "Meeting Room", "icon.png"),
    };

    // Act
    const room = Room.load(state);

    // Assert
    assertEquals(room.building, null);
});

Deno.test("Room - room-type getter returns correct type", () => {
    // Arrange
    const building = Building.create("9", "Main Building", "123 Main St");
    const roomType = RoomType.create("9", "Meeting Room", "icon.png");
    const room = Room.create("9", "Conference Room", building, roomType);

    // Act & Assert
    assertEquals(room.roomType, roomType);
});

Deno.test(
    "Room - load method initializes empty devices array when undefined",
    () => {
        // Arrange
        const state: RoomState = {
            documentId: "10",
            name: "Conference Room",
            building: Building.create("10", "Main Building", "123 Main St"),
            roomType: RoomType.create("10", "Meeting Room", "icon.png"),
        };

        // Act
        const room = Room.load(state);

        // Assert
        assertEquals(room.devices, []);
    }
);

Deno.test("Room - validateState checks both name and roomType", () => {
    // Arrange
    const building = Building.create("11", "Main Building", "123 Main St");

    // Act & Assert
    assertThrows(
        () => {
            Room.create("11", "", building, null as unknown as RoomType);
        },
        DomainException,
        "Room name is required."
    );

    assertThrows(
        () => {
            Room.create(
                "11",
                "Conference Room",
                building,
                null as unknown as RoomType
            );
        },
        DomainException,
        "Room type is required."
    );
});
