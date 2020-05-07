# 基本概念： 标准模型 + IE模型
    margin、border、padding、content

# 标准模型和IE模型的区别
    标准模型的宽高不包含padding和border
    IE模型的宽高包含padding和border

# CSS如何设置这两种模型
    box-sizing: content;      标准模型
    box-sizing: border-box;   IE模型

# JS如何设置获取盒模型对应的宽和高
    1. dom.style.width
       dom.style.height
       只能获取内联样式的宽和高

    2. dom.currentStyle.width
       dom.currentStyle.height
       获取浏览器渲染以后的宽和高,但是这个属性只有IE支持

    3. window.getComputedStyle(dom).width
       window.getComputedStyle(dom).height
       获取浏览器渲染以后的宽和高 （兼容firefox和chrome）

    4. dom.getBoundingClientRect().width
       dom.getBoundingClientRect().height
       获取浏览器渲染以后,根据视窗的左上角获取到元素的绝对位置,
       可以获取元素的宽和高


# 实例题（根据盒模型解释边距重叠）

# BFC （边距重叠解决方案）
    ## BFC的基本概念
        块级格式化上下文

    ## BFC的原理（BFC的渲染规则）
        1. BFC内的元素的垂直方向的边距会发生重叠
        2. BFC的区域不会与浮动元素重叠
        3. BFC在页面上是一个独立的容器,外面的元素不会影响里面的元素,
           里面的元素也不会影响外面的元素
        4. 计算元素高度时，浮动元素也会参与计算

    ## 如何创建BFC
        1. float值不为none
        2. position值不为static和relative
        3. display为inline-block或table、table-cell、table-caption等和table相关的属性
        4. overflow不为 visible

    ## BFC的使用场景
        1. 解决边距重叠   - BFC在页面上是一个独立的容器，外面的元素不会影响里面的元素,
                            里面的元素也不会影响外面的元素
        2. 两栏布局       - BFC不与浮动元素重叠
        3. 清除浮动       - BFC子元素即使是float也会参与计算