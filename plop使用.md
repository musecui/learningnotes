# plop模板工具的使用

***
## plop基本配置

plop是什么？plop是一个根据用户输入和预设模板生成所需要代码的一种js工具。[详细官方文档](https://plopjs.com/documentation/)  

**npm安装plop**

    // 全局安装
    npm i -g plop

    // 当前项目安装
    npm i --save-dev plop

plop安装后，需要在根目录下创建`plopfile.js`作为plop的入口文件。我安装后自动在项目根目录下生成了该文件，看看该文件内容。

```js
const viewGenerator = require('./plop-templates/view/prompt')
const componentGenerator = require('./plop-templates/component/prompt')
const storeGenerator = require('./plop-templates/store/prompt.js')

module.exports = function(plop) {
    plop.setGenerator('view', viewGenerator)
    plop.setGenerator('component', componentGenerator)
    plop.setGenerator('store', storeGenerator)
}
```

该文件中引用了根目录下`plop-templates`中的资源，分别对应`viewGenerator`、`componentGenerator`、`storeGenerator`三个`generator`。***generator***是plop中的生成器。该文件为plop的入口文件，控制台运行`plop`命令时（或者在`package.json`中配置的plop命令），将会提示用户选择`generator`进行下一步。

```
PS C:\work\vue> plop
? [PLOP] Please choose a generator. (Use arrow keys)
> view - generate a view
  component - generate vue component
  store - generate store
```


每个生成器中可设置`description`、`prompts`、`actions`，即生成器描述，交互提示以及生成器动作。

生成器基本代码如下所示

```js
    module.exports = {
    description: 'description',
        prompts: [
            {
                type: 'input',  // 交互类型
                name: 'name',   // 参数名称
                message:'请输入文件名称' // 交互提示
            },
            {
                type: 'list',
                name: 'path',
                message: '请选择文件创建目录',
                choice: []
            }
        ],
        actions: [
            {
                const name = '{{name}}'
                type: 'add', // 动作类型
                path: '{{ path }}/{{ name }}.vue', // '{{  }}' 双大括号内设置动态参数
                templateFile: 'plop-templates/views/vue.hbs' // 模板文件地址， 使用hbs文件,
                data: {
                    name: name
                }
            }
        ]
    }
```

该实例代码中生成器交互包括两步，第一步提示输入文件名称，交互类型为`input`,用户输入的数据将存储在`name`变量中。第二步提示选择文件创建目录,交互类型为`list`，在`choice`中给出展示的选项，类型为数组或返回类型为数组的函数,用户选择的选项保存在path变量中。动作`action`有一步，类型为`add`,添加路径中的`{{path}}`、`{{name}}`为交互中用户输入和选择的变量值，在该处引用交互中的变量时，需要使用`{{}}`对变量进行包裹。`templateFile`为模板文件地址，该处的模板文件需要使用hbs文件。`data`为数据选项，`data`内变量可以传入`templateFile`的文件中进行使用。

其中`prompts`的`type`支持的类型包括`input`, `number`, `checkbox`, `list`, `confirm`, `password` 等等。`name`为用户选择或者输入的变量名，`message`为显示的交互提示。还有其他值可供选择，如默认值`default`,可选值`choice`(接受数组或返回值为数组的函数)，验证函数`validate`（接受函数，返回值为true或报错信息）,过滤器`filter`（返回值为过滤后的用户输入），更多可选值参考[github plop文档](https://github.com/SBoudrias/Inquirer.js#inquirerregisterpromptname-prompt)。  

**`action`的配置：**  
- type 预设类型 add modify addMany etc  
- force 是否强制执行动作，及覆盖已存在文件，默认为`false`
- data 返回给模板的数据  
- abortOnFail 当有action 执行失败时,是否终止其他action，默认为`true` 

**当`action`的type为`add`时，其余配置为：**  
- path 添加文件的位置
- template 一个`handlebars`类型的模板，以该模板创建新文件
- templateFile  一个`handlebars`类型的模板文件的位置
- skipIfExists  存在则跳过，默认为`false`
- transform  可选函数，在新文件生成前对模板文件进行转换
- force  继承自`actionconfig`，覆盖已存在文件
- abortOnFail 继承自`actionconfig`

其他`action`预设类型modify addMany etc,详见[官方文档](https://plopjs.com/documentation/#addmany)。

***

## handlebars模板语法

plop生成文件时需要使用`.hbs`类型文件为模板，该类型文件需要用到`handlebars`模板语法进行完成。[`handlebars`官方文档](https://www.handlebarsjs.cn/)。官方文档中描述比较详细，在此不再赘述。