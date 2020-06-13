let o = {
    name: 'xiaoming',
    price: 190
}

let d = new Proxy(o, {
    get(target, key) {
        if(key === 'price') {
            return target[key] + 20
        }else {
            return target[key]
        }
    }
})

console.log(d.price)   // 210

-------------------------------------------------------------------
# 场景一：只读数据
let o = {
    name: 'xiaoming',
    price: 190
}

let d = new Proxy(o, {
    get(target, key) {
        return target[key]
    },
    set(target, key, value){
        return false
    }
})

d.price = 300
console.log(d.name, d.price) // "xiaoming"  190


-------------------------------------------------------------------
# 场景二：校验
let o = {
    name: 'xiaoming',
    price: 190
}

// 监听错误
window.addEventListener('error', (e) => {
    console.log(e.message)
    report()  // 错误上报
}, true)

// 校验规则
let validator = (target, key, value) => {
    if(Reflect.has(target, key)){
        if(key === 'price') {
            if(value > 300) {
                // 不满足规则就要触发错误
                throw new TypeError('price exceed 300')
            }else{
                target[key] = value
            }          
        }else{
            target[key] = value
        }
    }else {
        return false
    }
}

let d = new Proxy(o, {
    get(target, key) {
        return target[key] || ""
    },
    set: validator
})

d.price = 301
d.name = 'hanmeimei'
d.age = 400
console.log(d.name, d.price, d.age) // "hanmeimei"  190  ""


-------------------------------------------------------------------
# 场景三：组件错误

Class Component {
    constructor(){
        this.proxy = new Proxy({
            id: Math.random().toString(36).slice(-8)
        },{})
    }
    
    get id (){
        return this.proxy.id
    }
}

-----------------------------------------------------------------------
# 撤销代理

let o = {
    name: 'xiaoming',
    price: 190
}

let d = Proxy.revocable(o, {
    get(target, key) {
        if(key === 'price') {
            return target[key] + 20
        }else {
            return target[key]
        }
    }
})

console.log(d.proxy.price)  // 210

d.revoke()  // 撤销代理

console.log(d.proxy.price)  // 报错
