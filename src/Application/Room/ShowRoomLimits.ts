import {
    OutputPort,
    RoomQueryDto,
    RoomQueryRepository,
    ShowRoomLimitsInput,
    ShowRoomLimitsOutput,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class ShowRoomLimits implements UseCase<ShowRoomLimitsInput> {
    private readonly _outputPort: OutputPort<ShowRoomLimitsOutput>;
    private readonly _roomRepository: RoomQueryRepository;
    private readonly _messaging: Messaging;

    constructor(
        outputPort: OutputPort<ShowRoomLimitsOutput>,
        roomRepository: RoomQueryRepository,
        messaging: Messaging
    ) {
        this._outputPort = outputPort;
        this._roomRepository = roomRepository;
        this._messaging = messaging;
    }

    async execute(input: ShowRoomLimitsInput): Promise<void> {
        const roomOptional = await this._roomRepository.find(input.roomDocumentId);

        const roomDto = roomOptional.orElseThrow(
            () => new Error(`Room with ID ${input.roomDocumentId} not found.`)
        );

        if (!roomDto.devices.length) {
            throw new Error("Room has no devices");
        }

        const device = roomDto.devices[0];
        if(!device) {
            throw new Error("Device not found");
        }

        const requestTopic = `devices/${device.identifier}/limits/request`;
        const responseTopic = `devices/${device.identifier}/limits/response`;

        await this._messaging.publish(requestTopic, "{}");
        const response = await this._messaging.waitForMessage(responseTopic, 5000);

        if (!response) {
            throw new Error("Device did not respond in time");
        }

        const limits = JSON.parse(response);
        const output = this.mapDtoToOutput(roomDto, limits);
        this._outputPort.present(output);
    }

    private mapDtoToOutput(dto: RoomQueryDto, limits: RoomLimits): ShowRoomLimitsOutput {
        return {
            documentId: dto.documentId,
            limits
        };
    }
}
