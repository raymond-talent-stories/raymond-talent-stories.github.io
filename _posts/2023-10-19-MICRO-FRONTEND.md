---
layout:     post
title:      MICRO-FRONTEND
subtitle:   深入微前端架构
date:       2023-11-23
author:     Raymond Zhang
header-img: /img/2023-11-23/shutterstock.jpg
catalog:    true
filter:     brightness(0.5)
tags:
    - React
    - Frontend
images:
    image1: /img/2024-11-01/performance.png
---

> 微前端 (`Micro Frontends`) 是一种前端架构模式，通过将前端应用程序拆分成多个小型应用程序，从而实现更加灵活、高效地开发、测试、部署和升级，并降低应用程序的复杂度和维护成本。每个小型应用程序都有自己的生命周期和技术栈，可以独立运行。

微前端架构的思想来源于微服务架构，其本质都是对大型应用或系统进行拆分，并且保证各部分的独立性。

## 微服务架构
微服务架构（Microservices Architecture）是一种将单一应用拆分成一组小型、独立且自包含服务的架构模式。每个微服务通常负责特定的业务功能，可以独立开发、部署、扩展和维护。
                          +---------------------+
                          |    API Gateway      |
                          +---------------------+
                                   |
           +-------------------------------------------+
           |                 Service Discovery       |
           +-------------------------------------------+
              |                   |                   |
   +-------------------+   +-------------------+   +-------------------+
   |   Authentication  |   |   Order Service   |   |   Payment Service |
   +-------------------+   +-------------------+   +-------------------+
              |                   |                   |
       +----------------+  +----------------+  +-------------------+
       |   User Service |  |   Shipping     |  |   Inventory       |
       +----------------+  |   Service      |  |   Service         |
                           +----------------+  +-------------------+

## 微前端架构
微前端架构体系中存在一个主应用和若干个子应用，主应用主要负责路由、资源加载等通用事务，子应用可以使用独立于主应用的技术栈，各部分之间的通信则可以充分利用浏览器以及`Javascript`本身的特性实现，比如：`URL schema`、`EventBus`等。
<br>
比较流行的微前端架构解决方案包括：`Module Federation`，`iframe`，`single-spa`等。

### 基于路由策略的微前端模型 - `Single SPA`
`Single SPA`的核心目标是通过将不同技术栈、独立的微前端应用（如 React、Vue、Angular、甚至 Vanilla JS）组合成一个统一的前端应用，解决多团队协作、跨技术栈开发以及前端应用模块化的问题。其所扮演的角色是自模块的管理者，负责子模块的装卸工作。
<br>
`Single SPA`的核心是用于注册自模块的函数`registerApplication`，通过对URL路径进行匹配，然后决定执行加载对应的引用逻辑

```javascript
import { registerApplication, start } from 'single-spa';

registerApplication(
  'react-app', // 微应用的名称
  () => import('./reactApp'), // 动态导入微应用
  location => location.pathname.startsWith('/react'), // 路由匹配规则
  { domElement: document.getElementById('react-root') }
);

registerApplication(
  'vue-app', // 微应用的名称
  () => import('./vueApp'), // 动态导入微应用
  location => location.pathname.startsWith('/vue'), // 路由匹配规则
  { domElement: document.getElementById('vue-root') }
);

start();
```
定义挂载子模块的根结点，这个是由`Single SPA`管理的，而不是子模块本身。这意味着子模块的`main`文件将发生变化。
```html
<div id="react-root"></div>
<div id="vue-root"></div>
```
例如：在`React`中需要这样实现：
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const mount = async (props) => {
  const { domElement } = props;
  ReactDOM.render(<App />, domElement);
};

const unmount = async (props) => {
  const { domElement } = props;
  ReactDOM.unmountComponentAtNode(domElement);
};

export { mount, unmount };
```

### `iframe`
`iframe`在大部分情况下并不是微前端的第一选择，这是由其本身的特性决定的。
#### 性能开销

- 额外的渲染成本：每个 iframe 都是一个独立的浏览上下文，加载时需要额外的资源（如内存、CPU）来渲染和管理每个 iframe。这可能导致页面加载速度变慢，尤其是在存在多个 iframe 时，性能问题会更加明显。
- DOM 渲染和重排：每个 iframe 都需要独立的 DOM 渲染和样式计算，这可能导致页面的总体渲染效率低下，尤其是在需要多个 iframe 的情况下。
#### 无法共享全局状态

- 由于 iframe 提供了完全的沙箱隔离，微应用之间无法共享 JavaScript 变量或全局状态（例如用户登录状态、全局主题等）。这意味着如果需要在不同的微应用之间共享数据或状态，必须通过其他机制（如事件总线、postMessage API 或浏览器的 LocalStorage）来实现。
- 同时，跨 iframe 通信较为复杂，通常需要使用 window.postMessage() 来进行消息传递，这增加了开发的复杂度。
#### 复杂的路由管理

- 在 iframe 模式下，路由管理变得更加复杂。通常，iframe 内部会有自己的路由机制，外部主应用可能也有自己的路由系统。需要确保两者能够协同工作。例如，主应用的路由需要能够控制 iframe 的加载，而 iframe 也需要能响应内部分配的路由。
- 路由切换时，需要确保 iframe 的加载和卸载得当，否则可能导致页面出现不一致的情况，影响用户体验。
#### 跨域问题

- 如果微应用运行在不同的域下，那么 iframe 内的微应用和主应用之间可能会遇到 跨域问题。虽然可以通过设置 postMessage 或 Cross-Origin Resource Sharing (CORS) 来解决，但这会增加开发和配置的复杂度。
- 在跨域的情况下，无法直接访问 iframe 内的 DOM 和 JavaScript，这使得主应用和微应用之间的通信变得更加困难。
#### SEO 问题

- 如果微应用的内容被加载在 iframe 中，则这些内容通常不会被搜索引擎抓取。这可能对那些需要被搜索引擎索引的微应用造成问题，影响 SEO 性能。
- 尽管现代搜索引擎可以处理动态内容，iframe 内的内容通常仍然不如直接嵌入页面的内容容易被抓取。
#### 用户体验差异

- UI 和 UX 问题：iframe 通常会带来一些视觉上的不一致，比如滚动条、边框和其他样式的差异，可能会影响整体的用户体验。如果多个 iframe 之间没有良好的样式一致性，可能会导致界面看起来不协调。
- 由于 iframe 和主应用之间存在一个隔离层，微应用的界面可能会出现不同的行为，特别是在与主应用的交互上，可能不如无缝集成的微前端架构流畅。