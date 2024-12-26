import { DomainException } from "EnviroSense/Domain/mod.ts";

export interface RoomTypeState {
	documentId: string;
	name: string;
	icon: string;
}

export class RoomType {
	private readonly _id: string;
	private _name: string;
	private _icon: string;

	private constructor(documentId: string, name: string, icon: string) {
		this._id = documentId;
		this._name = name;
		this._icon = icon;
	}

	static create(documentId: string, name: string, icon: string): RoomType {
		const roomType = new RoomType(documentId, name, icon);
		roomType.validateState();

		return roomType;
	}

	static load(state: RoomTypeState): RoomType {
		const roomType = new RoomType(state.documentId, state.name, state.icon);
		roomType.validateState();

		return roomType;
	}

	public updateName(name: string): void {
		if (!name) {
			throw new DomainException("Name is required.");
		}
		this._name = name;
	}

	public updateIcon(icon: string): void {
		if (!icon) {
			throw new DomainException("Icon is required.");
		}
		this._icon = icon;
	}

	public validateState(): void {
		this.ensureNameIsNotEmpty();
		this.ensureIconIsNotEmpty();
	}

	private ensureNameIsNotEmpty(): void {
		if (!this._name) {
			throw new DomainException("Room type name is required.");
		}
	}

	private ensureIconIsNotEmpty(): void {
		if (!this._icon) {
			throw new DomainException(
				"Room type icon is required. Enter the ID of the icon.",
			);
		}
	}

	get documentId(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get icon(): string {
		return this._icon;
	}
}
