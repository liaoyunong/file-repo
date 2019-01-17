import Koa from 'koa'

const app=new Koa()

app.use(async (ctx, next) => {
    console.log('>> 1')
    await next() // 调用下一个middleware
    console.log('<< 1')
})

app.use(async (ctx, next) => {
    console.log('>> 2')
    await next() // 调用下一个middleware
    console.log('<< 2')
})

app.use(async (ctx, next) => {
    console.log('>> 3')
    await next()
    console.log('<< 3')
})

app.listen(3000)