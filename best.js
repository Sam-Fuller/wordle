const fs = require('fs');

//[undefined, undefined, undefined, undefined, undefined]
const greens = [undefined, undefined, undefined, undefined, undefined];
//[[], [], [], [], []]
const yellows = [[], [], [], [], []];
//[]
const blacks = [];

try {
    /**
     * @type {string[]} data
     */
    const data = fs.readFileSync('words.txt', 'utf8').split('\r\n');
    const validWords = data
        .map((line) => line.toLowerCase())
        .filter((word) => {
            let isWordValid = true;

            word.split('').forEach((letter, index) => {
                if (greens[index] !== undefined && greens[index] !== letter)
                    isWordValid = false;
            });

            if (!isWordValid) return false;

            yellows.forEach((list, i) => {
                list.forEach((l) => {
                    if (l === undefined) return;
                    let doesWordContainYellows = false;

                    word.split('').forEach((letter, index) => {
                        if (letter === l) {
                            if (index === i) {
                                isWordValid = false;
                            } else {
                                doesWordContainYellows = true;
                            }
                        }
                    });

                    if (!doesWordContainYellows) isWordValid = false;
                });
            });

            if (!isWordValid) return false;

            blacks.forEach((l, i) => {
                if (word.includes(l)) isWordValid = false;
            });

            return isWordValid;
        });

    console.log('found ' + validWords.length + ' valid 5 letter words');

    const letterFrequency = {};
    const letterPosFrequency = [{}, {}, {}, {}, {}];

    validWords.forEach((word) => {
        const wordLetterFrequency = {};

        word.split('').forEach((letter, i) => {
            wordLetterFrequency[letter] = 1;
            letterPosFrequency[i][letter] =
                (letterPosFrequency[i][letter] || 0) + 1;
        });

        Object.keys(wordLetterFrequency).forEach((letter) => {
            letterFrequency[letter] = (letterFrequency[letter] || 0) + 1;
        });
    });

    const calculateWordScore = (word) => {
        const wordLetterScore = {};

        const posLetterScore = word.split('').reduce((score, letter, i) => {
            wordLetterScore[letter] = letterFrequency[letter];

            return score + letterPosFrequency[i][letter];
        }, 0);

        return (
            Object.keys(wordLetterScore).reduce(
                (a, b) => a + wordLetterScore[b],
                0
            ) + posLetterScore
        );
    };

    let wordScores = validWords.map((word) => ({
        word,
        score: calculateWordScore(word),
    }));

    wordScores.sort((a, b) => b.score - a.score);
    wordScores = wordScores.map((word, i) => ({
        ...word,
        rank: i + 1,
    }));

    for (let i = 0; i < 5; i++) console.log(wordScores[i]);
} catch (err) {
    console.error(err);
}
