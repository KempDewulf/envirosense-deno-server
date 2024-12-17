import { CreateRoomTypeInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface CreateRoomTypeRequest {
	name: string;
	icon: string;
}

export class CreateRoomTypeController implements Controller<CreateRoomTypeRequest> {
	private readonly _useCase: UseCase<CreateRoomTypeInput>;

	constructor(useCase: UseCase<CreateRoomTypeInput>) {
		this._useCase = useCase;
	}

	public async handle(request: CreateRoomTypeRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(request: CreateRoomTypeRequest): CreateRoomTypeInput {
		return {
			name: request.name,
			icon: request.icon,
		};
	}
}
