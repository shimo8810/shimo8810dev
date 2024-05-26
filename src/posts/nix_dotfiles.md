---
title: Nix + home-manager で dotfiles 環境の構築
date: 2024-05-26
---

# Nix + home-manager で dotfiles 環境の構築

ここ数年使用してた Ubuntu に飽きてきたので、NixOS に乗り換えることにした。
それに合わせて数年放置していた dotfiles の管理も Nix + home-manager に移行することを決めた。
本記事は Nix + home-manager で dotfiles 環境を構築した際のメモである。

現在下記リポジトリでは、home-manager のみを使用して dotfiles を管理しているのみであり、NixOS は使用していない。
将来的には NixOS modules もここに打ち込むことになる。

リポジトリ: [shimo8810/dotfiles](https://github.com/shimo8810/dotfiles)

## Nix の準備

NixOS 以外で、Nix のインストールは公式の方法と `nix-installer` を使用する方法があるが、ここでは `nix-installer` を使用する。

`nix-installer` はデフォルトで flake が有効化されていたり、アンインストール方法が提供されているため、随所で利用が推奨されたので採用した。

```sh
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
```

## home-manager の準備

NixOS 以外の環境でも使用できるように、NixOS modules ではなく、standalone としてインストールする[[1]](https://nix-community.github.io/home-manager/index.xhtml#sec-flakes-standalone)。

```sh
nix run home-manager/master -- init --switch ~/dotfiles
```

`~/dotfiles/flake.nix` と `~/dotfiles/home.nix` が自動で生成される。
`home-manager`がインストールされていない状態では`nix run`から`home-manager`を実行する。
`home-manager`で自身をインストールすることで、`home-manager`を実行することができる。

下記のように`programs.home-manager.enable`を`true`に設定することで、`home-manager`を有効化することができる。

```nix
{
  programs.home-manager.enable = true;
}
```

これ移行は基本的にはこの `home.nix` を編集して、`home-manager switch --flake ~/dotfiles` で変更を反映させることができる。

## home-manager の設定

設定は基本的に公式のドキュメント[[2]](https://nix-community.github.io/home-manager/options.xhtml)を読んで設定する。

ここでは特に私が使用している設定を記載する。

### `home.packages`

`home.packages` ではインストールしたいパッケージを指定することができる。
`programs.<name>`で設定できるパッケージはそちらで設定を行っている。

```nix
home.packages = with pkgs; [
  bottom
  duf
  dust
  fd
  fzf
  go-task
  lsd
  ripgrep
]
```

### `programs.git`

`git` の設定を行うことができる。
設定した内容は`~/config/git/config`に反映される。

```nix
programs.git = {
  enable = true;
  userName = "shimo8810";
  userEmail = "shimo.8810@gmail.com";

  extraConfig = {
    core.editor = "nvim";
    init.defaultBranch = "main";
    color.ui = "auto";
  };
};
```

### `programs.neovim`

`neovim`の設定を行うことができる。

`vim`と`vi`にエイリアスを設定してある。
また `extraLuaConfig` で `init.lua` の内容を設定している。
plugins に `vimPlugins` なパッケージを指定することでプラグインをインストールすることができる。
インストールできるパッケージは NixOS Search で検索することができる。

```nix
programs.neovim = {
  enable = true;
  viAlias = true;
  vimAlias = true;
  defaultEditor = true;
  extraLuaConfig = lib.fileContents ./nvim/init.lua;
  plugins = with pkgs.vimPlugins; [
    lualine-nvim
    nord-nvim
    nvim-tree-lua
    vim-nix
  ];
};
```

## その他

長いコマンドを覚えられないので`taskfile`を利用している。
そのへんは`Makefile`でも何でも良いと思う。

## 引用資料

- \[1\]: https://nix-community.github.io/home-manager/index.xhtml#sec-flakes-standalone
- \[2\]: https://nix-community.github.io/home-manager/options.xhtml

## 参考資料

- [NixOS](https://nixos.org/)
- [Zero to Nix](https://github.com/DeterminateSystems/nix-installer)
- [nix-installer](https://github.com/DeterminateSystems/nix-installer)
- [Nixpkgs](https://nixos.org/nixpkgs/)
- [NixOS で最強の Linux デスクトップを作ろう](https://zenn.dev/asa1984/articles/nixos-is-the-best)
