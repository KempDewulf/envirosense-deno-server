import {
	DeviceConfig,
	DeviceConfigType,
	DeviceData,
	DeviceLimit,
	DeviceLimitType,
	DeviceUiModeType,
	DomainException,
	Room,
} from "EnviroSense/Domain/mod.ts";

export interface DeviceState {
	documentId: string;
	identifier: string;
	room?: Room | null;
	deviceData?: DeviceData[];
	limits?: Map<DeviceLimitType, DeviceLimit>;
	config?: DeviceConfig;
}

export class Device {
	private readonly _documentId: string;
	private _identifier: string;
	private _room: Room | null;
	private _deviceData: DeviceData[];
	private _limits: Map<DeviceLimitType, DeviceLimit>;
	private _config: DeviceConfig;

	private constructor(
		documentId: string,
		identifier: string,
		room: Room | null,
	) {
		this._documentId = documentId;
		this._identifier = identifier;
		this._room = room;
		this._deviceData = [];
		this._limits = new Map<DeviceLimitType, DeviceLimit>();
		this._config = DeviceConfig.create();
	}

	static create(documentId: string, identifier: string, room: Room): Device {
		const device = new Device(documentId, identifier, room);
		device.validateState();

		return device;
	}

	static load(state: DeviceState): Device {
		const device = new Device(
			state.documentId,
			state.identifier,
			state.room || null,
		);

		device._deviceData = state.deviceData ?? [];
		device._limits = state.limits ?? new Map<DeviceLimitType, DeviceLimit>();
		device._config = state.config ?? DeviceConfig.create();

		device.validateState();

		return device;
	}

	public updateIdentifier(identifier: string): void {
		if (!identifier) {
			throw new DomainException("Identifier is required.");
		}
		this._identifier = identifier;
	}

	public validateState(): void {
		this.ensureIdentifierIsNotEmpty();
	}

	public addDeviceData(deviceData: DeviceData): void {
		if (!deviceData) {
			throw new DomainException("DeviceData is required.");
		}

		this._deviceData.push(deviceData);
	}

	public addRoom(room: Room): void {
		if (room.building === null) {
			throw new DomainException("Room must be assigned to a building.");
		}

		room.building.ensureRoomExists(room.documentId);
		this._room = room;
	}

	public removeRoom(): void {
		this.ensureRoomIsNotEmpty();
		this._room = null;
	}

	public updateLimit(limit: DeviceLimit): void {
		limit.validate();
		this._limits.set(limit.type, limit);
	}

	public getLimit(type: DeviceLimitType): DeviceLimit | undefined {
		return this._limits.get(type);
	}

	public updateUiMode(uiMode: DeviceUiModeType): void {
		this._config.setUiMode(uiMode);
	}

	public getUiMode(): DeviceUiModeType {
		return this._config.getValue(DeviceConfigType.UI_MODE)?.value as DeviceUiModeType;
	}

	public updateBrightness(brightness: number): void {
		this._config.setBrightness(brightness);
	}

	public getBrightness(): number {
		return this._config.getValue(DeviceConfigType.BRIGHTNESS)?.value as number;
	}

	private ensureIdentifierIsNotEmpty(): void {
		if (!this._identifier) {
			throw new DomainException("Identifier is required.");
		}
	}

	private ensureRoomIsNotEmpty(): void {
		if (!this._room) {
			throw new DomainException("Room is required.");
		}
	}

	get documentId(): string {
		return this._documentId;
	}

	get identifier(): string {
		return this._identifier;
	}

	set identifier(identifier: string) {
		this._identifier = identifier;
	}

	get room(): Room | null {
		return this._room;
	}

	set room(room: Room | null) {
		this._room = room;
	}

	get deviceData(): DeviceData[] {
		return this._deviceData;
	}

	set deviceData(deviceData: DeviceData[]) {
		this._deviceData = deviceData;
	}

	get limits(): Map<DeviceLimitType, DeviceLimit> {
		return new Map(this._limits);
	}
}
