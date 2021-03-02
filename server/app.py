import json
import os
from random import randint

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pymongo
import urllib.parse
from interface.gitlab_interface import GitLab
from interface.gitlab_project_interface import GitLabProject

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
gitlabProjectInterface: [GitLabProject] = GitLabProject(None)

# Error respond body list:
projectIDError = {"response": False, "Cause": "Error, invalid projectID."}


@app.route('/')
def index():
    # Below is just an example to use mangodb
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
        gitlabProjectInterface = GitLabProject(myGitlab=myGitLab)
        return jsonify({'username': myGitLab.get_username(), 'response': True})
    else:
        return jsonify({'username': '', 'response': False, 'Cause': "Invalid token or url"})


@app.route('/projects', methods=['get'])
def get_project_list():
    global gitlabProjectInterface
    projectList = gitlabProjectInterface.project_list
    myResponse = []
    """
    This is for testing only, need to be changed later
    """
    for project in projectList:
        myResponse.append(project.name_with_namespace)
    return jsonify({'projects': myResponse, "response": True})


# Example: /projects/set?projectID=projectID_variable
@app.route('/projects/set', methods=['post'])
@cross_origin()
def set_project():
    global gitlabProjectInterface
    projectID = request.args.get('projectID', default=None, type=int)
    if gitlabProjectInterface.set_project(projectID=projectID):
        return jsonify({"response": True})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/overview', methods=['get'])
def get_project_overview(projectID):
    global gitlabProjectInterface
    memberObjectList = []

    if projectID == gitlabProjectInterface.project_id:
        memberList = gitlabProjectInterface.member_manager.get_member_list()
        for member in memberList:
            memberObjectList.append(
                {
                    "username": member.username,
                    "number_commits": randint(0, 100),
                    "lines_of_code": randint(0, 100000),
                    "number_issues": randint(0, 100)
                }
            )
        # memberObjectList = get_test_data()["get_project_overview"]["users"]

        return jsonify({"members": memberObjectList, "response": True})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/commits', methods=['get'])
def get_commits(projectID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        commitList: list = gitlabProjectInterface.commits_manager.get_commit_list_json()
        return jsonify({"response": True, "commit_list": json.loads(json.dumps(commitList))})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/merge_requests', methods=['get'])
def get_merge_request(projectID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        mergeRequestList: list = gitlabProjectInterface.merge_request_manager.merge_request_list
        return jsonify({"response": True, "merge_request_list": mergeRequestList})
    else:
        return jsonify(projectIDError)


# This function should only be used for testing purpose
def get_test_data() -> json:
    return json.load(open('test/test_dataset/test_data.json'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5678)
