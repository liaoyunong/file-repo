import Koa from 'koa'
import mongoose from 'mongoose'
const app = new Koa()

const db = 'mongodb://172.16.121.236:27017/test'

mongoose.connect(db, { useNewUrlParser: true }, err => {
    if (err) {
        console.error('Failed to connect to database')
    } else {
        console.log('Connecting database successfully')
        const UserSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
        })
        const UserModel = mongoose.model('User', UserSchema)
        const user = new UserModel({
            name: 'hello world',
            password: '12345'
        })
        user.save((err, doc) => {
            console.log(doc)
        })
    }
})

app.listen(3000)