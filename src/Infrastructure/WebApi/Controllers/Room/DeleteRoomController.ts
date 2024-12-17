import { DeleteRoomInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface DeleteRoomRequest {
	roomDocumentId: string;
}

export class DeleteRoomController implements Controller<DeleteRoomRequest> {
	private readonly _useCase: UseCase<DeleteRoomInput>;

	constructor(useCase: UseCase<DeleteRoomInput>) {
		this._useCase = useCase;
	}

	public async handle(request: DeleteRoomRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(request: DeleteRoomRequest): DeleteRoomInput {
		return {
			roomDocumentId: request.roomDocumentId,
		};
	}
}
