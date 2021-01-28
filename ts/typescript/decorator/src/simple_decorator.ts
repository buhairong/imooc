// // 类的装饰器
// // 装饰器本身是一个函数
// // 装饰器通过 @ 符号来使用
// // 多个装饰器从下至上，从右至左执行

// // 装饰器接收的参数为类的构造函数
// function testDecorator(constructor: any) {
//   constructor.prototype.getName = () => {
//     console.log('dell')
//   }
//   console.log('decorator')
// }

// // 工厂模式
// function testDecorator1(flag: boolean) {
//   if(flag) {
//     return function(constructor: any) {
//       console.log('decorator1')
//     }
//   }else {
//     return function(){}
//   }
// }

// @testDecorator
// @testDecorator1(true)
// class Test {

// }

// const test = new Test();
// (test as any).getName()