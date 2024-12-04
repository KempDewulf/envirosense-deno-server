import { Client } from "https://deno.land/x/mqtt@0.1.2/deno/mod.ts";
import { DeviceData } from "EnviroSense/Domain/Entities/DeviceData.ts";
import "jsr:@std/dotenv/load";
//import { DeviceDataStrapiRepository } from "EnviroSense/Infrastructure/Persistence/Repositories/Strapi/DeviceData/DeviceDataStrapiRepository.ts";


export class Messaging {
    private client: Client;
    //private repository: DeviceDataStrapiRepository;

    constructor() {
        this.client = new Client({url: Deno.env.get("MQTT_BROKER"), username: Deno.env.get("MQTT_USERNAME"), password: Deno.env.get("MQTT_PASSWORD")});
    }

    public async connect(): Promise<void> {
        await this.client.connect();
        //this.repository = new DeviceDataStrapiRepository();
    }

    public async subscribe(topic: string): Promise<void> {
        await this.client.subscribe(topic);
        this.client.on('message', (topic, payload) => {
            const msg = new TextDecoder().decode(payload);
            console.log(`Received message: ${msg} from topic: ${topic}`);

            const data = JSON.parse(msg);
            const deviceData = DeviceData.create(
                data.id,
                data.deviceId,
                new Date(),
                data.temperature,
                data.humidity,
                data.gasPpm
            );

            //this.repository.save(deviceData).then();

        });
    }

    public async publish(topic: string, message: string): Promise<void> {
        await this.client.publish(topic, message);
    }
}

