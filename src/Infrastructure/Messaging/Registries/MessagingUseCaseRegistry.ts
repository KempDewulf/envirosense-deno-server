import { ProcessDeviceDataInput, UpdateDeviceLimitInput, UpdateDeviceUiModeInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface MessagingUseCaseRegistry {
	processDeviceDataUseCase: UseCase<ProcessDeviceDataInput> | undefined;
	updateDeviceLimitUseCase: UseCase<UpdateDeviceLimitInput> | undefined;
	updateDeviceUiModeUseCase: UseCase<UpdateDeviceUiModeInput> | undefined;
}
