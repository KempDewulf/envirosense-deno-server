export interface ShowDeviceConfigOutput {
	documentId: string;
    config: Record<string, number | string>;
    failed: boolean;
}