import { View } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface RequestResponseDevice<Data> {
	response: Data | string;
	update(data: Data): void;
}

export class RequestResponse<Data> implements RequestResponseDevice<Data> {
	private _data: Data | undefined;
	private readonly _view?: View<Data>;

	constructor(view?: View<Data>) {
		this._view = view;
	}

	public get response(): Data | string {
		if (!this._data) {
			return "";
		}

		if (!this._view) {
			return this._data!;
		}

		const render = this._view.render(this._data!);

		return render || "";
	}

	public update(data: Data): void {
		this._data = data;
	}
}
