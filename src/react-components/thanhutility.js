export function caesarCipher(str, shift) {
    if (str === null || str === undefined || str === '') {
        return '';
    }
    return str.split('')
        .map(char => {
            let code = char.charCodeAt(0);
            // Uppercase letters
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }
            // Lowercase letters
            else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
            // Non-alphabetical characters remain unchanged
            return char;
        })
        .join('');
}

export function caesarDecipher(str, shift) {
    if (str === null || str === undefined || str === '') {
        return '';
    }
    return caesarCipher(str, -shift);
}