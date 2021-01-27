// 类的装饰器
// 装饰器本身是一个函数
// 装饰器通过 @ 符号来使用

// 装饰器接收的参数为类的构造函数
function testDecorator(constructor: any) {
  constructor.prototype.getName = () => {
    console.log('dell')
  }
  console.log('decorator')
}

@testDecorator
class Test {

}

const test = new Test();
(test as any).getName()