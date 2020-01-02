// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database()

const findCollection = db.collection('find')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('findList', async (ctx, next) => {
    const keyword = event.keyword
    let w = {}
    if (keyword.trim() != '') {
      w = {
        content: new db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }
    let findList = await findCollection.where(w).skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get().then((res) => {
        console.log('res',res)
        return res.data
      })
    ctx.body = findList
  })

  app.router('detail', async (ctx, next) => {
    let findId = event.findId
    // 详情查询
    let detail = await findCollection.where({
      _id: findId
    }).get().then((res) => {
      return res.data
    })
    // 评论查询
    const countResult = await findCollection.count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      let tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = db.collection('find-comment').skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT).where({findId}).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      commentList,
      detail,
    }
  })

  return app.serve()
}