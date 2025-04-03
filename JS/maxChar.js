// find the character that appears most frequently in a string
// Example: "hello" => "l"
// Example: "character" => "c" or "a" (both appear twice)
// Example: "aabbcc" => "a" or "b" or "c" (all appear twice)
// Example: "abc" => "a" or "b" or "c" (all appear once)    


function maxChar(str) {
    const charMap = {};
    let maxChar = '';
    let maxCount = 0;
    
    for (let char of str) {
        charMap[char] = charMap[char] + 1 || 1;

    }
    for(let char in charMap){
        if (charMap[key] > maxCount) {
        maxCount = charMap[key];
        maxChar = key;
        }
    }
    
    return maxChar;
    }

    console.log(maxChar("hello")); // "l"
    console.log(maxChar("character")); // "c" or "a"    