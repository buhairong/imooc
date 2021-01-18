// superagent 是 js文件，ts无法直接读取
// ts -> .d.ts 翻译文件 -> js
import superagent from 'superagent'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

interface Course {
  title: string,
  count: number
}

interface CourseResult {
  time: number,
  data: Course[]
}

interface Content {
  [propName: number]: Course[]
}

class Crowller {
  private secret = 'x3b174jsx'
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`

  constructor() {
    this.initSpiderProcess()
  }

  async initSpiderProcess() {
    const filePath = path.resolve(__dirname, '../data/course.json')
    const html = await this.getRawHtml()
    const courseResult = this.getCourseInfo(html)
    this.generateJsonContent(courseResult)
    fs.writeFileSync(filePath, JSON.stringify(fileContent))
  }

  async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  getCourseInfo(html: string) {
    const $ = cheerio.load(html)
    const courseItems = $('.course-item')
    const courseInfos: Course[] = []
    courseItems.map((index, element) => {
      const descs = $(element).find('.course-desc')
      const title = descs.eq(0).text()
      const count = parseInt(descs.eq(1).text().split('：')[1])
      courseInfos.push({title, count})
    })

    return {
      time: new Date().getTime(),
      data: courseInfos
    }
  }

  generateJsonContent(courseInfo: CourseResult) {
    const filePath = path.resolve(__dirname, '../data/course.json')
    let fileContent: Content = {}
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } 
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent
  }
}

const crowller = new Crowller()
