import {
	DeviceDataRepository,
	DeviceRepository,
	ProcessDeviceDataInput,
	UpdateDeviceLimitInput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { ProcessDeviceData, UpdateDeviceLimit } from "EnviroSense/Application/mod.ts";
import { DeviceDataStrapiRepository, DeviceStrapiRepository, RoomStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { FirebaseMessaging, MessagingBuilder } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { UpdateDeviceLimitPresenter } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { UpdateDeviceLimitPresentedData } from "EnviroSense/Infrastructure/WebApi/mod.ts";

export class MessagingUseCaseFactory {
	private deviceRepository: DeviceRepository;
	private deviceDataRepository: DeviceDataRepository;
	private roomRepository: RoomStrapiRepository;
	private firebaseMessaging: FirebaseMessaging;
	private updateDeviceLimitPresenter: UpdateDeviceLimitPresenter;

	constructor() {
		this.deviceRepository = new DeviceStrapiRepository();
		this.deviceDataRepository = new DeviceDataStrapiRepository();
		this.roomRepository = new RoomStrapiRepository();
		this.firebaseMessaging = new FirebaseMessaging();
		this.updateDeviceLimitPresenter = new UpdateDeviceLimitPresenter(new RequestResponse<UpdateDeviceLimitPresentedData>());
	}

	createProcessDeviceDataUseCase(): UseCase<ProcessDeviceDataInput> {
		return new ProcessDeviceData(
			this.deviceRepository,
			this.deviceDataRepository,
			this.firebaseMessaging,
			this.roomRepository,
		);
	}

	updateDeviceLimitUseCase(): UseCase<UpdateDeviceLimitInput> {
		return new UpdateDeviceLimit(
			this.updateDeviceLimitPresenter,
			this.deviceRepository,
			MessagingBuilder.getInstance(),
		);
	}
}
