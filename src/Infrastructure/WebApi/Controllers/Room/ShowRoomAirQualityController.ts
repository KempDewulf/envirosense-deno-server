import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { ShowRoomAirQualityInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowRoomAirQualityRequest {
	roomDocumentId: string;
}

export class ShowRoomAirQualityController implements Controller<ShowRoomAirQualityRequest> {
	private readonly _useCase: UseCase<ShowRoomAirQualityInput>;

	constructor(useCase: UseCase<ShowRoomAirQualityInput>) {
		this._useCase = useCase;
	}

	public async handle(request: ShowRoomAirQualityRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: ShowRoomAirQualityRequest,
	): ShowRoomAirQualityInput {
		return { roomDocumentId: request.roomDocumentId };
	}
}
