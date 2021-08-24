# Contributing

Thanks for considering contributing and making our planet easier to explore!

We're excited you would like to contribute to Earthdata Pub! Whether you're
finding bugs, adding new features, fixing anything broken, or improving documentation,
get started by submitting an issue or pull request!

## Submitting an Issue

If you have any questions or ideas, or notice any problems or bugs, first
[search open issues](https://wiki.earthdata.nasa.gov/display/EDPUB/Earthdata+Pub:+Report+a+Bug)
to see if the issue has already been submitted. We may already be working on the
issue. If you think your issue is new, you're welcome to [create a new issue](https://wiki.earthdata.nasa.gov/display/EDPUB/Earthdata+Pub:+Report+a+Bug).

## Pull Requests

If you want to submit your own contributions, follow these steps:

* Fork the Earthdata Pub Dashboard repo
* Create a new branch from the branch you'd like to contribute to
* If an issue doesn't already exist, submit one (see above)
* [Create a pull request](https://git.earthdata.nasa.gov/projects/EDPUB/repos/dashboard/pull-requests)
from your fork into the target branch of the nasa/earthdatapub-dashboard repo
* Be sure to [mention the corresponding issue number](https://help.github.com/articles/closing-issues-using-keywords/)
in the PR description, i.e. "Fixes Issue #10"
* If your contribution requires a specific version of the Earthdata Pub API, bump
(or add) the version in `app/src/js/config/index.js`.
  * If you don't know the Earthdata Pub API version (because it hasn't been
  released), create a one-line PR with the following attributes:
    * Title: Version bump for next Earthdata Pub API release
    * In the body, write a quick explanation and link to the unreleased Earthdata
    Pub Core PR
    * Set `'change-me-next-api-release'` as the value for the `minCompatibleApiVersion`
    config value.
* Upon submission of a pull request, the Earthdata Pub development team will
review the code
* The submission will then either be merged, declined, or an adjustment to the code
will be requested

### Template

Use the following template for Pull Request descriptions:

- _(Replace text in brackets `[]`.)_
- _(Italicized text in `_()_` is for your info and should be deleted.)_

```markdown
# Description

[add description of work done here]

## Spec

Designs: [link to design if applicable; delete if not]

See Ticket: [link to ticket if applicable; delete if not]

---

## Validation

1. Make sure all merge request checks have passed (CI/CD).
1. Pull related branches locally.
1. Navigate to... [continue instructions]

_(For an example of good validation instructions, check out [Bryan's Bouncy Ball PR](https://github.com/sparkbox/bouncy-ball/pull/56#issue-192153701).)_

---

## Change Log

_(copy/paste-able change log notes. check the box when the change is also in CHANGELOG.md)_

* [Add _____](link to commitid)
* [Fix _____](link to commitid)
```

## Guidelines

We ask that you follow these guidelines with your contributions:

### Tests

All of the automated tests for this project need to pass before your submission
will be accepted. See the README for instructions on how to run tests and verify
that the tests pass. If you add new functionality, please consider adding tests
for that functionality as well.

### Commits

* Make small commits that show the individual changes you are making
* Write descriptive commit messages that explain your changes

Example of a good commit message:

```text
Improve contributing guidelines. Fixes #10

Improve contributing docs and consolidate them in the standard location https://help.github.com/articles/setting-guidelines-for-repository-contributors/
```

### Earthdata Pub governance

For more information on Earthdata Pub governance see the
[Earthdata Pub Code Contribution Guidelines](https://docs.google.com/document/d/1PfyONpRX3_lk2VqOF_yXQ-LKlPGFbJwfXOtuQWdc2BI/edit)
and the [Earthdata Pub Wiki](https://wiki.earthdata.nasa.gov/display/EDPUB/Earthdata+Pub+Home)
