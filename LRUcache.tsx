
//Cmon you knew better.... this is actually thinking through the solution
class LRUCache {
    private capacity: number;
    private cache: Map<string, string>;
    private usage: string[];

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
        this.usage = [];
    }

    get(key: string): string {
        if (!this.cache.has(key)) {
            return "";
        }

        // Update usage
        this.usage = this.usage.filter(k => k !== key);
        this.usage.unshift(key);

        return this.cache.get(key)!;
    }

    put(key: string, value: string): void {
        if (this.cache.has(key)) {
            // this will uppdate usage
            this.usage = this.usage.filter(k => k !== key);
        } else if (this.cache.size >= this.capacity) {
            // this will evict least recently used
            const lruKey = this.usage.pop()!;
            this.cache.delete(lruKey);
        }

        // Add new entry
        this.cache.set(key, value);
        this.usage.unshift(key);
    }
}