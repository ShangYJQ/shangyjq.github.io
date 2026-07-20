---
title: C++ 异步编程入门：数据竞争与 `std::mutex`
date: 2026-07-20
---

# C++ 异步编程入门：数据竞争、`std::mutex` 与 `std::atomic`

## 前言

在上一章中，我们学习了如何使用 `std::thread` 和 `std::jthread` 创建线程，也学习了如何通过 `std::ref()` 将变量以引用的形式传入线程。

但是，当多个线程同时访问并修改同一个变量时，会产生一个新的问题：

> 多个线程同时修改一个变量，结果一定正确吗？

答案是否定的。

如果多个线程在没有任何同步措施的情况下同时读写同一个普通变量，程序就可能发生**数据竞争**。

本章将介绍：

- 什么是数据竞争
- 为什么 `center += 1` 并不安全
- 如何使用 `std::mutex` 保护共享变量
- 如何使用 `std::lock_guard` 自动管理锁
- 什么情况下可以使用 `std::atomic`
- `std::mutex` 和 `std::atomic` 应该如何选择

## 一个多线程计数示例

我们运行八个线程，它们分别将变量 `center` 增加 1000000 次。

所以 `center` 应该为 1000000 * 8 = 8000000

```cpp
#include <print>
#include <thread>
#include <vector>

int center = 0;

void add() {
	for (int i = 0; i < 1'000'000; ++i) {
		++center;
	}
}

int main() {
	std::vector<std::jthread> threads;

	for (int i = 0; i < 8; ++i) {
		threads.emplace_back(add);
	}

	threads.clear();

	std::println("center  = {}", center);

	return 0;
}
```

### 运行结果

```text
center  = 1875557

[Process exited 0]
```

但是发现 `center` 远远小于 8000000

这是为什么呢？

在 `cpp` 中 ++center 不是一个不可分割的操作，它通常可以近似拆成：

```text
读取 center
加 1
写回 center
```

考虑这种情况：

1. 线程 1 读取 `center`，得到数值 100；
2. 在线程 1 写回结果之前，线程 2 也读取了 `center`，同样得到 100；
3. 线程 1 计算 100 + 1，并将 101 写回 `center`；
4. 线程 2 也基于之前读取到的 100 进行计算，并再次将 101 写回 `center`。

虽然两个线程都执行了一次加一操作，但最终 center 只从 100 变成了 101，而不是预期的 102。

线程 2 的写入覆盖了线程 1 的更新，这种现象称为丢失更新。

导致这个问题的原因就叫 **数据竞争**。

## 什么是数据竞争

当以下情况同时成立时，就可能发生数据竞争：

1. 存在两个或多个线程；
2. 多个线程访问同一块内存；
3. 至少有一个线程正在写入；
4. 这些访问之间没有使用互斥锁、原子变量等同步机制。

在刚才的程序中：

```cpp
++center
```

每个线程都可能同时执行这条语句。

因此程序发生了数据竞争。

需要注意的是，数据竞争不仅仅意味着“结果可能少加几次”。

在 C++ 中，数据竞争会导致**未定义行为**（Undefined Behavior）。

也就是说，C++ 标准不再保证程序会发生什么。程序可能：

- 得到错误的计算结果
- 每次运行得到不同结果
- 看起来正常运行
- 在特定优化等级下出现异常
- 产生更加难以理解的行为

## 使用 `std::mutex`

为了解决多个线程同时修改共享变量的问题，可以使用互斥锁 `std::mutex`。

`mutex` 是 mutual exclusion 的缩写，意思是“互斥”。

它可以保证：

> 同一时间只能有一个线程进入受保护的代码区域。

可以把 `std::mutex` 想象成一把只有一份的钥匙。

某个线程拿到钥匙后，可以进入房间操作共享数据。其他线程必须在门外等待，直到前一个线程归还钥匙。

先创建一个全局互斥锁：

```cpp
std::mutex mtx;
```

然后在修改 `center` 之前加锁：

```cpp
mtx.lock();

++center;

mtx.unlock();
```

完整代码如下：

```cpp
#include <print>
#include <thread>
#include <vector>

int center = 0;
std::mutex mtx;

void add() {
	for (int i = 0; i < 1'000'000; ++i) {
		// 上锁
		mtx.lock();
		++center;
		// 解锁释放
		mtx.unlock();
	}
}

int main() {
	std::vector<std::jthread> threads;

	for (int i = 0; i < 8; ++i) {
		threads.emplace_back(add);
	}

	threads.clear();

	std::println("center  = {}", center);

	return 0;
}
```

