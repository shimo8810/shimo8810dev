---
title: "NixOS で Kubernetes を構築する Part 1: NixOS をインストールする"
date: 2024-08-09
---

k8s を自宅で動かすために何故か血迷って NixOS で構築するメモ。

ちなみに今回のインストール作業は [NixOs Installation Guide](https://nixos.wiki/wiki/NixOS_Installation_Guide) と [NixOS Manual](https://nixos.org/manual/nixos/stable/#ch-installation) を参考にしている。

またサーバ用として構築するため、minimal install で進める。つまり GUI は無い。

## これまでとこれからの流れ

1. NixOS で Kubernetes を構築する Part 1: NixOS をインストールする <- 今ここ
2. [NixOS で Kubernetes を構築する Part 2: NixOS を管理する](/posts/k8s-nixos-part2)
3. [NixOS で Kubernetes を構築する Part 3: Kubernetes を構築する](/posts/k8s-nixos-part3)

## 使用したもの

- 作業用 PC(Linux ないし macOS(家に windows がないので...))
- サーバ用マシン(今回は intel N100 のミニ PC)
- USB メモリ

## NixOS のインストーラの準備

NixOS のインストーラを作成するために、NixOS ISO image ファイルをダウンロードして、USB メモリに書き込む必要がある。

### NixOS ISO image ファイルのダウンロード

[Download | Nix & NixOS](https://nixos.org/download/#nixos-iso) から最新の ISO image ファイルをダウンロードする。今回は サーバ用途かつ k8s のホストとしてのみ使用するため、あらゆるデータを削った Minimal ISO image を選択する。

### USB メモリへの書き込み

USB メモリを作業用 PC に挿して、そのデバイスに `dd` コマンドで ISO image ファイルを書き込む。
今回は ISO image ファイルが `nixos-minimal-24.05.3642.883180e6550c-x86_64-linux.iso` で USB メモリのデバイスが `/dev/sdc` だったので、以下のコマンドで書き込む。

```sh
sudo dd \
  if=./nixos-minimal-24.05.3642.883180e6550c-x86_64-linux.iso \
  of=/dev/sdc \
  bs=4M \
  status=progress \
  conv=fdatasync
```

書き込みが終了すればインストールメディアの完成である。

## NixOS のインストール

先程完成したインストールメディアをサーバ用マシンに挿して、起動する。
別のディスクから起動される場合は、BIOS ないし UEFI の設定を変更して、インストールメディアから起動するようにする。

ちなみに NixOS のインストール時にはインターネット接続が必要なので、LAN ケーブルを挿しておく。

なんやかんやで shell が立ち上がる。

### パーティションの設定

GPT のパーティション設定を行う。

その前にどこのディスクにインストールするかを決めておく。
今回は 512GB の m.2 SSD `/dev/nvme0n1` にインストールすることにする。

まず GPT のパーティションテーブルを作成する。

```sh
parted /dev/nvme0n1 -- mklabel gpt
```

次にパーティションを作成する。
root パーティションを作成する。k8s のホストとして使用するため、swap パーティションは作成しないので、root パーティションは 先頭 512 MB 以外全て使用する。

```sh
parted /dev/nvme0n1 -- mkpart root ext4 512MB 100%
```

次に boot パーティションを作成する。普通に 512 MB で作成する。

```sh
parted /dev/nvme0n1 -- mkpart ESP fat32 1MB 512MB
parted /dev/nvme0n1 -- set 2 esp on
```

### ファイルシステムの作成

それぞれのパーティションをフォーマットする。

root パーティションを ext4 でフォーマットする。ラベルをつけることが推奨されているので、適当に `nixos` というラベルをつける。

```sh
mkfs.ext4 -L nixos /dev/nvme0n1p1
```

次に UEFI system のパーティションを fat32 でフォーマットする。

```sh
mkfs.fat -F 32 -n boot /dev/nvme0n1p2
```

### インストール

NixOS をインストールファイルシステムを `/mnt` にマウントする。

```sh
mount /dev/disk/by-label/nixos /mnt
mkdir -p /mnt/boot
mount -o umask=077 /dev/disk/by-label/boot /mnt/boot
```

NixOS の 初期設定を生成する。

```sh
nixos-generate-config --root /mnt
```

環境に合わせて、設定ファイルを編集する必要がある、が特に変更する内容がなかったので今回は何もしていない。

BIOS か UEFI なのか、ネットワーク設定は適切か、ファイルシステムの設定は適切か、などを確認してからインストールを行う。

そしてインストールを行う。

```sh
nixos-install
```

1000 年くらい待つとインストールが終わる。終わったら再起動。

```sh
reboot
```

再起動後、ログインできたら成功。できてなかったら失敗。
