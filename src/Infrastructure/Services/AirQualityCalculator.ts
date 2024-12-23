import { DeviceQueryRepository, RoomAirQualityOutput, RoomQueryRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { AirData, Building, Device, Room } from "EnviroSense/Domain/mod.ts";

export class AirQualityCalculator {
	private readonly deviceRepository: DeviceQueryRepository;
	private readonly roomRepository?: RoomQueryRepository;

	constructor(deviceRepository: DeviceQueryRepository, roomRepository?: RoomQueryRepository) {
		this.deviceRepository = deviceRepository;
		this.roomRepository = roomRepository;
	}

	private async fetchAllDeviceData(devices: Device[]): Promise<(any | null)[]> {
		const data = await Promise.all(
			devices.map(async (device) => {
				const deviceData = await this.getLastDeviceData(device.documentId);
				return deviceData;
			}),
		);
		return data;
	}

	//IGNORE ERRORS HERE IT WORKS
	public async calculateBuildingMetrics(building: Building): Promise<{
		enviroScore: number | null;
		roomScores: RoomAirQualityOutput[];
	}> {
		const roomPromises = building.rooms.map(async (room) => {
			const roomOptional = await this.roomRepository?.find(room.documentId);
			const roomEntity = roomOptional?.orElseThrow(() => new Error(`Room with ID ${room.documentId} not found.`));

			try {
				const { enviroScore } = await this.calculateMetrics(roomEntity);
				return {
					id: room.documentId,
					name: room.name,
					enviroScore: enviroScore,
				};
			} catch (error) {
				console.error("Error processing room:", room.id, error);
				throw error;
			}
		});

		const roomScores = await Promise.all(roomPromises);

		// Calculate building-wide score
		const validScores = roomScores
			.map((room) => room.enviroScore)
			.filter((score): score is number => score !== null);

		const buildingScore = validScores.length > 0
			? this.computeFinalEnviroScore(
				validScores.reduce((sum, score) => sum + score, 0),
				validScores.length,
			)
			: null;

		return {
			enviroScore: buildingScore,
			roomScores,
		};
	}

	public async calculateMetrics(room: Room): Promise<{ airData: AirData; enviroScore: number | null }> {
		const devices = room.devices || [];

		if (devices.length === 0) {
			return {
				airData: { temperature: null, humidity: null, ppm: null },
				enviroScore: null,
			};
		}

		const allDeviceData = await this.fetchAllDeviceData(devices);

		const airData: AirData = { temperature: null, humidity: null, ppm: null };
		let validDeviceCount = 0;

		allDeviceData.forEach((lastDeviceData) => {
			if (lastDeviceData) {
				this.aggregateAirData(airData, lastDeviceData);
				validDeviceCount += 1;
			}
		});

		const averageAirData = this.computeAverages(airData, validDeviceCount);

		const enviroScores = allDeviceData.map((lastDeviceData) => {
			if (lastDeviceData) {
				const score = this.computeEnviroScore(lastDeviceData);
				return score;
			}
			return null;
		});

		const validScores = enviroScores.filter((score) => score !== null) as number[];
		const processedDevices = validScores.length;
		const totalEnviroScore = validScores.reduce((acc, score) => acc + score, 0);
		const finalEnviroScore = processedDevices > 0 ? this.computeFinalEnviroScore(totalEnviroScore, processedDevices) : null;

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

		const deviceDataArray = deviceWithDeviceData?.value?.device_data || [];
		const lastDeviceData = deviceDataArray.length > 0 ? deviceDataArray[deviceDataArray.length - 1] : null;
		return lastDeviceData;
	}

	private aggregateAirData(airData: AirData, deviceData: any): void {
		airData.temperature = (airData.temperature ?? 0) + deviceData.temperature;
		airData.humidity = (airData.humidity ?? 0) + deviceData.humidity;
		airData.ppm = (airData.ppm ?? 0) + deviceData.gas_ppm;
	}

	private computeAverages(airData: AirData, deviceCount: number): AirData {
		if (deviceCount > 0) {
			airData.temperature = airData.temperature !== null ? parseFloat((airData.temperature / deviceCount).toFixed(2)) : null;
			airData.humidity = airData.humidity !== null ? parseFloat((airData.humidity / deviceCount).toFixed(2)) : null;
			airData.ppm = airData.ppm !== null ? parseFloat((airData.ppm / deviceCount).toFixed(2)) : null;
		} else {
			airData.temperature = null;
			airData.humidity = null;
			airData.ppm = null;
		}
		return airData;
	}

	private computeEnviroScore(deviceData: any): number {
		const co2Subscore = this.calculateCO2Subscore(deviceData.gas_ppm);
		const humiditySubscore = this.calculateHumiditySubscore(deviceData.humidity);
		const temperatureSubscore = this.calculateTemperatureSubscore(deviceData.temperature);

		const enviroScore = (0.5 * co2Subscore) + (0.3 * humiditySubscore) + (0.2 * temperatureSubscore);
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
		return deviceCount > 0 ? Number(parseFloat((totalScore / deviceCount).toFixed(1))) : null;
	}
}
