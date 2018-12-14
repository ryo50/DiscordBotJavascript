const webclient = require('request')
const Discord = require('discord.js')
const client = new Discord.Client()
const token = ''

const postOptions = {
  method: 'POST',
  url: 'https://rss2json-225513.appspot.com/rss',
  headers: {
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    rssUrl: 'https://fpsjp.net/feed',
    rssFilter: 'BFV'
  })
}

function doPost(options) {
  return new Promise(function (resolve, reject) {
    webclient(options, function (error, res, body) {
      console.log(`requestUrl => ${options.url}`)
      if (!error) {
        resolve(JSON.parse(body))
      } else {
        reject(error)
      }
    })
  })
}

client.on('ready', () => {
  console.log('ready...')
})

client.on('message', message => {
  console.log('bot get message.')
  if (message.author.bot) {
    return
  }

  const content = message.content

  if (content.match(/bot help/)) {
    replyHelp(message)
    return
  }

  if (content.match(/bot rss/)) {
    doPost(postOptions)
      .then(response => {
        rssReply(message, response)
      })
      .catch(error => {
        console.log('error => ' + error)
      })
    return
  }
})

function replyHelp(message) {
  const helpDocument = `\`\`\`
Usage: bot <command>

where <command> is one of:
rss  :  Get articles of BFV.
\`\`\``
  replyMessage(message, helpDocument)
}

function replyMessage(message, replyText) {
  message
    .reply(replyText)
    .then(message => console.log(`Sent message: ${message}`))
    .catch(console.error)
}

function rssReply(message, rssItems) {
  rssItems.slice(0, 3).forEach(item => {
    message
      .reply(item.url)
      .then(message => console.log(`Sent message: rssItems`))
      .catch(console.error)
  })
}

client.login(token)
