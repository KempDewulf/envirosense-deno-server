import { DeviceQueryRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { Room, AirData } from "EnviroSense/Domain/mod.ts";

export class AirQualityCalculator {
	private readonly deviceRepository: DeviceQueryRepository;

	constructor(deviceRepository: DeviceQueryRepository) {
		this.deviceRepository = deviceRepository;
	}

	public async calculateAverageAirQuality(room: Room): Promise<AirData> {
		const devices = room.devices;
		const airData: AirData = { temperature: 0, humidity: 0, ppm: 0 };

		for (const device of devices) {
			const deviceWithDeviceData = await this.deviceRepository.find(device.documentId);
			const deviceDataArray = deviceWithDeviceData.value.device_data;
			const lastDeviceData = deviceDataArray[deviceDataArray.length - 1];
			const { temperature, humidity, gas_ppm } = lastDeviceData as any;

			airData.temperature += temperature;
			airData.humidity += humidity;
			airData.ppm += gas_ppm;
		}

		if (devices.length > 0) {
			airData.temperature = parseFloat((airData.temperature / devices.length).toFixed(2));
			airData.humidity = parseFloat((airData.humidity / devices.length).toFixed(2));
			airData.ppm = parseFloat((airData.ppm / devices.length).toFixed(2));
		}

		return airData;
	}

	public async calculateEnviroScore(room: Room): Promise<number> {
		const devices = room.devices;

		let totalAirQuality = 0;
		let dataDevicePointCount = 0;

		for (const device of devices) {
			const deviceWithDeviceData = await this.deviceRepository.find(
				device.documentId,
			);

			const deviceDataArray = deviceWithDeviceData.value.device_data;

			if (deviceDataArray.length > 0) {
				const lastDeviceData =
					deviceDataArray[deviceDataArray.length - 1];
				const { temperature, humidity, gas_ppm } =
					lastDeviceData as any;

				// CO₂ Subscore Calculation
				let co2Subscore: number;
				if (gas_ppm <= 600) {
					co2Subscore = 100;
				} else if (gas_ppm <= 1000) {
					co2Subscore = 100 - ((gas_ppm - 600) / 400) * 50; // Linear decline from 100 to 50
				} else {
					co2Subscore = 50 - ((gas_ppm - 1000) / 500) * 50; // Linear decline from 50 to 0
				}
				co2Subscore = Math.max(0, Math.min(co2Subscore, 100));

				// Humidity Subscore Calculation
				let humiditySubscore: number;
				if (humidity >= 40 && humidity <= 60) {
					humiditySubscore = 100;
				} else if (humidity < 40) {
					humiditySubscore = 100 -
						Math.pow((40 - humidity) / 10, 2) * 50;
				} else {
					humiditySubscore = 100 -
						Math.pow((humidity - 60) / 10, 2) * 50;
				}
				humiditySubscore = Math.max(0, Math.min(humiditySubscore, 100));

				// Temperature Subscore Calculation
				let temperatureSubscore: number;
				if (temperature >= 20 && temperature <= 25) {
					temperatureSubscore = 100;
				} else if (temperature < 20) {
					temperatureSubscore = 100 -
						Math.pow((20 - temperature) / 5, 2) * 50;
				} else {
					temperatureSubscore = 100 -
						Math.pow((temperature - 25) / 5, 2) * 50;
				}
				temperatureSubscore = Math.max(
					0,
					Math.min(temperatureSubscore, 100),
				);

				// Calculate AirQuality with adjusted weights
				const enviroScore = (0.5 * co2Subscore) +
					(0.3 * humiditySubscore) + (0.2 * temperatureSubscore);

				totalAirQuality += enviroScore;
				dataDevicePointCount++;
			} else {
				return NaN;
			}
		}

		// Average based on number of devices processed
		return dataDevicePointCount > 0
			? Math.round(totalAirQuality / dataDevicePointCount)
			: 0;
	}
}
