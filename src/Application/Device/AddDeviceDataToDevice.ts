import {
    AddDeviceDataToDeviceInput,
    DeviceDataRepository,
    DeviceRepository,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceDataOperation } from "EnviroSense/Infrastructure/Persistence/Repositories/Strapi/Device/DeviceStrapiRepository.ts";

export class AddDeviceDataToDevice
    implements UseCase<AddDeviceDataToDeviceInput>
{
    private readonly _deviceRepository: DeviceRepository;
    private readonly _deviceDataRepository: DeviceDataRepository;

    constructor(
        deviceRepository: DeviceRepository,
        deviceDataRepository: DeviceDataRepository
    ) {
        this._deviceRepository = deviceRepository;
        this._deviceDataRepository = deviceDataRepository;
    }

    async execute(input: AddDeviceDataToDeviceInput): Promise<void> {
        const deviceOptional = await this._deviceRepository.find(
            input.deviceDocumentId
        );
        const device = deviceOptional.orElseThrow(
            () =>
                new Error(`Device with ID ${input.deviceDocumentId} not found.`)
        );

        const deviceDataDocumentIdsToConnect: string[] = [];

        for (const deviceDataDocumentId of input.device_data) {
            const deviceDataOptional = await this._deviceDataRepository.find(
                deviceDataDocumentId
            );

            const deviceData = deviceDataOptional.orElseThrow(
                () =>
                    new Error(
                        `DeviceData with documentId ${deviceDataDocumentId} not found.`
                    )
            );

            device.addDeviceData(deviceData);

            deviceDataDocumentIdsToConnect.push(deviceData.id);
        }

        await this._deviceRepository.manageDeviceData(
            device.documentId,
            deviceDataDocumentIdsToConnect,
            DeviceDataOperation.ADD
        );
    }
}
