import { initializeApp } from "npm:firebase-admin/app";
import { getMessaging } from "npm:firebase-admin/messaging";
import { applicationDefault } from "npm:firebase-admin/app";

export class FirebaseMessaging {
    private messaging;

    constructor() {
        const app = initializeApp({
            credential: applicationDefault()
        });
        this.messaging = getMessaging(app);
    }

    async sendToTopic(topic: string, title: string, body: string) {
        const message = {
            notification: {
                title,
                body,
            },
            topic,
        };

        try {
            const response = await this.messaging.send(message);
            console.log('Successfully sent message:', response);
            return response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
}