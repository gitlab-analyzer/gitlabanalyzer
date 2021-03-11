import json
from typing import Optional
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5678)
