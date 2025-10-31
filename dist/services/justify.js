"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.justifyText = justifyText;
/**
 * Justifies the text to the specified line length
 * @param text The text to justify
 * @param lineLength The maximum length of each line (default: 80)
 * @returns The justified text
 */
function justifyText(text, lineLength = 80) {
    if (lineLength <= 0) {
        throw new Error('Line length must be greater than 0');
    }
    // Split text into words
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) {
        return '';
    }
    const lines = [];
    let currentLine = [];
    let currentLength = 0;
    // Build lines of words without exceeding lineLength
    for (const word of words) {
        // If adding the next word would exceed the line length, process the current line
        if (currentLength + currentLine.length + word.length > lineLength) {
            if (currentLine.length === 0) {
                // Handle case where a single word is longer than lineLength
                lines.push(word);
                continue;
            }
            // Add the justified line to the result
            lines.push(justifyLine(currentLine, lineLength));
            currentLine = [];
            currentLength = 0;
        }
        // Add the word to the current line
        currentLine.push(word);
        currentLength += word.length;
    }
    // Add the last line (left-justified)
    if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
    }
    return lines.join('\n');
}
/**
 * Helper function to justify a single line
 */
function justifyLine(words, lineLength) {
    if (words.length === 1) {
        return words[0];
    }
    const totalSpaces = lineLength - words.reduce((sum, word) => sum + word.length, 0);
    const gaps = words.length - 1;
    const baseSpaceLength = Math.floor(totalSpaces / gaps);
    let extraSpaces = totalSpaces % gaps;
    let result = '';
    for (let i = 0; i < words.length; i++) {
        result += words[i];
        // Don't add spaces after the last word
        if (i < words.length - 1) {
            // Add base spaces
            result += ' '.repeat(baseSpaceLength);
            // Distribute extra spaces from left to right
            if (extraSpaces > 0) {
                result += ' ';
                extraSpaces--;
            }
        }
    }
    return result;
}
