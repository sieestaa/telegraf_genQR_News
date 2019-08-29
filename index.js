const scanner = require('./helpers/parser.js');
const generator = require('./helpers/generator.js')
const Telegraf = require('telegraf');
const {Extra, Markup} = Telegraf;
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { enter, leave } = Stage
const bot = new Telegraf('761035519:AAH2BxmvQAhmPLmSfd039SEBUsgtbx0w0p8')

const stage = new Stage()
bot.use(session())
bot.use(stage.middleware())


/*                                    scenes                                   */
const news = new Scene('news')
stage.register(news)
const generate = new Scene('generate')
stage.register(generate)
/*                                                                             */


bot.start((ctx) => {
  starter(ctx)
})

bot.action('getnews', (ctx) => {
  ctx.scene.enter('news')
})

/*                                    news                                   */
news.enter((ctx) => {
  ctx.replyWithChatAction('typing')
  scanner.getYandexNews().
    then((res)=>{
      let news = res.map((v) => '🧾 ' + v)
      ctx.editMessageText(news.join('\n'), backButton())
    })  
})

news.action('start', (ctx) => {
  starter(ctx)
  ctx.scene.leave('news')
})

/*                                    generateqr                                   */
bot.action('generateqr', (ctx) => {
  ctx.scene.enter('generate')
})

generate.enter(async (ctx) => {
  ctx.editMessageText('I`m ready. Send me text!', backButton())
})

generate.action('start', (ctx) => {
  starter(ctx)
  ctx.scene.leave('generate')
})

generate.on('text', async (ctx) => {
  ctx.replyWithChatAction('upload_photo')
  let response = await generator.genQR(ctx.message.text)
  await ctx.replyWithPhoto(response, { caption: 'Your QR was generated!' })
  ctx.reply('You can send me another text or tap "⬅️ Back"', backButton())
})

bot.launch()

// ____________________

async function starter(ctx) {
  try{
    await ctx.editMessageText('Hello man!', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('🖊 Generate QR Code', 'generateqr'),
      m.callbackButton('🧾 Get news', 'getnews')
    ])))
  }catch(e){
    await ctx.reply('Hello man!', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('🖊 Generate QR Code', 'generateqr'),
      m.callbackButton('🧾 Get news', 'getnews')
    ], { columns: 1 })))
  } 
}

function makeDate () {
  const today = new Date()
  const yyyy = today.getFullYear()
  let mm = today.getMonth() + 1
  let dd = today.getDate()

  dd < 10 ? dd = '0' + dd : false
  mm < 10 ? mm = '0' + mm : false
  return `${mm}/${dd}/${yyyy}`
}

function backButton(){
  return Extra.markup((m) =>  
      m.inlineKeyboard([
        m.callbackButton('⬅️ Back', 'start'),
      ])
    ); 
}