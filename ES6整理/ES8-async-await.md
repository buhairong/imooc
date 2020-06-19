async function firstAsync() {
    return 27  // Promise.resolve(27)
}

console.log(firstAsync())   // 函数前加了 async 后，返回的就是一个promise 对象，而不是27

// 函数前加了 async 后，如果return 的不是一个promise，会自动转成promise实例
firstAsync().then(res => {
    console.log(res)   // 27
})


-----------------------------------------------------------------------------------

async function firstAsync() {
    let result = await 30  // await 后必须是一个promise对象，如果不是promise,会自动转换成promise对象
    console.log(result)  // 30
}

firstAsync()