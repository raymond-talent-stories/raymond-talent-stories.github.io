---
layout:     post
title:      从React开始进阶前端技术专家
subtitle:   始于一场裁员风暴，不知终于何时何方
date:       2024-11-23
author:     Raymond Zhang
header-img: img/react-page.avif
catalog: true
key: 2024-11-23-fax
tags:
    - React
    - Frontend
---

## 起源
从[维基百科](https://zh.wikipedia.org/zh-cn/React)中可以知道React的早期雏形[Fax.js](https://github.com/jordwalke/FaxJs)由Jordan Walke于2011年左右建立，并依然托管在Github上。![alt text](/img/{{ page.key }}/fax-on-github.png)
那么让我们通过这个雏形项目的源代码窥探那些前端大神的革命思想。
通过实例讲解源码永远是最好的方式，在Github上列出的例子可以很好的帮助我们快速了解Fax和它的原型。
```javascript
var MainComponent = exports.MainComponent = F.Componentize({
  structure : function() {
    return Div({
      firstPerson: PersonDisplayer({
        name: 'Joe Johnson', age: 31,
        interests: 'hacking, eating, sleeping'
      }),

      secondPerson: PersonDisplayer({
        name: 'Sally Smith', age: 29,
        interests: 'biking, cooking swiming'
      }),

      thirdPerson: PersonDisplayer({
        name: 'Greg Winston', age: 25,
        interests: 'design and technology'
      })
    });
  }
});
```
从 `F.Componentize`开始，看看Fax是如何工作的：

## 发展