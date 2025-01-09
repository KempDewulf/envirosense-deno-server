import { assertEquals, assertThrows } from '@std/assert';
import { Optional } from "EnviroSense/Domain/mod.ts";


Deno.test("Optional - of method with non-null value", () => {
    // Arrange
    const value = 42;

    // Act
    const optional = Optional.of<number>(value);

    // Assert
    assertEquals(optional.value, value);
    assertEquals(optional.isPresent, true);
});

Deno.test("Optional - of method with undefined value throws error", () => {
    // Arrange
    const value = undefined;

    // Act & Assert
    assertThrows(() => {
        Optional.of<undefined>(value);
    }, Error, 'Cannot create Optional.of with undefined');
});

Deno.test("Optional - ofNullable method with non-null value", () => {
    // Arrange
    const value = 42;

    // Act
    const optional = Optional.ofNullable(value);

    // Assert
    assertEquals(optional.value, value);
    assertEquals(optional.isPresent, true);
});

Deno.test("Optional - ofNullable method with null value", () => {
    // Arrange
    const value = null;

    // Act
    const optional = Optional.ofNullable<null>(value);

    // Assert
    assertEquals(optional.isPresent, true);
    assertEquals(optional.value, null);
});

Deno.test("Optional - empty method", () => {
    // Act
    const optional = Optional.empty();

    // Assert
    assertEquals(optional.isPresent, false);
    assertThrows(() => {
        return optional.value;
    }, Error, 'Value is not present');
});

Deno.test("Optional - getOrElse method with present value", () => {
    // Arrange
    const value = 42;
    const defaultValue = 100;
    const optional = Optional.of<number>(value);

    // Act
    const result = optional.getOrElse(defaultValue);

    // Assert
    assertEquals(result, value);
});

Deno.test("Optional - getOrElse method with absent value", () => {
    // Arrange
    const defaultValue = 100;
    const optional = Optional.empty<number>();

    // Act
    const result = optional.getOrElse(defaultValue);

    // Assert
    assertEquals(result, defaultValue);
});

Deno.test("Optional - map method with present value", () => {
    // Arrange
    const value = 42;
    const optional = Optional.of<number>(value);

    // Act
    const mappedOptional = optional.map((v: number) => v * 2);

    // Assert
    assertEquals(mappedOptional.isPresent, true);
    assertEquals(mappedOptional.value, 84);

});

Deno.test("Optional - map method with absent value", () => {
    // Arrange
    const optional = Optional.empty<number>();

    // Act
    const mappedOptional = optional.map((v: number) => v * 2);

    // Assert
    assertEquals(mappedOptional.isPresent, false);
});

Deno.test("Optional - map method with undefined value", () => {
    // Arrange
    const optional = Optional.empty<number>();

    // Act
    const result = optional.map((value: number) => value * 2);

    // Assert
    assertEquals(result.isPresent, false);
});

Deno.test("Optional - map method with null result from mapper", () => {
    // Arrange
    const optional = Optional.of<number>(5);

    // Act
    const result = optional.map((value: any) => null);

    // Assert
    assertEquals(result.isPresent, false);
});

Deno.test("Optional - flatMap method with undefined value", () => {
    // Arrange
    const optional = Optional.empty<number>();

    // Act
    const result = optional.flatMap((value: number) => Optional.of(value * 2));

    // Assert
    assertEquals(result.isPresent, false);
});

Deno.test("Optional - flatMap method with null result from mapper", () => {
    // Arrange
    const optional = Optional.of<number>(5);

    // Act
    const result = optional.flatMap((value: any) => null);

    // Assert
    assertEquals(result.isPresent, false);
});

Deno.test("Optional - flatMap method with present value", () => {
    // Arrange
    const value = 42;
    const optional = Optional.of<number>(value);

    // Act
    const flatMappedOptional = optional.flatMap((v: number) => Optional.of<number>(v * 2));

    // Assert
    assertEquals(flatMappedOptional.value, 84);
});

Deno.test("Optional - flatMap method with absent value", () => {
    // Arrange
    const optional = Optional.empty<number>();

    // Act
    const flatMappedOptional = optional.flatMap((v: number) => Optional.of<number>(v * 2));

    // Assert
    assertEquals(flatMappedOptional.isPresent, false);
});

Deno.test("Optional - filter method with matching predicate", () => {
    // Arrange
    const value = 42;
    const optional = Optional.of<number>(value);

    // Act
    const filteredOptional = optional.filter((v: number) => v > 40);

    // Assert
    assertEquals(filteredOptional.isPresent, true);
    assertEquals(filteredOptional.value, value);
});

