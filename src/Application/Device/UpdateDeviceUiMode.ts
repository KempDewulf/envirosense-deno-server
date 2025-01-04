import {
    DeviceRepository,
    OutputPort,
    UpdateDeviceUiModeInput,
    UpdateDeviceUiModeOutput,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { DeviceUiModeType, UiMode } from "EnviroSense/Domain/mod.ts";

export class UpdateDeviceUiMode implements UseCase<UpdateDeviceUiModeInput> {
    private readonly _outputPort: OutputPort<UpdateDeviceUiModeOutput>;
    private readonly _deviceRepository: DeviceRepository;
    private readonly _messaging: Messaging;

    constructor(
        outputPort: OutputPort<UpdateDeviceUiModeOutput>,
        deviceRepository: DeviceRepository,
        messaging: Messaging,
    ) {
        this._outputPort = outputPort;
        this._deviceRepository = deviceRepository;
        this._messaging = messaging;
    }

    public async execute(input: UpdateDeviceUiModeInput): Promise<void> {
        const deviceOptional = await this._deviceRepository.find(input.deviceDocumentId);
        const device = deviceOptional.orElseThrow(
            () => new Error(`Device with ID ${input.deviceDocumentId} not found.`),
        );

        const uiMode = new UiMode(input.mode as DeviceUiModeType);
        device.updateUiMode(uiMode);

        const topic = `devices/${device.identifier}/config/ui-mode`;
        const message = JSON.stringify({
            mode: uiMode.type,
        });

        await this._messaging.publish(topic, message);

        const output: UpdateDeviceUiModeOutput = {
            documentId: device.documentId,
            mode: uiMode.type,
        };

        this._outputPort.present(output);
    }
}
