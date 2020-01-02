// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init()
const TcbRouter = require('tcb-router')

const db = cloud.database()
const replayPicCollection = db.collection('replayPic')
const contentDataCollection = db.collection('indexContent')


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('replayPicList', async (ctx, next) => {
    const replayPicList = await replayPicCollection.get().then((res) => {
      return res
    })
    ctx.body = replayPicList
  })

  app.router('content', async (ctx, next) => {
    const content = await contentDataCollection.get().then((res) => {
      return res
    })
    ctx.body = content
  })

  return app.serve()
}