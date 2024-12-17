import { View } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface ConsoleDevice<Data> {
	update(data: Data): void;
}

export class Console<Data> implements ConsoleDevice<Data> {
	private readonly _view: View<Data>;

	constructor(view: View<Data>) {
		this._view = view;
	}

	public update(data: Data): void {
		const output = this._view.render(data);

		console.log(output);
	}
}
