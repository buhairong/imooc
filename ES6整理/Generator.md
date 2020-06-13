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