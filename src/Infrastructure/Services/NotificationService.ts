import { Device } from "EnviroSense/Domain/mod.ts";
import { ProcessDeviceDataInput, RoomRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { FirebaseMessaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";

const NOTIFICATION_COOLDOWNS_IN_MINUTES = {
	EXTREME: 15,
	WARNING: 120,
} as const;

export class NotificationService {
	private lastExtremeNotification = new Map<string, number>();
	private lastWarningNotification = new Map<string, number>();

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
		).orElseThrow(() => Error("Room not found."));

		const roomId = room.documentId;
		const buildingDocumentId = room.building?.documentId;
		const roomName = room.name;

		const { title, body } = this.getNotificationContent(
			roomName,
			enviroScore,
			input,
		);

		if (!this.canSendNotification(roomId, enviroScore)) {
			console.log(`Skipping ${enviroScore <= 10 ? "extreme" : "warning"} notification - cooldown period not elapsed`);
			return;
		}

		if (title && body) {
			console.log("Sending notification...");
			await this.firebaseMessaging.sendToTopic(
				"buildings-" + buildingDocumentId,
				title,
				body,
			);
			this.updateLastNotificationTime(roomId, enviroScore);
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
				body = `EMERGENCY: EnviroScore at ${enviroScore.toFixed(2)}%\n` +
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
				body = `URGENT: EnviroScore at ${enviroScore.toFixed(2)}%\n` +
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
				body = `Warning: EnviroScore at ${enviroScore.toFixed(2)}%\n` +
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
				body = `Advisory: EnviroScore at ${enviroScore.toFixed(2)}%\n` +
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

	private canSendNotification(roomId: string, enviroScore: number): boolean {
		const currentTime = Math.floor(Date.now() / (1000 * 60));

		if (enviroScore <= 10) {
			const lastExtreme = this.lastExtremeNotification.get(roomId) || 0;
			return (currentTime - lastExtreme) >= NOTIFICATION_COOLDOWNS_IN_MINUTES.EXTREME;
		}

		const lastWarning = this.lastWarningNotification.get(roomId) || 0;
		return (currentTime - lastWarning) >= NOTIFICATION_COOLDOWNS_IN_MINUTES.WARNING;
	}

	private updateLastNotificationTime(roomId: string, enviroScore: number): void {
		const currentTime = Math.floor(Date.now() / (1000 * 60));

		if (enviroScore <= 10) {
			this.lastExtremeNotification.set(roomId, currentTime);
		} else {
			this.lastWarningNotification.set(roomId, currentTime);
		}
	}
}
