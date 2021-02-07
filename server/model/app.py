from flask import Flask, request, jsonify
import pymongo
import urllib.parse

from gitlab_interface import GitLab

app = Flask(__name__)
myGitLab = None

@app.route('/')
def index():
    username = urllib.parse.quote_plus('root')
    password = urllib.parse.quote_plus('pass')
    myClient = pymongo.MongoClient("mongodb://%s:%s@mangodb:27017/" % (username, password))
    myDB = myClient["student_repo"]
    myCol = myDB["students"]

    myCol.insert_one({"name": "John", "repoInfo": "this is a test"})

    print(myDB.list_collection_names(), flush=True)
    print(myCol.find_one(), flush=True)

    return "Hello World from index"


@app.route('/hello')
def hello_world():
    username = urllib.parse.quote_plus('root')
    password = urllib.parse.quote_plus('pass')
    myClient = pymongo.MongoClient("mongodb://%s:%s@mangodb:27017/" % (username, password))
    myDB = myClient["student_repo"]
    myCol = myDB["students"]

    myCol.insert_one({"name": "John", "repoInfo": "this is a test"})

    print(myDB.list_collection_names(), flush=True)
    temp = str(myCol.find_one())
    print(temp, flush=True)
    return {'result': temp}


# Example: /auth?token=token_variable
@app.route('/auth', methods=['get'])
def auth():
    token = request.args.get('token', default=None, type=str)
    if not token:
        return jsonify({'value': 'invalid token'})
    global myGitLab
    myGitLab = GitLab(token=token)
    return jsonify({'value': myGitLab.authenticate()})


@app.route('/getProjectList', methods=['get'])
def get_project_list():
    projectList = myGitLab.get_project_list()
    myResponse = []
    """
    This is for testing only, need to be changed later
    """
    for project in projectList:
        myResponse.append(project.name_with_namespace)
    return jsonify({'value': myResponse})



if __name__ == '__main__':
    app.run(host='0.0.0.0')
