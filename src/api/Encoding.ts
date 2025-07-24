const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export default {
    string: {
        encode(text: string): Uint8Array {
            return textEncoder.encode(text);
        },
        decode(text: Uint8Array): string {
            return textDecoder.decode(text);
        },
    },
    number: {
        encode(number: number, bytes: number = 4) {
            const array = new Uint8Array(bytes);

            for (let i = bytes - 1; i >= 0; i--) {
                array[i] = number % 0xff;
                number >>= 8;
            }

            return array;
        },
        decode(number: Uint8Array): number {
            let output = 0;
            for (let i = number.length - 1; i >= 0; i--) {
                output <<= 8;
                output += number[i];
            }

            return output;
        },
    },
};
