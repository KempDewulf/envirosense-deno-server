import { ShowRoomsPresentedData } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { View } from "EnviroSense/Infrastructure/Shared/mod.ts";

export class ShowRoomsView implements View<ShowRoomsPresentedData[]> {
    render(data: ShowRoomsPresentedData[]): string {
        return `<html>
        <head>
            <title>MTG Tournaments</title>
        </head>
        <body>

            <h1>Building: All Rooms</h1>
            <p>Here is the list of rooms:</p>
            <ul>
                ${data
                    .map(
                        (room: ShowRoomsPresentedData) => `
                    <li>
                        <a href="/tournaments/${room.id}">
                            ${room.name}
                        </a>
                    </li>
                `
                    )
                    .join("")}
        </body>
    </html>`;
    }
}
