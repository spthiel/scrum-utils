export default {
    leadingZero(number: number, pad: number = 2) {
        const numberString = number.toString();

        if (pad <= numberString.length) {
            return numberString;
        }

        const template = "0".repeat(pad - numberString.length);

        return template + numberString;
    },
    formatDate(date: Date = new Date()) {
        const year = this.leadingZero(date.getFullYear(), 4);
        const month = this.leadingZero(date.getMonth() + 1, 2);
        const day = this.leadingZero(date.getDate(), 2);
        const hour = this.leadingZero(date.getHours(), 2);
        const minute = this.leadingZero(date.getMinutes(), 2);
        const second = this.leadingZero(date.getSeconds(), 2);

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
};
