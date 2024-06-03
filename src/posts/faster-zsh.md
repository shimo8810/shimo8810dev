---
title: zsh の高速化
date: 2024-06-03
---

## tl;dr.

- zsh を高速化
- プラグインマネージャを zplug から sheldon に変更
- タイムは 0.269s -> 0.048s

## 現状の問題

zsh が微妙に遅い。メイン機ならそこそこ速いが、中古で買ったラップトップだと秒単位でかかる。
かつて oh-my-zsh と nvm で環境を激重にした悪しき記憶が蘇る。

## 原因分析

とりあえず推測するより計測する。
zprof を使用してプロファイルを取得。

```sh
num  calls                time                       self            name
-----------------------------------------------------------------------------------
 1)    1         117.48   117.48   44.88%    116.80   116.80   44.62%  __zplug::log::write::info
 2)    3          54.74    18.25   20.91%     28.54     9.51   10.90%  compinit
 3)    4          26.20     6.55   10.01%     26.20     6.55   10.01%  compaudit
 4)    5          19.15     3.83    7.32%      9.16     1.83    3.50%  __zplug::core::load::as_plugin
 5)    1          18.39    18.39    7.03%      9.03     9.03    3.45%  __check__
 6)    5           8.78     1.76    3.35%      8.78     1.76    3.35%  __zplug::sources::github::check
 7)    7          10.00     1.43    3.82%      7.74     1.11    2.96%  __zplug::core::sources::call
 8)    1          28.27    28.27   10.80%      5.45     5.45    2.08%  __zplug::core::core::prepare
 9)    1           4.92     4.92    1.88%      4.89     4.89    1.87%  __zplug::base::base::git_version
10)    5          11.98     2.40    4.58%      4.75     0.95    1.81%  __zplug::core::sources::use_default
...
```

compinit や compaudit が複数回呼び出されているのも気になるが、zplug が時間を食っている。

## 対策

zplug がどうやら時間を消費しているっぽい。
頑張って遅延読み込みの設定をしてもよいが手軽に高速化したいので、今回はプラグインマネージャごと sheldon に刷新する。

## sheldon

nix 環境なので nix でインストールと設定を書いていく。

home-manager の設定。

```nix
{ pkgs, ... }: {
  home.packages = with pkgs; [
    sheldon
  ];

  home.file = {
    ".config/sheldon/plugins.toml".source = ./plugins.toml;
  };
}
```

`plugins.toml`の中身。

```toml
shell = "zsh"

[plugins]

[plugins.base16]
github = "chriskempson/base16-shell"

[plugins.zsh-completions]
github = "zsh-users/zsh-completions"

[plugins.zsh-autosuggestions]
github = "zsh-users/zsh-autosuggestions"
use = ["{{ name }}.zsh"]

[plugins.zsh-syntax-highlighting]
github = "zsh-users/zsh-syntax-highlighting"

[plugins.pure]
github = "sindresorhus/pure"
use = ["async.zsh", "pure.zsh"]
```

(欲しい設定がたまたま公式の例に書いてあった。感謝感謝。)

インストールできたら、sheldon で更新。

```sh
sheldon lock
```

## 成果

今のタイム

```sh
❯ time zsh -i -c exit
zsh -i -c exit  0.17s user 0.12s system 106% cpu 0.269 total
```

何もないときのタイム(理論値)

```sh
% time zsh -i -c exit
zsh -i -c exit  0.01s user 0.01s system 99% cpu 0.030 total
```

プラグインマネージャを zplug から sheldon に変更した後のタイム

```sh
❯ time zsh -i -c exit
zsh -i -c exit  0.03s user 0.02s system 100% cpu 0.048 total
```

何だったら fish より速くなった気がする。
sheldon の公式には遅延読み込みの方法が記載されていたので、もっと高速化することができるが、速度に困ったら行う。今はこれでいい。
