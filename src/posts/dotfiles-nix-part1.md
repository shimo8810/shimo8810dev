---
title: Nix による dotfiles - part1
date: 2024-09-16
---

# Nix による dotfiles - part 1

手元の PC の環境をすべて Nix によって構築する。
以前作成した環境をベースにしている。
参照に記載したリポジトリの構成を大いに参考にしている。

一旦完成した リポジトリ: [shimo8810/tsurara: dotfiles with nix](https://github.com/shimo8810/tsurara)

## 環境

手元にある以下の開発 PC の環境を Nix によって構築する。
(以前作成した k8s サーバは現状別管理, そのうち統合する)

- hemingway: メイン機、win とのデュアルブート
- hokusai: M1 MBA
- pipkrake: NixOS 実験用

|   ホスト名   |    pipkrake    | hemingway | hokusai |
| :----------: | :------------: | :-------: | :-----: |
|      OS      |     NixOS      |  Ubuntu   |  MacOS  |
|    NixOS     |       O        |     X     |    X    |
| home-manager |       O        |     O     |    O    |
|      HW      | think pad x280 |   自作    | MBA M1  |

## 方針

- できるだけ浅い層(`flake.nix`など)には具体を実装しない

## ディレクトリ構成

リポジトリのディレクトリ構成は以下の通りになっている。

```shellscript
tsurara
├── devshells
├── home
│   ├── cli
│   ├── desktop
│   └── gui
└── hosts
    ├── hemingway
    ├── hokusai
    └── pipkrake
```

- `devshells`: このリポジトリの開発環境
- `home`: home-manager から利用するモジュール
  - `cli`: cli 環境用のモジュール
  - `desktop`: デスクトップ環境(gnome とか hyprland とか)用のモジュール
  - `gui`: gui 環境用のツール
- `hosts/**`: 各ホスト用の設定、NixOS や home-manager の設定はここ

## 開発環境

このリポジトリを開発するための仮想環境を作成してある。
といっても今は formatter と linter をインストールしてあるだけ。

### devShells

flake では仮想環境を `devShells` として output する必要がある。

```nix
# Used by `nix develop .#<name>`
devShells."<system>"."<name>" = derivation;
# Used by `nix develop`
devShells."<system>".default = derivation;
```

仮想環境の実装自体は `devshells` にて実装してあるのでそれを import して使用している。

```nix
{
  inputs = {
    # ...
  };
  outputs = inputs: {
    devShells = (import ./devshells inputs);
  };
}
```

### `devshells/default.nix` の実装
開発環境は想定するホストの全アーキテクチャで同じ構成にする。
同じ記述の重複を避けるために、`nixpkgs.lib.genAttrs` を使用している。
これは与えられた名前リストをkeyとしたmapを作成することができる。

例としてはこんな感じらしい。
```nix
genAttrs [ "foo" "bar" ] (name: "x_" + name)
=> { foo = "x_foo"; bar = "x_bar"; }
```

これを用いて nixpkgs の system を map化

```nix
inputs:
let
  Systems = [
    "aarch64-linux"
    "x86_64-linux"
    "aarch64-darwin"
    "x86_64-darwin"
  ];
in
inputs.nixpkgs.lib.genAttrs Systems (
  system:
  let
    pkgs = import inputs.nixpkgs { inherit system; };
  in
  {
    default = pkgs.mkShell {
      name = "tsurara";
      packages = with pkgs; [
        nixfmt-rfc-style
        nixd
      ];

      shellHook = ''
        exec zsh
      '';
    };
  }
)
```

### 実行方法

flake を使用しているので下記のコマンドで開発環境に入れるようにする。

実行コマンド:

```bash
~/tsurara main
❯ nix develop
```

切り替わった環境:

```bash
~/tsurara main
tsurara-env ❯
```

## 参照

- [NixOS と Hyprland で最強の Linux デスクトップ環境を作る
  ](https://zenn.dev/asa1984/scraps/e4d8b9947d8351)
- [asa1984/dotfiles: NixOS is great](https://github.com/asa1984/dotfiles)
- [nix develop - Nix Reference Manual](https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix3-develop)
- https://nixos.org/manual/nixpkgs/stable/#function-library-lib.attrsets.genAttrs