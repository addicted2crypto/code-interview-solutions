Code Assessment Questions Summary
Problem 1: Good URI Design (Multiple Choice)
Question: Which of the following are true regarding good URI design? (Pick ONE or MORE)

Options:

URIs should never be changed
URIs must be constructed by the client
URIs should be short in length ✅
URIs should be case-sensitive
HTTP verbs should be used instead of operation names in URIs ✅
Use spaces when designing a URI
Redirection must be used if a change in URI is required ✅
Problem 2: SQL - Company Employees (MySQL)
Question: Write a query to print the ID of companies with more than 10,000 employees.

Table: COMPANY

Field	Type
ID	Integer (Primary Key, 1-1000)
NAME	String (1-100 chars)
EMPLOYEES	Integer
Expected Output: IDs of companies where EMPLOYEES > 10000

Problem 3: FizzBuzz
Question: Print numbers 1 to n with the following rules:

If divisible by 3 AND 5: print "FizzBuzz"
If divisible by 3 only: print "Fizz"
If divisible by 5 only: print "Buzz"
Otherwise: print the number
Print one result per line.

Example: n = 15
Output:


1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
Problem 4: Java Exception Handling (Find the Output)
Question: What will the code print when we call divide(4, 0)?


public int divide(int a, int b) {
    int c = -1;
    
    try {
        c = a / b;
    }
    catch (Exception e) {
        System.err.print("Exception ");
    }
    finally {
        System.err.println("Finally ");
    }
    
    return c;
}
Options:

Exception Finally ✅
Finally Exception
Exception
Finally
No output
-1
Problem 5: Java String Array Declaration
Question: Which of the following Java declarations of the String array is correct?

Options:

String temp [] = new String {"j" "a" "z"};
String temp [] = { "j" " " "b" "c"};
String temp = {"a", "b", "c"};
String temp [] = {"a", "b", "c"}; ✅
Problem 6: Java Math Functions (Output -4.0)
Question: Which of the following will output -4.0?

Options:

System.out.println(Math.floor(-4.7)); → -5.0
System.out.println(Math.round(-4.7)); → -5
System.out.println(Math.ceil(-4.7)); ✅ → -4.0
System.out.println(Math.Min(-4.7)); → Error
Problem 7: Java String Operations
Question: Given the following declarations, which operation is legal?


String s1 = new String("Hello");
String s2 = new String("there");
String s3 = new String();
Options:

s3 = s1 + s2; ✅
s3 = s1 - s2;
s3 = s1 & s2
s3 = s1 && s2
Problem 8: Time Complexity Analysis
Question: What is the complexity of the following code snippet?


int a = 1;

while (a < n) {
    a = a * 2;
}
Options:

O(n)
O(1)
O(log₂(n)) ✅
O(2ⁿ)
Problem 9: SQL - Employee Salaries (PostgreSQL)
Question: Write a query to print the name and salary for all employees in the Employee table who earn a salary larger than $500. Sort results in ascending order of the last 3 characters in the employee's name. If two or more employees have names ending with the same 3 characters, sort them by highest (descending) salary.

Table: Employee

Field	Type
ID	Integer
NAME	String
SALARY	Integer
Solution:


SELECT name, salary
FROM Employee
WHERE salary > 500
ORDER BY RIGHT(name, 3) ASC, salary DESC;
Problem 10: Rod Cutting (JavaScript)
Question: You are given an array of metal rod lengths. In each round:

Count how many rods are currently present
Identify the shortest rod length
Discard all rods that have this shortest length
Subtract the shortest length from each remaining rod and discard the offcuts
Repeat until no rods are left
Return an array where each element represents the number of rods at the start of each round.

Example:

Input: lengths = [1, 1, 3, 4]
Output: [4, 2, 1]
Explanation:

Round 1: 4 rods [1,1,3,4], shortest=1, discard two 1s, cut 1 from remaining → [2,3]
Round 2: 2 rods [2,3], shortest=2, discard 2, cut 2 from remaining → [1]
Round 3: 1 rod [1], shortest=1, discard → []
Problem 11: Arrange the Words (JavaScript)
Question: Rearrange words in a sentence:

Order words by increasing length
If multiple words have same length, keep original order (stable sort)
First letter uppercase, all others lowercase
Words separated by single spaces
Sentence ends with period
Example:

Input: "The lines are printed in reverse order."
Output: "In the are lines order printed reverse."
Problem 12: Find the Factor (JavaScript)
Question: Given two integers n and p:

Find all positive factors of n
Sort them in ascending order
Return the p-th smallest factor (1-based indexing)
If n has fewer than p factors, return 0
Constraints:

1 ≤ n ≤ 10^15
1 ≤ p ≤ 10^9
Example:

Input: n = 10, p = 3
Output: 5
Factors of 10: {1, 2, 5, 10}, 3rd factor = 5
Problem 13: REST Security Best Practices (Multiple Choice)
Question: Identify rules to follow when securing a web app based on REST architecture. (Pick ONE or MORE)

Options:

Sensitive data such as usernames and passwords must always be passed using POST method ✅
A web service must not use any HTTP error messages
All input validations must be done on the server ✅
Validate malformed XML/JSON ✅
PUT operations must be read-only