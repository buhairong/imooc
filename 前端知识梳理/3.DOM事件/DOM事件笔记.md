# 基本概念： DOM事件的级别
    DOM1标准制定时，没有涉及与DOM相关的东西

    DOM0: element.onclick = function(){}
    DOM2: element.addEventListener('click', function(){}, false)  - true: 捕获阶段触发  false: 冒泡阶段触发
    DOM3: element.addEventListener('keyup', function(){}, false)  - DOM3事件类型增加了鼠标事件、键盘事件

# DOM事件模型
    捕获: 从上至下
    冒泡: 从当前元素向上

# DOM事件流
    捕获 -- 目标阶段（如点击了一个按钮，这个按钮就是目标阶段） -- 冒泡
    事件通过捕获到达目标元素，从目标元素再上传到window对象

# 描述DOM事件捕获的具体流程
    获取html节点: document.documentElement
    window -- document -- html -- body -- 按照结构一层一层找到目标元素
    反之就是冒泡的流程

# Event对象的常见应用
    event.preventDefault()                   - 阻止浏览器默认事件
    event.stopPropagation()                  - 阻止冒泡
    event.stopImmediatePropagation()         - 如果元素绑定了2个click，
                                               在第一个click函数中写上event.stopImmediatePropagation()，
                                               那第二个事件不会响应
    event.currentTarget                      - 当前所绑定事件的元素 (例如事件委托时，就是指绑定元素的父级对象)
    event.target                             - 当前被点击的元素

# 自定义事件
    var eve = new Event('custom')
    // var eve = new CustomEvent('custom', {detail: {obj}})  - CustomEvent可以携带参数,必须写在detail对象里
    ev.addListener('custom', function(){
        console.log('custom')
    })
    ev.dispatchEvent(eve)