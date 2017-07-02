class Ringbuffer<T> implements Iterable<T> {
    private size: number;
    private start: number;
    private end: number;
    private buffer: Array<T>;

    constructor(size: number) {
        this.size = size;
        this.start = 0;
        this.end = 0;
        this.buffer = Array(size).fill(null);
    }

    public length(): number {
        return this.end - this.start;
    }

    public push(item: T) {
        this.buffer[this.end % this.size] = item;
        ++this.end;
        if (this.end - this.start > this.size) {
            ++this.start;
        }
    }

    public pop(): T {
        if (this.start == this.end) {
            return null;
        }
        let item = this.buffer[this.start];
        ++this.start;
        return item;
    }

    public clear() {
        this.start = this.end;
    }

    [Symbol.iterator](): Iterator<T> {
        let pos = this.start;
        let ringbuffer = this;
        return {
            next(): IteratorResult<T> {
                if (pos >= ringbuffer.end) {
                    return {
                        done: true,
                        value: null,
                    }
                } else {
                    let i = pos % ringbuffer.size;
                    ++pos;
                    return {
                        done: false,
                        value: ringbuffer.buffer[i],
                    }
                }
            }
        }
    }
}
