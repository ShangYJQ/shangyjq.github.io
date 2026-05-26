---
title: C++ 异步编程入门：std::async 与 std::future
date: 2026-05-24
---

# C++ 异步编程入门：`std::async` 与 `std::future`

## 前言

在现代 C++ (本文默认使用 C++23 标准) 中，异步编程是提升程序性能的重要手段。本文将从一个最简单的例子出发，
讲解 `std::async` 和 `std::future` 的基本用法。

- **`std::async`（异步任务）：** 就像是你向收银员点了一份需要现做的汉堡。后台厨房（新线程）立刻开始为你制作。
- **`std::future`（未来凭证）：** 收银员不会让你站在柜台前干等，而是会给你一张取餐小票（Future 对象）。你可以先去一旁刷手机（主线程继续执行其他操作），等你需要汉堡时，再拿着小票去兑换结果。

## 一个最简单的异步示例

下面的代码演示了这一过程。我们用 `sleep_for` 来模拟一个耗时的后台任务：

```cpp
// Create by ShangYJQ.
// 2026-05-24

#include <chrono>
#include <future>
#include <print>
#include <thread>

int fetch_it() {
    std::this_thread::sleep_for(std::chrono::seconds(3));
    return 69;
}

signed main() {

    static int res = 0;

    // 启动异步任务
    std::future<int> task = std::async(std::launch::async, fetch_it);

    // 主线程可以继续做自己的事情
    std::println("waiting data...");

    // 获取异步任务的结果。如果后台还没做完，主线程会在这里阻塞等待
    res = task.get();

    std::println("{}", res);

    return 0;
}

```

### 执行流程

| 时间 | 主线程                               | 异步线程                         |
| ---- | ------------------------------------ | -------------------------------- |
| 0s   | 启动异步任务，打印 "waiting data..." | 开始执行 `fetch_it()`，sleep 3秒 |
| 0~3s | 调用 `task.get()`，阻塞等待          | 继续 sleep...                    |
| 3s   | 收到返回值 69，打印结果              | 执行完毕                         |

### 运行结果

```bash
waiting data...
69

[Process exited 0]
```
