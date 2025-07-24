import {describe, expect, test} from "vitest";

import DateFormatter from "api:DateFormatter";

describe("Leading zero", () => {
    test("Pad -1", () => {
        expect(DateFormatter.leadingZero(1, -1)).toBe("1");
        expect(DateFormatter.leadingZero(10, -1)).toBe("10");
        expect(DateFormatter.leadingZero(100, -1)).toBe("100");
    });
    test("Pad default", () => {
        expect(DateFormatter.leadingZero(1)).toBe("01");
        expect(DateFormatter.leadingZero(10)).toBe("10");
        expect(DateFormatter.leadingZero(100)).toBe("100");
    });
    test("Pad 4", () => {
        expect(DateFormatter.leadingZero(1, 4)).toBe("0001");
        expect(DateFormatter.leadingZero(10, 4)).toBe("0010");
        expect(DateFormatter.leadingZero(100, 4)).toBe("0100");
    });
});

describe("Date formatter", () => {
    function testCase(date: Date, expected: string) {
        test(date.toISOString() + " to be " + expected, () => {
            expect(DateFormatter.formatDate(date)).toBe(expected);
        });
    }

    testCase(new Date(1970, 0, 1, 0, 0, 0), "1970-01-01 00:00:00");
    testCase(new Date(1970, 0, 1, 12, 0, 0), "1970-01-01 12:00:00");
    testCase(new Date(2000, 4, 25, 12, 34, 56), "2000-05-25 12:34:56");
    testCase(new Date(100, 10, 10, 1, 1, 1), "0100-11-10 01:01:01");
});
