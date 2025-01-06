import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { ShowRoomLimitsInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowRoomLimitsRequest {
	roomDocumentId: string;
}

export class ShowRoomLimitsController implements Controller<ShowRoomLimitsRequest> {
	private readonly _useCase: UseCase<ShowRoomLimitsInput>;

	constructor(useCase: UseCase<ShowRoomLimitsInput>) {
		this._useCase = useCase;
	}

	public async handle(request: ShowRoomLimitsRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(request: ShowRoomLimitsRequest): ShowRoomLimitsInput {
		return { roomDocumentId: request.roomDocumentId };
	}
}
