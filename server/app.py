import hashlib
from typing import Any

import flask
import os
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from manager.gitlab_analyzer_manager import GitLabAnalyzerManager

app = Flask(__name__)
cors = CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
port = int(os.environ.get("PORT", 5678))

# Error respond body list:
projectIDError = {"response": False, "cause": "Error, invalid projectID."}


def hash_token(myToken: str):
    return hashlib.sha256(str.encode(myToken)).hexdigest()


@app.route('/auth', methods=['POST'])
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


@app.route('/projects', methods=['GET'])
def get_project_list():
    isSuccess, errorCode, value = gitlab_manager.get_project_list(
        request.cookies.get("id", "")
    )

    return jsonify({'projects': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/sync', methods=['POST'])
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


@app.route('/projects/sync/batch', methods=['POST'])
def sync_a_list_of_products():
    isSuccess, errorCode, response = gitlab_manager.sync_list_of_projects(
        request.cookies.get("id", ""), get_request(request, "project_list")
    )

    return jsonify({"response": isSuccess, "status": response, 'cause': errorCode})


@app.route('/projects/<int:projectID>/sync/state', methods=['POST'])
def get_state(projectID: int):
    isSuccess, errorCode, value = gitlab_manager.check_sync_state(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'status': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/sync/batch/state', methods=['POST'])
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


@app.route('/projects/<int:projectID>/members', methods=['GET'])
def get_project_members(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_members(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'members': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/users', methods=['GET'])
def get_project_users(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_users(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'users': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/commit', methods=['GET'])
def get_commits(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_master_commits(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'commit_list': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/commit/user/all', methods=['GET'])
def get_commits_for_users(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_all_commits_by_user(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'commit_list': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/commit/master/direct/user/all', methods=['GET'])
def get_unique_master_commits_for_users(projectID):
    (
        isSuccess,
        errorCode,
        value,
    ) = gitlab_manager.get_project_master_direct_commits_by_user(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'commit_list': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/merge_request/user/all', methods=['GET'])
def get_merge_requests_for_users(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_merge_request_by_user(
        request.cookies.get("id", ""), projectID
    )

    return jsonify(
        {'merge_request_users_list': value, "response": isSuccess, 'cause': errorCode}
    )


@app.route('/projects/<int:projectID>/merge_request/all', methods=['GET'])
def get_all_merge_requests(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_all_merge_request(
        request.cookies.get("id", ""), projectID
    )

    return jsonify(
        {'merge_request_list': value, "response": isSuccess, 'cause': errorCode}
    )


@app.route('/projects/<int:projectID>/code_diff/<int:codeDiffID>', methods=['GET'])
def get_code_diff(projectID, codeDiffID):
    isSuccess, errorCode, value = gitlab_manager.get_code_diff(
        request.cookies.get("id", ""), projectID, codeDiffID
    )

    return jsonify({'code_diff_list': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/comments/all', methods=['GET'])
def get_all_notes(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_all_project_notes(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'notes': value, "response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/comments/user/all', methods=['GET'])
def get_notes_for_all_users(projectID):
    isSuccess, errorCode, value = gitlab_manager.get_project_notes_by_user(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({'notes': value, "response": isSuccess, 'cause': errorCode})


# TODO: May be we can add a admin list so only user with admin access can make this call
@app.route('/admin/config/garbage_monitor/start', methods=['POST'])
def start_garbage_collector():
    gitlab_manager.start_garbage_monitor_thread()

    return jsonify({"response": True, 'cause': ""})


@app.route('/admin/config/garbage_monitor/stop', methods=['POST'])
def stop_garbage_collector():
    gitlab_manager.stop_garbage_monitor_thread()

    return jsonify({"response": True, 'cause': ""})


@app.route('/admin/config/garbage_monitor/check_period', methods=['GET', 'POST'])
def change_garbage_collector_check_period():
    if request.method == "GET":
        return jsonify(
            {
                "response": True,
                'cause': "",
                "check_period": gitlab_manager.get_garbage_monitor_check_period(),
            }
        )
    elif request.method == "POST":
        gitlab_manager.change_worker_check_period(
            request.form.get("check_period", None)
        )

    return jsonify({"response": True, 'cause': ""})


@app.route('/projects/<int:projectID>/map', methods=['POST'])
def map_users(projectID):
    isSuccess, errorCode = gitlab_manager.map_users(
        request.cookies.get("id", ""), projectID, get_request(request, "user_mapping")
    )

    return jsonify({"response": isSuccess, 'cause': errorCode})


@app.route('/projects/<int:projectID>/map/reset', methods=['POST'])
def reset_user_mapping(projectID):
    isSuccess, errorCode = gitlab_manager.reset_user_mapping(
        request.cookies.get("id", ""), projectID
    )

    return jsonify({"response": isSuccess, 'cause': errorCode})


@app.route('/config', methods=['GET', 'POST'])
def add_or_get_config():
    value: dict = {}
    if request.method == "GET":
        isSuccess, errorCode, value = gitlab_manager.get_config(
            request.cookies.get("id", "")
        )
    else:
        isSuccess, errorCode = gitlab_manager.update_config(
            request.cookies.get("id", ""),
            get_request(request, "name"),
            get_request(request, "value"),
        )

    return jsonify({"response": isSuccess, 'cause': errorCode, "configs": value})


@app.route('/admin/reset', methods=['POST'])
def reset_server():
    global gitlab_manager
    del gitlab_manager
    gitlab_manager = GitLabAnalyzerManager()
    return jsonify({"response": True, 'cause': ""})


if __name__ == '__main__':
    gitlab_manager = GitLabAnalyzerManager()
    app.run(host='0.0.0.0', port=port)
