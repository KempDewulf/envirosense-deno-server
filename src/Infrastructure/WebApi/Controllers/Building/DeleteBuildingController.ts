import { DeleteBuildingInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface DeleteBuildingRequest {
	buildingDocumentId: string;
}

export class DeleteBuildingController implements Controller<DeleteBuildingRequest> {
	private readonly _useCase: UseCase<DeleteBuildingInput>;

	constructor(useCase: UseCase<DeleteBuildingInput>) {
		this._useCase = useCase;
	}

	public async handle(request: DeleteBuildingRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: DeleteBuildingRequest,
	): DeleteBuildingInput {
		return {
			buildingDocumentId: request.buildingDocumentId,
		};
	}
}
