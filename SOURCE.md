# Prebuilt catalog source

This branch contains the prebuilt 0.1.0-beta.1 package for pinned Git installation.

- Source and development files: https://github.com/tsuixl/dsh-stylebook/tree/0713fd73fd2da1e91e8fefc8858e6d6486d8dd90
- Release: https://github.com/tsuixl/dsh-stylebook/releases/tag/v0.1.0-beta.1
- Release tarball SHA-256: ae754b578d686dff56e5d57ef81b4f937df04680afdcc888d2ded6bb531eba7a

Runtime files are copied byte-for-byte from the verified Release tarball. Development scripts and devDependencies are removed from package.json so Git installation does not require a build. Runtime dependencies, peer dependencies, engines, exports and the DSH manifest are preserved. The main branch remains the development source.
