import { assertEquals, assertThrows } from "@std/assert";
import { Building, DomainException, Room, RoomState, RoomType } from "EnviroSense/Domain/mod.ts";

Deno.test("Room - create method with valid parameters", () => {
    // Arrange
    const id = "1";
    const name = "Conference Room";
    const building = Building.create("1", "Main Building", "123 Main St");
    const roomType = RoomType.create("1", "Meeting Room", "icon.png");

    // Act
    const room = Room.create(id, name, building, roomType);

    // Assert
    assertEquals(room.id, id);
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
    assertThrows(() => {
        Room.create(id, name, building, roomType);
    }, DomainException, "Room name cannot be empty.");
});

Deno.test("Room - create method with null building throws error", () => {
    // Arrange
    const id = "1";
    const name = "Conference Room";
    const building = null;
    const roomType = RoomType.create("1", "Meeting Room", "icon.png");

    // Act & Assert
    assertThrows(() => {
        Room.create(id, name, building as unknown as Building, roomType);
    }, DomainException, "Building cannot be empty.");
});

Deno.test("Room - create method with null roomType throws error", () => {
    // Arrange
    const id = "1";
    const name = "Conference Room";
    const building = Building.create("1", "Main Building", "123 Main St");
    const roomType = null;

    // Act & Assert
    assertThrows(() => {
        Room.create(id, name, building, roomType as unknown as RoomType);
    }, DomainException, "Room type cannot be empty.");
});

Deno.test("Room - load method with valid state", () => {
    // Arrange
    const state: RoomState = {
        id: "1",
        name: "Conference Room",
        building: Building.create("1", "Main Building", "123 Main St"),
        roomType: RoomType.create("1", "Meeting Room", "icon.png"),
        devices: []
    };

    // Act
    const room = Room.load(state);

    // Assert
    assertEquals(room.id, state.id);
    assertEquals(room.name, state.name);
    assertEquals(room.building, state.building);
    assertEquals(room.roomType, state.roomType);
    assertEquals(room.devices, state.devices);
});

Deno.test("Room - load method with empty name in state throws error", () => {
    // Arrange
    const state: RoomState = {
        id: "1",
        name: "",
        building: Building.create("1", "Main Building", "123 Main St"),
        roomType: RoomType.create("1", "Meeting Room", "icon.png"),
        devices: []
    };

    // Act & Assert
    assertThrows(() => {
        Room.load(state);
    }, DomainException, "Room name cannot be empty.");
});

Deno.test("Room - load method with null building in state throws error", () => {
    // Arrange
    const state: RoomState = {
        id: "1",
        name: "Conference Room",
        building: null,
        roomType: RoomType.create("1", "Meeting Room", "icon.png"),
        devices: []
    };

    // Act & Assert
    assertThrows(() => {
        Room.load(state);
    }, DomainException, "Building cannot be null.");
});

Deno.test("Room - load method with null roomType in state throws error", () => {
    // Arrange
    const state: RoomState = {
        id: "1",
        name: "Conference Room",
        building: Building.create("1", "Main Building", "123 Main St"),
        roomType: null,
        devices: []
    };

    // Act & Assert
    assertThrows(() => {
        Room.load(state);
    }, DomainException, "Room type cannot be null.");
});