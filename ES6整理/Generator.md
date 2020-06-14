function * loop() {
    for(let i=0;i<5;i++) {
        yield console.log(i)  // yield  暂停状态
    }
}

const l = loop()
l.next() // 0
l.next() // 1
l.next() // 2
l.next() // 3
l.next() // 4
l.next() // 没有输出

--------------------------------------------------------------------------------------

function * gen(){
    let val
    val = yield 1
    console.log(val)
}

const l = gen()
l.next()  // 没有输出       执行 yield 1
l.next()  // undefined      将yield 1 赋值给 val,然后执行下面的语句, yield 没有返回值

---------------------------------------------------------------------------------------------

function * gen(){
    let val
    val = yield * [1, 2, 3]  // 加了 * 号，表示后面是一个可迭代的对象，或者是一个generator对象
    console.log(val)
}

const l = gen()
l.next()  // 没有输出
l.next()  // 没有输出

---------------------------------------------------------------------------------------------

function * gen(){
    let val
    val = yield  [1, 2, 3]
    console.log(val)  // 20
}

const l = gen()
console.log(l.next(10))  // {value: Array(3), done: false}
console.log(l.next(20)) // {value: undefined, done: true}    yield表达式对val赋值时，通过next传值影响yield的返回值