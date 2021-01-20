// superagent 是 js文件，ts无法直接读取
// ts -> .d.ts 翻译文件 -> js
import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
import DellAnalyzer from './dellAnalyzer'

export interface Analyzer {
  analyzer: (html: string, filePath: string) => string
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/course.json')

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess()
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyzer(html, this.filePath)

    fs.writeFileSync(this.filePath, fileContent)
  }

  private async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }
}

const secret = 'x3b174jsx'
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`


const analyzer = DellAnalyzer.getInstance()
new Crowller(url, analyzer)
console.log("113");
