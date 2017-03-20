'use strict'

/*
    The Require module has a version that returns promises.
    I'm using in this way to simply show how to handle promises escaping from the promises hell
*/
const request = require('request')

function getRepos (user) {
  return new Promise((resolve, reject) => {
    const options = {
      'headers': {
        'User-Agent': 'let-me-in' // Declare User-Agent header is required
      },
      'url': `https://api.github.com/users/${user}/repos`
    }

    request(options, (err, res, body) => {
      handleResponse(err, res, body, resolve, reject)
    })
  })
}

function getReposResolve (repos) {
  repos.forEach((element, idx, arr) => {
    getIssues(element.owner.login, element.name)
        .then(res => {
          console.log(`The repository ${element.name} has ${res.length} issues`)
        }).catch(handleError)
  })
}

function getIssues (owner, repo) {
  return new Promise((resolve, reject) => {
    const options = {
      'headers': {
        'User-Agent': 'let-me-in'
      },
      'url': `https://api.github.com/repos/${owner}/${repo}/issues`
    }

    request(options, (err, res, body) => {
      handleResponse(err, res, body, resolve, reject)
    })
  })
}

function handleResponse (err, res, body, resolve, reject) {
  if (err) {
    reject(err)
  } else if (res.statusCode !== 200) {
    reject(new Error(`HTTP Error: ${res.statusCode}`))
  } else {
    resolve(JSON.parse(body))
  }
}

function handleError (err) {
  console.log(err.message)
}

getRepos('RodrigoSampaio')
    .then(getReposResolve)
    .catch(handleError)
