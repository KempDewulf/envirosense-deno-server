export interface ShowRoomLimitsOutput {
	documentId: string;
	limits: Record<string, string | number>;
	failedDevices: string[];
}
