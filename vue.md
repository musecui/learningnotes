## vue双向绑定
***
vue.js采用数据劫持结合发布者-订阅者模式，通过object.defineProperty()来劫持各个属性的setter(),getter()方法，在数据变动时发布消息给订阅者，触发相应的监听回调。
***

## key的使用

***

用key管理可复用的元素  

vue在渲染模板时，如果两个模板使用相同的元素时，用户输入不会被替换。而key可以标记不同的元素，使得vue在渲染模板时不会将用户输入复用。  

vue官方文档给出下面的两个例子。

**例1**
```html
    <template v-if="loginType === 'username'">
        <label>Username</label>
        <input placeholder="Enter your username">
    </template>
    <template v-else>
        <label>Email</label>
        <input placeholder="Enter your email address">
    </template>
```
**例2**  
```html
    <template v-if="loginType === 'username'">
        <label>Username</label>
    <input placeholder="Enter your username" key="username-input">
    </template>
    <template v-else>
        <label>Email</label>
        <input placeholder="Enter your email address" key="email-input">
    </template>  
```
其中例1中`<input>`元素中未设置`key`，则在`logintype`切换时，输入框中的用户输入不会被重新渲染，而在例2中`<input>`元素中设置了`key`值，则在`logintype`切换时输入框中的用户输入会被重新渲染。  

实际应用中，当单页面中有多个`dialog`需要用户输入时，切换`dialog`可能会导致用户输入继续被渲染进下一个`dialog`，此时在元素中加入`key`值或许可以解决部分问题。更多实际使用，可能需要在应用中进行发现。

在使用`v-for`时尽可能使用`key`对元素进行绑定，这样可以使得vue在列表顺序或列表元素发生变化时进行重新排序。除非需要渲染的元素非常简单（或功能业务对是否排序无需求），此时可以不适用`key`来提升性能。在2.2.0+版本后，在组件中使用`v-for`时`key`时必须的。

***  

## checkbox中多个复选框绑定同一个数组

***

```html
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Checked names: {{ checkedNames }}</span>
```

```js
new Vue({
  el: '...',
  data: {
    checkedNames: []
  }
})
```

选中单选框后，单选框的`value`值自动push到绑定的数组中去。此处与多选时的逻辑不同。在使用多选框时，选中的元素加入到绑定数组中时，依然是按照`option`中展示的顺序排列。如下：

```html
<div id="example-6">
  <select v-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Selected: {{ selected }}</span>
</div>
```

```js
new Vue({
  el: '#example-6',
  data: {
    selected: []
  }
})
```
该例中A、B、C加入到`selected`数组的顺序是按照`option`顺序A、B、C进行排列的，与选择A、B、C的先后顺序无关。

***