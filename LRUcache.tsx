// LRU Cache - Optimized Implementation using Doubly Linked List
// Time Complexity: O(1) for both get() and put()
// Space Complexity: O(capacity)

// Node class for doubly linked list
// Each node represents a cache entry with key, value, and pointers to 
// prev/next nodes
class DoublyLinkedListNode {
    key: string;
    value: string;
    prev: DoublyLinkedListNode | null;
    next: DoublyLinkedListNode | null;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

// Optimized LRU Cache using Doubly Linked List + HashMap
// Why? Array filter() is O(n), but linked list operations are O(1)
class LRUCache {
    private capacity: number;
    // Map stores key -> node reference for O(1) lookup
    private cache: Map<string, DoublyLinkedListNode>;
    // Dummy head and tail nodes to simplify edge cases
    // Head.next = most recently used, Tail.prev = least recently used
    private head: DoublyLinkedListNode;
    private tail: DoublyLinkedListNode;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();

        // Initialize dummy head and tail nodes
        // These never store actual data, just help with pointer management
        this.head = new DoublyLinkedListNode("", "");
        this.tail = new DoublyLinkedListNode("", "");

        // Connect head and tail: head <-> tail
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    // Helper: Add a node right after the head (most recently used position)
    // Why? Newly accessed/added items should be at the front
    private addToHead(node: DoublyLinkedListNode): void {
        // Insert node between head and head.next
        node.prev = this.head;
        node.next = this.head.next;

        // Update the old head.next's prev pointer to point to new node
        this.head.next!.prev = node;

        // Update head's next pointer to point to new node
        this.head.next = node;
    }

    // Helper: Remove a node from its current position in the list
    // Why? We need this when moving a node or evicting the LRU item
    private removeNode(node: DoublyLinkedListNode): void {
        // Connect the prev and next nodes together, bypassing this node
        const prevNode = node.prev;
        const nextNode = node.next;

        prevNode!.next = nextNode;
        nextNode!.prev = prevNode;
    }

    // Helper: Move an existing node to the head (mark as most recently used)
    // Why? When we access an existing key, it becomes the most recently used
    private moveToHead(node: DoublyLinkedListNode): void {
        this.removeNode(node);  // Remove from current position
        this.addToHead(node);   // Add to front
    }

    // Helper: Remove the least recently used item (node before tail)
    // Why? When capacity is exceeded, we evict the LRU item
    private removeTail(): DoublyLinkedListNode {
        const lruNode = this.tail.prev!;
        this.removeNode(lruNode);
        return lruNode;
    }

    // Get value by key
    // Returns empty string if key doesn't exist
    // Marks the accessed key as most recently used
    get(key: string): string {
        const node = this.cache.get(key);

        // Key not found in cache
        if (!node) {
            return "";
        }

        // Key found: move to head (most recently used position)
        // This is O(1) because we have direct node reference from Map
        this.moveToHead(node);

        return node.value;
    }

    // Add or update key-value pair
    // If key exists: update value and mark as most recently used
    // If key is new and cache is full: evict LRU item
    put(key: string, value: string): void {
        const node = this.cache.get(key);

        if (node) {
            // Key already exists: update value and move to head
            node.value = value;
            this.moveToHead(node);
        } else {
            // New key: create new node
            const newNode = new DoublyLinkedListNode(key, value);

            // Add to cache Map
            this.cache.set(key, newNode);

            // Add to head of linked list (most recently used)
            this.addToHead(newNode);

            // Check if we exceeded capacity
            if (this.cache.size > this.capacity) {
                // Remove least recently used item (tail.prev)
                const lruNode = this.removeTail();

                // Remove from cache Map as well
                this.cache.delete(lruNode.key);
            }
        }
    }
}
//add limit to cache size to aviod memory overflow
// Example Usage:
// const cache = new LRUCache(2);
// cache.put("a", "1");     // cache: {a=1}
// cache.put("b", "2");     // cache: {a=1, b=2}
// cache.get("a");          // returns "1", cache: {b=2, a=1}
// cache.put("c", "3");     // evicts "b", cache: {a=1, c=3}
// cache.get("b");          // returns "", not found
