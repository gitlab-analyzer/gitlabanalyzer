<br />
<p align="center">
  <a href="./client/public/logogitlab.png">
    <img width="60%" src="./client/public/logogitlab.png" alt="gitlabanalyzer logo">
  </a>
  <p align="center">
<!--     <a href="https://github.com/quarterblue/bloomy/actions/workflows/rust.yml" target="_blank">
        <img src="https://github.com/quarterblue/bloomy/actions/workflows/rust.yml/badge.svg" alt="GitHub Passing">
    </a> -->
    <a href="https://github.com/gitlab-analyzer/gitlabanalyzer/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" alt="License">
    </a>   
     <a href="https://github.com/gitlab-analyzer/gitlabanalyzer/graphs/contributors" target="_blank">
        <img src="https://img.shields.io/github/contributors/gitlab-analyzer/gitlabanalyzer" alt="Contributers">
    </a>   
    <a href="https://github.com/gitlab-analyzer/gitlabanalyzer/graphs/commit-activity" target="_blank">
        <img src="https://img.shields.io/github/last-commit/gitlab-analyzer/gitlabanalyzer" alt="Last Commit">
    </a>
    <a href="https://github.com/gitlab-analyzer/gitlabanalyzer/issues" target="_blank">
        <img src="https://img.shields.io/github/issues/gitlab-analyzer/gitlabanalyzer" alt="Issues">
    </a>
</p>
  <h3 align="center">A web application for analyzing <a href="https://gitlab.com/gitlab-org/gitlab" target="_blank">GitLab</a> repositories.</h3>

  <p align="center">
    Built for Simon Fraser University course CMPT 373.
    <br />
    <a href="https://github.com/gitlab-analyzer/gitlabanalyzer/blob/master/server/API_example_response.md#api-example-response"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/gitlab-analyzer/gitlabanalyzer#demo-iteration-3">View Demo</a>
    ·
    <a href="https://github.com/gitlab-analyzer/gitlabanalyzer/issues">Report Bug</a>
    ·
    <a href="https://github.com/gitlab-analyzer/gitlabanalyzer/issues">Request Feature</a>
  </p>
</p>

## ⚡️ Quick start

First of all, [download](https://nodejs.org/en/) and install **Node.js**. Version `14.7.0 LTS` or higher is recommended.

Then, [download](https://www.python.org/downloads/) and install **Python 3**. Version `3.6` or higher is recommended.

**Clone directory:**
```bash
$ git clone git@github.com:gitlab-analyzer/gitlabanalyzer.git
```

**Frontend:**
```bash
# Change directory:
$ cd gitlabanalyzer/client/

# Installation:
$ npm install

# Start client server:
$ npm start
```

**Backend:**
```bash
# Change directory:
$ cd gitlabanalyzer/server/

# Installation:
$ pip3 install

# Start backend server:
$ python3 app.py
```

Then navigate to **[http://localhost:6789/](http://localhost:6789/)** on your browser.


## 🐳 Docker-way to quick start

Make sure you have [installed docker and docker-compose](https://docs.docker.com/compose/install/) on your computer

**Clone directory:**
```bash
$ git clone git@github.com:gitlab-analyzer/gitlabanalyzer.git
```

**Run:**
```bash
# Change directory:
$ cd gitlabanalyzer/

# Run:
$ ./start.sh  

# Or if you need sudo previleges:
$ sudo bash ./start.sh
```

Then navigate to **[http://localhost:6789/](http://localhost:6789/)** on your browser.

You might need to wait a couple minutes for everything in docker to be loaded.


## Demo (Iteration 3)

👉 Try it <a href="http://142.58.22.167:6789/">here</a>.
<br>

<h1 align="center">
  <img src="./client/public/iter3.png" width="900">
</h1>

## Features

Iteration 1:
- [x] Token based authentication
- [x] Repository listings
- [x] Float bar
- [x] Overview page
- [x] MR & Commits page
- [ ] Issues & Reviews
- [ ] Config

Iteration 2:
- [x] Score Calculation 💯
- [x] Merge Requests & Commit Ignoring
- [x] Refactored Overview graphs
- [x] Issues & Reviews
- [x] Initial Config & App Config
- [x] Search Repo
- [x] <a href="./server/API_example_response.md#api-example-response " target="_blank">REST API v2 Finished!</a> 🚀
- [x] Batch Processing (UI Only)
- [ ] Code Diff Page
- [ ] Export Reports

**Iteration 3:**
- [x] Issues & Reviews
- [x] Config
- [x] Batch Processing
- [x] <a href="./server/API_example_response.md#api-example-response " target="_blank">REST API v3 Finished!</a> 🚀
- [x] Code Diff Page

## Directory Structure
- server (Where the backend code is stored, python flask is used as the backend server)
  - interface (Contains all the interface files)
  - manager (Contains all the manager files)
  - model (Contains our data class for commits, mergre requests etc.)
  - test (Contains all the test and unittest files)
  - app.py (Main server file)
  - API_example_response (Stores all the API routes and their example response body)
- client (Where the front-end client code is stored, reactjs is used)
  - public
  - src
    - components
    - context
    - pages
    - public
    - various files
- various docker files for building and deploying

## Links
- [GitLab Test Server](https://cmpt373-1211-12.cmpt.sfu.ca/)
- [GitLab Analyzer](http://142.58.22.167:6789/)

## Credits
This software uses the following open source packages:

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Flask](https://flask.palletsprojects.com/en/1.1.x/)

## License

<a href="https://www.gnu.org/licenses/agpl-3.0.en.html" target="_blank">AGPL v3.0</a>

