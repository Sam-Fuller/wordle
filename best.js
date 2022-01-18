const fs = require('fs');

const greens = 'p-o-y'.split('');
const yellows = [
    ''.split(''),
    ''.split(''),
    'r'.split(''),
    ''.split(''),
    ''.split(''),
];
const blacks = 'taesin'.split('');

try {
    /**
     * @type {string[]} allWords
     */
    const allWords = fs
        .readFileSync('words.txt', 'utf8')
        .split('\r\n')
        .map((line) => line.toLowerCase());

    const validWords = allWords.filter((word) => {
        let isWordValid = true;

        word.split('').forEach((letter, index) => {
            if (greens[index] !== '-' && greens[index] !== letter)
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

    if (validWords.length === 1) {
        validWords.map((word) => console.log({ word }));
    } else {
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
            const wordLetterScores = {};

            const posLetterScore = word.split('').reduce((score, letter, i) => {
                wordLetterScores[letter] = letterFrequency[letter];

                return score + letterPosFrequency[i][letter];
            }, 0);

            const wordLetterScore = Object.keys(wordLetterScores).reduce(
                (a, b) => a + wordLetterScores[b],
                0
            );

            return (
                (isNaN(wordLetterScore) ? 0 : wordLetterScore) +
                (isNaN(posLetterScore) ? 0 : posLetterScore)
            );
        };

        const calculateWordInformation = (word) => {
            const wordLetterScores = {};

            const posLetterScore = word.split('').reduce((score, letter, i) => {
                if (letter === greens[i]) return score;
                if (blacks.includes(letter)) return score;
                if (yellows.flat().includes(letter)) return score;

                wordLetterScores[letter] = letterFrequency[letter];

                return score + letterPosFrequency[i][letter];
            }, 0);

            const wordLetterScore = Object.keys(wordLetterScores).reduce(
                (a, b) => a + wordLetterScores[b],
                0
            );

            return (
                (isNaN(wordLetterScore) ? 0 : wordLetterScore) +
                (isNaN(posLetterScore) ? 0 : posLetterScore)
            );
        };

        let wordScores = allWords.map((word) => ({
            word,
            score: calculateWordScore(word),
            information: calculateWordInformation(word),
        }));

        wordScores.sort((a, b) => b.information - a.information);
        wordScores = wordScores.map((word, i) => ({
            ...word,
            rank: i + 1,
        }));

        console.log('The top 5 words are:');
        for (let i = 0; i < 5; i++) console.log(wordScores[i]);
    }
} catch (err) {
    console.error(err);
}
