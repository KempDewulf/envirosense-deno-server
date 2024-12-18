import { DeviceQueryRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { AirData, Room } from "EnviroSense/Domain/mod.ts";

export class AirQualityCalculator {
	private readonly deviceRepository: DeviceQueryRepository;

	constructor(deviceRepository: DeviceQueryRepository) {
		this.deviceRepository = deviceRepository;
	}

	public async calculateAverageAirQuality(room: Room): Promise<AirData> {
		const devices = room.devices;
		const airData: AirData = { temperature: 0, humidity: 0, ppm: 0 };

		for (const device of devices) {
			const lastDeviceData = await this.getLastDeviceData(
				device.documentId,
			);
			if (lastDeviceData) {
				this.aggregateAirData(airData, lastDeviceData);
			}
		}

		return this.computeAverages(airData, devices.length);
	}

	public async calculateEnviroScore(room: Room): Promise<number> {
		const devices = room.devices;

		let totalEnviroScore = 0;
		let processedDevices = 0;

		for (const device of devices) {
			const lastDeviceData = await this.getLastDeviceData(
				device.documentId,
			);
			if (lastDeviceData) {
				const enviroScore = this.computeEnviroScore(lastDeviceData);
				totalEnviroScore += enviroScore;
				processedDevices++;
			}
		}

		return this.computeFinalEnviroScore(totalEnviroScore, processedDevices);
	}

	private async getLastDeviceData(documentId: string): Promise<any | null> {
		const deviceWithDeviceData = await this.deviceRepository.find(
			documentId,
		);
		const deviceDataArray = deviceWithDeviceData?.value?.device_data || [];
		return deviceDataArray.length > 0
			? deviceDataArray[deviceDataArray.length - 1]
			: null;
	}

	private aggregateAirData(airData: AirData, deviceData: any): void {
		airData.temperature += deviceData.temperature;
		airData.humidity += deviceData.humidity;
		airData.ppm += deviceData.gas_ppm;
	}

	private computeAverages(airData: AirData, deviceCount: number): AirData {
		if (deviceCount > 0) {
			airData.temperature = parseFloat(
				(airData.temperature / deviceCount).toFixed(2),
			);
			airData.humidity = parseFloat(
				(airData.humidity / deviceCount).toFixed(2),
			);
			airData.ppm = parseFloat((airData.ppm / deviceCount).toFixed(2));
		}
		return airData;
	}

	private computeEnviroScore(deviceData: any): number {
		const co2Subscore = this.calculateCO2Subscore(deviceData.gas_ppm);
		const humiditySubscore = this.calculateHumiditySubscore(
			deviceData.humidity,
		);
		const temperatureSubscore = this.calculateTemperatureSubscore(
			deviceData.temperature,
		);

		// Combine scores with weights
		return (0.5 * co2Subscore) + (0.3 * humiditySubscore) +
			(0.2 * temperatureSubscore);
	}

	private calculateCO2Subscore(ppm: number): number {
		if (ppm <= 600) return 100;
		if (ppm <= 1000) return 100 - ((ppm - 600) / 400) * 50; // Linear decline from 100 to 50
		return Math.max(0, 50 - ((ppm - 1000) / 500) * 50); // Linear decline from 50 to 0
	}

	private calculateHumiditySubscore(humidity: number): number {
		if (humidity >= 40 && humidity <= 60) return 100;
		if (humidity < 40) {
			return Math.max(0, 100 - Math.pow((40 - humidity) / 10, 2) * 50);
		}
		return Math.max(0, 100 - Math.pow((humidity - 60) / 10, 2) * 50);
	}

	private calculateTemperatureSubscore(temperature: number): number {
		if (temperature >= 20 && temperature <= 25) return 100;
		if (temperature < 20) {
			return Math.max(0, 100 - Math.pow((20 - temperature) / 5, 2) * 50);
		}
		return Math.max(0, 100 - Math.pow((temperature - 25) / 5, 2) * 50);
	}

	private computeFinalEnviroScore(
		totalScore: number,
		deviceCount: number,
	): number {
		return deviceCount > 0 ? Math.round(totalScore / deviceCount) : 0;
	}
}
