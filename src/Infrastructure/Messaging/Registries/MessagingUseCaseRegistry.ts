import { ProcessDeviceDataInput, UpdateDeviceLimitInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface MessagingUseCaseRegistry {
	processDeviceDataUseCase: UseCase<ProcessDeviceDataInput>;
	updateDeviceLimitUseCase: UseCase<UpdateDeviceLimitInput>;
}
