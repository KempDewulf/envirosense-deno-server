import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { ShowBuildingsInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowBuildingsRequest {
	name: string;
}

export class ShowBuildingsController implements Controller<ShowBuildingsRequest> {
	private readonly _useCase: UseCase<ShowBuildingsInput>;

	constructor(useCase: UseCase<ShowBuildingsInput>) {
		this._useCase = useCase;
	}

	public async handle(request: ShowBuildingsRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: ShowBuildingsRequest,
	): ShowBuildingsInput {
		return { name: request.name };
	}
}
