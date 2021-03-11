### 1、输入一个值，返回其数据类型  
  

```js
function type(para) {
    return Object.prototype.toString.call(para)
}
```

### 2、数组去重

```js
function unique1(arr) {
    return [...new Set(arr)]
}

function unique2(arr) {
    var obj = {};
    return arr.filter(ele => {
        if (!obj[ele]) {
            obj[ele] = true;
            return true;
        }
    })
}

function unique3(arr) {
    var result = [];
    arr.forEach(ele => {
        if (result.indexOf(ele) == -1) {
            result.push(ele)
        }
    })
    return result;
}

```

### 3、字符串去重

```js
String.prototype.unique = function () {
    var obj = {},
        str = '',
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!obj[this[i]]) {
            str += this[i];
            obj[this[i]] = true;
        }
    }
    return str;
}

//去除连续的字符串 
function uniq(str) {
    return str.replace(/(\w)\1+/g, '$1')
}

```