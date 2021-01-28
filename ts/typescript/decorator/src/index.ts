// function testDecorator() {
//   return function<T extends new (...args: any[]) => {}>(constructor: T) {
//     return class extends constructor {
//       name = 'lee'
//       getName() {
//         return this.name
//       }
//     }
//   }
// }

// const Test = testDecorator()(class {
//   name: string
//   constructor(name: string) {
//     this.name = name
//   }
// })

// 普通方法：target 对应的是 类的 prototype , key 是 装饰的方法的名字, descriptor 可以对 方法的descriptor属性做一些编辑
// 静态方法：target 对应的是 类的 构造函数
function getNameDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
  //descriptor.writable = false
  descriptor.value = function() {
    return 'decorator'
  }
}

class Test {
  name: string
  constructor(name: string) {
    this.name = name
  }

  @getNameDecorator
  getName() {
    return this.name
  }
}


const test = new Test('dell');
console.log(test.getName())



