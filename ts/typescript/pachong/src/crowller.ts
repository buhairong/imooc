// superagent 是 js文件，ts无法直接读取
// ts -> .d.ts 翻译文件 -> js
import superagent from 'superagent'

class Crowller {
  private secret = 'x3b174jsx'
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
  private rawHtml = ''

  constructor() {
    this.getRawHtml()
  }

  async getRawHtml() {
    const result = await superagent.get(this.url)
    this.rawHtml = result.text
  }
}

const crowller = new Crowller()
