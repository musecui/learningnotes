var PubSub = function(){
    this.handlers = {}; 
};
PubSub.prototype.subscribe = function(eventType, handler) {
    if (!(eventType in this.handlers)) {
        this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler); //添加事件监听器
    return this;//返回上下文环境以实现链式调用
};
PubSub.prototype.publish = function(eventType) {
    var _args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, _handlers = this.handlers[eventType]; i < _handlers.length; i++) {
        _handlers[i].apply(this, _args);// 遍历事件监听器
    }
    return this;
};
var event = new PubSub;// 构造PubSub实例
event.subscribe('list', function(msg) {
    console.log(msg);
});
event.publish('list', {data: ['one,', 'two']});// Object {data: Array[2]}