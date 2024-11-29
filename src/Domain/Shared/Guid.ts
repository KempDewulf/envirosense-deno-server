import { IllegalStateException } from "EnviroSense/Domain/mod.ts";

const TEMPLATE = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

class GuidGenerator {
    static generate(): string {
        const dateNowHex = Date.now().toString(16);

        const filledTemplate = this.fillTemplateWithRandomValues(TEMPLATE);
        const guid = this.replaceStartTemplateWithDateNowHex(
            dateNowHex,
            filledTemplate
        );

        return guid;
    }

    private static replaceStartTemplateWithDateNowHex(
        dateNowHex: string,
        filledTemplate: string
    ) {
        const maxLength = 8; // Maximum length for the first segment
        const trimmedDateNowHex = dateNowHex.substring(0, maxLength);
        const guid =
            trimmedDateNowHex + filledTemplate.slice(trimmedDateNowHex.length);

        return guid;
    }

    private static fillTemplateWithRandomValues(template: string) {
        return template.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

class GuidValidator {
    static isValid(guid: string): boolean {
        const regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regex.test(guid);
    }
}

export class Guid {
    private value: string;

    protected constructor(value: string = "") {
        if (value === "") {
            value = GuidGenerator.generate();
        }
        this.value = value;

        if (!GuidValidator.isValid(value)) {
            throw new IllegalStateException("Invalid GUID");
        }
    }

    static create(value: string = ""): Guid {
        return new Guid(value);
    }

    public toString(): string {
        return this.value;
    }

    public isEqual(guid: Guid): boolean {
        return this.value === guid.toString();
    }
}
