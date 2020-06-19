const data = {
  PortLand: '78/50',
  Dublin: '88/52',
  Lima: '58/40'
}

Object.defineProperty(data, 'Lima', {
  enumerable: false,   // 是否可以枚举
  writable: false  // 是否可以修改
})

console.log(Object.keys(data))   // ['PortLand', 'Dublin']  Lima 已经不可遍历
console.log(Object.getOwnPropertyDescriptors(data))  // 可遍历出对象所有数据的描述符
console.log(Object.getOwnPropertyDescriptor(data, 'Lima'))  // 读取对象指定数据的描述符

data.Lima = '59/50'   // 修改失效
