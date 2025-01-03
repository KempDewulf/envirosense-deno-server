export interface MessageHandler {
	handleMessage(topic: string, payload: string): Promise<void>;
	canHandle(topic: string): boolean;
}
