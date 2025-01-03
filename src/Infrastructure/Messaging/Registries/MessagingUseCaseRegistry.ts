import { ProcessDeviceDataInput, UpdateDeviceLimitInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface MessagingUseCaseRegistry {
	processDeviceDataUseCase: UseCase<ProcessDeviceDataInput> | undefined;
	updateDeviceLimitUseCase: UseCase<UpdateDeviceLimitInput> | undefined;
}
