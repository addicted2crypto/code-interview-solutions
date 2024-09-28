
// Given a sorted array of integers and an integer called target, find the element that 
// equals the target and return its index. If the element is not found return -1.








"use strict";

function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while(left <= right) {
        /* Using (right - left) prevents possible overflow as (left + right) could 
        do potentially */
        const middleOfElements = left + Math.floor((right - left) / 2);
        /* If arr[middleOfElements] is the target return middleOfElements yahoo we
         got the answer */
        if(arr[middleOfElements] === target) return middleOfElements; 
        if(arr[middleOfElements] < target){
            /*If middle is less than target we want to discard everything element
             wise to the left boundary (middle + 1)*/
            left = middleOfElements + 1;
        } else {
            /* If the middle is greater than target we want to discard everything 
            element wise to the right of search boundary or of the pointer middle - 1 */

            right = middleOfElements - 1;
        }
        /* as stated in problem if we didnt hit the target element we return -1 */
        return -1;
    }

}