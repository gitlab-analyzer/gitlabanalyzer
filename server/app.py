import hashlib
import json
import threading
import time
from copy import deepcopy
from typing import Optional
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from interface.gitlab_interface import GitLab
from interface.gitlab_project_interface import GitLabProject
from manager.member_manager import MemberManager

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
state = False  # TODO: this is used to minimize API call time for frontend

# These cannot stay as globals. Change when possible
myGitLab: Optional[GitLab] = None
gitlabProjectInterface: Optional[GitLabProject] = None

# Error respond body list:
projectIDError = {"response": False, "Cause": "Error, invalid projectID."}


# Note: Should pass both the gitlab url and the access token when making post call to /auth
@app.route('/auth', methods=['post'])
@cross_origin()
def auth():
    global myGitLab
    myToken = request.form['token']
    myGitLab = GitLab(token=myToken, url=request.form['url'])
    if myGitLab.authenticate():
        response = make_response(
            jsonify({'username': myGitLab.get_username(), 'response': True})
        )
        # TODO: This hashed str will be stored in the gitlabAnalyzer class later on
        #       add unix time to the end of the token. Then hash it.
        response.set_cookie(
            key="id", value=hashlib.sha256(str.encode(myToken + str(time.time()))).hexdigest()
        )
        return response
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


def sync_project(projectID: int):
    global myGitLab
    global gitlabProjectInterface
    gitlabProjectInterface = GitLabProject(projectID)
    gitlabProjectInterface.update(myGitLab)


@app.route('/projects/sync', methods=['post'])
@cross_origin()
def set_project():
    global myGitLab
    projectID = request.args.get('projectID', default=None, type=int)

    if myGitLab.find_project(projectID) is not None:
        global state
        if not state:
            threading.Thread(target=sync_project, args=(projectID,)).start()
            state = True
        return jsonify({"response": True})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/sync/state', methods=['get'])
def get_state(projectID: int):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        return jsonify({"response": True, "status": gitlabProjectInterface.get_project_sync_state()})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/members', methods=['get'])
def get_project_members(projectID):
    global gitlabProjectInterface

    if gitlabProjectInterface is None:
        global myGitLab
        memberInfoList: list = []
        tempGitLab = deepcopy(myGitLab)
        tempGitLab.set_project(projectID)
        members: list = tempGitLab.get_all_members()
        memberManager = MemberManager()

        for member in members:
            memberManager.add_member(member)
        memberList = memberManager.get_member_list()
        for member in memberList:
            memberInfoList.append(member.to_dict())

        return jsonify({"members": memberInfoList, "response": True})

    if projectID == gitlabProjectInterface.project_id:
        memberInfoList: list = []
        memberList = gitlabProjectInterface.member_manager.get_member_list()
        for member in memberList:
            memberInfoList.append(member.to_dict())
        return jsonify({"members": memberInfoList, "response": True})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/users', methods=['get'])
def get_project_users(projectID):
    global gitlabProjectInterface

    if projectID == gitlabProjectInterface.project_id:
        return jsonify({"users": gitlabProjectInterface.user_list, "response": True})
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
        mergeRequestList: list = gitlabProjectInterface.get_commits_for_all_users()
        return jsonify({"response": True, "commit_list": mergeRequestList})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/merge_request/user/all')
def get_merge_requests_for_users(projectID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        mergeRequestList: dict = (
            gitlabProjectInterface.get_merge_request_and_commit_list_for_users()
        )
        return jsonify({"response": True, "merge_request_users_list": mergeRequestList})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/merge_request/all')
def get_all_merge_requests(projectID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        mergeRequestList: list = (
            gitlabProjectInterface.get_all_merge_request_and_commit()
        )
        return jsonify({"response": True, "merge_request_list": mergeRequestList})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/code_diff/<int:codeDiffID>')
def get_code_diff(projectID, codeDiffID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        codeDiff = gitlabProjectInterface.get_code_diff(codeDiffID)
        return jsonify({"response": True, "code_diff_list": codeDiff})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/comments/all')
def get_all_notes(projectID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        commentList = gitlabProjectInterface.get_all_comments()
        return jsonify({"response": True, "notes": commentList})
    else:
        return jsonify(projectIDError)


@app.route('/projects/<int:projectID>/comments/user/all')
def get_notes_for_all_users(projectID):
    global gitlabProjectInterface
    if projectID == gitlabProjectInterface.project_id:
        commentList = gitlabProjectInterface.get_comments_for_all_users()
        return jsonify({"response": True, "notes": commentList})
    else:
        return jsonify(projectIDError)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5678)
