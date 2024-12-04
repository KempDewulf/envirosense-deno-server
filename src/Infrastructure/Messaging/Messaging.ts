import { Client } from "https://deno.land/x/mqtt@0.1.2/deno/mod.ts";
import { DeviceData } from "EnviroSense/Domain/Entities/DeviceData.ts";
import "jsr:@std/dotenv/load";
import { AirData, Device } from 'EnviroSense/Domain/mod.ts';
//import { DeviceDataStrapiRepository } from "EnviroSense/Infrastructure/Persistence/Repositories/Strapi/DeviceData/DeviceDataStrapiRepository.ts";
import { DeviceStrapiRepository } from "EnviroSense/Infrastructure/Persistence/Repositories/Strapi/Device/DeviceStrapiRepository.ts";


export class Messaging {
    private client: Client;
    //private deviceDataRepository: DeviceDataStrapiRepository;
    private deviceRepository: DeviceStrapiRepository;


    constructor() {
        this.client = new Client({
            url: Deno.env.get("MQTT_BROKER"), 
            username: Deno.env.get("MQTT_USERNAME"), 
            password: Deno.env.get("MQTT_PASSWORD")
        });
        //this.deviceDataRepository = new DeviceDataStrapiRepository();
        this.deviceRepository = new DeviceStrapiRepository();
    }

    public async connect(): Promise<void> {
        await this.client.connect();
        //this.repository = new DeviceDataStrapiRepository();
    }

    public async subscribe(topic: string): Promise<void> {
        await this.client.subscribe(topic);
        this.client.on('message', async (topic: string, payload: Uint8Array) => {
            const msg: string = new TextDecoder().decode(payload);
            const deviceId: string = this.getDeviceId(topic);
            console.log(`Received message: ${msg} from topic: ${topic}`);

            const airData: AirData = JSON.parse(msg);

            // Fetch the Device object using the deviceId
            const optionalDevice = await this.deviceRepository.findByIdentifier(deviceId);
            if (!optionalDevice.isPresent) {
                console.error(`Device with id ${deviceId} not found.`);
                return;
            }
            const device: Device = optionalDevice.value;

            const deviceData: DeviceData = DeviceData.create(
                '',
                device,
                new Date(),
                airData.temperature,
                airData.humidity,
                456 //airData.gasPpm
            );
            
            //this.repository.save(deviceData).then();
        });
    }

    public async publish(topic: string, message: string): Promise<void> {
        await this.client.publish(topic, message);
    }

    private getDeviceId(topic: string): string {
        return topic.split('/')[1] || '';
    }
}

