import { cert, initializeApp } from "npm:firebase-admin/app";
import { getMessaging } from "npm:firebase-admin/messaging";

export class FirebaseMessaging {
	private messaging;

	constructor() {
		const app = initializeApp({
			credential: cert("./firebase_credentials.json"),
		});
		this.messaging = getMessaging(app);
	}

	async sendToTopic(topic: string, title: string, body: string): Promise<string> {
		const message = {
			notification: {
				title,
				body,
			},
			android: {
                notification: {
                    color: '#FF9900',
                },
				priority: 'high' as const,
            },
            topic: topic,
		};

		try {
			const response = await this.messaging.send(message);
			console.log("Successfully sent message:", response);
			return response;
		} catch (error) {
			console.error("Error sending message:", error);
			throw error;
		}
	}
}
