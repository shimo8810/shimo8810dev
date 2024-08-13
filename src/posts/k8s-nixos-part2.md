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

## 設定の flake 化

適当なディレクトリ(ここでは`k8s-shirase`)を作成して nixos の設定ファイルをコピーする。

```sh
mkdir -p ~/k8s-shirase
cp -r /etc/nixos/* ~/k8s-shirase
cd ~/k8s-shirase
```

以下作業は `~/k8s-shirase` で行う。

次に flake ファイルの作成。

```sh
nix flake init
```

そうすると以下のようなファイルが作成される。
このファイルをゴリゴリに編集していく。

```nix
{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: {

    packages.x86_64-linux.hello = nixpkgs.legacyPackages.x86_64-linux.hello;

    packages.x86_64-linux.default = self.packages.x86_64-linux.hello;

  };
}
```

先程コピーした設定ファイルを flake に読み込ませる。
あと不要なパッケージは削除しておく。

具体的には `outputs` の中に `nixosConfigurations` を追加して、`configuration.nix` を読み込ませる。

[Flakes - NixOS Wiki](https://nixos.wiki/wiki/Flakes) に詳細が書かれているので要参照。

```nix
{
  # outputs 中にnixosConfigurationsを追加
  outputs = { self, nixpkgs }: {
    nixosConfigurations."shirase" = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        ./configuration.nix
      ];
    };
  };
}
```

最後に `flake.nix` をビルドして反映させる。

```sh
sudo nixos-rebuild switch --flake .#shirase
```

成功したら flake 化完了。

