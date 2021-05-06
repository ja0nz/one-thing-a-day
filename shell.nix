with import <nixpkgs> {};
mkShell {
  buildInputs = [
   nodePackages.pnpm
   nodePackages.serve
   nodePackages.prettier
   xsel
  ];
}
