import { assertEquals, assertThrows } from "@std/assert";
import { Building, Device, DeviceData, DeviceState, DomainException, Room, RoomType } from "EnviroSense/Domain/mod.ts";

Deno.test("Device - create method with valid parameters", () => {
    // Arrange
    const id = "1";
    const identifier = "Device001";
    const building = Building.create("1", "Main Building", "123 Main St");
    const roomType = RoomType.create("1", "Office", "office_icon.png");
    const room = Room.create("1", "Office Room", building, roomType);

    // Act
    const device = Device.create(id, identifier, room);

    // Assert
    assertEquals(device.id, id);
    assertEquals(device.identifier, identifier);
    assertEquals(device.room, room);
});

Deno.test("Device - create method with empty identifier throws error", () => {
    // Arrange
    const id = "2";
    const identifier = "";
    const building = Building.create("2", "Main Building", "123 Main St");
    const roomType = RoomType.create("2", "Office", "office_icon.png");
    const room = Room.create("2", "Office Room", building, roomType);

    // Act & Assert
    assertThrows(() => {
        Device.create(id, identifier, room);
    }, DomainException, "Identifier is required");
});

Deno.test("Device - load method with valid state", () => {
    // Arrange
    const building = Building.create("3", "Main Building", "123 Main St");
    const roomType = RoomType.create("3", "Office", "office_icon.png");
    const room = Room.create("3", "Office Room", building, roomType);
    const state: DeviceState = {
        id: "3",
        identifier: "Device003",
        room: room,
        deviceData: []
    };

    // Act
    const device = Device.load(state);

    // Assert
    assertEquals(device.id, state.id);
    assertEquals(device.identifier, state.identifier);
    assertEquals(device.room, room);
    assertEquals(device.deviceData, []);
});

Deno.test("Device - load method with empty identifier in state throws error", () => {
    // Arrange
    const building = Building.create("4", "Main Building", "123 Main St");
    const roomType = RoomType.create("4", "Office", "office_icon.png");
    const room = Room.create("4", "Office Room", building, roomType);
    const state: DeviceState = {
        id: "4",
        identifier: "",
        room: room,
        deviceData: []
    };

    // Act & Assert
    assertThrows(() => {
        Device.load(state);
    }, DomainException, "Identifier is required");
});

Deno.test("Device - removeRoom method removes the room from the device", () => {
    // Arrange
    const id = "5";
    const identifier = "Device005";
    const building = Building.create("5", "Main Building", "123 Main St");
    const roomType = RoomType.create("5", "Office", "office_icon.png");
    const room = Room.create("5", "Office Room", building, roomType);
    const device = Device.create(id, identifier, room);

    // Act
    device.removeRoom();

    // Assert
    assertEquals(device.room, null);
});

Deno.test("Device - addRoom method adds a new room after removing the current room", () => {
    // Arrange
    const id = "6";
    const identifier = "Device006";

    const building = Building.create("6", "Main Building", "123 Main St");

    const roomType1 = RoomType.create("6", "Office", "office_icon.png");
    const room1 = Room.create("6", "Office Room", building, roomType1);
    building.addRoom(room1); // Add room1 to the building

    const roomType2 = RoomType.create("7", "Conference", "conference_icon.png");
    const room2 = Room.create("7", "Conference Room", building, roomType2);
    building.addRoom(room2); // Add room2 to the building

    const device = Device.create(id, identifier, room1);

    // Act
    device.removeRoom();
    device.addRoom(room2);

    // Assert
    assertEquals(device.room, room2);
});

Deno.test("Device - updateIdentifier method with valid identifier", () => {
    // Arrange
    const id = "7";
    const oldIdentifier = "Device007";
    const newIdentifier = "Device007-Updated";
    const building = Building.create("7", "Main Building", "123 Main St");
    const roomType = RoomType.create("7", "Office", "office_icon.png");
    const room = Room.create("7", "Office Room", building, roomType);
    const device = Device.create(id, oldIdentifier, room);

    // Act
    device.updateIdentifier(newIdentifier);

    // Assert
    assertEquals(device.identifier, newIdentifier);
});

Deno.test("Device - updateIdentifier method with empty identifier throws error", () => {
    // Arrange
    const id = "8";
    const oldIdentifier = "Device008";
    const newIdentifier = "";
    const building = Building.create("8", "Main Building", "123 Main St");
    const roomType = RoomType.create("8", "Office", "office_icon.png");
    const room = Room.create("8", "Office Room", building, roomType);
    const device = Device.create(id, oldIdentifier, room);

    // Act & Assert
    assertThrows(() => {
        device.updateIdentifier(newIdentifier);
    }, DomainException, "Identifier is required");
});

Deno.test("Device - addRoom method with room not assigned to building throws error", () => {
    // Arrange
    const id = "9";
    const identifier = "Device009";
    const building = Building.create("9", "Main Building", "123 Main St");
    const roomType = RoomType.create("9", "Office", "office_icon.png");

    // Create initial room and device
    const room1 = Room.create("9", "Office Room", building, roomType);
    building.addRoom(room1);
    const device = Device.create(id, identifier, room1);

    // Create room without building
    const roomType2 = RoomType.create("10", "Conference", "conference_icon.png");
    const roomWithoutBuilding = Room.create("10", "Conference Room", null as unknown as Building, roomType2);

    // Act & Assert
    assertThrows(() => {
        device.addRoom(roomWithoutBuilding);
    }, DomainException, "Room must be assigned to a building");
});

