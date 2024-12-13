import { assertEquals, assertThrows } from "@std/assert";
import { Building, Device, DeviceData, Room, RoomType, AirData, DeviceDataState } from "EnviroSense/Domain/mod.ts";

Deno.test("DeviceData - create method with valid parameters", () => {
    // Arrange
    const id = "1";
    const building = Building.create("1", "Main Building", "123 Main St");
    const roomType = RoomType.create("1", "Office", "office_icon.png");
    const room = Room.create("1", "Office Room", building, roomType);
    const device = Device.create("1", "Device001", room, []);
    const timestamp = new Date();
    const airData: AirData = { temperature: 25, humidity: 50, ppm: 400 };
    
    // Act
    const deviceData = DeviceData.create(id, device, timestamp, airData);
    
    // Assert
    assertEquals(deviceData.id, id);
    assertEquals(deviceData.device, device);
    assertEquals(deviceData.timestamp, timestamp);
    assertEquals(deviceData.airData, airData);
});

Deno.test("DeviceData - create method with null device throws error", () => {
    // Arrange
    const id = "2";
    const device = null;
    const timestamp = new Date();
    const airData: AirData = { temperature: 25, humidity: 50, ppm: 400 };
    
    // Act & Assert
    assertThrows(() => {
        DeviceData.create(id, device as unknown as Device, timestamp, airData);
    }, Error, "Device is required");
});

Deno.test("DeviceData - create method with null timestamp throws error", () => {
    // Arrange
    const id = "3";
    const building = Building.create("3", "Main Building", "123 Main St");
    const roomType = RoomType.create("3", "Office", "office_icon.png");
    const room = Room.create("3", "Office Room", building, roomType);
    const device = Device.create("3", "Device003", room, []);
    const timestamp = null;
    const airData: AirData = { temperature: 25, humidity: 50, ppm: 400 };
    
    // Act & Assert
    assertThrows(() => {
        DeviceData.create(id, device, timestamp as unknown as Date, airData);
    }, Error, "Timestamp is required");
});

Deno.test("DeviceData - create method with null airData throws error", () => {
    // Arrange
    const id = "4";
    const building = Building.create("4", "Main Building", "123 Main St");
    const roomType = RoomType.create("4", "Office", "office_icon.png");
    const room = Room.create("4", "Office Room", building, roomType);
    const device = Device.create("4", "Device004", room, []);
    const timestamp = new Date();
    const airData = null;
    
    // Act & Assert
    assertThrows(() => {
        DeviceData.create(id, device, timestamp, airData as unknown as AirData);
    }, Error, "AirData is required");
});

Deno.test("DeviceData - create method with invalid airData throws error", () => {
    // Arrange
    const id = "5";
    const building = Building.create("5", "Main Building", "123 Main St");
    const roomType = RoomType.create("5", "Office", "office_icon.png");
    const room = Room.create("5", "Office Room", building, roomType);
    const device = Device.create("5", "Device005", room, []);
    const timestamp = new Date();
    const airData = { temperature: null, humidity: 50, ppm: 400 };
    
    // Act & Assert
    assertThrows(() => {
        DeviceData.create(id, device, timestamp, airData as unknown as AirData);
    }, Error, "Temperature is required in AirData");
});

Deno.test("DeviceData - load method with valid state", () => {
    // Arrange
    const building = Building.create("6", "Main Building", "123 Main St");
    const roomType = RoomType.create("6", "Office", "office_icon.png");
    const room = Room.create("6", "Office Room", building, roomType);
    const device = Device.create("6", "Device006", room, []);
    const state: DeviceDataState = {
        id: "6",
        device: device,
        timestamp: new Date(),
        airData: { temperature: 25, humidity: 50, ppm: 400 }
    };
    
    // Act
    const deviceData = DeviceData.load(state);
    
    // Assert
    assertEquals(deviceData.id, state.id);
    assertEquals(deviceData.device, state.device);
    assertEquals(deviceData.timestamp, state.timestamp);
    assertEquals(deviceData.airData, state.airData);
});

Deno.test("DeviceData - load method with null device in state throws error", () => {
    // Arrange
    const state = {
        id: "7",
        device: null,
        timestamp: new Date(),
        airData: { temperature: 25, humidity: 50, ppm: 400 }
    };
    
    // Act & Assert
    assertThrows(() => {
        DeviceData.load(state as unknown as DeviceDataState);
    }, Error, "Device is required");
});