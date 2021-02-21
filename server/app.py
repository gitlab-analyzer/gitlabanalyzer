import json
from random import randint

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pymongo
import urllib.parse
from interface.gitlab_interface import GitLab
from interface.gitlab_project_interface import GitlabProject

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
gitlabProjectInterface: [GitlabProject] = GitlabProject(None)


@app.route('/')
def index():
    # username = urllib.parse.quote_plus('root')
    # password = urllib.parse.quote_plus('pass')
    # myClient = pymongo.MongoClient(
    #     "mongodb://%s:%s@mangodb:27017/" % (username, password))
    # myDB = myClient["student_repo"]
    # myCol = myDB["students"]
    #
    # myCol.insert_one({"name": "John", "repoInfo": "this is a test"})
    #
    # print(myDB.list_collection_names(), flush=True)
    # print(myCol.find_one(), flush=True)
    return "Hello World from index"


@app.route('/hello')
def hello_world():
    username = urllib.parse.quote_plus('root')
    password = urllib.parse.quote_plus('pass')
    myClient = pymongo.MongoClient(
        "mongodb://%s:%s@mangodb:27017/" % (username, password))
    myDB = myClient["student_repo"]
    myCol = myDB["students"]

    myCol.insert_one({"name": "John", "repoInfo": "this is a test"})

    print(myDB.list_collection_names(), flush=True)
    temp = str(myCol.find_one())
    print(temp, flush=True)
    return {'result': temp}


# Note: Should pass both the gitlab url and the access token when making post call to /auth
@app.route('/auth', methods=['post'])
@cross_origin()
def auth():
    myGitLab = GitLab(token=request.form['token'], url=request.form['url'])
    if myGitLab.authenticate():
        global gitlabProjectInterface
        gitlabProjectInterface = GitlabProject(myGitlab=myGitLab)
        return jsonify({'username': myGitLab.get_username(), 'response': 'valid'})
    else:
        return jsonify({'username': '', 'response': 'invalid'})


@app.route('/getProjectList', methods=['get'])
def get_project_list():
    global gitlabProjectInterface
    projectList = gitlabProjectInterface.project_list
    myResponse = []
    """
    This is for testing only, need to be changed later
    """
    for project in projectList:
        myResponse.append(project.name_with_namespace)
    return jsonify({'value': myResponse})


# Example: /setProject?projectID=projectID_variable
@app.route('/setProject', methods=['post'])
@cross_origin()
def set_project():
    global gitlabProjectInterface
    projectID = request.args.get('projectID', default=None, type=int)
    gitlabProjectInterface.set_project(projectID=projectID)
    return jsonify({"response": "ok"})


@app.route('/getProjectOverview', methods=['get'])
def get_project_overview():
    global gitlabProjectInterface
    memberObjectList = []
    memberList = gitlabProjectInterface.member_manager.getMemberList()

    for member in memberList:
        memberObjectList.append(
            {
                "username": member.username,
                "number_commits": randint(0, 100),
                "lines_of_code": randint(0, 100000),
                "number_issues": randint(0, 100)
            }
        )
    # TODO: The format of this response need to be changed
    # print({"users": memberObjectList})
    memberObjectList = get_test_data()["get_project_overview"]["users"]
    return jsonify({"users": memberObjectList})


@app.route('/getCommits', methods=['get'])
def get_commits():
    global gitlabProjectInterface
    commitList: list = gitlabProjectInterface.commits_manager.get_commit_list_json()
    return jsonify({"commit_list": json.loads(json.dumps(commitList))})


@app.route('/getMergeRequests', methods=['get'])
def get_merge_request():
    global gitlabProjectInterface
    mergeRequestList: list = gitlabProjectInterface.merge_request_manager.merge_request_list
    return jsonify({"merge_request_list": mergeRequestList})


# This function should only be used
def get_test_data() -> json:
    return json.load(open('test_data.json'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5678)

