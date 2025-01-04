import {
	DeviceDataRepository,
	DeviceRepository,
	ProcessDeviceDataInput,
	UpdateDeviceBrightnessInput,
	UpdateDeviceLimitInput,
	UpdateDeviceUiModeInput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { ProcessDeviceData, UpdateDeviceLimit, UpdateDeviceUiMode, UpdateDeviceBrightness } from "EnviroSense/Application/mod.ts";
import { DeviceDataStrapiRepository, DeviceStrapiRepository, RoomStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { FirebaseMessaging, MessagingBuilder } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { UpdateDeviceLimitPresenter, UpdateDeviceUiModePresentedData, UpdateDeviceUiModePresenter, UpdateDeviceBrightnessPresenter, UpdateDeviceBrightnessPresentedData } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { UpdateDeviceLimitPresentedData } from "EnviroSense/Infrastructure/WebApi/mod.ts";

export class MessagingUseCaseFactory {
	private deviceRepository: DeviceRepository;
	private deviceDataRepository: DeviceDataRepository;
	private roomRepository: RoomStrapiRepository;
	private firebaseMessaging: FirebaseMessaging;

	constructor() {
		this.deviceRepository = new DeviceStrapiRepository();
		this.deviceDataRepository = new DeviceDataStrapiRepository();
		this.roomRepository = new RoomStrapiRepository();
		this.firebaseMessaging = new FirebaseMessaging();
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
		const presenter = new UpdateDeviceLimitPresenter(
			new RequestResponse<UpdateDeviceLimitPresentedData>(),
		);
		return new UpdateDeviceLimit(
			presenter,
			this.deviceRepository,
			MessagingBuilder.getInstance(),
		);
	}

	updateDeviceUiModeUseCase(): UseCase<UpdateDeviceUiModeInput> {
		const presenter = new UpdateDeviceUiModePresenter(
			new RequestResponse<UpdateDeviceUiModePresentedData>(),
		);
		return new UpdateDeviceUiMode(
			presenter,
			this.deviceRepository,
			MessagingBuilder.getInstance(),
		);
	}

	updateDeviceBrightnessUseCase(): UseCase<UpdateDeviceBrightnessInput> {
		const presenter = new UpdateDeviceBrightnessPresenter(
			new RequestResponse<UpdateDeviceBrightnessPresentedData>(),
		);
		return new UpdateDeviceBrightness(
			presenter,
			this.deviceRepository,
			MessagingBuilder.getInstance(),
		);
	}
}
