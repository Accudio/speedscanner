# Speed Scanner

> :warning: Due to changes to the [WebPageTest API](https://blog.webpagetest.org/posts/the-webpagetest-api-has-gone-public/), Speed Scanner no longer has a place in continuous frontend synthetic testing. This project has been archived, please more to an alternative solution.

Unfortunately due to the new pricing of the WebPageTest API, Speed Scanner no longer is a good option for front-end performance monitoring. Although it will still work with the WPT API, the cost of that API means you should probably be looking at using an alternative, more polished service like those listed below.

In future I hope to see whether there is any way that a project like Speed Scanner can exist, and if so perhaps work on Speed Scanner 2. For the moment however, I will be retiring my Speed Scanner instances or replacing them with Speedlify as listed below.

## Alternatives to Speed Scanner

- [Speedlify](https://www.speedlify.dev) — Open-source performance monitoring tool that can be run and deployed on hosts like Netlify, Vercel and Github Pages. Can be free depending on usage.
- [Calibre](https://calibreapp.com/) — Synthetic monitoring that is really polished and at a reasonable price. They have a fantastic performance-realted newsletter and really seem to know what they're doing.
- [SpeedCurve](https://speedcurve.com/) — Synthetic and RUM monitoring, a bit more expensive than Calibre but also very well-regarded.

---
## Previous readme for posterity

Set of functions and frontend for automating and visualising [WebPageTest](https://www.webpagetest.org/) data.

Synthetic web page testing testing tools like [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) and WebPageTest can provide incredibly useful insight into the performance of websites for any web developer. Despite a huge number of backend performance monitoring tools, there are few frontend performance monitoring tools. Among several others, [SpeedCurve](https://speedcurve.com/) and [Calibre](https://calibreapp.com/) provide this service but can prove to be expensive and over-complicated.

Until recently, [SpeedTracker](https://speedtracker.org/) offered a free open-source alternative, however from late-2019 it seems to no longer function and is no longer maintained. Speed Scanner is heavily inspired by SpeedTracker but relies on free [serverless](https://serverless.css-tricks.com/) functions rather than a central server in order to be totally disconnected and within complete control of developers.

Whatever your need, SpeedScanner can help you easily monitor the performance of websites for free.

[Demo](https://demo.speedscanner.org/)

### Specifications

- [WebPageTest](https://www.webpagetest.org/) — running tests
- [Netlify Functions](https://www.netlify.com/) — triggering, getting and setting of test data
- [FaunaDB](https://fauna.com/) — Free tier for noSQL databases
- [Nuxt](https://nuxtjs.org/) — frontend SPA interface
- Cron solution like [Zapier](https://zapier.com/home) or [IFTTT](https://ifttt.com/) or a machine with a cron job to regularly trigger tests

### Requirements

You will need the following **free** services to use Speed Scanner. Alternatives are available, but they will likely require changes to functions.

- WebPageTest API key, [request one here](https://www.webpagetest.org/getkey.php)
- Netlify account
- FaunaDB account
- IFTTT account

### Installation

#### I. FaunaDB Database

1. Create database, no particular name necessary.
2. Create an API key from "Security" with "Server" role.
3. Make a note of the Key Secret, we will use this later and you can only see it once.
4. Create two collections. One will contain page configuration, the other your tests. For example 'site_tests' and 'site_pages'.
5. For each collection, add a new index. These should be named as the collections but with `unique_` prefixed and `_id` suffixed. eg, `unique_site_pages_id`. Set Terms to `id` and check "Unique".
6. Now we create our configuration documents in our page configuration collection. For each page you want to test, create a document in your pages collection with the following format (excluding comments):
```
{
  "id": "home", // unique identifier for each page
  "title": "Home Page", // title for page used in frontend
  "url": "https://speedscanner.org", // full URL to test
  "freq": 4, // number of hours to leave between each test
  "options": {
    // custom configuration for WebPageTest.
    // for config parameters, see npmjs.com/package/webpagetest
    // if not specified, default parameters will be used
  }
}
```

#### II. Functions and Interface

1. Fork this repository into your own GitHub account or organisation.
2. In Netlify, create a New Site from Git.
3. Select the forked repository
4. Click "Show advanced" button above the Deploy site button.
5. Set five Environment Variables:
```
DB_PAGES      name of fauna config/pages collection. eg, site_pages
DB_TESTS      name of faunca test collection. eg, site_tests
FAUNA_SECRET  secret key you created for your fauna database
WPT_KEY       API key you obtained from WebPageTest
FORCE_KEY     custom secret string, recommended randomised 30-50char
```
(keep the force key secret, this allows you to manually trigger tests regardless of the cofngured frequency)

6. Click deploy
7. By default a random URL is created, you can customise this in Settings.
8. Once deployed, trigger the first tests by navigating to yourdomain.netlify.com/.netlify/functions/trigger

#### III. 'Cron' job

This simply needs to be an hourly GET request to yourdomain.netlify.com/.netlify/functions/trigger. To keep with serverless metholody you could use IFTTT or Zapier among others, or you could set up a cron job with curl/wget. The demo above uses an IFTTT applet with a trigger of "Time" and task of "Webhook", that fires a GET requst to the configured address every hour.

If a test is due to run it will be triggered, otherwise it will return with 200 with a message including the next allowed run time.

#### IV. Customisation (optional)

1. Install dependencies with `npm install`
2. Install netlify dev cli with ```npm install netlify-cli -g```
3. Run with ```netlify dev```

### Changelog

- v1.0.0  - Initial stable release with flattened history

### Credits

Speed Scanner has been developed by the following contributors:

- Alistair Shepherd — [alistairshepherd.uk](https://alistairshepherd.uk)

If you would like to support this project then please consider contributing if you can. Alternatively, spread the word about Speed Scanner and the importance of frontend performance!

### License

This project is licensed under the MPLv2.0 license.

The full license is included at LICENSE.md, or at [mozilla.org/en-US/MPL/2.0/](https://www.mozilla.org/en-US/MPL/2.0/)
