
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
        //adding ! as we know is not not null or undefined ie (param of key) so we say to 
        //typescript this will not be null!
        //similar to adding type inversion =>
        // return this.cache.get(key) as string;
        // or
    //     return this.cache.get(key) || "";
    }

    put(key: string, value: string): void {
        //void to show the return type method doesnt return anything 
        // and is maintaining the messages type signature while catching errors
        if (this.cache.has(key)) {
            // this will uppdate usage
            this.usage = this.usage.filter(k => k !== key);
        } else if (this.cache.size >= this.capacity) {
            // this will evict least recently used
            const lruKey = this.usage.pop()!;
            this.cache.delete(lruKey);
        }

        // Add new entry to the put
        this.cache.set(key, value);
        this.usage.unshift(key);
    }
}