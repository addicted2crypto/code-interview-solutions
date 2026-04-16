// LRU Cache - Optimized Implementation using Doubly Linked List + Dictionary
// Time Complexity: O(1) for TryGet, Put, and Remove
// Space Complexity: O(capacity)
//
// Improvements over the TypeScript version:
//   - Generic <TKey, TValue> instead of hardcoded string/string
//   - TryGet pattern: distinguishes "missing" from "present but default value"
//   - Uses built-in LinkedList<T>, so no sentinel head/tail bookkeeping
//   - Capacity is validated up front
//   - Exposes Count / Capacity for observability

using System;
using System.Collections.Generic;

public sealed class LRUCache<TKey, TValue> where TKey : notnull
{
    private readonly int _capacity;
    private readonly Dictionary<TKey, LinkedListNode<Entry>> _map;
    private readonly LinkedList<Entry> _list;

    // Key is stored alongside value so eviction (tail removal) knows which
    // dictionary entry to drop without a reverse lookup.
    private readonly struct Entry
    {
        public readonly TKey Key;
        public readonly TValue Value;
        public Entry(TKey key, TValue value) { Key = key; Value = value; }
    }

    public LRUCache(int capacity)
    {
        if (capacity <= 0)
            throw new ArgumentOutOfRangeException(nameof(capacity), "Capacity must be positive.");
        _capacity = capacity;
        _map = new Dictionary<TKey, LinkedListNode<Entry>>(capacity);
        _list = new LinkedList<Entry>();
    }

    public int Count => _map.Count;
    public int Capacity => _capacity;

    // Returns true if key exists. On hit, promotes entry to most-recently-used.
    public bool TryGet(TKey key, out TValue value)
    {
        if (_map.TryGetValue(key, out var node))
        {
            _list.Remove(node);
            _list.AddFirst(node);
            value = node.Value.Value;
            return true;
        }
        value = default!;
        return false;
    }

    // Inserts or updates. On overflow, evicts the least-recently-used entry.
    public void Put(TKey key, TValue value)
    {
        if (_map.TryGetValue(key, out var existing))
        {
            existing.Value = new Entry(key, value);
            _list.Remove(existing);
            _list.AddFirst(existing);
            return;
        }

        if (_map.Count >= _capacity)
        {
            var lru = _list.Last!;
            _list.RemoveLast();
            _map.Remove(lru.Value.Key);
        }

        var node = new LinkedListNode<Entry>(new Entry(key, value));
        _list.AddFirst(node);
        _map[key] = node;
    }

    public bool Remove(TKey key)
    {
        if (!_map.TryGetValue(key, out var node)) return false;
        _list.Remove(node);
        _map.Remove(key);
        return true;
    }
}

// Example usage:
//   var cache = new LRUCache<string, int>(2);
//   cache.Put("a", 1);              // cache: {a=1}
//   cache.Put("b", 2);              // cache: {a=1, b=2}
//   cache.TryGet("a", out var a);   // a = 1, cache order: {b=2, a=1}
//   cache.Put("c", 3);              // evicts "b", cache: {a=1, c=3}
//   cache.TryGet("b", out var _);   // returns false
