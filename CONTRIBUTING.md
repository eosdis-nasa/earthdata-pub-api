# Contributing

Thanks for considering contributing and making our planet easier to explore!

We're excited you would like to contribute to Earthdata Pub (EDPub)! Whether you're
finding bugs, adding new features, fixing anything broken, or improving documentation,
get started by submitting an issue or pull request!

Here are some important resources:

- wiki: [EDPub Wiki](https://wiki.earthdata.nasa.gov/display/EDPUB)
- bugs: [New Issue](https://bugs.earthdata.nasa.gov/secure/RapidBoard.jspa?rapidView=911&projectKey=EDPUB&view=planning.nodetail&issueLimit=100)
- comms: [#earthdatapub EOSDIS Slack Channel](https://eosdis.slack.com/archives/CBPQF3Y5T)

## Governance

For more information on Earthdata Pub governance see the
[Earthdata Pub Code Contribution Guidelines](https://wiki.earthdata.nasa.gov/display/EDPUB/Governance)
and the [Earthdata Pub Wiki](https://wiki.earthdata.nasa.gov/display/EDPUB/Earthdata+Pub+Home)

## Submitting an Issue

If you have any questions or ideas, or notice any problems or bugs, first
[search open issues](https://bugs.earthdata.nasa.gov/issues/?jql=project%20%3D%20EDPUB)
to see if the issue has already been submitted. We may already be working on the
issue. If you think your issue is new, you're welcome to create a new issue in
the [EDPub Project](https://bugs.earthdata.nasa.gov/projects/EDPUB/issues).

## Coding standards

See individual EDPub repos for specific coding standards.

General coding standards are:

1. document as you go
2. make your code readable
3. think about security from the start
4. use a standard style guide (such as [PEP 8](https://www.python.org/dev/peps/pep-0008/))
5. use a linter (such as [pylint](https://www.pylint.org/))
6. use .gitignore to exclude files that should not be in a repo (see this repo's
[.gitignore](./.gitignore))

An IDE, such as [VS Code](https://code.visualstudio.com/), helps to create and
maintain beautiful code.

## Testing

All of the automated tests for this project need to pass before your submission
will be accepted. See the README for instructions on how to run tests and verify
that the tests pass. If you add new functionality, please consider adding tests
for that functionality as well.

## Submitting changes

If you want to submit your own contributions, follow these steps:

- Fork the EDPub repo
- Create a new branch from the branch you'd like to contribute to
- If an issue doesn't already exist, submit one (see above)
- [Create a pull request](https://github.com/eosdis-nasa/earthdata-pub-api/pulls)
from your fork into the target branch of the earthdata-pub-api repo
- Be sure to [mention the corresponding issue number](https://help.github.com/articles/closing-issues-using-keywords/)
in the PR description, i.e. "Fixes Issue #10"
- Upon submission of a pull request, the EDPub development team will
review the code
- The request will then either be merged, declined, or an adjustment to the code
will be requested

### Git flow

EDPub will follow the [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow).
When possible, feature branches should be tied directly to a Jira ticket.

### Commit messages

Always write a clear log message for your commits. One-line messages are fine for
small changes, but bigger changes should look like this:

```bash
$ git commit -m "A brief summary of the commit
>
> A paragraph describing what changed and its impact."
```

### Change log

All features should be added to the [CHANGELOG.md](CHANGELOG.md). The changes can
be also used for release notes.

From [https://keepachangelog.com/en/1.0.0/](https://keepachangelog.com/en/1.0.0/):

> What is a changelog?
>
> A changelog is a file which contains a curated, chronologically ordered list of
notable changes for each version of a project.
>
> Why keep a changelog?
>
> To make it easier for users and contributors to see precisely what notable changes
have been made between each release (or version) of the project.
>
> Who needs a changelog?
>
> People do. Whether consumers or developers, the end users of software are human
beings who care about what's in the software. When the software changes, people want
to know why and how.

### Version numbers

EDPub adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
Version numbers for code will be used to identify changes to the code base. The format
of that number should be `1.1.1` where the numbers mean `major.minor.fix`.

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> 1. MAJOR version when you make incompatible [application] changes,
> 1. MINOR version when you add functionality in a backwards compatible manner, and
> 1. PATCH version when you make backwards compatible bug fixes.

See the [CHANGELOG.md](CHANGELOG.md) for examples.

### Pull Requests

Please make a new Pull Request with a clear list of what you've done (read more
about [pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)).
Merge requests will be assigned to an EDPub developer for a code review. Follow our coding standards (above). Make all of your commits atomic
(one feature per commit).

#### Template

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
2. Pull related branches locally.
3. Navigate to... [continue instructions]

_(For an example of good validation instructions, check out
[Bryan's Bouncy Ball PR](https://github.com/sparkbox/bouncy-ball/pull/56#issue-192153701).)_

---

## Change Log

_(copy/paste-able change log notes. check the box when the change is also in CHANGELOG.md)_

* [Add _____](link to commitid)
* [Fix _____](link to commitid)
```

## Github settings

All github settings should be the same across all EDPub repositories. Developers will have an easier time working across repos if the behavior is consistent.

## Terminology

1. Core repo - The core EDPub repo will be a quick start to the entire
   EDPub framework. All other repos will follow include versions of the high level
   *.md files from there, e.g. CONTRIBUTING.md. The core repo is <https://github.com/eosdis-nasa/earthdata-pub>
1. Repositories - EDPub repositories shall be named `earthdata-pub-thing`,
   for example: `earthdata-pub-forms`, `earthdata-pub-api`.
1. Modules - EDPub core modules will be named "EDPub Thing" where "Thing" is
   always capitalized and one word. The name should be descriptive. Examples are
   "EDPub Forms", "EDPub API", "EDPub Dashboard", "EDPub Workflows". It is acceptable
   to use Thing as a name by itself when the context is obvious. So, Dashboard as
   a label inside an EDPub diagram makes sense.
1. Abbreviation - We will use the abbreviation "EDPub" to shorten EDPub, however
   this abbreviation will appear in all caps in the Wiki, JIRA, and ECC repository
   space, which is <https://wiki.earthdata.nasa.gov/display/EDPUB>
