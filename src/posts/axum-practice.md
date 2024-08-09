---
title: 実践axum
date: 2024-06-30
---

# 実践 axum

axum でなにがしを実装する際のメモ

## Dependencies Injection

依存性の注入をするときに単純な静的ディスパッチを使用するのか, Cake Pattern を使用するのか色々考えたが, Cake Pattern だと 最後に全ての Trait を実装する `Module` があらゆる機能が露出してしまう(例えば Repository のインターフェイスが露出してしまう, 他のユースケースが必要のない Repository を呼び出せてしまうなど)のが問題である。
一応 Trait を `use` しなければ呼び出せない。


```rust
trait Repository {
    fn read(&self, id: i32) -> String;
}

struct RepositoryImpl {}

impl Repository for RepositoryImpl {
    fn read(&self, _id: i32) -> String {
        "data".to_string()
    }
}
```

```rust
pub trait Service {
    fn get_data(&self, id: i32) -> String;
}

struct ServiceImpl<R: Repository> {
    repo: R,
}

impl<R: Repo> ServiceImpl<R> {
    pub fn new(repo: R) -> Self {
        Self { repo }
    }
}

impl<R: Repo> Service for ServiceImpl<R> {
    fn get(&self, id: i32) -> String {
        self.repo.get(id)
    }
}
```

```rust
pub trait HasService {
    type S1: Service;

    fn service(&self) -> &Self::S1;
}

pub struct Module<S: Service> {
    pub service: S,
}

impl<S: Service> Module<S> {
    pub fn new(service: S) -> Self {
        Self { service }
    }
}

impl<S: Service> HasService for Module<S> {
    type S1 = S;

    fn service(&self) -> &Self::S1 {
        &self.service
    }
}
```

```rust
// -- fn --
pub fn get<M: HasService>(module: M, id: i32) -> String {
    module.service().get(id)
}
```
