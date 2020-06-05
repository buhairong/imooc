# ES5数组遍历方法
 ## for

 ## forEach
    不支持 break continue
 
 ## every
 
 ## for in
    数组也是对象
    let arr = [1,2,3,4]
    arr.a = 8 // [1, 2, 3, 4, a:8]
    
 ## filter
 
# ES6数组遍历方法
 ## for of
 
 
# Array.from(arrayLike, mapFn, thisArg)
    - mapFn 回调函数，可以对伪数组里的每一项做出改变
 
# Array.of
    生成新数组
    let arr = Array.of(1,2,3,4)
    console.log(arr)  // [1,2,3,4]
    
# Array.fill
    生成新数组并填充
    let arr = Array(5).fill(1)
    console.log(arr) // [1,1,1,1,1]
    Array.fill(value, start, end)
    
# Array.find
    找到返回数据项，没找到返回undefined
    
# Array.findIndex
    返回索引