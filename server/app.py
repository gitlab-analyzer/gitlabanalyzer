import hashlib
from typing import Any

import flask
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from manager.gitlab_analyzer_manager import GitLabAnalyzerManager

app = Flask(__name__)
cors = CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

# Error respond body list:
projectIDError = {"response": False, "cause": "Error, invalid projectID."}


def hash_token(myToken: str):
    return hashlib.sha256(str.encode(myToken)).hexdigest()


# TODO:
#  1. Add a background task to delete key value pairs if it has
#  stayed in the map for a long time (so it wont blow up the memory)


@app.route('/auth', methods=['post'])
def auth():
    myToken = request.form['token']
    hashedToken = hash_token(myToken)

    isSuccess, errorCode, username = gitlab_manager.add_gitlab(
        myToken, hashedToken, request.form['url']
    )
    response = make_response(
        jsonify({'username': username, 'response': isSuccess, 'cause': errorCode})
    )
    if isSuccess:
        response.set_cookie(key="id", value=hashedToken)

    return response


@app.route('/projects', methods=['get'])
def get_project_list():
    isSuccess, errorCode, value = gitlab_manager.get_project_list(
        request.cookies.get("id", "")
    )

    return jsonify({'projects': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/sync', methods=['post'])
def sync_project(projectID: int):
    isSuccess, errorCode = gitlab_manager.sync_project(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({"response": isSuccess, 'cause': errorCode})


def get_request(myRequest: flask.Request, key: str) -> Any:
    requestBody = myRequest.get_json()
    if requestBody is None:
        requestBody = {}
    return requestBody.get(key)


@app.route('/projects/sync/batch', methods=['post'])
def sync_a_list_of_products():
    isSuccess, errorCode, response = gitlab_manager.sync_list_of_projects(
        request.cookies.get("id", ""), get_request(request, "project_list")
    )

    return jsonify({"response": isSuccess, "status": response, 'cause': errorCode})


@app.route('/projects/<int:projectID>/sync/state', methods=['get'])
def get_state(projectID: int):
    isSuccess, errorCode, value = gitlab_manager.check_sync_state(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'status': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/sync/batch/state', methods=['post'])
def get_state_for_multiple_project():
    (
        isSuccess,
        errorCode,
        value,
        totalProgress,
    ) = gitlab_manager.check_project_list_sync_state(
        request.cookies.get("id", ""), get_request(request, "project_list")
    )

    return jsonify(
        {
            "response": isSuccess,
            "status": value,
            'cause': errorCode,
            "totalProgress": totalProgress,
        }
    )


@app.route('/projects/<int:projectID>/members', methods=['get'])
def get_project_members(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_members(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'members': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/users', methods=['get'])
def get_project_users(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_users(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'users': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/commit', methods=['get'])
def get_commits(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_master_commits(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'commit_list': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/commit/user/all', methods=['get'])
def get_commits_for_users(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_all_commits_by_user(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'commit_list': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/merge_request/user/all', methods=['get'])
def get_merge_requests_for_users(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_merge_request_by_user(
        request.cookies.get("id", ""), projectID
    )

    return jsonify(
        {'merge_request_users_list': value, "response": isSuccess, 'cause': errorCode}
    )


@app.route('/projects/<int:projectID>/merge_request/all', methods=['get'])
def get_all_merge_requests(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_all_merge_request(
        request.cookies.get("id", ""), projectID
    )

    return jsonify(
        {'merge_request_list': value, "response": isSuccess, 'cause': errorCode}
    )


@app.route('/projects/<int:projectID>/code_diff/<int:codeDiffID>', methods=['get'])
def get_code_diff(projectID, codeDiffID):
    isSuccess, errorCode, value = gitlab_manager.get_code_diff(
        request.cookies.get("id", ""), projectID, codeDiffID
    )

    return jsonify({'code_diff_list': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/comments/all', methods=['get'])
def get_all_notes(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_all_project_notes(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'notes': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/comments/user/all', methods=['get'])
def get_notes_for_all_users(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_notes_by_user(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'notes': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/map', methods=['post'])
def map_users(projectID):
    isSuccess, errorCode = gitlab_manager.map_users(
        request.cookies.get("id", ""), projectID, get_request(request, "user_map")
    )

    return jsonify({"response": isSuccess, 'cause': errorCode})


if __name__ == '__main__':
    gitlab_manager = GitLabAnalyzerManager()
    app.run(host='0.0.0.0', port=5678)
