import {
    DeleteAllDeviceDataFromDeviceInput,
    DeviceDataRepository,
    DeviceRepository,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceDataStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { DeviceData } from "EnviroSense/Domain/mod.ts";

export class DeleteAllDeviceDataFromDevice
    implements UseCase<DeleteAllDeviceDataFromDeviceInput>
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

    public async execute(
        input: DeleteAllDeviceDataFromDeviceInput
    ): Promise<void> {
        const device = (
            await this._deviceRepository.find(input.deviceDocumentId)
        ).orElseThrow(
            () =>
                new Error(`Device with ID ${input.deviceDocumentId} not found.`)
        );

        const deviceData = await new DeviceDataStrapiQueryRepository().all(
            device.identifier
        );

        const deletePromises = deviceData.map((data) => {
            const deviceDataEntity = DeviceData.create(
                data.documentId,
                data.device,
                data.timestamp,
                data.airData
            );

            return this._deviceDataRepository
                .deleteEntity(deviceDataEntity)
                .catch((error) => {
                    console.error(
                        `Failed to delete data ${data.documentId}: ${error.message}`
                    );
                    throw new Error(
                        `Failed to delete device data ${data.documentId}`
                    );
                });
        });

        await Promise.all(deletePromises);

        device.deviceData = [];
    }
}
