import Koa from 'koa'

const app = new Koa()

app.use(async ctx => {
    ctx.throw(500)
})

app.listen(3000)