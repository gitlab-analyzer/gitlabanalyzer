from typing import List
from pprint import pprint

from pymongo import MongoClient
from pymongo.cursor import Cursor

class MongoDB:
    def __init__(self, addr: str = 'localhost', port: int = 27017) -> None:
        self.__client = MongoClient(addr, port)

        self.__gitLabAnalyzerDB = self.__client["GitLabAnalyzer"]
        self.__userColl = self.__gitLabAnalyzerDB["users"]

    def find_many_in_users(self, num: int, obj: dict) -> Cursor:
        return self.__userColl.find(obj)

    def insert_into_users(self, obj: dict) -> None:
        self.__userColl.insert_one(obj)
    
    def insert_many_users(self, objList: List[dict]) -> None:
        self.__userColl.insert_many(objList)

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
