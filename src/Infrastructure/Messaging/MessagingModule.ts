import { Module } from 'EnviroSense/Infrastructure/Shared/Modules/Module.ts';
import { Messaging } from 'EnviroSense/Infrastructure/Messaging/Messaging.ts';
import {
  DeviceDataRepository,
  DeviceRepository,
  ProcessAirDataInput,
  UseCase,
} from 'EnviroSense/Application/Contracts/mod.ts';
import { ProcessAirData } from 'EnviroSense/Application/mod.ts';
import {
  DeviceStrapiRepository,
  DeviceDataStrapiRepository,
} from 'EnviroSense/Infrastructure/Persistence/mod.ts';

export class MessagingModule implements Module {
  private messaging: Messaging;
  private processAirDataUseCase: UseCase<ProcessAirDataInput>;

  constructor() {
    const deviceRepository: DeviceRepository = new DeviceStrapiRepository();
    const deviceDataRepository: DeviceDataRepository =new DeviceDataStrapiRepository();

    this.processAirDataUseCase = new ProcessAirData(
      deviceRepository,
      deviceDataRepository,
    );

    this.messaging = new Messaging(this.processAirDataUseCase);
  }

  public async run(): Promise<void> {
    console.log('Messaging module started');

    await this.messaging.connect();
    await this.messaging.subscribe('test/#');
  }
}