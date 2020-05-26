const WebPageTest = require('webpagetest')
const fauna = require('faunadb')
const q = fauna.query

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

exports.handler = (event, context, callback) => {
  const wpt = new WebPageTest('www.webpagetest.org')
  const testId = event.queryStringParameters.id

  const client = new fauna.Client({
    secret: process.env.FAUNA_SECRET
  })

  console.log('pingback request for id ' + testId)

  wpt.getTestResults(testId, (err, response) => {
    if (err) {
      console.log('error:')
      console.log(err, response)
      return error(callback, 'Internal server error')
    }

    const statusCode = response.statusCode

    if (statusCode === 100) {
      console.log('Test not yet completed')
      return error(callback, 'Test not yet completed', 100)
    }

    if (statusCode === 200) {
      console.log('successfully fetched')

      const result = response.data
      const testResult = response.data.median.firstView

      // base info
      const data = {
        id: result.id,
        status: 'completed',
        wptStatus: response.statusText,
        url: result.url,
        results: result.summary,
        location: result.location,
        connectivity: result.connectivity,
        testRuns: result.testRuns,
        completed: result.completed
      }

      // load times
      data.load = {
        ttfb: testResult.TTFB,
        document: testResult.docTime,
        full: testResult.fullyLoaded
      }

      // render times
      data.render = {
        start: testResult.render,
        speedIndex: testResult.SpeedIndex,
        visual: testResult.visualComplete90
      }

      // lighthouse
      data.lighthouse = {
        accessibility: testResult['lighthouse.Accessibility'],
        bestPractices: testResult['lighthouse.BestPractices'],
        performance: testResult['lighthouse.Performance'],
        pwa: testResult['lighthouse.ProgressiveWebApp'],
        seo: testResult['lighthouse.SEO']
      }

      // content breakdown
      data.content = {
        html: {
          bytes: testResult.breakdown.html.bytes,
          requests: testResult.breakdown.html.requests
        },
        css: {
          bytes: testResult.breakdown.css.bytes,
          requests: testResult.breakdown.css.requests
        },
        js: {
          bytes: testResult.breakdown.js.bytes,
          requests: testResult.breakdown.js.requests
        },
        image: {
          bytes: testResult.breakdown.image.bytes,
          requests: testResult.breakdown.image.requests
        },
        font: {
          bytes: testResult.breakdown.font.bytes,
          requests: testResult.breakdown.font.requests
        },
        other: {
          bytes: testResult.breakdown.video.bytes + testResult.breakdown.other.bytes + testResult.breakdown.flash.bytes,
          requests: testResult.breakdown.video.requests + testResult.breakdown.other.requests + testResult.breakdown.flash.requests
        }
      }

      // images
      data.waterfall = testResult.images.waterfall
      data.filmstrip = testResult.videoFrames

      // get existing ref, if exists
      const getRef = client.query(
        q.Get(q.Match(q.Index('unique_' + process.env.DB_TESTS + '_id'), data.id))
      )
      getRef.then((response) => {
        const ref = response.ref

        // add test to FaunaDB
        const dbData = JSON.parse(JSON.stringify(data))
        const completedISO = new Date(dbData.completed * 1000).toISOString()
        dbData.completed = q.Time(completedISO)
        const addTest = client.query(
          q.Update(
            ref, {
              data: dbData
            }
          )
        )
        addTest.then((response) => {
          console.log('updated test in database')
          callback(null, {
            statusCode,
            headers,
            body: JSON.stringify({ ...response.data, ...data })
          })
        }).catch((reason) => {
          console.log('error: failed to update test in database')
          console.log(reason)
          error(callback, reason)
        })
      }).catch((reason) => {
        console.log('error: failed to get existing ref')
        console.log(reason)
        error(callback, reason)
      })
    } else {
      console.log('error: failed to request test details')
      console.log(response)
      error(callback, response)
    }
  })
}

function error(callback, data, statusCode = 400) {
  callback(null, {
    statusCode,
    headers,
    body: JSON.stringify(data)
  })
}
