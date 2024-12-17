import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	ShowDevicesInput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowDevicesRequest {
	identifier: string;
}

export class ShowDevicesController implements Controller<ShowDevicesRequest> {
	private readonly _useCase: UseCase<ShowDevicesInput>;

	constructor(useCase: UseCase<ShowDevicesInput>) {
		this._useCase = useCase;
	}

	public async handle(request: ShowDevicesRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(request: ShowDevicesRequest): ShowDevicesInput {
		return { identifier: request.identifier };
	}
}
