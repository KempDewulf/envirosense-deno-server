import { Module } from "EnviroSense/Infrastructure/Shared/Modules/Module.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/Messaging.ts";
import {
    DeviceDataRepository,
    DeviceRepository,
    ProcessDeviceDataInput,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { ProcessDeviceData } from "EnviroSense/Application/mod.ts";
import {
    DeviceStrapiRepository,
    DeviceDataStrapiRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";

export class MessagingModule implements Module {
    private messaging: Messaging;
    private processDeviceDataUseCase: UseCase<ProcessDeviceDataInput>;

    constructor() {
        const deviceRepository: DeviceRepository = new DeviceStrapiRepository();
        const deviceDataRepository: DeviceDataRepository =
            new DeviceDataStrapiRepository();

        this.processDeviceDataUseCase = new ProcessDeviceData(
            deviceRepository,
            deviceDataRepository
        );

        this.messaging = new Messaging(this.processDeviceDataUseCase);
    }

    public async run(): Promise<void> {
        console.log("Messaging module started");

        await this.messaging.connect();
        await this.messaging.subscribe("test/#");
    }
}
