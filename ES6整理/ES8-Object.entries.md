let grade = {
  'lilei': 96,
  'hanmeimei': 99
}

console.log(Object.keys(grade))
console.log(Object.values(grade))

for (let [k, v] of Object.entries(grade)) {
  console.log(k, v)
}