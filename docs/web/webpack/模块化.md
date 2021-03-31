随着前端应用的日益复杂化，我们的项目已经逐渐膨胀到了不得不花大量时间去管理的程度。而模块化就是一种最主流的项目组织方式，它通过把复杂的代码按照功能划分为不同的模块单独维护，从而提高开发效率、降低维护成本。
> webpack 用于编译 JavaScript 模块，Webpack 本质上是一个模块化打包工具，它通过“万物皆模块”这种设计思想，巧妙地实现了整个前端项目的模块化。在 Webpack 的理念中，前端项目中的任何资源都可以作为一个模块，任何模块都可以经过 Loader 机制的处理，最终再被打包到一起。



### 模块化的演进过程

- 文件划分方式
> 将每个功能及其相关状态数据各自单独放到不同的 JS 文件中，约定每个文件是一个独立的模块。使用某个模块将这个模块引入到页面中，一个 script 标签对应一个模块，然后直接调用模块中的成员（变量 / 函数）。

```javascript
src
├── a.js
├── b.js
└── index.html
```


```javascript
// a.js
let a = 'hello';
let b = 'webpack!';
```


```javascript
// b.js
function jump() {
    location.replace(`www.baidu.com`);
}
```


```html
<!DOCTYPE html>
<html>
    <head>  
        <meta charset="UTF-8" />
        <title>webpack</title>
    </head>
    <body>
        <script src="a.js"></script>
        <script src="b.js"></script>
        <script>
            // 直接使用全局成员
            jump(); // 可能存在命名冲突
            console.log(a + b);
            a = 'other'; // 数据可能会被修改
        </script>
    </body>
</html>
```


缺点：
> - 模块直接在全局工作，大量模块成员污染全局作用域；
> - 没有私有空间，所有模块内的成员都可以在模块外部被访问或者修改；
> - 一旦模块增多，容易产生命名冲突；
> - 无法管理模块与模块之间的依赖关系；
> - 在维护的过程中也很难分辨每个成员所属的模块。



这种原始“模块化”的实现方式完全依靠约定实现，一旦项目规模变大，这种约定就会暴露出种种问题，非常不可靠，所以我们需要尽可能解决这个过程中暴露出来的问题。


- 命名空间方式
> 约定每个模块只暴露一个全局对象，所有模块成员都挂载到这个全局对象中，具体做法是在第一阶段的基础上，通过将每个模块“包裹”为一个全局对象的形式实现，这种方式就好像是为模块内的成员添加了“命名空间”，所以我们又称之为命名空间方式。

```javascript
// a.js
window.moduleA = {
    method1: function () {
        console.log('moduleA#method1');
    },
};
```


```javascript
// b.js
window.moduleB = {
    data: 'something'
    method1: function () {
        console.log('moduleB#method1')
    }
}
```


```javascript
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Stage 2</title>
</head>
<body>
    <script src="a.js"></script>
    <script src="b.js"></script>
    <script>
        moduleA.method1()
        moduleB.method1()
        // 模块成员依然可以被修改
        moduleA.data = 'foo'
    </script>
</body>
</html>
```
这种命名空间的方式只是解决了命名冲突的问题，但是其它问题依旧存在。


- IIFE (Immediately-Invoked Function Expression)
> 使用立即执行函数表达式（IIFE，Immediately-Invoked Function Expression）为模块提供私有空间。具体做法是将每个模块成员都放在一个立即执行函数所形成的私有作用域中，对于需要暴露给外部的成员，通过挂到全局对象上的方式实现。

```javascript
// a.js
!(function () {
    let name = 'module-a';

    function method1() {
        console.log(name + '#method1');
    }

    window.moduleA = {
        method1: method1,
    };
})();
```


```javascript
// b.js
!(function () {
    let name = 'module-b';

    function method1() {
        console.log(name + '#method1');
    }

    window.moduleB = {
        method1: method1,
    };
})();
```


这种方式带来了私有成员的概念，私有成员只能在模块成员内通过闭包的形式访问，这就解决了前面所提到的全局作用域污染和命名冲突的问题。


- IIFE 依赖参数
> 在 IIFE 的基础之上，我们还可以利用 IIFE 参数作为依赖声明使用，这使得每一个模块之间的依赖关系变得更加明显。

```javascript
// a.js
!(function ($) {
    // 通过参数明显表明这个模块的依赖
    let name = 'module-a';

    function method1() {
        console.log(name + '#method1');
        $('body').animate({ margin: '200px' });
    }

    window.moduleA = {
        method1: method1,
    };
})(jQuery);
```


以上 4 个阶段是早期的开发者在没有工具和规范的情况下对模块化的落地方式，这些方式确实解决了很多在前端领域实现模块化的问题，但是仍然存在一些没有解决的问题。比如：模块加载；


### 模块化规范的萌芽
除了模块加载的问题以外，目前这几种通过约定实现模块化的方式，不同的开发者在实施的过程中会出现一些细微的差别，因此，为了统一不同开发者、不同项目之间的差异，我们就需要制定一个行业标准去规范模块化的实现方式；


- commonJS
> 它是 Node.js 中所遵循的模块规范，该规范约定，一个文件就是一个模块，每个模块都有单独的作用域，通过 module.exports 导出成员，再通过 require 函数载入模块。CommonJS 约定的是以同步的方式加载模块，因为 Node.js 执行机制是在启动时加载模块，执行过程中只是使用模块，所以这种方式不会有问题。但是如果要在浏览器端使用同步的加载模式，就会引起大量的同步模式请求，导致应用运行效率低下



- AMD (Asynchronous Module Definition)
> 专门为浏览器端重新设计了一个规范，即异步模块定义规范，约定每个模块通过 define() 函数定义，这个函数默认可以接收两个参数，第一个参数是一个数组，用于声明此模块的依赖项；第二个参数是一个函数，参数与前面的依赖项一一对应，每一项分别对应依赖项模块的导出成员，这个函数的作用就是为当前模块提供一个私有空间。如果在当前模块中需要向外部导出成员，可以通过 return 的方式实现。同期还推出了一个非常出名的库，叫做[ require.js](https://requirejs.org/)，它除了实现了 AMD 模块化规范，本身也是一个非常强大的模块加载器。

```javascript
define(['jquery', './module.js'], function ($, module){
    return {
        start(){
            $('body).animate({margin: '200px'});
            module()
        }
    }
})
```


- CMD (Common Module Definition)
> 他的规范阐述了如何编写模块，以便在基于浏览器的环境中实现互操作，类似于 CommonJS，在使用上基本和 Require.js 相同，可以算上是重复的轮子，淘宝的[Seajs](https://seajs.github.io/seajs/docs/#intro)。



- UMD (Universal Module Definition)[ 链接](https://github.com/umdjs/umd)
> 该模式主要用来解决CommonJS模式和AMD模式代码不能通用的问题，并同时还支持老式的全局变量规范。

- ES Modules [ECMA-262](http://www.ecma-international.org/ecma-262/6.0/#sec-modules)
> 将 JavaScript 程序拆分为可按需导入的单独模块的机制。其设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。



