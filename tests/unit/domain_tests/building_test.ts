import { assertEquals, assertThrows } from "@std/assert";
import { Building, DomainException, Room, RoomType } from "EnviroSense/Domain/mod.ts";


Deno.test("Building - create method with valid parameters", () => {
    // Arrange
    const id = "1";
    const name = "Main Building";
    const address = "123 Main St";

    // Act
    const building = Building.create(id, name, address);

    // Assert
    assertEquals(building.id, id);
    assertEquals(building.name, name);
    assertEquals(building.address, address);
});

Deno.test("Building - create method with empty name throws error", () => {
    // Arrange
    const id = "2";
    const name = "";
    const address = "123 Main St";

    // Act & Assert
    assertThrows(() => {
        Building.create(id, name, address);
    }, DomainException, "Name is required");
});

Deno.test("Building - create method with empty address throws error", () => {
    // Arrange
    const id = "3";
    const name = "Main Building";
    const address = "";

    // Act & Assert
    assertThrows(() => {
        Building.create(id, name, address);
    }, DomainException, "Address is required");
});

Deno.test("Building - load method with valid state", () => {
    // Arrange
    const state = {
        id: "4",
        name: "Main Building",
        address: "123 Main St",
        rooms: []
    };

    // Act
    const building = Building.load(state);

    // Assert
    assertEquals(building.id, state.id);
    assertEquals(building.name, state.name);
    assertEquals(building.address, state.address);
});

Deno.test("Building - load method with empty name in state throws error", () => {
    // Arrange
    const state = {
        id: "5",
        name: "",
        address: "123 Main St",
        rooms: []
    };

    // Act & Assert
    assertThrows(() => {
        Building.load(state);
    }, DomainException, "Name is required");
});

Deno.test("Building - addRoom method adds room to the building", () => {
    // Arrange
    const building = Building.create("6", "Main Building", "123 Main St");
    const roomType = RoomType.create("1", "Office", "office_icon.png");
    const room = Room.create("1", "Office Room", building, roomType);

    // Act
    building.addRoom(room);

    // Assert
    assertEquals(building.rooms.length, 1);
    assertEquals(building.rooms[0], room);
});

Deno.test("Building - addRoom method with existing room throws error", () => {
    // Arrange
    const building = Building.create("7", "Main Building", "123 Main St");
    const roomType = RoomType.create("2", "Office", "office_icon.png");
    const room = Room.create("2", "Office Room", building, roomType);
    building.addRoom(room);

    // Act & Assert
    assertThrows(() => {
        building.addRoom(room);
    }, DomainException, "Room 2 already exists");
});

Deno.test("Building - removeRoom method removes room from the building", () => {
    // Arrange
    const building = Building.create("8", "Main Building", "123 Main St");
    const roomType = RoomType.create("3", "Office", "office_icon.png");
    const room = Room.create("3", "Office Room", building, roomType);
    building.addRoom(room);

    // Act
    building.removeRoom(room.id);

    // Assert
    assertEquals(building.rooms.length, 0);
});

Deno.test("Building - removeRoom method with non-existent room throws error", () => {
    // Arrange
    const building = Building.create("9", "Main Building", "123 Main St");

    // Act & Assert
    assertThrows(() => {
        building.removeRoom("non_existent_room_id");
    }, DomainException, "Room does not exist");
});

Deno.test("Building - ensureRoomExists method with existing room does not throw error", () => {
    // Arrange
    const building = Building.create("10", "Main Building", "123 Main St");
    const roomType = RoomType.create("4", "Conference", "conference_icon.png");
    const room = Room.create("4", "Conference Room", building, roomType);
    building.addRoom(room);

    console.log(building.rooms);

    // Act & Assert
    building.ensureRoomExists(room.id);
});

Deno.test("Building - ensureRoomExists method with non-existent room throws error", () => {
    // Arrange
    const building = Building.create("11", "Main Building", "123 Main St");

    // Act & Assert
    assertThrows(() => {
        building.ensureRoomExists("non_existent_room_id");
    }, DomainException, "Room does not exist");
});
