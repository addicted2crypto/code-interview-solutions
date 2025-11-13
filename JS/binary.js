
// Given a sorted array of integers and an integer called target, find the element that 
// equals the target and return its index. If the element is not found return -1.

//Binanry Search Problem 

// create left and right(with value.length - 1) dual pointers to cut output in half every iteration








"use strict";

function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while(left <= right) {
        // Using (right - left) prevents integer overflow
        const mid = left + Math.floor((right - left) / 2);

        if(arr[mid] === target) {
            return mid; // Found the target
        }

        if(arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }

    // Target not found
    return -1;
}

// Test cases
console.log(binarySearch([1, 3, 5, 7, 9, 11], 7));  // Expected: 3
console.log(binarySearch([1, 3, 5, 7, 9, 11], 1));  // Expected: 0
console.log(binarySearch([1, 3, 5, 7, 9, 11], 11)); // Expected: 5
console.log(binarySearch([1, 3, 5, 7, 9, 11], 6));  // Expected: -1
console.log(binarySearch([], 5));                    // Expected: -1
console.log(binarySearch([5], 5));                   // Expected: 0