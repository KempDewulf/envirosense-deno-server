import { Device } from "EnviroSense/Domain/mod.ts";
import { ProcessDeviceDataInput, RoomRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { FirebaseMessaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";

const NOTIFICATION_COOLDOWNS_IN_MINUTES = {
	EXTREME: 15,
	WARNING: 120,
} as const;

export class NotificationService {
	private readonly lastNotificationTime: Map<string, number> = new Map();

	constructor(
		private readonly firebaseMessaging: FirebaseMessaging,
		private readonly roomRepository: RoomRepository,
	) {}

	async sendAirQualityNotification(
		device: Device,
		input: ProcessDeviceDataInput,
		enviroScore: number,
	): Promise<void> {
		const room = (
			await this.roomRepository.find(device.room?.documentId!)
		).orElseThrow(() => Error("Room not found"));

		const roomId = room.documentId;
		const buildingDocumentId = room.building?.documentId;
		const roomName = room.name;
		const currentTimeInMinutes = Math.floor(Date.now() / (1000 * 60)); // Current time in minutes
		const lastNotification = this.lastNotificationTime.get(roomId) || 0;

		console.log(
			`Room ${roomName} - Last notification: ${lastNotification}, Current time: ${currentTimeInMinutes}`,
		);

		const { title, body, cooldown } = this.getNotificationContent(
			roomName,
			enviroScore,
			input,
		);

		const timeSinceLastNotification = currentTimeInMinutes - lastNotification;
		console.log(
			`Time since last notification: ${timeSinceLastNotification} minutes`,
		);

		if (lastNotification > 0 && timeSinceLastNotification < cooldown) {
			console.log(
				`Skipping notification - Cooldown active for ${cooldown - timeSinceLastNotification} more minutes`,
			);
			return;
		}

		if (title && body) {
			await this.firebaseMessaging.sendToTopic(
				"buildings-" + buildingDocumentId,
				title,
				body,
			);
			this.lastNotificationTime.set(roomId, currentTimeInMinutes);
		}
	}

	private getNotificationContent(
		roomName: string,
		enviroScore: number,
		input: ProcessDeviceDataInput,
	): { title: string; body: string; cooldown: number } {
		let title = "";
		let body = "";
		let cooldown = 0;

		switch (true) {
			case enviroScore <= 10:
				cooldown = NOTIFICATION_COOLDOWNS_IN_MINUTES.EXTREME;
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
				cooldown = NOTIFICATION_COOLDOWNS_IN_MINUTES.WARNING;
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
				cooldown = NOTIFICATION_COOLDOWNS_IN_MINUTES.WARNING;
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
				cooldown = NOTIFICATION_COOLDOWNS_IN_MINUTES.WARNING;
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

		return { title, body, cooldown };
	}
}
