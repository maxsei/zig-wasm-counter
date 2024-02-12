const std = @import("std");
const testing = std.testing;

var __buf: [4096]u8 = undefined;
var fba = std.heap.FixedBufferAllocator.init(&__buf);
var allocator = fba.allocator();

pub export fn init() *const Counter {
    var ret = allocator.create(Counter) catch unreachable;
    ret.* = Counter{};
    return ret;
}

const Counter = struct {
    count: i32 = 0,

    pub export fn increment(self: *Counter) void {
        self.count += 1;
    }
    pub export fn get_count(self: *Counter) i32 {
        return self.count;
    }
    pub export fn deinit(self: *Counter) void {
        allocator.destroy(self);
    }
};
