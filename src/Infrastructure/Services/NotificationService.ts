import { Device } from "EnviroSense/Domain/mod.ts";
import { ProcessDeviceDataInput } from "EnviroSense/Application/Contracts/mod.ts";
import { RoomRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { FirebaseMessaging } from "EnviroSense/Infrastructure/Messaging/FirebaseMessaging.ts";

export class NotificationService {
	private readonly REGULAR_COOLDOWN: number = 2 * 60 * 60 * 1000; // 2 hours in ms
	private readonly EMERGENCY_COOLDOWN: number = 15 * 60 * 1000; // 15 minutes in ms
	private lastNotificationTime: Map<string, number> = new Map();

	constructor(
		private readonly firebaseMessaging: FirebaseMessaging,
		private readonly roomRepository: RoomRepository,
	) {}

	async sendAirQualityNotification(
		device: Device,
		input: ProcessDeviceDataInput,
		enviroScore: number,
	): Promise<void> {
		const room = (await this.roomRepository.find(device.room?.documentId!))
			.orElseThrow(() => Error("Room not found"));

		const roomId = room.documentId;
		const buildingDocumentId = room.building?.documentId;
		const roomName = room.name;
		const currentTime = Date.now();
		const lastNotification = this.lastNotificationTime.get(roomId) || 0;
		const cooldownPeriod = enviroScore <= 10 ? this.EMERGENCY_COOLDOWN : this.REGULAR_COOLDOWN;

		if (currentTime - lastNotification < cooldownPeriod) {
			return; // Still in cooldown period
		}

		const { title, body } = this.getNotificationContent(roomName, enviroScore, input);

		if (title && body) {
			await this.firebaseMessaging.sendToTopic(
				"buildings-" + buildingDocumentId,
				title,
				body,
			);
            this.lastNotificationTime.set(roomId, currentTime);
		}
	}

	private getNotificationContent(roomName: string, enviroScore: number, input: ProcessDeviceDataInput) {
		let title = "";
		let body = "";

		switch (true) {
			case enviroScore <= 10:
				title = `🆘 EXTREME DANGER - EVACUATE ${roomName}`;
				body = `EMERGENCY: EnviroScore at ${enviroScore}%\n` +
					`CO₂: ${input.airData.ppm} ppm\n` +
					`Temperature: ${input.airData.temperature}°C\n` +
					`Humidity: ${input.airData.humidity}%\n\n` +
					`⚠️ IMMEDIATE ACTION REQUIRED:\n` +
					`• EVACUATE AREA IMMEDIATELY\n` +
					`• Do not re-enter until cleared\n` +
					`• Life-threatening conditions present`;
				break;

			case enviroScore <= 30:
				title = `🚨 CRITICAL Air Quality in ${roomName}`;
				body = `URGENT: EnviroScore at ${enviroScore}%\n` +
					`CO₂: ${input.airData.ppm} ppm (Very High)\n` +
					`Temperature: ${input.airData.temperature}°C\n` +
					`Humidity: ${input.airData.humidity}%\n\n` +
					`⚠️ Health Risk: Immediate ventilation required.\n` +
					`• Open windows/doors immediately\n` +
					`• Evacuate if symptoms develop\n` +
					`• Contact facility management`;
				break;

			case enviroScore <= 49:
				title = `⚠️ Poor Air Quality in ${roomName}`;
				body = `Warning: EnviroScore at ${enviroScore}%\n` +
					`CO₂: ${input.airData.ppm} ppm (High)\n` +
					`Temperature: ${input.airData.temperature}°C\n` +
					`Humidity: ${input.airData.humidity}%\n\n` +
					`Recommended Actions:\n` +
					`• Increase ventilation\n` +
					`• Consider reducing room occupancy\n` +
					`• Monitor for changes`;
				break;

			case enviroScore <= 69:
				title = `ℹ️ Moderate Air Quality in ${roomName}`;
				body = `Advisory: EnviroScore at ${enviroScore}%\n` +
					`CO₂: ${input.airData.ppm} ppm\n` +
					`Temperature: ${input.airData.temperature}°C\n` +
					`Humidity: ${input.airData.humidity}%\n\n` +
					`Suggestions:\n` +
					`• Consider fresh air intake\n` +
					`• Monitor air quality trends`;
				break;
		}

		return { title, body };
	}
}
