{
  description = "dev shell";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/release-23.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.zls.url = "github:zigtools/zls";

  outputs = { self, nixpkgs, flake-utils, ... }@inputs:
    let
      zigpkgs = inputs.zls.inputs.zig-overlay.outputs.packages;
      overlays = [
        (final: prev: {
          zig-versions = zigpkgs.${prev.system};
          zls = inputs.zls.packages.${prev.system}.zls;
        })
      ];
      # Our supported systems are the same supported systems as the Zig binaries
      systems = builtins.attrNames zigpkgs;
    in flake-utils.lib.eachSystem systems (system:
      let pkgs = import nixpkgs { inherit overlays system; };
      in {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            zig-versions."0.11.0"
            zls
            nodejs
            yarn
            binaryen
          ];

          buildInputs = with pkgs; [ bashInteractive ];

          shellHook = ''
            export SHELL=${pkgs.bashInteractive}/bin/bash
          '';
        };
        devShell = self.devShells.${system}.default;
      });
}
