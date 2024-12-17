import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { ShowDeviceDataByDocumentIdInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowDeviceDataByDocumentIdRequest {
	deviceDataDocumentId: string;
}

export class ShowDeviceDataByDocumentIdController
	implements Controller<ShowDeviceDataByDocumentIdRequest> {
	private readonly _useCase: UseCase<ShowDeviceDataByDocumentIdInput>;

	constructor(useCase: UseCase<ShowDeviceDataByDocumentIdInput>) {
		this._useCase = useCase;
	}

	public async handle(
		request: ShowDeviceDataByDocumentIdRequest,
	): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: ShowDeviceDataByDocumentIdRequest,
	): ShowDeviceDataByDocumentIdInput {
		return { deviceDataDocumentId: request.deviceDataDocumentId };
	}
}
