# JS异步操作
JavaScript语言执行环境是“单线程”（单线程，就是指一次只能完成一件任务，如果有多个任务就必须排队等候，前面一个任务完成，再执行后面一个任务）。这种“单线程”模式执行效率较低，任务耗时长。但是在实际的开发过程中，需要处理并行的情况。为了解决这个问题，提出了“异步模式”(异步模式，是指后一个任务不等前一个任务执行完就执行，每个任务有一个或多个回调函数)。

异步模式使得JavaScript在处理事务时非常高效，但也带来很多问题，如异常处理困难、嵌套过深。

JS中的异步编程方法大致有以下几种：

1. 回调函数
2. 发布/订阅模式
3. promise
4. generator（ES6）
5. async/await（ES7）

## 回调函数callback

回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。它的英语名字 callback，直译过来就是"重新调用"。虽然回调函数多用于异步编程，但带有回调函数的方法不一定是异步的。

```js
unction successCallback() { 
    console.log('callback');
    } 
function fn(successCallback) { 
    console.log('这里表示执行了一大堆各种代码');
     // 其他代码执行完毕，最后执行回调函数 
    successCallback instanceof Function && successCallback(); } 
fn(successCallback);
```

异步回调比较常见的例子是ajax。

```js
$.ajax({
    url:"/getmsg",
    type: 'GET',
    dataType: 'json',
    success: function(ret) {
        if (ret && ret.status) {
            //
        }
    },
    error: function(xhr) {
        //
    }
})
```

回调函数的一个明显问题是，当回调函数嵌套套层数不深的情况下，代码还算容易理解和维护，一旦嵌套层数加深，就会出现“回调金字塔”的问题。如果每个回调函数中的业务逻辑又比较复杂的话，整块代码就会变得非常复杂，变得难以维护。

## 发布/订阅模式

在系统中存在一个"信号中心"，当某个任务执行完成后向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。简单实现如下：

```js
var PubSub = function(){
    this.handlers = {}; 
};
PubSub.prototype.subscribe = function(eventType, handler) {
    if (!(eventType in this.handlers)) {
        this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler); //添加事件监听器
    return this;//返回上下文环境以实现链式调用
};
PubSub.prototype.publish = function(eventType) {
    var _args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, _handlers = this.handlers[eventType]; i < _handlers.length; i++) {
        _handlers[i].apply(this, _args);// 遍历事件监听器
    }
    return this;
};
var event = new PubSub;// 构造PubSub实例
event.subscribe('list', function(msg) {
    console.log(msg);
});
event.publish('list', {data: ['one,', 'two']});// Object {data: Array[2]}
```

## Promise
Promise是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

使用Promise对象可以用同步操作的流程写法来表达异步操作，避免了层层嵌套的异步回调，代码也更加清晰易懂，方便维护，也可以捕捉异常。

以下为使用promise实现ajax的例子。

```js
var getJSON=function(url){
    var promise=new Promise(function(resolve,reject){
        var client=new XMLHttpRequest();
        client.open("GET",url);
        client.onreadystatechange=handler;
        client.responseType="json";
        client.setRequestHeader("Accept","application/json");
        client.send();
        function handler(){
            if(this.readyState!=4){
                return;
            }
            if(this.status==200){
                resolve(this.response);
            }else{
                reject(new Error(this.statusText));
            }
        }
    });
    return promise;
}

getJSON('/posts.json').then(function(json){
    console.log('Contents: '+json);
},function(error){
    console.error(error)
})
```

可以看到，Promise 的写法只是回调函数的改进，使用then方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意。

Promise 的最大问题是代码冗余，原来的任务被Promise 包装了一下，不管什么操作，一眼看去都是一堆 then，原来的语义变得很不清楚。

## Generator

Generator函数是ES6提供的一种异步编程解决方案，语法行为与传统函数完全不同。

Generator函数有多种理解角度。从语法上，首先可以把它理解成Generator函数是一个状态机，封装了多个内部状态。

执行Generator函数会返回一个遍历器对象，也就是说，Generator函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历Generator函数内部的每一个状态。

形式上，Generator函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield语句，定义不同的内部状态（yield语句在英语里的意思就是“产出”）。

```js
function* gen(x){
    let y=yield x+2;
    return y;
}
let g=gen(1);
g.next();
//返回 {value: 3, done: false}
g.next();
//返回 {value: undefined, done: true}
```

Generator函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用Generator函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，该对象为遍历器对象（Iterator Object）。遍历器对象需要使用next()方法使得指针移动到下一个状态。也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield语句（或return语句）为止。换言之，Generator函数是分段执行的，yield语句是暂停执行的标记，而next方法可以恢复执行。

## async/await

Async函数是es7提供的函数，使得异步操作变得更加方便，实际上async函数是Generator的语法糖。async函数基于Generator又做了几点改进：

1. 内置执行器，将Generator函数和自动执行器进一步包装。
2. 语义更清楚，async表示函数中有异步操作，await表示等待着紧跟在后边的表达式的结果。
3. 适用性更广泛，await后面可以跟promise对象和原始类型的值(Generator中不支持)
4. 返回值是Promise。async函数的返回值是Promise对象，这比Generator函数的返回值是Iterator对象方便多了。你可以用then方法指定下一步的操作。

以下为使用async函数依次读取两个文件的例子。
```JS
var asyncReadFile = async function (){
    var f1 = await readFile('/etc/fstab');
    var f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
  };
```

需要注意的是await只能在async函数中使用，否则会报错。


Async函数有多种使用方式。

```js
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};
```

总结：js的异步编程在不断地发展，学习的关键是理解异步编程的机制。目前async函数被称为最好的异步解决方案，需要更加深入的理解该函数的实现原理以及使用方式。