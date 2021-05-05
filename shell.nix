{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
   pkgs.nodePackages.pnpm
   pkgs.nodePackages.serve
   pkgs.xsel
   pkgs.rlwrap
   pkgs.nodejs_latest
  ];
}
