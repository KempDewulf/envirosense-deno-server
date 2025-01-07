import {
	DeviceDataQueryRepository,
	DeviceQueryRepository,
	RoomAirQualityOutput,
	RoomQueryRepository,
} from "EnviroSense/Application/Contracts/mod.ts";
import { AirData, Building, Device, DeviceData, Room } from "EnviroSense/Domain/mod.ts";
import { RoomNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

export class AirQualityCalculator {
	private readonly deviceRepository: DeviceQueryRepository;
	private readonly deviceDataRepository: DeviceDataQueryRepository;
	private readonly roomRepository?: RoomQueryRepository;

	constructor(
		deviceRepository: DeviceQueryRepository,
		deviceDataRepository: DeviceDataQueryRepository,
		roomRepository?: RoomQueryRepository,
	) {
		this.deviceRepository = deviceRepository;
		this.deviceDataRepository = deviceDataRepository;
		this.roomRepository = roomRepository;
	}

	private async fetchAllDeviceData(devices: Device[]): Promise<DeviceData[]> {
		const deviceDataPromises = devices.map((device) => this.getLastDeviceData(device.documentId));

		const results = await Promise.all(deviceDataPromises);
		return results.filter((data): data is DeviceData => data !== null);
	}

	public async calculateBuildingMetrics(building: Building): Promise<{
		enviroScore: number | null;
		roomScores: RoomAirQualityOutput[];
	}> {
		const roomPromises = building.rooms.map(async (room) => {
			const roomQueryDto = (await this.roomRepository?.find(room.documentId))?.orElseThrow(() =>
				new RoomNotFoundError(room.documentId)
			);

			try {
				const { enviroScore } = await this.calculateMetrics(roomQueryDto as Room);
				return {
					documentId: room.documentId,
					name: room.name,
					enviroScore: enviroScore,
				};
			} catch (error) {
				console.error("Error processing room:", room.documentId, error);
				throw error;
			}
		});

		const unsortedRoomScores = await Promise.all(roomPromises);

		const roomScores = [...unsortedRoomScores].sort((a, b) => {
			if (a.enviroScore === null && b.enviroScore === null) return 0;
			if (a.enviroScore === null) return 1;
			if (b.enviroScore === null) return -1;
			return b.enviroScore - a.enviroScore;
		});

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

	public async calculateMetrics(
		room: Room,
	): Promise<{ airData: AirData; enviroScore: number | null }> {
		const devices = room.devices || [];

		if (devices.length === 0) {
			return {
				airData: { temperature: null, humidity: null, ppm: null },
				enviroScore: null,
			};
		}

		const allDeviceData = await this.fetchAllDeviceData(devices);

		const airData: AirData = {
			temperature: null,
			humidity: null,
			ppm: null,
		};
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

		const validScores = enviroScores.filter(
			(score) => score !== null,
		);
		const processedDevices = validScores.length;
		const totalEnviroScore = validScores.reduce(
			(acc, score) => acc + score,
			0,
		);
		const finalEnviroScore = processedDevices > 0
			? this.computeFinalEnviroScore(
				totalEnviroScore,
				processedDevices,
			)
			: null;

		console.log(
			"Deno Server responded with:",
			averageAirData,
			finalEnviroScore,
		);
		return { airData: averageAirData, enviroScore: finalEnviroScore };
	}

	public async calculateAverageAirQuality(
		room: Room,
		allDeviceData?: (any | null)[],
	): Promise<AirData> {
		if (!allDeviceData) {
			allDeviceData = await this.fetchAllDeviceData(room.devices);
		}

		const airData: AirData = {
			temperature: null,
			humidity: null,
			ppm: null,
		};
		allDeviceData.forEach((lastDeviceData) => {
			if (lastDeviceData) {
				this.aggregateAirData(airData, lastDeviceData);
			}
		});

		return this.computeAverages(airData, room.devices.length);
	}

	public async calculateEnviroScore(
		room: Room,
		allDeviceData?: (any | null)[],
	): Promise<number | null> {
		if (!allDeviceData) {
			allDeviceData = await this.fetchAllDeviceData(room.devices);
		}

		const enviroScores = allDeviceData.map((lastDeviceData) => {
			if (lastDeviceData) {
				return this.computeEnviroScore(lastDeviceData);
			}
			return null;
		});

		const validScores = enviroScores.filter(
			(score) => score !== null,
		);
		const processedDevices = validScores.length;
		const totalEnviroScore = validScores.reduce(
			(acc, score) => acc + score,
			0,
		);

		if (processedDevices === 0) {
			return null;
		}

		return this.computeFinalEnviroScore(totalEnviroScore, processedDevices);
	}

	private async getLastDeviceData(documentId: string): Promise<any | null> {
		const device = await this.deviceRepository.find(
			documentId,
		);

		const deviceDataArray = await this.deviceDataRepository.all(device?.value?.identifier) || [];
		const lastDeviceData = deviceDataArray.length > 0 ? deviceDataArray[0] : null;
		return lastDeviceData;
	}

	private aggregateAirData(airData: AirData, deviceData: any): void {
		airData.temperature = (airData.temperature ?? 0) + deviceData.airData.temperature;
		airData.humidity = (airData.humidity ?? 0) + deviceData.airData.humidity;
		airData.ppm = (airData.ppm ?? 0) + deviceData.airData.ppm;
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

	public computeEnviroScore(deviceData: any): number {
		const ppmSubscore = this.calculatePpmSubscore(deviceData.airData.ppm);
		const humiditySubscore = this.calculateHumiditySubscore(
			deviceData.airData.humidity,
		);
		const temperatureSubscore = this.calculateTemperatureSubscore(
			deviceData.airData.temperature,
		);

		const enviroScore = 0.5 * ppmSubscore +
			0.3 * humiditySubscore +
			0.2 * temperatureSubscore;
		return enviroScore;
	}

	private calculatePpmSubscore(ppm: number): number {
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
