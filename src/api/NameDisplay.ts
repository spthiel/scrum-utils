const INITIAL_LENGTH = 2;

export default {
    matching(nameA: string, nameB: string) {
        nameA = nameA.toLowerCase();
        nameB = nameB.toLowerCase();

        const shorterName = Math.min(nameA.length, nameB.length);

        for (let i = 0; i < shorterName; i++) {
            if (nameA.charAt(i) !== nameB.charAt(i)) {
                return i;
            }
        }

        return shorterName;
    },

    createUniqueInitials(name: string, compare: string[]) {
        const attempt = name.substring(0, INITIAL_LENGTH);

        if (compare.every((otherName) => !otherName.toLowerCase().startsWith(attempt.toLowerCase()))) {
            return attempt;
        }

        let mostClashes = 0;
        for (const clash of compare) {
            const match = this.matching(name, clash);
            if (match > mostClashes) {
                mostClashes = match;
            }
        }

        if (mostClashes < name.length) {
            return name.substring(0, INITIAL_LENGTH - 1) + name.charAt(mostClashes);
        }

        return attempt;
    },
};
