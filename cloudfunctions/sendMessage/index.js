// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  console.log('event', event)

  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      page: `/pages/find-comment/find-comment?findId=${event.findId}`,
      data: event.data,
      templateId: '4CtYNADmGcR12HC4Jim1ay7Gjyoijv9ds525fn5yTD8',
    })
    console.log('result',result)
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
}