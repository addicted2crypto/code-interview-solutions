// find the character that appears most frequently in a string
// Example: "hello" => "l"
// Example: "character" => "c" or "a" (both appear twice)
// Example: "aabbcc" => "a" or "b" or "c" (all appear twice)
// Example: "abc" => "a" or "b" or "c" (all appear once)    


function maxChar(str) {
    if (!str) return '';

    const charMap = new Map();
    let maxChar = '';
    let maxCount = 0;

    for (let char of str) {
        const count = (charMap.get(char) || 0) + 1;
        charMap.set(char, count);

        // Track max while building the map (single pass optimization)
        if (count > maxCount) {
            maxCount = count;
            maxChar = char;
        }
    }

    return maxChar;
}

// Test cases
console.log(maxChar("hello"));      // "l"
console.log(maxChar("character"));  // "c" or "a"
console.log(maxChar("aabbcc"));     // "a"
console.log(maxChar("abc"));        // "a"
console.log(maxChar(""));           // ""
console.log(maxChar("aaabbbbbcc")); // "b"