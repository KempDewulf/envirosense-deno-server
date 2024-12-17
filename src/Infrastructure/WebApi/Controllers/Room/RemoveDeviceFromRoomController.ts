import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	RemoveDeviceFromRoomInput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export interface RemoveDeviceFromRoomRequest {
	roomDocumentId: string;
	deviceDocumentId: string;
}

export class RemoveDeviceFromRoomController
	implements Controller<RemoveDeviceFromRoomRequest> {
	private readonly _useCase: UseCase<RemoveDeviceFromRoomInput>;

	constructor(useCase: UseCase<RemoveDeviceFromRoomInput>) {
		this._useCase = useCase;
	}

	handle(request: RemoveDeviceFromRoomRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		return this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: RemoveDeviceFromRoomRequest,
	): RemoveDeviceFromRoomInput {
		return {
			roomDocumentId: request.roomDocumentId,
			deviceDocumentId: request.deviceDocumentId,
		};
	}
}
