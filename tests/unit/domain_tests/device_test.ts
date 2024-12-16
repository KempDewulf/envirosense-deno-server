import { assertEquals, assertThrows } from "@std/assert";
import { Building, Device, DeviceState, DomainException, Room, RoomType } from "EnviroSense/Domain/mod.ts";

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
