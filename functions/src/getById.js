const fauna = require('faunadb')
const q = fauna.query

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

exports.handler = (event, context, callback) => {
  const client = new fauna.Client({
    secret: process.env.FAUNA_SECRET
  })

  const testId = event.queryStringParameters.id

  console.log('request to get test with id ' + testId)

  const getAll = client.query(
    q.Get(
      q.Match(q.Index('unique_' + process.env.DB_TESTS + '_id'), testId)
    )
  )
  getAll.then((response) => {
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    })
  }).catch((reason) => {
    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify(reason)
    })
  })
}
