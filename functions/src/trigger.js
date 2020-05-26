const WebPageTest = require('webpagetest')
const fauna = require('faunadb')
const dayjs = require('dayjs')
const q = fauna.query

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

const wptOptions = {
  key: process.env.WPT_KEY,
  pingback: process.env.URL + '/.netlify/functions/pingback',
  firstViewOnly: true,
  runs: 3,
  private: true,
  video: true,
  location: 'London_EC2',
  lighthouse: true,
  connectivity: 'Cable'
}

exports.handler = (event, context, callback) => {
  const wpt = new WebPageTest('www.webpagetest.org')

  const client = new fauna.Client({
    secret: process.env.FAUNA_SECRET
  })

  if (typeof event.queryStringParameters.force !== 'undefined' && event.queryStringParameters.force !== process.env.FORCE_KEY) {
    return error(callback, { reason: 'Force key not valid' }, 403)
  }
  const force = typeof event.queryStringParameters.force !== 'undefined' && event.queryStringParameters.force === process.env.FORCE_KEY

  let configQuery
  const pageId = event.queryStringParameters.id
  if (pageId) {
    configQuery = q.Match(q.Index('unique_' + process.env.DB_PAGES + '_id'), pageId)
  } else {
    configQuery = q.Match(q.Index('all_' + process.env.DB_PAGES))
  }
  const getConfig = client.query(
    q.Map(
      q.Paginate(
        configQuery,
        { size: 100 }
      ),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )

  console.log('getting config')
  getConfig.then((response) => {
    console.log('got config')

    runAllTests(client, wpt, force, response.data).then((response) => {
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      })
    }).catch((reason) => {
      return error(callback, reason)
    })
  }).catch((reason) => {
    return error(callback, reason)
  })
}

function runAllTests(client, wpt, force, config) {
  const pages = []
  config.forEach((page) => {
    pages.push(runTest(client, wpt, force, page))
  })

  console.log(pages)
  return Promise.all(pages)
}

function runTest(client, wpt, force, page) {
  return new Promise((resolve, reject) => {
    const siteRef = page.ref.value.id
    page = page.data

    const url = page.url
    const pageId = page.id

    if (!force && page.lastRun) {
      const freq = page.freq
      const nextRun = dayjs(page.lastRun.value).add(freq, 'hour').subtract(10, 'minute')

      if (dayjs().isBefore(nextRun)) {
        return resolve({ pageId, status: 'fail', statusCode: 403, reason: 'Tests can be run every ' + freq + ' hour(s). Please wait until ' + nextRun.format() + ' before trying again.' })
      }
    }

    const options = { ...wptOptions, ...page.options }

    console.log('triggering test for ' + pageId + ' with options:')
    console.log(options)

    wpt.runTest(url, options, (err, result) => {
      if (err) {
        console.log('failed to trigger test for ' + pageId)
        console.log(err, result)
        return resolve({ pageId, status: 'fail', statusCode: 500, reason: 'Failed to trigger test', content: err })
      }

      const statusCode = result.statusCode
      if (statusCode !== 200) {
        console.log('error: failed to trigger test for ' + pageId)
        console.log(err, result)
        return resolve({ pageId, status: 'fail', statusCode: 500, reason: 'Failed to trigger test', content: result })
      }

      const addTest = client.query(
        q.Create(q.Collection(process.env.DB_TESTS), {
          data: {
            id: result.data.testId,
            page: pageId,
            status: 'pending',
            started: q.Now(),
            urls: {
              json: result.data.jsonUrl,
              user: result.data.userUrl
            }
          }
        })
      )

      addTest.then((response) => {
        console.log('added pending test to database ' + pageId)

        if (force) {
          return resolve({ pageId, status: 'success', statusCode: 200, result })
        }

        const updateConfig = client.query(
          q.Update(
            q.Ref(q.Collection(process.env.DB_PAGES), siteRef),
            {
              data: {
                lastRun: q.Now()
              }
            }
          )
        )
        updateConfig.then((response) => {
          console.log('updated site lastRun for ' + pageId)
          return resolve({ pageId, status: 'success', statusCode: 200, result })
        }).catch((reason) => {
          console.log('error updating site lastRun for ' + pageId)
          console.log(reason)
          return resolve({ pageId, status: 'fail', reason: 'error updating site lastRun', statusCode: 500, content: reason })
        })
      }).catch((reason) => {
        console.log('error adding pending test to database for ' + pageId)
        console.log(reason)
        return resolve({ pageId, status: 'fail', reason: 'error adding pending test to database', statusCode: 500, content: reason })
      })
    })
  })
}

function error(callback, data, statusCode = 400) {
  callback(null, {
    statusCode,
    headers,
    body: JSON.stringify(data)
  })
}
