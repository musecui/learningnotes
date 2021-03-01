# key的使用  

用key管理可复用的元素  

vue在渲染模板时，如果两个模板使用相同的元素时，用户输入不会被替换。而key可以标记不同的元素，使得vue在渲染模板时不会将用户输入复用。  

vue官方文档给出下面的两个例子。

**例1**

    <template v-if="loginType === 'username'">
        <label>Username</label>
        <input placeholder="Enter your username">
    </template>
    <template v-else>
        <label>Email</label>
        <input placeholder="Enter your email address">
    </template>

**例2**  

    <template v-if="loginType === 'username'">
        <label>Username</label>
    <input placeholder="Enter your username" key="username-input">
    </template>
    <template v-else>
        <label>Email</label>
        <input placeholder="Enter your email address" key="email-input">
    </template>  

其中例1中`<input>`元素中未设置`key`，则在`logintype`切换时，输入框中的用户输入不会被重新渲染，而在例2中`<input>`元素中设置了`key`值，则在`logintype`切换时输入框中的用户输入会被重新渲染。  

实际应用中，当单页面中有多个`dialog`需要用户输入时，切换`dialog`可能会导致用户输入继续被渲染进下一个`dialog`，此时在元素中加入`key`值或许可以解决部分问题。更多实际使用，可能需要在应用中进行发现。