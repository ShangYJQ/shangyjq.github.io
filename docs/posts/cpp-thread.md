---
title: C++ 异步编程入门：thread
date: 2026-05-25
---

# C++ 异步编程入门：原生线程 `std::thread` 与 `std::jthread`

## 前言

在上一章中，我们使用了 `std::async`，它是一种高级的异步任务封装，非常适合“提交任务并获取结果”的场景。但在更底层的开发中，我们往往需要直接操作和管理线程本身。

C++11 引入了 `std::thread`，而 C++20 则带来了更安全、更智能的 `std::jthread`。

- **`std::thread`：** 就像是你雇佣了一个短工。你必须明确交代他是干完活向你交差（`join`），还是让他自己干完就走人（`detach`）。如果你忘记了交代，程序在结束时会直接崩溃（触发 `std::terminate`）。
- **`std::jthread`（推荐使用）：** 现代 C++ 的推荐选择。它像是一个训练有素的员工，带有 RAII 属性，下班（作用域结束）时会自动等待任务完成。不仅如此，它还自带了“对讲机”（`std::stop_token`），你可以随时呼叫他提前结束工作。

::: info 什么是 RAII
**RAII**（Resource Acquisition Is Initialization，资源获取即初始化）是现代 C++ 的核心管理思想。
通俗来说，就是**“把资源的生命周期与局部对象的生命周期强行绑定”**：

- **诞生（构造函数）**：对象被创建时，自动去申请资源（比如锁、内存、操作系统线程）。
- **消亡（析构函数）**：对象离开大括号作用域时，编译器**严格保证**会自动调用它的析构函数，把资源安全释放。

所以说 `std::jthread` 带有 RAII 属性，就是因为它的析构函数里写好了自动退出的逻辑，只要它自己生命周期结束了，就会自动帮你善后，不需要你去手动写 `join()`。
:::

## 使用 `std::thread`

下面是使用 `std::thread` 的基本示例。注意我们必须手动管理它的生命周期：

```cpp
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

## `std::jthread` 与中断机制

在现代 C++ 开发中，我们更倾向于使用 `std::jthread`。它不仅解决了忘记 `join` 导致的崩溃问题，还引入了优雅的协作式中断机制（Cooperative Cancellation）。

下面的代码演示了如何使用 `std::stop_token` 来安全地停止一个正在运行的后台线程：

```cpp
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

## 运行带有参数的函数

直接在函数指针或者 `lambda` 后面加要传入的参数就行

```cpp
#include <print>
#include <thread>

signed main() {
	int val = 0;

	std::jthread t2([](int v) { std::println("{}", v); }, val);

	t2.join();

	std::println("Result: {}", val);

	return 0;
}

```

但是要是我想引用传递呢？

```cpp
std::jthread t2([](int &v) { v = 100; }, val);
```

编译器报错：

```text
error: static assertion failed due to requirement
'is_invocable_v<(lambda), int> || is_invocable_v<(lambda), std::stop_token, int>'
```

::: info 报错在说什么？
这段报错其实是编译器在抱怨：**“类型匹配失败，我没法调用这个函数！”**

它尝试了两种 `jthread` 的传参策略，都失败了：

1. **`is_invocable_v<(lambda), int>`：** 尝试直接传 `int` 拷贝。但 Lambda 想要的是 `int&`（引用），**拷贝的值不能绑定到普通引用上**，失败
2. **`is_invocable_v<(lambda), std::stop_token, int>`：** 再次尝试把 `stop_token` 一起塞进去。但 Lambda 只有一个参数，数量对不上，再次失败

:::

为了保证线程安全，防止多个线程不小心改乱同一个变量，`jthread`（或 `thread`）的默认策略是：不管线程函数想要什么参数，我都会在底层强行“拷贝（Copy）”一份
**所有参数默认都会被拷贝（Copy）到新线程的空间中。**
如果你想按引用传递，必须使用 `<functional>` 库中的 `std::ref()` 来显式包装

```cpp
#include <functional>
#include <print>
#include <thread>

signed main() {
	int val = 0;

	std::jthread t2([](int &v) { v = 100; }, std::ref(val));

	t2.join();

	std::println("Result: {}", val);

	return 0;
}
```

运行结果:

```text
Result: 100

[Process exited 0]
```

::: danger 悬垂引用的致命危险
使用 `std::ref` 相当于赋予了子线程极大的权力

如果你用 `std::ref` 传递了一个局部变量给子线程，你必须绝对保证：主线程里的这个变量活得比子线程久
如果主线程运行结束，局部变量被销毁回收了，而子线程还在往那个内存地址写数据，程序就会立刻崩溃（段错误 Segfault）

幸运的是，我们使用的是带有 RAII 自动等待功能的 `std::jthread`，它在离开作用域前一定会等待子线程执行完毕，所以完美地规避了这种内存越界访问的风险。但如果你使用的是老式的 `std::thread` 加上 detach()，那这就是一个随时会引爆的定时炸弹了。
:::
