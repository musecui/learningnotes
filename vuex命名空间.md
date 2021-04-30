## vue项目报错unknown local action type: xxx, global type: xxx 到vuex命名空间

出现原因为在带命名空间的模块访问全局内容。使用`dispath`或`commit`进行分发`actions`或提交`mutations`时，默认使用本命名空间，在`actions`和`getters`中`dispath`和`commit`均被局部化。使用命名空间在输出时如下所示：


```js
export default{
    // 当namespaced值为true时，该模块中的dispath和commit被局部化，默认使用当前文件名/actions下得方法名。值为false时，使用根路径
    namespaced: true,
    state,
    actions,
    mutations,
}
```

在当前文件中使用其他命名空间中的acitons时，如果namespaced属性为true时，在使用`dispath`或`commit`时，将`{ root: true }`作为参数传入，如下所示：
```js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
``` 

当然，也可以将`namespaced`属性设为false，则`dispath`、`commit`或`getter`时，需要将`actions`的完整路径传入。