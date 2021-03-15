# Makemake GitLab Analyzer

<div align="center">
  <img src="https://csil-git1.cs.surrey.sfu.ca/373-2021-1-Makemake/gitlabanalyzer/-/raw/master/client/public/logogitlab.png" alt="makemake" width="600">
</div>

<h4 align="center">A web application for analyzing <a href="https://gitlab.com/gitlab-org/gitlab" target="_blank">GitLab</a> repositories. Built for Simon Fraser University course CMPT 373.</h4>

## Demo (Iteration 1)
👉 Watch it <a href="https://drive.google.com/file/d/18iEGWiYWicCjd1soPNFKauMuo1m2qhgz/view">here</a>.

👉 Try it <a href="http://142.58.22.167:6789/">here</a>.
<br>

<h1 align="center">
  <img src="https://csil-git1.cs.surrey.sfu.ca/373-2021-1-Makemake/gitlabanalyzer/-/raw/master/client/public/iteration2ss.png" width="900">
</h1>


## Deploy our web app on your local machine
- Make sure you have [installed docker and docker-compose](https://docs.docker.com/compose/install/) on your computer
- Clone or download the repo on your local computer
- `cd` into the repo folder
- run `./start.sh` or `sudo bash ./start.sh` if you need sudo privileges to run **docker-compose**
- paste **http://localhost:6789/** into your web browser and explore our GitLab Analyzer!
	- You might need to wait a couple minutes for everything in docker to be loaded

## Features

Iteration 1:
- [x] Token based authentication
- [x] Repository listings
- [x] Float bar
- [x] Overview page
- [x] MR & Commits page
- [ ] Issues & Reviews
- [ ] Config

**Iteration 2:**
- [x] Score Calculation 💯
- [x] Merge Requests & Commit Ignoring
- [x] Refactored Overview graphs
- [x] Issues & Reviews
- [x] Initial Config & App Config
- [x] Search Repo
- [x] REST API v2 Finished! 🚀
- [x] Batch Processing (UI Only)
- [ ] Code Diff Page
- [ ] Export Reports

Iteration 3:

## Links
- [GitLab Test Server](https://cmpt373-1211-12.cmpt.sfu.ca/)
- [GitLab Analyzer](http://142.58.22.167:6789/)

## Credits
This software uses the following open source packages:

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Flask](https://flask.palletsprojects.com/en/1.1.x/)

## License

MIT

