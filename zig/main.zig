const std = @import("std");
const testing = std.testing;

export fn add(a: f32, b: f32) f32 {
    return a + b;
}

test "basic add functionality" {
    try testing.expect(add(3, 7) == 10);
}
