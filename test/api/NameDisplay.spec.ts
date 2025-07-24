import {describe, expect, test} from "vitest";

import NameDisplay from "api:NameDisplay";

describe("Name matching test", () => {
    test("Non clashing name", () => {
        expect(NameDisplay.matching("ABC", "BB")).toBe(0);
        expect(NameDisplay.matching("BBB", "ABC")).toBe(0);
    });
    test("Clashing names", () => {
        expect(NameDisplay.matching("ABC", "ABCD")).toBe(3);
        expect(NameDisplay.matching("AAA", "ABC")).toBe(1);
    });
    test("Equal names", () => {
        expect(NameDisplay.matching("ABC", "ABC")).toBe(3);
        expect(NameDisplay.matching("Abcd", "Abcd")).toBe(4);
    });
    test("Non clashing name case insensitive", () => {
        expect(NameDisplay.matching("ABC", "bb")).toBe(0);
        expect(NameDisplay.matching("BBB", "abc")).toBe(0);
    });
    test("Clashing names case insensitive", () => {
        expect(NameDisplay.matching("ABC", "abcd")).toBe(3);
        expect(NameDisplay.matching("AAA", "abc")).toBe(1);
    });
    test("Equal names case insensitive", () => {
        expect(NameDisplay.matching("ABC", "abc")).toBe(3);
        expect(NameDisplay.matching("Abcd", "aBCD")).toBe(4);
    });
});

describe("Name initials test", () => {
    test("Non clashing name", () => {
        expect(NameDisplay.createUniqueInitials("AAA", ["BBB", "CCC"])).toBe("AA");
        expect(NameDisplay.createUniqueInitials("Abc", ["BBB", "CCC"])).toBe("Ab");
    });
    test("Clashing names", () => {
        expect(NameDisplay.createUniqueInitials("ABC", ["ABCD", "CCC"])).toBe("AB");
        expect(NameDisplay.createUniqueInitials("ABCD", ["ABC", "CCC"])).toBe("AD");
    });
    test("Equal names", () => {
        expect(NameDisplay.createUniqueInitials("AAA", ["AAA", "CCC"])).toBe("AA");
    });
    test("Non clashing name case insensitive", () => {
        expect(NameDisplay.createUniqueInitials("AAA", ["bbb", "ccc"])).toBe("AA");
        expect(NameDisplay.createUniqueInitials("Abc", ["bbb", "ccc"])).toBe("Ab");
    });
    test("Clashing names case insensitive", () => {
        expect(NameDisplay.createUniqueInitials("ABC", ["abcd", "ccc"])).toBe("AB");
        expect(NameDisplay.createUniqueInitials("ABCD", ["abc", "ccc"])).toBe("AD");
    });
    test("Equal names case insensitive", () => {
        expect(NameDisplay.createUniqueInitials("AAA", ["aaa", "ccc"])).toBe("AA");
    });
});
