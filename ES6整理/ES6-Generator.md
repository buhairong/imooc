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

---------------------------------------------------------------------------------------------

function * gen(){
    let val
    val = yield  [1, 2, 3]
    console.log(val)   // 流程被终止，不会执行
}

const l = gen()
console.log(l.next(10))  
console.log(l.return(100))   //  {value: 100, done: true}   终止流程
console.log(l.next(20)) 



---------------------------------------------------------------------------------------------------

function * gen() {
    while(true){
        try{
            yield 1
        }catch(e){
            console.log(e)
        }
    }
}

const g = gen()
console.log(g.next())      // {value: 1, done: false}
g.throw(new Error('sss'))  // 抛出异常
console.log(g.next())     // {value: 1, done: false}   抛出异常后，不会影响程序后续执行


