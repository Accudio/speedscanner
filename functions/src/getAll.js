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

  console.log('request to get all tests')
  const getAll = client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('all_' + process.env.DB_TESTS)),
        { size: 100000 }
      ),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )
  getAll.then((response) => {
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data.map(x => x.data))
    })
  }).catch((reason) => {
    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify(reason)
    })
  })
}
