### 目的：

> -   能够将散落的模块打包到一起；
> -   能够编译代码中的新特性；
> -   能够支持不同种类的前端资源模块。

目前，前端领域最为主流打包工具就是 Webpack、Parcel 和 Rollup；

> -   Webpack 作为一个模块打包工具，本身就可以解决模块化代码打包的问题，将零散的 JavaScript 代码打包到一个 JS 文件中。
> -   对于有环境兼容问题的代码，Webpack 可以在打包过程中通过 Loader 机制对其实现编译转换，然后再进行打包。
> -   对于不同类型的前端模块类型，Webpack 支持在 JavaScript 中以模块化的方式载入任意类型的资源文件，例如，我们可以通过 Webpack 实现在 JavaScript 中加载 CSS 文件，被加载的 CSS 文件将会通过 style 标签的方式工作

Webpack 还具备代码拆分的能力，它能够将应用中所有的模块按照我们的需要分块打包;这样一来，就不用担心全部代码打包到一起，产生单个文件过大，导致加载慢的问题。我们可以把应用初次加载所必需的模块打包到一起，其他的模块再单独打包，等到应用工作过程中实际需要用到某个模块，再异步加载该模块，实现增量加载，或者叫作渐进式加载，非常适合现代化的大型 Web 应用。

### webpack 打包 [官网](https://www.webpackjs.com/guides/installation/)

> 由于 Webpack 是一个 npm 工具模块，所以我们先初始化一个 package.json 文件，用来管理 npm 依赖版本，完成之后，再来安装 Webpack 的核心模块以及它的 CLI 模块，

```javascript
npm init --yes || yarn init --yes
npm install webpack webpack-cli   || yarn add webpack webpack-cli
```

> webpack 是 Webpack 的核心模块，webpack-cli 是 Webpack 的 CLI 程序，用来在命令行中调用 Webpack，可根据 `npx webpack --version`  查看 webpack 版本， `npx webpack`  是执行打包的命令

![image.png](https://cdn.nlark.com/yuque/0/2021/png/541953/1610611585895-b795b042-556e-4a8d-9631-96c641bdfebd.png#align=left&display=inline&height=72&margin=%5Bobject%20Object%5D&name=image.png&originHeight=72&originWidth=272&size=6527&status=done&style=none&width=272)

-   新建一个 main.js 和 index.html 文件

```javascript
// main.js
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// 在html中引入了lodash
const newArray = _.chunk(array, 2)
console.log(newArray) // [[1, 2]  [3, 4], [5, 6], [7, 8], [9, 10]]
```

```html
<!--index.html-->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>webpack bundle</title>
    </head>
    <body>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"></script>
        <script type="module" src="./main.js"></script>
    </body>
</html>
```

然后用浏览器打开这个文件，控制台可查看
![image.png](https://cdn.nlark.com/yuque/0/2021/png/541953/1610614272375-f70e1f96-1fa6-4f96-9de2-2f579f2eb3d3.png#align=left&display=inline&height=128&margin=%5Bobject%20Object%5D&name=image.png&originHeight=128&originWidth=220&size=4491&status=done&style=none&width=220)
所以以上我们环境和代码是可行的，下面来使用 webpack 打包，首先介绍几个属性：

> -   entry: 指定 webpack 打包的入口文件路径
> -   output: 设置输出文件的位置。output  属性的值必须是一个对象，通过这个对象的  filename  指定输出文件的文件名称，path  指定输出的目录
>     -   filename
>     -   path
> -   mode: 编译模式，如果未设置，则 webpack 设置`production`为[`mode`](https://webpack.js.org/configuration/mode/)的默认值。
>     -   development 启动内置优化插件，自动优化打包结果，打包速度偏慢
>     -   production 自动优化打包速度，添加一些调试过程中的辅助插件
>     -   none 运行最原始的打包，不做任何额外处理。

新建目录如下：

```json
webpack
├── src
│   ├── index.html
│   └── main.js
├── package.json
├── webpack.config.js
└── yarn.lock
```

```javascript
// webpack.config.js
const path = require('path')

module.exports = {
    entry: './src/main.js', // entry指定webpack打包的入口文件路径
    mode: 'none', // development production none 如果未设置，则webpack设置production为的默认值mode。

    output: {
        // output 属性设置输出文件的位置。output 属性的值必须是一个对象，通过这个对象的 filename 指定输出文件的文件名称，path 指定输出的目录
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
    },
}
```

然后将 package.json 文件的修改成如下：

> 安装了 `lodash`  快速整合功能

```json
// package.json
{
    "name": "bundle",
    "version": "1.0.0",
    "private": true,
    "license": "MIT",
    "scripts": {
        "dev": "npx webpack"
    },
    "dependencies": {
        "lodash": "^4.17.20",
        "webpack": "^5.14.0",
        "webpack-cli": "^4.3.1"
    }
}
```

在 index.html 中添加内容

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>webpack bundle</title>
    </head>
    <body>
        <script src="../dist/bundle.js"></script>
    </body>
</html>
```

main.js 内容如下：

```javascript
import _ from 'lodash'

function component() {
    let element = document.createElement('div')
    element.innerHTML = _.join(['Hello', 'webpack'], ' ')
    return element
}

document.body.appendChild(component())
```

然后再控制台中执行命令：

```javascript
yarn dev
```

执行命令后会在项目的根目录生成 dist 文件夹(也就是打包编译后的文件夹)。
查看浏览器如图内容：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/541953/1610618053570-81277b6d-8b7d-4c3a-b42e-ea5b35da7e46.png#align=left&display=inline&height=61&margin=%5Bobject%20Object%5D&name=image.png&originHeight=61&originWidth=210&size=1446&status=done&style=none&width=210)
