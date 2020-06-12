# Reflect => 反射，  什么是反射机制？
Java的反射机制是在编译阶段不知道是哪个类被加载，而是在运行的时候才加载，运行

Reflect.apply(Math.floor, null, [4.72])  // 4

// price 大于100向下取整，小于100，向上取整
let price = 91.5
Reflect.apply(price > 100 ? Math.floor : Math.ceil, null, [price])  // 92

// 用构造函数指定要调用的类
let d = Reflect.construct(Date, [])
d.getTime()  // 1566920137917


const student1 = {}
const student2 = {}
const o = Object.defineProperty(student1, 'name', {value: 'Mike1'})
const r = Reflect.defineProperty(student2, 'name', {value: 'Mike2'})
console.log(student1)   //  {name: 'Mike1'}
console.log(student2)   //  {name: 'Mike2'}
console.log(o)   //  {name: 'Mike1'}
console.log(r)   //  true


const obj = {x: 1, y: 2}
Reflect.deleteProperty(obj, 'x')
console.log(obj)   // {y: 2}

Reflect.get(obj, 'y')  // 2
Reflect.get([3, 4], 1)  // 4


const obj1 = {x: 1, y: 2}
Object.getOwnPropertyDescriptor(obj, 'x')   // {value: 1, writable: true, enumerable: true, configurable: true}
Reflect.getOwnPropertyDescriptor(obj, 'x')   // {value: 1, writable: true, enumerable: true, configurable: true}


let d = new Date()
Reflect.getPrototypeOf(d)  // 查询原型链上方法


const obj2 = {x: 1, y: 2}
Reflect.has(obj2, 'x')  // true   has方法是Reflect特有的，Object 没有


const obj3 = {x: 1, y: 2}
Reflect.isExtensible(obj3)  // true   是否是可扩展的对象

Object.freeze(obj3)
Reflect.isExtensible(obj3)  // false
Reflect.ownKeys(obj3)  // ["x", "y"]
Reflect.ownKeys([])  // ["length"]
Reflect.ownKeys([1, 2])  // ["0", "1", "length"]


const obj4 = {x: 1, y: 2}
Reflect.preventExtensions(obj4)  // 阻止扩展
Reflect.isExtensible(obj4)  // false


const obj5 = {x: 1, y: 2}
Reflect.set(obj, 'z', 4)
console.log(obj)  // {x: 1, y: 2, z: 4}


const arr = ['duck', 'duck', 'duck']
Reflect.set(arr, 2, 'goose')
console.log(arr)  // ['duck', 'duck', 'goose']
Reflect.setPrototypeOf(arr, String.prototype)   // 修改原型链对象


