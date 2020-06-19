let authors = {
  allAuthors: {
    fiction: ['Agla', 'Skks', 'LP'],
    scienceFiction: ['Neal', 'Arthru', 'Ribert'],
    fantasy: ['J.R.Tole', 'J.M.R', 'Terry P.K']
  },
  Addres: []
}

// 自定义遍历器
authors[Symbol.iterator] = function() {
    let allAuthors = this.allAuthors
    let keys = Reflect.ownKeys(allAuthors)
    let values = []
    
    return {
        next() {
            if(!values.length) {
                if(keys.length) {
                    values = allAuthors[keys[0]]
                    keys.shift()
                }
            }
        
            return {
                done: !values.length,
                value: values.shift()
            }
        }
    }
}

let r = []

for(let val of authors){
    r.push(val)
}

console.log(r)   // ['Agla', 'Skks', 'LP', 'Neal', 'Arthru', 'Ribert', 'J.R.Tole', 'J.M.R', 'Terry P.K']


--------------------------------------------------------------------------------------------------------------------

// 使用 Generator 自定义遍历器
authors[Symbol.iterator] = function * () {
    let allAuthors = this.allAuthors
    let keys = Reflect.ownKeys(allAuthors)
    let values = []
    
    while(1) {
        if(!values.length) {
            if(keys.length) {
                values = allAuthors[keys[0]]
                keys.shift()
                yield values.shift()
            }else {
                return false
            }
        }else {
            yield values.shift()
        }    
    }       
}

let r = []

for(let val of authors){
    r.push(val)
}

console.log(r)   // ['Agla', 'Skks', 'LP', 'Neal', 'Arthru', 'Ribert', 'J.R.Tole', 'J.M.R', 'Terry P.K']
