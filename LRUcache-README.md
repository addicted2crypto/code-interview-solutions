# LRU Cache Implementation Guide

## Table of Contents
1. [What is an LRU Cache?](#what-is-an-lru-cache)
2. [Real-World Use Cases](#real-world-use-cases)
3. [Implementation Approaches](#implementation-approaches)
4. [Optimized Implementation - Line by Line](#optimized-implementation---line-by-line)
5. [Complexity Analysis](#complexity-analysis)
6. [Visual Explanation](#visual-explanation)
7. [Example Usage & Test Cases](#example-usage--test-cases)
8. [Common Interview Questions](#common-interview-questions)

---

## What is an LRU Cache?

**LRU (Least Recently Used) Cache** is a data structure that:
- Stores a limited number of items (capacity)
- Evicts the **least recently used** item when capacity is exceeded
- Provides fast access to stored items

**Key Operations:**
- `get(key)`: Retrieve value and mark as recently used
- `put(key, value)`: Store/update value and mark as recently used

---

## Real-World Use Cases

### 1. **Database Query Caching**
```typescript
// Cache recent database query results
const dbCache = new LRUCache(100);
dbCache.put("SELECT * FROM users WHERE id=1", userObject);
```

### 2. **Web Browser Cache**
- Stores recently visited pages
- Evicts oldest pages when memory limit reached

### 3. **CDN (Content Delivery Networks)**
- Caches popular content closer to users
- Removes least accessed content when storage fills

### 4. **API Response Caching**
```typescript
// Cache API responses to reduce external calls
const apiCache = new LRUCache(50);
apiCache.put("/api/users/123", responseData);
```

### 5. **DNS Resolution Cache**
- Operating systems cache DNS lookups
- Speeds up repeated domain name resolutions

---

## Implementation Approaches

### ❌ Naive Approach: Array + Map (Old Implementation)

**Data Structures:**
- `Map<string, string>`: Stores key-value pairs
- `Array<string>`: Tracks usage order (front = most recent)

**Problems:**
```typescript
this.usage = this.usage.filter(k => k !== key);  // O(n) - SLOW!
this.usage.unshift(key);
```

**Why It's Slow:**
- `filter()` creates a new array: **O(n)**
- `unshift()` shifts all elements: **O(n)**
- Every `get()` or `put()` becomes **O(n)**

**Time Complexity:**
- `get()`: **O(n)** due to filter
- `put()`: **O(n)** due to filter
- Space: O(capacity)

### ✅ Optimized Approach: Doubly Linked List + Map

**Data Structures:**
- `Map<string, Node>`: Stores key → node reference
- `DoublyLinkedList`: Tracks usage order (head = most recent, tail = least recent)

**Why It's Fast:**
- Direct node access via Map: **O(1)**
- Moving nodes in linked list: **O(1)**
- No array shifting needed!

**Time Complexity:**
- `get()`: **O(1)**
- `put()`: **O(1)**
- Space: O(capacity)

---

## Optimized Implementation - Line by Line

### Part 1: DoublyLinkedListNode Class

```typescript
class DoublyLinkedListNode {
    key: string;
    value: string;
    prev: DoublyLinkedListNode | null;
    next: DoublyLinkedListNode | null;
```

**Lines 7-11: Node Properties**
- `key`: The cache key (needed for eviction)
- `value`: The cached value
- `prev`: Pointer to previous node (more recently used)
- `next`: Pointer to next node (less recently used)

**Why store `key` in the node?**
When evicting the LRU item, we need the key to delete it from the Map.

```typescript
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
```

**Lines 13-18: Constructor**
- Initializes a new node with key and value
- Sets prev/next to null (will be linked later)

---

### Part 2: LRUCache Class Setup

```typescript
class LRUCache {
    private capacity: number;
    private cache: Map<string, DoublyLinkedListNode>;
    private head: DoublyLinkedListNode;
    private tail: DoublyLinkedListNode;
```

**Line 24: `capacity`**
- Maximum number of items the cache can hold
- When exceeded, evict the LRU item

**Line 26: `cache` Map**
- **Key**: The cache key (string)
- **Value**: Reference to the node in the linked list
- **Purpose**: O(1) lookup to find nodes instantly

**Lines 29-30: `head` and `tail` Dummy Nodes**
- **Dummy nodes**: Never store actual data
- **Purpose**: Simplify edge cases (empty list, single item)
- **Structure**: `head ⇄ [actual nodes] ⇄ tail`
- `head.next` = most recently used
- `tail.prev` = least recently used

**Why dummy nodes?**
Without them, we'd need null checks everywhere:
```typescript
// Without dummy nodes (complex):
if (this.head === null) { /* special case */ }

// With dummy nodes (simple):
this.head.next = newNode;  // Always works!
```

```typescript
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();

        this.head = new DoublyLinkedListNode("", "");
        this.tail = new DoublyLinkedListNode("", "");

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
```

**Lines 32-44: Constructor**
- **Line 33**: Store the capacity limit
- **Line 34**: Initialize empty Map
- **Lines 38-39**: Create dummy head and tail
- **Lines 42-43**: Connect head ⇄ tail (initially empty list)

**Initial State:**
```
head ⇄ tail
```

---

### Part 3: Helper Method - addToHead()

```typescript
    private addToHead(node: DoublyLinkedListNode): void {
        node.prev = this.head;
        node.next = this.head.next;

        this.head.next!.prev = node;
        this.head.next = node;
    }
```

**Purpose:** Insert a node right after head (most recently used position)

**Line-by-line execution:**

**Before:**
```
head ⇄ nodeA ⇄ tail
```

**Line 50**: `node.prev = this.head`
```
head ← node
     ⇄ nodeA ⇄ tail
```

**Line 51**: `node.next = this.head.next` (nodeA)
```
head ← node → nodeA
     ⇄        ⇄ tail
```

**Line 54**: `this.head.next!.prev = node` (nodeA.prev = node)
```
head ← node ⇄ nodeA
     ⇄           ⇄ tail
```

**Line 57**: `this.head.next = node`
```
head ⇄ node ⇄ nodeA ⇄ tail
```

**Why the `!` operator?**
- TypeScript knows `this.head.next` might be null
- But we know it's always the tail (or another node)
- `!` tells TypeScript: "Trust me, this is not null"

---

### Part 4: Helper Method - removeNode()

```typescript
    private removeNode(node: DoublyLinkedListNode): void {
        const prevNode = node.prev;
        const nextNode = node.next;

        prevNode!.next = nextNode;
        nextNode!.prev = prevNode;
    }
```

**Purpose:** Remove a node from its current position

**Before:**
```
head ⇄ nodeA ⇄ nodeB ⇄ nodeC ⇄ tail
```

**Removing nodeB:**

**Lines 64-65**: Store references
```typescript
prevNode = nodeA
nextNode = nodeC
```

**Line 67**: `prevNode.next = nextNode` (nodeA → nodeC)
```
head ⇄ nodeA → nodeC ⇄ tail
       ⇅ nodeB ←
```

**Line 68**: `nextNode.prev = prevNode` (nodeC ← nodeA)
```
head ⇄ nodeA ⇄ nodeC ⇄ tail

       nodeB (isolated, will be garbage collected)
```

**Result:**
```
head ⇄ nodeA ⇄ nodeC ⇄ tail
```

---

### Part 5: Helper Method - moveToHead()

```typescript
    private moveToHead(node: DoublyLinkedListNode): void {
        this.removeNode(node);
        this.addToHead(node);
    }
```

**Purpose:** Mark an existing node as most recently used

**Line 74**: Remove from current position
**Line 75**: Add to front (right after head)

**Example:**
```
Before: head ⇄ nodeA ⇄ nodeB ⇄ nodeC ⇄ tail
After:  head ⇄ nodeB ⇄ nodeA ⇄ nodeC ⇄ tail
```
(nodeB moved to front = most recently used)

---

### Part 6: Helper Method - removeTail()

```typescript
    private removeTail(): DoublyLinkedListNode {
        const lruNode = this.tail.prev!;
        this.removeNode(lruNode);
        return lruNode;
    }
```

**Purpose:** Evict the least recently used item

**Line 81**: Get the node before tail (LRU item)
**Line 82**: Remove it from the list
**Line 83**: Return it (so we can delete from Map)

**Before:**
```
head ⇄ nodeA ⇄ nodeB ⇄ nodeC ⇄ tail
                       ↑ (LRU - will be removed)
```

**After:**
```
head ⇄ nodeA ⇄ nodeB ⇄ tail
```

---

### Part 7: get() Method

```typescript
    get(key: string): string {
        const node = this.cache.get(key);

        if (!node) {
            return "";
        }

        this.moveToHead(node);

        return node.value;
    }
```

**Line 90**: Look up node in Map - **O(1)**

**Lines 93-95**: Key not found
- Return empty string (could also return null/-1 depending on use case)

**Line 99**: Mark as most recently used
- Move node to front of linked list - **O(1)**

**Line 101**: Return the cached value

**Example Flow:**
```typescript
cache.get("b")

Before: head ⇄ a ⇄ b ⇄ c ⇄ tail
After:  head ⇄ b ⇄ a ⇄ c ⇄ tail  (b moved to front)
Returns: value of b
```

---

### Part 8: put() Method

```typescript
    put(key: string, value: string): void {
        const node = this.cache.get(key);

        if (node) {
            node.value = value;
            this.moveToHead(node);
        } else {
            const newNode = new DoublyLinkedListNode(key, value);

            this.cache.set(key, newNode);

            this.addToHead(newNode);

            if (this.cache.size > this.capacity) {
                const lruNode = this.removeTail();

                this.cache.delete(lruNode.key);
            }
        }
    }
```

**Line 108**: Check if key already exists - **O(1)**

**Case 1: Key Exists (Lines 110-113)**
- **Line 112**: Update the value
- **Line 113**: Move to front (most recently used)

**Case 2: New Key (Lines 114-132)**

**Line 116**: Create new node with key and value

**Line 119**: Add to Map for O(1) lookup

**Line 122**: Add to front of linked list (most recently used)

**Lines 125-131**: Check capacity
- **Line 125**: If we exceeded capacity
- **Line 127**: Remove LRU item (tail.prev)
- **Line 130**: Delete from Map using the evicted node's key

**Example Flow:**
```typescript
cache = LRUCache(2)  // capacity = 2

cache.put("a", "1")
State: head ⇄ a ⇄ tail
Map: {a → nodeA}

cache.put("b", "2")
State: head ⇄ b ⇄ a ⇄ tail
Map: {a → nodeA, b → nodeB}

cache.put("c", "3")  // Exceeds capacity!
State: head ⇄ c ⇄ b ⇄ tail  (a evicted)
Map: {b → nodeB, c → nodeC}
```

---

## Complexity Analysis

### Optimized Implementation (Current)

| Operation | Time Complexity | Why? |
|-----------|----------------|------|
| `get(key)` | **O(1)** | Map lookup + move node in linked list |
| `put(key, value)` | **O(1)** | Map insert + add/remove node in linked list |
| **Space** | **O(capacity)** | Stores at most `capacity` nodes + Map entries |

### Old Array-Based Implementation

| Operation | Time Complexity | Why? |
|-----------|----------------|------|
| `get(key)` | **O(n)** | `filter()` creates new array |
| `put(key, value)` | **O(n)** | `filter()` creates new array |
| **Space** | **O(capacity)** | Array + Map |

### Performance Difference

For a cache with **1000 items**:
- **Old**: ~1000 operations per get/put
- **New**: ~5 operations per get/put (constant!)
- **Speedup**: ~200x faster! 🚀

---

## Visual Explanation

### Data Structure Visualization

```
Map (cache):
┌─────────────────────────────┐
│ "a" → nodeA                 │
│ "b" → nodeB                 │
│ "c" → nodeC                 │
└─────────────────────────────┘

Doubly Linked List (usage order):
┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
│ head │ ⇄ │   c  │ ⇄ │   b  │ ⇄ │   a  │ ⇄ │ tail │
│(dummy)│   │ (MRU)│   │      │   │ (LRU)│   │(dummy)│
└──────┘   └──────┘   └──────┘   └──────┘   └──────┘

MRU = Most Recently Used
LRU = Least Recently Used
```

### Step-by-step: put("d", "4") with capacity=3

**Before:**
```
Map: {a → nodeA, b → nodeB, c → nodeC}
List: head ⇄ c ⇄ b ⇄ a ⇄ tail
```

**Step 1:** Create new node for "d"
```
newNode = {key: "d", value: "4"}
```

**Step 2:** Add to Map
```
Map: {a → nodeA, b → nodeB, c → nodeC, d → nodeD}
```

**Step 3:** Add to head of list
```
List: head ⇄ d ⇄ c ⇄ b ⇄ a ⇄ tail
```

**Step 4:** Check capacity (4 > 3, need to evict!)
```
LRU item = a (tail.prev)
```

**Step 5:** Remove "a" from list
```
List: head ⇄ d ⇄ c ⇄ b ⇄ tail
```

**Step 6:** Delete "a" from Map
```
Map: {b → nodeB, c → nodeC, d → nodeD}
```

**Final State:**
```
Map: {b → nodeB, c → nodeC, d → nodeD}
List: head ⇄ d ⇄ c ⇄ b ⇄ tail
```

### Step-by-step: get("b")

**Before:**
```
List: head ⇄ d ⇄ c ⇄ b ⇄ tail
                       ↑ (accessing this)
```

**Step 1:** Find node in Map - O(1)
```typescript
node = cache.get("b")  // Returns nodeB instantly
```

**Step 2:** Remove from current position
```
List: head ⇄ d ⇄ c ⇄ tail
```

**Step 3:** Add to head (most recently used)
```
List: head ⇄ b ⇄ d ⇄ c ⇄ tail
             ↑ (now MRU!)
```

**Step 4:** Return value
```typescript
return node.value  // "2"
```

---

## Example Usage & Test Cases

### Basic Usage

```typescript
const cache = new LRUCache(2);

// Test 1: Basic put and get
cache.put("a", "1");
console.log(cache.get("a"));  // "1"

// Test 2: Capacity limit
cache.put("b", "2");
cache.put("c", "3");  // Evicts "a" (LRU)
console.log(cache.get("a"));  // "" (not found)
console.log(cache.get("b"));  // "2"

// Test 3: Update existing key
cache.put("b", "updated");
console.log(cache.get("b"));  // "updated"

// Test 4: Access order matters
cache.put("d", "4");  // Evicts "c" (LRU, because "b" was accessed)
console.log(cache.get("c"));  // "" (not found)
console.log(cache.get("b"));  // "updated"
```

### Edge Cases

```typescript
// Edge 1: Capacity of 1
const cache1 = new LRUCache(1);
cache1.put("a", "1");
cache1.put("b", "2");  // Evicts "a"
console.log(cache1.get("a"));  // ""

// Edge 2: Get non-existent key
console.log(cache1.get("xyz"));  // ""

// Edge 3: Update doesn't count as new insertion
const cache2 = new LRUCache(2);
cache2.put("a", "1");
cache2.put("b", "2");
cache2.put("a", "updated");  // Update, not new
cache2.put("c", "3");  // Evicts "b"
console.log(cache2.get("b"));  // ""
console.log(cache2.get("a"));  // "updated"
```

### Interview Test Case

```typescript
// LeetCode style test
const cache = new LRUCache(2);

cache.put("1", "1");
cache.put("2", "2");
cache.get("1");       // returns "1", marks 1 as recently used
cache.put("3", "3");  // evicts key 2
cache.get("2");       // returns "" (not found)
cache.put("4", "4");  // evicts key 1
cache.get("1");       // returns "" (not found)
cache.get("3");       // returns "3"
cache.get("4");       // returns "4"
```

---

## Common Interview Questions

### Q1: Why use a doubly linked list instead of a singly linked list?

**Answer:**
We need to remove nodes from the middle of the list efficiently.

**Singly Linked List:**
- To remove a node, we need the previous node
- We'd have to traverse from head: **O(n)**

**Doubly Linked List:**
- Each node has `prev` pointer
- We can remove any node directly: **O(1)**

```typescript
// Doubly linked: O(1) removal
node.prev.next = node.next;
node.next.prev = node.prev;

// Singly linked: O(n) - need to find prev!
let current = head;
while (current.next !== node) { current = current.next; }
current.next = node.next;
```

### Q2: Why use dummy head and tail nodes?

**Answer:**
Simplifies edge cases and eliminates null checks.

**Without dummy nodes:**
```typescript
// Need to check if list is empty
if (this.head === null) {
    this.head = newNode;
    this.tail = newNode;
} else if (this.head === this.tail) {
    // Special case for single element
} else {
    // Normal case
}
```

**With dummy nodes:**
```typescript
// Always works, no special cases!
this.head.next = newNode;
newNode.next = this.head.next;
```

### Q3: Could we use just a Map without a linked list?

**Answer:**
No, because Map doesn't maintain insertion/access order in a way we can manipulate.

**JavaScript Map** preserves insertion order for iteration, but:
- Can't efficiently move an element to the front
- Can't efficiently find the least recently used item
- Would need to rebuild the Map on every access: **O(n)**

### Q4: What if we need thread-safe LRU cache?

**Answer:**
Add locks/mutexes:

```typescript
class ThreadSafeLRUCache {
    private lock = new Mutex();

    async get(key: string): Promise<string> {
        await this.lock.acquire();
        try {
            // ... normal get logic
        } finally {
            this.lock.release();
        }
    }
}
```

### Q5: How would you add TTL (time-to-live) to the cache?

**Answer:**
Store expiration time in each node:

```typescript
class TTLNode extends DoublyLinkedListNode {
    expiresAt: number;
}

get(key: string): string {
    const node = this.cache.get(key);
    if (!node || Date.now() > node.expiresAt) {
        this.cache.delete(key);  // Expired
        return "";
    }
    // ... rest of get logic
}
```

---

## Summary

### Key Takeaways

1. **LRU Cache** = Fast access + automatic eviction of old data
2. **Optimal Implementation** = Doubly Linked List + HashMap
3. **Time Complexity**: O(1) for both get and put
4. **Space Complexity**: O(capacity)

### When to Use LRU Cache

✅ **Use when:**
- Limited memory/storage available
- Access patterns show temporal locality (recent items accessed again)
- Need fast eviction policy

❌ **Don't use when:**
- Unlimited storage available
- All items equally important (no recency bias)
- Need different eviction policy (LFU, FIFO, random)

### Alternative Cache Eviction Policies

| Policy | Evicts | Use Case |
|--------|--------|----------|
| **LRU** | Least Recently Used | General-purpose caching |
| **LFU** | Least Frequently Used | Popular items stay longer |
| **FIFO** | First In First Out | Simple queue behavior |
| **Random** | Random item | Simple, works for uniform access |
| **TTL** | Expired items | Time-sensitive data |

---

## Additional Resources

- [LeetCode Problem 146: LRU Cache](https://leetcode.com/problems/lru-cache/)
- [TypeScript Handbook: Classes](https://www.typescriptlang.org/docs/handbook/classes.html)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

---

**Happy Coding!** 🚀
