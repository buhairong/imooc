# 属性保护

let _age = 4
class Animal {
    constructor(type) {
        this.type = type
    }
    
    // 只定义了 get ，没有定义 set 时，get 的属性是只读的，不可修改
    get age() {
        return _age
    }
    
    set age(val) {
        this._age = val    
    }
    
    eat() {
        console.log('i am eat food')
    }
}

# 静态方法
class Animal {
    constructor(type) {
        this.type = type
    }
    
    // 静态方法是挂在类上的，而不是实例上
    static walk() {
        console.log('i am walk')
    }
    
    eat() {
        console.log('i am eat food')
    }
}