Deno.test("Device - removeRoom method throws error when room is already null", () => {
    // Arrange
    const id = "10";
    const identifier = "Device010";
    const building = Building.create("10", "Main Building", "123 Main St");
    const roomType = RoomType.create("10", "Office", "office_icon.png");
    const room = Room.create("10", "Office Room", building, roomType);
    const device = Device.create(id, identifier, room);

    // First removal
    device.removeRoom();

    // Act & Assert
    assertThrows(() => {
        device.removeRoom();
    }, DomainException, "Room is required");
});

Deno.test("Device - deviceData getter returns empty array by default", () => {
    // Arrange
    const id = "11";
    const identifier = "Device011";
    const building = Building.create("11", "Main Building", "123 Main St");
    const roomType = RoomType.create("11", "Office", "office_icon.png");
    const room = Room.create("11", "Office Room", building, roomType);

    // Act
    const device = Device.create(id, identifier, room);

    // Assert
    assertEquals(device.deviceData, []);
});

Deno.test("Device - removeRoom method removes room successfully", () => {
    // Arrange
    const id = "10";
    const identifier = "Device010";
    const building = Building.create("10", "Main Building", "123 Main St");
    const roomType = RoomType.create("10", "Office", "office_icon.png");
    const room = Room.create("10", "Office Room", building, roomType);
    building.addRoom(room);
    const device = Device.create(id, identifier, room);

    // Act
    device.removeRoom();

    // Assert
    assertEquals(device.room, null);
});

Deno.test("Device - removeRoom method throws error when room is null", () => {
    // Arrange
    const id = "11";
    const identifier = "Device011";
    const device = Device.create(id, identifier,  null as unknown as Room);

    // Act & Assert
    assertThrows(() => {
        device.removeRoom();
    }, DomainException, "Room is required.");
});

Deno.test("Device - addDeviceData method adds device data successfully", () => {
    // Arrange
    const id = "12";
    const identifier = "Device012";
    const device = Device.create(id, identifier,  null as unknown as Room);
    const deviceData = DeviceData.create("1", device, new Date(), { temperature: 25, humidity: 50, ppm: 100 });

    // Act
    device.addDeviceData(deviceData);

    // Assert
    assertEquals(device.deviceData.length, 1);
    assertEquals(device.deviceData[0], deviceData);
});

Deno.test("Device - updateIdentifier method updates identifier successfully", () => {
    // Arrange
    const id = "13";
    const identifier = "Device013";
    const device = Device.create(id, identifier, null as unknown as Room);
    const newIdentifier = "Device013Updated";

    // Act
    device.updateIdentifier(newIdentifier);

    // Assert
    assertEquals(device.identifier, newIdentifier);
});

Deno.test("Device - updateIdentifier method throws error when identifier is empty", () => {
    // Arrange
    const id = "14";
    const identifier = "Device014";
    const device = Device.create(id, identifier,  null as unknown as Room);

    // Act & Assert
    assertThrows(() => {
        device.updateIdentifier("");
    }, DomainException, "Identifier is required");
});

Deno.test("Device - validateState method throws error when identifier is empty", () => {
    // Arrange
    const id = "15";
    const identifier = "";
    const building = Building.create("15", "Main Building", "123 Main St");
    const roomType = RoomType.create("15", "Office", "office_icon.png");
    const room = Room.create("15", "Office Room", building, roomType);

    // Act & Assert
    assertThrows(() => {
        Device.create(id, identifier, room);
    }, DomainException, "Identifier is required.");
});

Deno.test("Device - addDeviceData adds first device data to empty array", () => {
    // Arrange
    const id = "16";
    const identifier = "Device016";
    const building = Building.create("16", "Main Building", "123 Main St");
    const roomType = RoomType.create("16", "Office", "office_icon.png");
    const room = Room.create("16", "Office Room", building, roomType);
    const device = Device.create(id, identifier, room);
    const deviceData = DeviceData.create("1", device, new Date(), { temperature: 25, humidity: 50, ppm: 100 });

    // Act
    device.addDeviceData(deviceData);

    // Assert
    assertEquals(device.deviceData.length, 1);
    assertEquals(device.deviceData[0], deviceData);
});

Deno.test("Device - removeRoom method ensures room exists before removal", () => {
    // Arrange
    const id = "17";
    const identifier = "Device017";
    const building = Building.create("17", "Main Building", "123 Main St");
    const roomType = RoomType.create("17", "Office", "office_icon.png");
    const room = Room.create("17", "Office Room", building, roomType);
    const device = Device.create(id, identifier, room);

    // Act & Assert
    assertThrows(() => {
        device.removeRoom();
        device.removeRoom(); // Try to remove again when room is already null
    }, DomainException, "Room is required.");
});