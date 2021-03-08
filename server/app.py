import json
from random import randint
from typing import Optional
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pymongo
import urllib.parse
from interface.gitlab_interface import GitLab
from interface.gitlab_project_interface import GitLabProject

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# These cannot stay as globals. Change when possible
myGitLab: Optional[GitLab] = None
gitlabProjectInterface: Optional[GitLabProject] = None

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
        "mongodb://%s:%s@mangodb:27017/" % (username, password)
    )
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
    global myGitLab
    myGitLab = GitLab(token=request.form['token'], url=request.form['url'])
    if myGitLab.authenticate():
        return jsonify({'username': myGitLab.get_username(), 'response': True})
    else:
        return jsonify(
            {'username': '', 'response': False, 'Cause': "Invalid token or url"}
        )


@app.route('/projects', methods=['get'])
def get_project_list():
    global myGitLab
    projectList = myGitLab.get_project_list()
    myResponse = []
    """
    This is for testing only, need to be changed later
    """
    myGitLab.get_project_list()
    for project in projectList:
        myResponse.append(project.name_with_namespace)
    return jsonify({'projects': myResponse, "response": True})


# Example: /projects/set?projectID=projectID_variable
@app.route('/projects/set', methods=['post'])
@cross_origin()
def set_project():
    global gitlabProjectInterface
    global myGitLab
    projectID = request.args.get('projectID', default=None, type=int)

    if myGitLab.find_project(projectID) is not None:
        gitlabProjectInterface = GitLabProject(myGitLab, projectID)
        return jsonify({"response": True})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/members', methods=['get'])
def get_project_members(projectID):
    global gitlabProjectInterface

    if projectID == gitlabProjectInterface.project_id:
        members_name: list = []
        memberList = gitlabProjectInterface.member_manager.get_member_list()
        for member in memberList:
            members_name.append(member.username)
        return jsonify({"members": members_name, "response": True})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/overview', methods=['get'])
def get_project_overview(projectID):
    global gitlabProjectInterface
    userObjectList = []

    if projectID == gitlabProjectInterface.project_id:
        userList: list = gitlabProjectInterface.user_list
        # TODO: below code will be replaced by a function call to gitlab project list
        for user in userList:
            userObjectList.append(
                {
                    "username": user,
                    "number_commits": randint(0, 100),
                    "lines_of_code": randint(0, 100000),
                    "number_issues": randint(0, 100),
                }
            )
        return jsonify({"users": userObjectList, "response": True})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/commit', methods=['get'])
def get_commits(projectID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        commitList: list = gitlabProjectInterface.commits_manager.get_commit_list_json()
        return jsonify(
            {"response": True, "commit_list": json.loads(json.dumps(commitList))}
        )
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/commit/user/all')
def get_commits_for_users(projectID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        mergeRequestList: list = (
            gitlabProjectInterface.get_commits_for_all_users()
        )
        return jsonify({"response": True, "commit_list": mergeRequestList})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/merge_request/all')
def get_merge_requests_for_users(projectID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        mergeRequestList: list = (
            gitlabProjectInterface.get_merge_request_and_commit_list()
        )
        return jsonify({"response": True, "merge_request_list": mergeRequestList})
    else:
        return jsonify(projectIDError)


# This function should only be used for testing purpose
def get_test_data() -> json:
    return json.load(open('test/test_dataset/test_data.json'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5678)
