import Koa from 'koa'
import mongoose from 'mongoose'

const app = new Koa()

const db = 'mongodb://172.16.121.236:27017/test'

mongoose.connect(db, { useNewUrlParser: true }, err => {
    if (err) {
        console.error('Failed to connect to database');
    } else {
        console.log('Connecting database successfully');
    }
});

app.listen(3000)