---
title: "NixOS で Kubernetes を構築する Part 2: NixOS を管理する"
date: 2024-08-09
---

k8s を自宅で動かすために何故か血迷って NixOS で構築するメモ。

今回の作業範囲は、nixos の flake 化 と 適当な設定迄となる。

## これまでとこれからの流れ

1. [NixOS で Kubernetes を構築する Part 1: NixOS をインストールする](/posts/k8s-nixos-part2)
2. NixOS で Kubernetes を構築する Part 2: NixOS を管理する <- いまここ
3. [NixOS で Kubernetes を構築する Part 3: Kubernetes を構築する](/posts/k8s-nixos-part3)

## flake 化

現在の NixOS のデフォルトの設定では flake が有効になっていないので、flake を有効にする。
`/etc/nixos/configuration.nix` に以下の設定を追加する。

```nix
{ config, lib, pkgs, ... }:
{
  # 下記行を追加
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
}
```

設定を追加したら再ビルドして反映。

```sh
nixos-rebuild switch
```

