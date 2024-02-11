const std = @import("std");
const testing = std.testing;

var count: ?i32 = null;
pub export fn counter() i32 {
    if (count == null) {
        count = 0;
        return 0;
    }
    count.? += 1;
    return count.?;
}

pub export fn myadd(a: f32, b: f32) f32 {
    return a + b;
}
