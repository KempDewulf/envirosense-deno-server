export class RoomTypeNotFoundError extends Error {
	constructor(roomTypeId: string) {
		super(`Room Type with ID ${roomTypeId} not found.`);
		this.name = "RoomTypeNotFoundError";
	}
}
