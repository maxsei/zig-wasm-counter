const M: u8 = 32;

const Branch = struct {
    mbrPoints: [3][2]f32,
    children: [M]Node,
    childrenCount: u8,
};
const Leaf = struct {
    mbrPoints: [3][2]f32,
    points: [M][2]f32,
    pointsCount: u8,
};
const Node = union(enum) {
    leaf: Leaf,
    branch: Branch,
};

test "idk" {
    _ = Node{
        .Leaf = .{
            .mbrPoints = .{},
        },
    };
}