Deno.test("Optional - filter method with non-matching predicate", () => {
    // Arrange
    const value = 42;
    const optional = Optional.of<number>(value);

    // Act
    const filteredOptional = optional.filter((v: number) => v < 40);

    // Assert
    assertEquals(filteredOptional.isPresent, false);
});



Deno.test("Optional - filter method with empty undefined value", () => {
    // Arrange
    const optional = Optional.empty<number>();

    // Act
    const result = optional.filter((value: number) => value > 5);

    // Assert
    assertEquals(result.isPresent, false);
});

Deno.test("Optional - filter method with undefined value", () => {
    // Arrange
    const optional = Optional.ofNullable<undefined>(undefined);

    // Act
    const result = optional.filter((value: any) => value! > 5);

    // Assert
    assertEquals(result.isPresent, false);
});

Deno.test("Optional - filter method with null value", () => {
    // Arrange
    const optional = Optional.ofNullable<null>(null);

    // Act
    const result = optional.filter((value: any) => value! > 5);

    // Assert
    assertEquals(result.isPresent, false);
});

Deno.test("Optional - ifPresent method with present value", () => {
    // Arrange
    const value = 42;
    const optional = Optional.of<number>(value);
    let consumedValue: number | null = null;

    // Act
    optional.ifPresent((v: number | null) => {
        consumedValue = v;
    });

    // Assert
    assertEquals(consumedValue, value);
});

Deno.test("Optional - ifPresent method with absent value", () => {
    // Arrange
    const optional = Optional.empty<number>();
    let consumedValue: number | null = null;

    // Act
    optional.ifPresent((v: number | null) => {
        consumedValue = v;
    });

    // Assert
    assertEquals(consumedValue, null);
});



Deno.test("Optional - orElseThrow method with present value", () => {
    // Arrange
    const value = 42;
    const optional = Optional.of<number>(value);

    // Act
    const result = optional.orElseThrow(() => new Error('Value is not present.'));

    // Assert
    assertEquals(result, value);
});

Deno.test("Optional - orElseThrow method with absent value throws error", () => {
    // Arrange
    const optional = Optional.empty<number>();

    // Act & Assert
    assertThrows(() => {
        optional.orElseThrow(() => new Error('Value is not present.'));
    }, Error, 'Value is not present');
});

Deno.test("Optional - equals method with equal optionals", () => {
    // Arrange
    const value = 42;
    const optional1 = Optional.of<number>(value);
    const optional2 = Optional.of<number>(value);

    // Act
    const result = optional1.equals(optional2);

    // Assert
    assertEquals(result, true);
});

Deno.test("Optional - equals method with non-equal optionals", () => {
    // Arrange
    const optional1 = Optional.of<number>(42);
    const optional2 = Optional.of<number>(100);

    // Act
    const result = optional1.equals(optional2);

    // Assert
    assertEquals(result, false);
});

Deno.test("Optional - toString method with present value", () => {
    // Arrange
    const value = 42;
    const optional = Optional.of<number>(<number>value);

    // Act
    const result = optional.toString();

    // Assert
    assertEquals(result, 'Optional(42)');
});

Deno.test("Optional - toString method with absent value", () => {
    // Arrange
    const optional = Optional.empty<number>();

    // Act
    const result = optional.toString();

    // Assert
    assertEquals(result, 'Optional.empty');
});

Deno.test("Optional - toString method with null value", () => {
    // Arrange
    const optional = Optional.ofNullable(null);

    // Act
    const result = optional.toString();

    // Assert
    assertEquals(result, 'Optional(null)');
});

Deno.test("Optional - equals method with both optionals empty", () => {
    // Arrange
    const optional1 = Optional.empty<number>();
    const optional2 = Optional.empty<number>();

    // Act
    const result = optional1.equals(optional2);

    // Assert
    assertEquals(result, true);
});

Deno.test("Optional - equals method with one empty and one present optional", () => {
    // Arrange
    const optional1 = Optional.of(42);
    const optional2 = Optional.empty<number>();

    // Act
    const result = optional1.equals(optional2);

    // Assert
    assertEquals(result, false);
});

Deno.test("Optional - filter method with absent value", () => {
    // Arrange
    const optional = Optional.empty<number>();

    // Act
    const filteredOptional = optional.filter((v: number) => v > 40);

    // Assert
    assertEquals(filteredOptional.isPresent, false);
});
