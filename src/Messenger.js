import request from 'request'

export default class Messenger {
  constructor(access_token) {
    if (access_token == null) {
      throw new Error('Invalid access token')
    }
    this.access_token = access_token
  }
  send(recipientId, messageText, callback) {
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: this.access_token
      },
      method: 'POST',
      json: {
        recipient: {
          id: recipientId
        },
        message: {
          text: messageText
        }
      }
    }, function(error, response, body) {
      if (callback)
        callback(error || response.body.error)
    });
  }
}
