module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    {
      value: 'refactor',
      name: 'refactor: A code change that neither fixes a bug nor adds a feature',
    },
    { value: 'perf', name: 'perf:     A code change that improves performance' },
    { value: 'test', name: 'test:     Adding missing tests' },
    {
      value: 'style',
      name: 'style:    Changes that do not affect the meaning of the code',
    },
    {
      value: 'chore',
      name: 'chore:    Changes to the build process or auxiliary tools',
    },
    { value: 'release', name: 'release:  Release version' },
    { value: 'build', name: 'build:    Changes project build' },
    { value: 'ci', name: 'ci:       Change CI' },
    { value: 'revert', name: 'revert:   Revert to a commit' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
  ],

  /** 提交消息
   * -------------------------- */
  messages: {
    type: "Select the type of change that you're committing:",
    scope: 'Denote the SCOPE of this change (optional):',
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional):\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  subjectLimit: 100,
  // typePrefix: '[',
  // typeSuffix: ']',
  // subjectSeparator: '：',

  scopes: [
    { name: 'package' },
    { name: 'eslint' },
    { name: 'cz' },
    { name: 'hook' },
    { name: 'script' },
    { name: 'other' },
  ],

  // scopeOverrides: {
  //   fix: [
  //     {name: 'merge'},
  //     {name: 'style'},
  //     {name: 'e2eTest'},
  //     {name: 'unitTest'}
  //   ]
  // },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'refactor'],
  // skipQuestions: ['body', 'footer'],
  appendBranchNameToCommitMessage: true,
  allowTicketNumber: false,
  ticketNumberPrefix: 'TICKET-',
  isTicketNumberRequired: false,
  ticketNumberRegExp: '\\d{1,5}',
  breaklineChar: '|',
  // breakPrefix: 'BREAKING CHANGE:',
  // footerPrefix : 'ISSUES CLOSED:',
  // askForBreakingChangeFirst : true,
}
