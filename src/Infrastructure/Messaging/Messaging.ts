import { Client } from 'https://deno.land/x/mqtt@0.1.2/deno/mod.ts';
import { AirData } from 'EnviroSense/Domain/mod.ts';
import { ProcessDeviceDataInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import 'jsr:@std/dotenv/load';

export class Messaging {
    private client: Client;
    private processDeviceDataUseCase: UseCase<ProcessDeviceDataInput>;

    constructor(processDeviceDataUseCase: UseCase<ProcessDeviceDataInput>) {
        this.client = new Client({
            url: Deno.env.get('MQTT_BROKER'),
            username: Deno.env.get('MQTT_USERNAME'),
            password: Deno.env.get('MQTT_PASSWORD'),
        });
        this.processDeviceDataUseCase = processDeviceDataUseCase;
    }

    public async connect(): Promise<void> {
        await this.client.connect();
    }

    public async subscribe(topic: string): Promise<void> {
        await this.client.subscribe(topic);
        this.client.on(
            'message',
            async (topic: string, payload: Uint8Array) => {
                const msg: string = new TextDecoder().decode(payload);
                const deviceIdentifier: string = this.getDeviceId(topic);
                const airData: AirData = JSON.parse(msg);

                const input: ProcessDeviceDataInput = {
                    deviceIdentifier,
                    airData,
                };

                await this.processDeviceDataUseCase.execute(input);
            },
        );
    }

    public async publish(topic: string, message: string): Promise<void> {
        await this.client.publish(topic, message);
    }

    private getDeviceId(topic: string): string {
        return topic.split('/')[1] || '';
    }
}
