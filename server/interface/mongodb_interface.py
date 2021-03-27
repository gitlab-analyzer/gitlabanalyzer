from typing import List
from pprint import pprint

from pymongo import MongoClient
from pymongo.cursor import Cursor

from bson.objectid import ObjectId

class MongoDB:
    def __init__(self, addr: str = 'localhost', port: int = 27017) -> None:
        self.__client = MongoClient(addr, port)

        self.__gitLabAnalyzerDB = self.__client["GitLabAnalyzer"]
        self.__userColl = self.__gitLabAnalyzerDB["users"]
        self.__projectColl = self.__gitLabAnalyzerDB["projects"]
        self.__mergeRequestColl = self.__gitLabAnalyzerDB["mergeRequests"]
        self.__commitColl = self.__gitLabAnalyzerDB["commits"]

    # def find_users(self, num: int, obj: dict) -> Cursor:
    #     return self.__userColl.find(obj)

    # # insert a single user
    # def insert_user(self, obj: dict) -> None:
    #     obj['_id'] = self.__userNextId
    #     self.__userNextId += 1
    #     self.__userColl.insert_one(obj)
    
    # # insert multiple users at once
    # def insert_many_users(self, objList: List[dict]) -> None:
    #     for obj in objList:
    #         obj['_id'] = self.__userNextId
    #         self.__userNextId += 1
    #     self.__userColl.insert_many(objList)
    
    # def update_user(self, obj: dict, update: dict) -> None:
    #     self.__userColl.update_one(obj, update)

    # def remove_user(self, obj: dict) -> None:
    #     self.__userColl.remove(obj)

    # # This will delete ALL entries in the users collection. IRREVERSIBLE OPERATION
    # def clear_users(self) -> None:
    #     self.__userColl.remove({})

    @property
    def collections(self) -> List[str]:
        return self.__gitLabAnalyzerDB.list_collection_names()
        

if __name__ == '__main__':
    # root:pass@mangodb
    testDB = MongoDB('localhost', 27017)

    userObj = {"name": "John", "repoInfo": "this is a test"}

    print(testDB.collections)

"""
DRAFT SCHEMA

// PRIMARY KEY: (_id)
Users Collection: [
	{
		_id: ObjectId("IKNF23141ASFINO"), (_id is the user's hashed token)
		username: John123,
        name: John Lee,
		config: <user's global config>

        NOTE: config will probably contain info relating to modifications
                relating to what the user can see on screen PER PROJECT.
                Ex. Ignored commits, score multipliers, etc.
	}
]

// PRIMARY KEY: (_id)
Project Collection: [
    {
        _id: <project id>,
        name: <project name>,
        path: <project path>,
        namespace: {
            name: <name namespace>
            path: <path namespace>
        },
        last_cached_date: <date project was last updated in mongodb>,
        config: {
            <project config. Starts empty, and gets user's config when project is analyzed for the first time.
             this config will include the mapping of user names and members>
        }
        members: [
            <will contain all contributors of the project (members and users)>
        ]
        score_data: {
            merge_requests: [
                <ids of MRs>
            ],
            commits: [
                <ids of MASTER commits; {mr_id: NULL} commits>
            ],
        }
    }
]

// PRIMARY KEY: (_id, project_id)
MergeRequest Collection: [
    {
        _id: <merge request id (project scoped id)>,
        project_id: <id of project this MR belongs to>,
        merged_date: <date when MR was merged>,
        contributors: [
            <people who worked on this MR>
        ],
        related_commit_ids: [
            <ids of commits in the merge request>
        ]
    }
]

// PRIMARY KEY: (_id, project_id)
Commit Collection: [
    {
        _id: <id of commit>,
        project_id: <id of project this commit belongs to>,
        mr_id: <id of MR this commit is related to OR NULL if master commit>,
        commiter: <person who made this commit>,
        code_diff_ids: [
            <ids of code diffs for this commit>
        ]
    }
]
"""