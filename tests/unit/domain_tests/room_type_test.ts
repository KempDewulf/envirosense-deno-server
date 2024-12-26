import { assertEquals, assertThrows } from "@std/assert";
import {
    DomainException,
    RoomType,
    RoomTypeState,
} from "EnviroSense/Domain/mod.ts";

Deno.test("RoomType - create method with valid parameters", () => {
    // Arrange
    const documentId = "1";
    const name = "Living Room";
    const icon = "icon.png";

    // Act
    const roomType = RoomType.create(documentId, name, icon);

    // Assert
    assertEquals(roomType.documentId, documentId);
    assertEquals(roomType.name, name);
    assertEquals(roomType.icon, icon);
});

Deno.test("RoomType - create method with empty name throws error", () => {
    // Arrange
    const documentId = "1";
    const name = "";
    const icon = "icon.png";

    // Act & Assert
    assertThrows(
        () => {
            RoomType.create(documentId, name, icon);
        },
        DomainException,
        "Room type name is required."
    );
});

Deno.test("RoomType - create method with empty icon throws error", () => {
    // Arrange
    const documentId = "1";
    const name = "Living Room";
    const icon = "";

    // Act & Assert
    assertThrows(
        () => {
            RoomType.create(documentId, name, icon);
        },
        DomainException,
        "Room type icon is required."
    );
});

Deno.test("RoomType - load method with valid state", () => {
    // Arrange
    const state: RoomTypeState = {
        documentId: "1",
        name: "Living Room",
        icon: "icon.png",
    };

    // Act
    const roomType = RoomType.load(state);

    // Assert
    assertEquals(roomType.documentId, state.documentId);
    assertEquals(roomType.name, state.name);
    assertEquals(roomType.icon, state.icon);
});

Deno.test(
    "RoomType - load method with empty name in state throws error",
    () => {
        // Arrange
        const state: RoomTypeState = {
            documentId: "1",
            name: "",
            icon: "icon.png",
        };

        // Act & Assert
        assertThrows(
            () => {
                RoomType.load(state);
            },
            DomainException,
            "Room type name is required."
        );
    }
);

Deno.test(
    "RoomType - load method with empty icon in state throws error",
    () => {
        // Arrange
        const state: RoomTypeState = {
            documentId: "1",
            name: "Living Room",
            icon: "",
        };

        // Act & Assert
        assertThrows(
            () => {
                RoomType.load(state);
            },
            DomainException,
            "Room type icon is required."
        );
    }
);
