from typing import List
from pprint import pprint

from pymongo import MongoClient
from pymongo.cursor import Cursor

class MongoDB:
    def __init__(self, addr: str = 'localhost', port: int = 27017) -> None:
        self.__client = MongoClient(addr, port)

        self.__gitLabAnalyzerDB = self.__client["GitLabAnalyzer"]
        self.__userColl = self.__gitLabAnalyzerDB["users"]
        self.__userIdCount = 1

    def find_users(self, num: int, obj: dict) -> Cursor:
        return self.__userColl.find(obj)

    # insert a single user
    def insert_user(self, obj: dict) -> None:
        self.__userColl.insert_one(obj)
    
    # insert multiple users at once
    def insert_many_users(self, objList: List[dict]) -> None:
        self.__userColl.insert_many(objList)
    
    def update_user(self, obj: dict, update: dict) -> None:
        self.__userColl.update_one(obj, update)

    def remove_user(self, obj: dict) -> None:
        self.__userColl.remove(obj)

    # This will delete ALL entries in the users collection. IRREVERSIBLE OPERATION
    def clear_users(self) -> None:
        self.__userColl.remove({})

    @property
    def collections(self) -> List[str]:
        return self.__gitLabAnalyzerDB.list_collection_names()
        

if __name__ == '__main__':
    # root:pass@mangodb
    testDB = MongoDB('localhost', 27017)

    userObj = {"name": "John", "repoInfo": "this is a test"}

    print(testDB.collections)

"""
Users Collection: [
	{
		_id: 1,
		name: John,
		hashed_token: IKNF23141ASFINO,
		config: {
			
		}
	}
]
"""