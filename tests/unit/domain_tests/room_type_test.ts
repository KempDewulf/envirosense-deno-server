import { assertEquals, assertThrows } from "@std/assert";
import { RoomType, RoomTypeState } from "EnviroSense/Domain/mod.ts";
import { DomainException } from "EnviroSense/Domain/mod.ts";

Deno.test("RoomType - create method with valid parameters", () => {
    // Arrange
    const id = "1";
    const name = "Living Room";
    const icon = "icon.png";

    // Act
    const roomType = RoomType.create(id, name, icon);

    // Assert
    assertEquals(roomType.id, id);
    assertEquals(roomType.name, name);
    assertEquals(roomType.icon, icon);
});

Deno.test("RoomType - create method with empty name throws error", () => {
    // Arrange
    const id = "1";
    const name = "";
    const icon = "icon.png";

    // Act & Assert
    assertThrows(() => {
        RoomType.create(id, name, icon);
    }, DomainException, "Room type name cannot be empty.");
});

Deno.test("RoomType - create method with empty icon throws error", () => {
    // Arrange
    const id = "1";
    const name = "Living Room";
    const icon = "";

    // Act & Assert
    assertThrows(() => {
        RoomType.create(id, name, icon);
    }, DomainException, "Room type icon cannot be empty.");
});

Deno.test("RoomType - load method with valid state", () => {
    // Arrange
    const state: RoomTypeState = { id: "1", name: "Living Room", icon: "icon.png" };

    // Act
    const roomType = RoomType.load(state);

    // Assert
    assertEquals(roomType.id, state.id);
    assertEquals(roomType.name, state.name);
    assertEquals(roomType.icon, state.icon);
});

Deno.test("RoomType - load method with empty name in state throws error", () => {
    // Arrange
    const state: RoomTypeState = { id: "1", name: "", icon: "icon.png" };

    // Act & Assert
    assertThrows(() => {
        RoomType.load(state);
    }, DomainException, "Room type name cannot be empty.");
});

Deno.test("RoomType - load method with empty icon in state throws error", () => {
    // Arrange
    const state: RoomTypeState = { id: "1", name: "Living Room", icon: "" };

    // Act & Assert
    assertThrows(() => {
        RoomType.load(state);
    }, DomainException, "Room type icon cannot be empty.");
});