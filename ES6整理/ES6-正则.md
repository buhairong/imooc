# y 修饰符

const s = 'aaa_aa_a'
const r1 = /a+/g    // g 全局搜索
const r1 = /a+/y    // y 粘连符，必须从第一个字符匹配

r1.exec(s)   // aaa
r2.exec(s)   // aaa

r1.exec(s)   // aa
r2.exec(s)   // null  剩余的字符串第一个字符是 _  ,不符合匹配

# u 修饰符

let s = '𠮷'
let s2 = '\uD842\uDFB7'

console.log(/^\uD842/.test(s2))   // true  unicode编码\uD842 作为一个字符
console.log(/^\uD842/u.test(s2))  // false  u 修饰符 匹配 \uD842\uDFB7 汉字完整字符
console.log(/^.$/.test(s)) // false   . 代表匹配任意字符 
console.log(/^.$/u.test(s)) // true 加修饰符u 才能匹配到大于2个字节的字符

// u 修饰符 可以匹配 unicode 码点
console.log(/\u{20BB7}/u.test(s))  // true
console.log(/\u{61}/u.test('a'))   // true

console.log(/𠮷{2}/.test('𠮷𠮷'))   // false
console.log(/𠮷{2}/u.test('𠮷𠮷'))  // true

console.log(/[a-z]/i.test('\u212A'))   // false
console.log(/[a-z]/iu.test('\u212A'))  // true


------------------------------------------------------------------------------------------------------------------
# ES9 新增

// . 匹配任意字符，但是不能匹配 utf-16编码，换行符 \n、回车符 \r
// 加上s修饰符可以匹配到 utf-16编码，换行符 \n、回车符 \r
console.log(/foo.bar/us.test('foo\nbar'))  // true

const re = /foo.bar/s  
console.log(re.dotAll) // true  正则是否开启 dotAll
console.log(re.flags) // s  正则开启的修饰符


# 分组匹配
const t = '2019-06-07'.match(/(\d{4})-(\d{2})-(\d{2})/)
console.log(t[1])  // 2019
console.log(t[2])  // 06
console.log(t[3]) // 07


# 命名分组匹配
const t = '2019-06-07'.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/)
console.log(t.groups.year)   // 2019
console.log(t.groups.month)  // 06
console.log(t.groups.day)   // 07


# 先行断言  先匹配到hello,再匹配hello后是否满足条件（是否是 world）
let test = 'hello world'
console.log(test.match(/hello(?=\sworld)/))

# 后行断言  先匹配到world,再匹配world前是否满足条件（是否是hello ）
console.log(test.match(/(?<hello\s)world/))
console.log(test.match(/(?<!helle\s)world/)) // 匹配world前不等于helle





