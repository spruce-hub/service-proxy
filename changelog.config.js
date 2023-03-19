'use strict'
const Q = require('q')
const compareFunc = require('compare-func')

const conventionalChangelog = require('conventional-changelog-angular/conventional-changelog')
const parserOpts = require('conventional-changelog-angular/parser-opts')
const recommendedBumpOpts = require('conventional-changelog-angular/conventional-recommended-bump')
const writerOpts = require('conventional-changelog-angular/writer-opts')

function getWriterOpts() {
  return {
    transform: (commit, context) => {
      let discard = true
      const issues = []

      commit.notes.forEach((note) => {
        note.title = 'BREAKING CHANGES'
        discard = false
      })

      if (commit.type === 'feat') {
        commit.type = '✨Features'
      } else if (commit.type === 'fix') {
        commit.type = '🐛Bug Fixes'
      } else if (commit.type === 'refactor') {
        commit.type = '🔨Code Refactoring'
      } else if (commit.type === 'perf') {
        commit.type = '⚡Performance Improvements'
      } else if (commit.type === 'test') {
        commit.type = '✅Tests'
      } else if (commit.type === 'chore') {
        commit.type = '🛠️Chore'
      } else if (commit.type === 'revert' || commit.revert) {
        commit.type = '⏪Reverts'
      } else if (commit.type === 'build') {
        commit.type = '🏗️Build System'
      } else if (commit.type === 'ci') {
        commit.type = '👷Continuous Integration'
      } else if (discard) {
        return
      } else if (commit.type === 'style') {
        commit.type = '🎨Styles'
      } else if (commit.type === 'docs') {
        commit.type = '📝Documentation'
      } else if (commit.type === 'release') {
        commit.type = '🚀Release'
      }

      if (commit.scope === '*') {
        commit.scope = ''
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      if (typeof commit.subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl
        if (url) {
          url = `${url}/issues/`
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue)
            return `[#${issue}](${url}${issue})`
          })
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(
            /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
            (_, username) => {
              if (username.includes('/')) {
                return `@${username}`
              }

              return `[@${username}](${context.host}/${username})`
            }
          )
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter((reference) => {
        if (issues.indexOf(reference.issue) === -1) {
          return true
        }

        return false
      })

      return commit
    },
    groupBy: 'type',
    commitGroupsSort: (a, b) => {
      if (a.title === '✨Features') {
        return -1
      } else if (b.title === '✨Features') {
        return 1
      } else if (a.title === '🐛Bug Fixes') {
        return -1
      } else if (b.title === '🐛Bug Fixes') {
        return 1
      } else if (a.title === '🔨Code Refactoring') {
        return -1
      } else if (b.title === '🔨Code Refactoring') {
        return 1
      } else if (a.title === '✅Tests') {
        return -1
      } else if (b.title === '✅Tests') {
        return 1
      } else if (a.title === '⚡Performance Improvements') {
        return -1
      } else if (b.title === '⚡Performance Improvements') {
        return 1
      } else if (a.title === '⏪Reverts') {
        return -1
      } else if (b.title === '⏪Reverts') {
        return 1
      } else if (a.title === '🛠️Chore') {
        return -1
      } else if (b.title === '🛠️Chore') {
        return 1
      }
    },
    commitsSort: '',
    noteGroupsSort: 'title',
    notesSort: compareFunc,
  }
}

module.exports = Q.all([conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts]).spread(
  (conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
    writerOpts.transform = getWriterOpts().transform
    writerOpts.groupBy = getWriterOpts().groupBy
    writerOpts.commitGroupsSort = getWriterOpts().commitGroupsSort
    writerOpts.commitsSort = getWriterOpts().commitsSort
    writerOpts.noteGroupsSort = getWriterOpts().noteGroupsSort
    writerOpts.notesSort = getWriterOpts().notesSort
    return { conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts }
  }
)
