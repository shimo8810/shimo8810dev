---
title: Nix(NixOS + home-manager) による dotfiles
date: 2024-09-16
---

# Nix(NixOS + home-manager) による dotfiles

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

