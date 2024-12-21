import { DeviceQueryRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { AirData, Device, Room } from "EnviroSense/Domain/mod.ts";

export class AirQualityCalculator {
	private readonly deviceRepository: DeviceQueryRepository;

	constructor(deviceRepository: DeviceQueryRepository) {
		this.deviceRepository = deviceRepository;
	}

	private async fetchAllDeviceData(devices: Device[]): Promise<(any | null)[]> {
		console.log("Fetching data for devices:", devices);
		const data = await Promise.all(
			devices.map(async (device, index) => {
				console.log(`Fetching last data for device ${index + 1} (ID: ${device.documentId})`);
				const deviceData = await this.getLastDeviceData(device.documentId);
				console.log(`Data fetched for device ${index + 1}:`, deviceData);
				return deviceData;
			}),
		);
		console.log("All fetched device data:", data);
		return data;
	}

	public async calculateMetrics(room: Room): Promise<{ airData: AirData; enviroScore: number | null }> {
		console.log("Starting calculateMetrics for room:", room);
		const devices = room.devices;
		console.log("Devices:", devices);

		if (devices.length === 0) {
			console.log("No devices found in room.");
			return { airData: { temperature: null, humidity: null, ppm: null }, enviroScore: null };
		}

		const allDeviceData = await this.fetchAllDeviceData(devices);
		console.log("All Device Data:", allDeviceData);

		const airData: AirData = { temperature: null, humidity: null, ppm: null };
		allDeviceData.forEach((lastDeviceData, index) => {
			console.log(`Aggregating data from device ${index + 1}:`, lastDeviceData);
			if (lastDeviceData) {
				this.aggregateAirData(airData, lastDeviceData);
			}
		});
		console.log("Aggregated Air Data:", airData);

		const averageAirData = this.computeAverages(airData, devices.length);
		console.log("Average Air Data:", averageAirData);

		const enviroScores = allDeviceData.map((lastDeviceData, index) => {
			if (lastDeviceData) {
				const score = this.computeEnviroScore(lastDeviceData);
				console.log(`Enviro Score for device ${index + 1}:`, score);
				return score;
			}
			console.log(`No data to compute Enviro Score for device ${index + 1}.`);
			return null;
		});
		console.log("Enviro Scores:", enviroScores);

		const validScores = enviroScores.filter((score) => score !== null) as number[];
		console.log("Valid Enviro Scores:", validScores);
		const processedDevices = validScores.length;
		const totalEnviroScore = validScores.reduce((acc, score) => acc + score, 0);
		console.log("Total Enviro Score:", totalEnviroScore);
		const finalEnviroScore = processedDevices > 0 ? this.computeFinalEnviroScore(totalEnviroScore, processedDevices) : null;
		console.log("Final Enviro Score:", finalEnviroScore);

		console.log("Deno Server responded with:", averageAirData, finalEnviroScore);
		return { airData: averageAirData, enviroScore: finalEnviroScore };
	}

	public async calculateAverageAirQuality(room: Room, allDeviceData?: (any | null)[]): Promise<AirData> {
		if (!allDeviceData) {
			allDeviceData = await this.fetchAllDeviceData(room.devices);
		}

		const airData: AirData = { temperature: null, humidity: null, ppm: null };
		allDeviceData.forEach((lastDeviceData) => {
			if (lastDeviceData) {
				this.aggregateAirData(airData, lastDeviceData);
			}
		});

		return this.computeAverages(airData, room.devices.length);
	}

	public async calculateEnviroScore(room: Room, allDeviceData?: (any | null)[]): Promise<number | null> {
		if (!allDeviceData) {
			allDeviceData = await this.fetchAllDeviceData(room.devices);
		}

		const enviroScores = allDeviceData.map((lastDeviceData) => {
			if (lastDeviceData) {
				return this.computeEnviroScore(lastDeviceData);
			}
			return null;
		});

		const validScores = enviroScores.filter((score) => score !== null) as number[];
		const processedDevices = validScores.length;
		const totalEnviroScore = validScores.reduce((acc, score) => acc + score, 0);

		if (processedDevices === 0) {
			return null;
		}

		return this.computeFinalEnviroScore(totalEnviroScore, processedDevices);
	}

	private async getLastDeviceData(documentId: string): Promise<any | null> {
		const deviceWithDeviceData = await this.deviceRepository.find(
			documentId,
		);
		console.log("deviceWithDeviceData", deviceWithDeviceData);

		const deviceDataArray = deviceWithDeviceData?.value?.device_data || [];
		const lastDeviceData = deviceDataArray.length > 0 ? deviceDataArray[deviceDataArray.length - 1] : null;
		console.log("Last Device Data:", lastDeviceData);
		return lastDeviceData;
	}

	private aggregateAirData(airData: AirData, deviceData: any): void {
		airData.temperature = (airData.temperature ?? 0) + deviceData.temperature;
		airData.humidity = (airData.humidity ?? 0) + deviceData.humidity;
		airData.ppm = (airData.ppm ?? 0) + deviceData.gas_ppm;
	}

	private computeAverages(airData: AirData, deviceCount: number): AirData {
		console.log("Computing averages with AirData:", airData, "and deviceCount:", deviceCount);
		if (deviceCount > 0) {
			airData.temperature = airData.temperature !== null ? parseFloat((airData.temperature / deviceCount).toFixed(2)) : null;
			airData.humidity = airData.humidity !== null ? parseFloat((airData.humidity / deviceCount).toFixed(2)) : null;
			airData.ppm = airData.ppm !== null ? parseFloat((airData.ppm / deviceCount).toFixed(2)) : null;
			console.log("Computed Averages:", airData);
		}
		return airData;
	}

	private computeEnviroScore(deviceData: any): number {
		console.log("Calculating Enviro Score for device data:", deviceData);
		const co2Subscore = this.calculateCO2Subscore(deviceData.gas_ppm);
		console.log("CO2 Subscore:", co2Subscore);
		const humiditySubscore = this.calculateHumiditySubscore(deviceData.humidity);
		console.log("Humidity Subscore:", humiditySubscore);
		const temperatureSubscore = this.calculateTemperatureSubscore(deviceData.temperature);
		console.log("Temperature Subscore:", temperatureSubscore);

		const enviroScore = (0.5 * co2Subscore) + (0.3 * humiditySubscore) + (0.2 * temperatureSubscore);
		console.log("Computed Enviro Score:", enviroScore);
		return enviroScore;
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
	): number | null {
		return deviceCount > 0 ? Math.round(totalScore / deviceCount) : null;
	}
}
