import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	ShowDeviceDataInput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowDeviceDataRequest {
	identifier: string;
}

export class ShowDeviceDataController
	implements Controller<ShowDeviceDataRequest> {
	private readonly _useCase: UseCase<ShowDeviceDataInput>;

	constructor(useCase: UseCase<ShowDeviceDataInput>) {
		this._useCase = useCase;
	}

	public async handle(request: ShowDeviceDataRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: ShowDeviceDataRequest,
	): ShowDeviceDataInput {
		return { identifier: request.identifier };
	}
}
