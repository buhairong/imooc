import { Router, Request, Response } from 'express';
import Crowller from './crowller';
import DellAnalyzer from './dellAnalyzer';
import fs from 'fs'
import path from 'path'

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  }
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.login : false

  if(isLogin) {
    res.send(`
        <html>
        <body>
          <a href="/getData">spider</a>
          <a href="/showData">show</a>
          <a href="/logout">退出</a>
        </body>
      </html>
    `)
  }else{
    res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password" />
            <button>登录</button>
          </form>
        </body>
      </html>
    `);
  }
});

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send('已经登陆过');
  } else {
    if (password === '123' && req.session) {
      req.session.login = true;
      res.send('登陆成功');
    } else {
      res.send('登陆失败');
    }
  }
});

router.get('/logout', (req: Request, res: Response) => {
  if(req.session) {
    req.session.login = undefined
  }

  res.redirect('/')
});

router.get('/getData', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false

  if (isLogin) {
    const secret = 'secretKey';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.send('getData Success!');
  } else {
    res.send('请先登录')
  }
});

router.get('/showData', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false

  if (isLogin) {
    try {
      const url = path.resolve(__dirname, '../data/course.json')
      const result = fs.readFileSync(url, 'utf-8')
      res.json(JSON.parse(result))
    }catch(e) {
      res.send("尚未爬取到内容")
    }
  } else {
    res.send('请先登录')
  }
});

export default router;