现在 `++center` 变成了一个**原子操作**，无论这几个线程如何调度，最终结果都应该是：

```text
center  = 8000000

[Process exited 0]
```

::: tip **原子操作**
原子操作（Atomic Operation）是指一个在执行过程中不可被分割的完整操作。

对于其他线程来说，一个原子操作只有两种状态：

操作还没有发生；
操作已经全部完成。

其他线程不会看到它“执行到一半”的中间状态。
:::

这样，我们就实现了 `center` 的互斥锁保护。

## 临界区

被互斥锁保护的代码区域通常称为**临界区**（Critical Section）。

例如：

```cpp
mtx.lock();

++center;

mtx.unlock();
```

从 `lock()` 到 `unlock()` 之间就是一个临界区。

## 手动解锁的风险

虽然可以直接使用：

```cpp
mtx.lock();
++center;
mtx.unlock();
```

但这种写法并不安全。

假设在加锁后，程序因为某些原因提前返回：

```cpp
mtx.lock();

if (center > 100) {
	return;
}

center += 1;
mtx.unlock();
```

当程序执行 `return` 时，`mtx.unlock()` 不会被执行。

互斥锁将一直保持锁定状态，其他线程以后再调用 `lock()` 时，就会永远等待。

类似的问题也可能由异常造成：

```cpp
mtx.lock();

some_function(); // 这里可能抛出异常

++center;
mtx.unlock();
```

如果 `some_function()` 抛出异常，解锁语句同样不会执行。

因此，在现代 C++ 中，通常不推荐直接手动管理 `lock()` 和 `unlock()`。

## 使用 `std::lock_guard`

现代 C++ 更推荐使用 `std::lock_guard` 管理互斥锁。

```cpp
{
	std::lock_guard<std::mutex> lock(mtx);
	center += 1;
}
```

创建 `lock` 对象时，它会自动锁定 `mtx`。

当代码离开当前作用域时，`lock` 对象会被销毁，并自动解锁 `mtx`。

这也是 RAII 思想的应用。

完整代码如下：

```cpp
#include <mutex>
#include <print>
#include <thread>
#include <vector>

int center = 0;
std::mutex mtx;

void add() {
	for (int i = 0; i < 1'000'000; ++i) {
		// 自动上锁解锁
		std::lock_guard<std::mutex> lock(mtx);

		++center;
	}
}

int main() {
	std::vector<std::jthread> threads;

	for (int i = 0; i < 8; ++i) {
		threads.emplace_back(add);
	}

	threads.clear();

	std::println("center  = {}", center);

	return 0;
}
```

当程序执行到右大括号时：

```cpp
}
```

`lock` 会被立即析构，互斥锁也会被自动释放。

这样，后面的休眠操作不会继续占用锁。

## 类型模板参数的省略

从 C++17 开始，编译器支持类模板参数推导。

因此：

```cpp
std::lock_guard<std::mutex> lock(mtx);
```

也可以简写为：

```cpp
std::lock_guard lock(mtx);
```

编译器会根据传入的 `mtx` 自动推导出互斥锁类型。

完整写法更明确：

```cpp
std::lock_guard<std::mutex> lock(mtx);
```

简写则更加方便：

```cpp
std::lock_guard lock(mtx);
```

两种写法都可以。

## 使用 `std::atomic`

对于简单的整数计数操作，除了互斥锁，还可以使用原子变量 `std::atomic`。

将普通整数：

```cpp
int center = 0;
```

修改为：

```cpp
std::atomic<int> center = 0;
```

之后，对 `center` 的简单加减操作就是原子的：

```cpp
++center;
```

这样程序就变为

```cpp
#include <atomic>
#include <print>
#include <thread>
#include <vector>

// 这样就不需要使用锁了
std::atomic<int> center = 0;

void add() {
	for (int i = 0; i < 1'000'000; ++i) {
		++center;
		// 或者使用
		// center.fetch_add(1);
	}
}

int main() {
	std::vector<std::jthread> threads;

	for (int i = 0; i < 8; ++i) {
		threads.emplace_back(add);
	}

	threads.clear();

	// atomic 要使用 load 来加载数据
	std::println("center  = {}", center.load());

	return 0;
}
```

:::warning **atomic 不是绝对安全的**
`std::atomic` 只保证单个操作是原子的。像 `center = center + 1` 这种"读-改-写"三步操作仍然不是原子的（必须用 `++center` 或 `fetch_add`），而 `if (center < 100) ++center;` 这种"检查再修改"的模式也存在竞态条件。涉及多步逻辑时仍需使用互斥锁。
:::
