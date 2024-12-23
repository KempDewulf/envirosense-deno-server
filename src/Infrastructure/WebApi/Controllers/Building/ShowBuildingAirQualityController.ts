import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { ShowBuildingAirQualityInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowBuildingAirQualityRequest {
	buildingDocumentId: string;
}

export class ShowBuildingAirQualityController implements Controller<ShowBuildingAirQualityRequest> {
	private readonly _useCase: UseCase<ShowBuildingAirQualityInput>;

	constructor(useCase: UseCase<ShowBuildingAirQualityInput>) {
		this._useCase = useCase;
	}

	public async handle(request: ShowBuildingAirQualityRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: ShowBuildingAirQualityRequest,
	): ShowBuildingAirQualityInput {
		return { buildingDocumentId: request.buildingDocumentId };
	}
}
