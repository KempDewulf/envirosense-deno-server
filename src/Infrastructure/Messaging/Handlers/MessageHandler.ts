export interface MessageHandler {
	handleMessage(topic: string, payload: string): Promise<void>;
	canHandle(topic: string): boolean;
	setLastPublished(topic: string, message: string): void;
}
