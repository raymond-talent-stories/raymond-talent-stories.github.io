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
从[`维基百科`](https://zh.wikipedia.org/zh-cn/React)中可以知道React的早期雏形[`Fax.js`](https://github.com/jordwalke/FaxJs)由Jordan Walke于2011年左右建立，并依然托管在Github上。![alt text](/img/{{ page.key }}/fax-on-github.png)
那么让我们通过这个雏形项目的源代码窥探那些前端大神的革命思想。

### 案例
通过实例讲解源码永远是最好的方式，在Github上的例子可以很好的帮助我们快速了解Fax和它的原型。
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
`F.Componentize`接收一个构造函数，并在构造函数内返回一段结构化的代码，`Div`来源于`Fdom.js`，通过`makeDomContainerComponent`创建的一个虚拟`DOM`-`div`，其本质是一个`NativeComponentConstructor`构造函数，该函数包含`updateAllProps`和`genMarkup`两个方法。接下来让我们先看看`genMarkup`是怎么工作的：
```javascript
NativeComponentConstructor.prototype.genMarkup = function(idRoot) {
  var props = this.props;

  /* The open tag (and anything from content key) */
  var markup = tagOpen + generateSingleDomAttributes.call(this, idRoot);

  /* Children */
  markup += generateDomChildren.call(
    this,
    idRoot,
    props[CHILD_LIST_KEY] ||
        props[CHILD_SET_KEY] ||
        extractChildrenLegacy(props)
  );

  /* The footer */
  markup += tagClose;

  return markup;
};
```

## 发展