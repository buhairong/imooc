for (let i = 1; i < 32; i++) {
  console.log(i.toString().padStart(2, '0'))  // 前面补位
  console.log(i.toString().padEnd(2, '0'))  // 后面补位
}