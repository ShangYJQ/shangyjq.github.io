---
title: C++ 异步编程入门：thread
date: 2026-05-25
---

# C++ 异步编程入门：原生线程 `std::thread` 与 `std::jthread`

## 前言

在上一章中，我们使用了 `std::async`，它是一种高级的异步任务封装，非常适合“提交任务并获取结果”的场景。但在更底层的开发中，我们往往需要直接操作和管理线程本身。

C++11 引入了 `std::thread`，而 C++20 则带来了更安全、更智能的 `std::jthread`。

- **`std::thread`（手动挡）：** 就像是你雇佣了一个短工。你必须明确交代他是干完活向你交差（`join`），还是让他自己干完就走人（`detach`）。如果你忘记了交代，程序在结束时会直接崩溃（触发 `std::terminate`）。
- **`std::jthread`（自动挡）：** 现代 C++ 的推荐选择。它像是一个训练有素的员工，带有 RAII 属性，下班（作用域结束）时会自动等待任务完成。不仅如此，它还自带了“对讲机”（`std::stop_token`），你可以随时呼叫他提前结束工作。

::: info 什么是 RAII
**RAII**（Resource Acquisition Is Initialization，资源获取即初始化）是现代 C++ 的核心管理思想。
通俗来说，就是**“把资源的生命周期与局部对象的生命周期强行绑定”**：

- **诞生（构造函数）**：对象被创建时，自动去申请资源（比如锁、内存、操作系统线程）。
- **消亡（析构函数）**：对象离开大括号作用域时，编译器**严格保证**会自动调用它的析构函数，把资源安全释放。

所以说 `std::jthread` 带有 RAII 属性，就是因为它的析构函数里写好了自动退出的逻辑，只要它自己生命周期结束了，就会自动帮你善后，不需要你去手动写 `join()`。
:::

## 使用：`std::thread`

下面是使用 `std::thread` 的基本示例。注意我们必须手动管理它的生命周期：

```cpp
// Create by ShangYJQ.
// 2026-05-24

#include <iostream>
#include <thread>

void work() {
    std::cout << "working..." << std::endl;
}

signed main() {
    // 启动新线程，立刻开始执行 work 函数
    std::thread t(work);

    std::cout << "start" << std::endl;

    // 必须手动调用 join()！
    // 此时主线程会在这里阻塞，直到 t 线程执行完毕。
    t.join();

    std::cout << "end" << std::endl;

    return 0;
}

```

### 运行结果

> (注：由于多线程并发的特性，`start` 和 `working...` 的打印顺序在实际运行中可能会交替)

```bash
start
working...
end

[Process exited 0]
```

## 现代的thread：`std::jthread` 与中断机制

在现代 C++ 开发中，我们更倾向于使用 `std::jthread`。它不仅解决了忘记 `join` 导致的崩溃问题，还引入了优雅的协作式中断机制（Cooperative Cancellation）。

下面的代码演示了如何使用 `std::stop_token` 来安全地停止一个正在运行的后台线程：

```cpp
// Create by ShangYJQ.
// 2026-05-24

#include <chrono>
#include <print>
#include <stop_token>
#include <thread>

using namespace std;

// 线程函数接受一个 std::stop_token，这就是主线程发给我们的“对讲机”
void work(std::stop_token st) {

    // 每次循环前，检查一下对讲机里有没有喊停 (stop_requested)
    while (!st.stop_requested()) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        println("hello");
    }

    // 收到停止信号，跳出循环，做最后的收尾工作
    println("stopped");
}

signed main() {

    // 启动 jthread。不需要手动 join，它在析构时会自动帮我们善后
    std::jthread t(work);

    // 主线程去忙自己的事情（这里模拟等待1秒）
    std::this_thread::sleep_for(std::chrono::seconds(1));

    // 通过对讲机发送停止请求，通知 work 线程退出循环
    t.request_stop();

    println("end");

    return 0;
}

```

### 执行流程

| 时间 | 主线程                                     | `jthread` 异步线程                                     |
| ---- | ------------------------------------------ | ------------------------------------------------------ |
| 0s   | 启动 `jthread`，开始 sleep 1秒             | 启动，进入 `while` 循环，每 100ms 打印一次 "hello"     |
| 0~1s | 继续 sleep...                              | 持续打印约 10 次 "hello"                               |
| 1s   | 醒来，调用 `t.request_stop()` 发出中断信号 | 接收到信号                                             |
| 1s+  | 打印 "end"，主函数准备退出                 | `stop_requested()` 返回 true，退出循环，打印 "stopped" |
| 结束 | `jthread` 析构，自动阻塞等待子线程彻底完工 | 执行完毕退出                                           |

### 运行结果

_(打印次数取决于操作系统的线程调度精度，通常在9-10次左右)_

```bash
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
end
stopped

[Process exited 0]

```
