// Find the factor

// You are given two integars, n and p.
// A factor of n is any positive integar that divides n with no remainder.
// Your task is to:
// - find all positive factors of n
// - sort them in ascending order
// - return the pth smallest factor(using 1-based indexing)

// if n has fewer than p factors, return 0.

// Ex.
// Suppose n = 10 and p = 3
// Outpu = 5
// The factors of 10 in ascending order are {1, 2, 5, 10}. The 3rd factor using (1-based indexing) is 5.
// if p were greater than 4, you would return 0 since there are only 4 factors.A
// Constraints:
// 1 <= n <= 10^15
// 1 <= = <= 10^9 

//BigInt didn't work in hackerrand so had to get a brute force on the board, will optimize to run more efficiently later 
//I will add a const small and const large array to sort as I go to avoid sorting at the end asc and descending

function findTheFactor(n, p) {
    const factors = [];

    //find factors up to sqrt(n) -> using i * i instead of Math.sqrt due to floating point precision issues

    for(let i = 1; i * i <= n; i++) {
        if(n % i === 0) {
            factors.push(i);

            const pair = Math.floor(n/ i);

            if(i !== pair) {
                factors.push(pair);
            }
        }
    }

    //Create asc order
    factors.sort((a, b) => a - b)
    
    if(p <= factors.length) {
        return factors[p -1];
    }
    return 0;
}
