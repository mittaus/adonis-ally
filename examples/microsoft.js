'use strict'

const { ioc } = require('@adonisjs/fold')
const config = require('./setup/config')
const http = require('./setup/http')
const Ally = require('../src/Ally')
ioc.bind('Adonis/Src/Config', () => {
  return config
})

http.get('/microsoft', async function (request, response) {
  const ally = new Ally(request, response)
  const microsoft = ally.driver('microsoft')
  response.writeHead(200, {'content-type': 'text/html'})
  const url = await microsoft.getRedirectUrl()
  response.write(`<a href="${url}">Login With Microsoft</a>`)
  response.end()
})

http.get('/microsoft/authenticated', async function (request, response) {
  const ally = new Ally(request, response)
  const microsoft = ally.driver('microsoft')
  try {
    const user = await microsoft.getUser()
    response.writeHead(200, {'content-type': 'application/json'})
    response.write(JSON.stringify({ original: user.getOriginal(), profile: user.toJSON() }))
  } catch (e) {
    console.log(e)
    response.writeHead(500, {'content-type': 'application/json'})
    response.write(JSON.stringify({ error: e }))
  }
  response.end()
})

http.start().listen(8000)
