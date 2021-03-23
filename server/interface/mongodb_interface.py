from pprint import pprint

import pymongo
from pymongo.cursor import Cursor

class MongoDB:
    def __init__(self, addr: str, port: int) -> None:
        # Below is just an example to use mangodb
        self.__client = pymongo.MongoClient()
        self.__gitLabAnalyzerDB = self.__client["GitLabAnalyzer"]

        self.__userColl = self.__gitLabAnalyzerDB["users"]

    def find_many_in_users(self, num: int, obj: dict) -> Cursor:
        return self.__userColl.find(obj)

    def insert_into_users(self, obj: dict):
        self.__userColl.insert_one(obj)
    
    # This will delete ALL entries in accounts collection. IRREVERSIBLE OPERATION
    def clear_users(self):
        self.__userColl.remove({})

    @property
    def collections(self) -> list:
        return self.__gitLabAnalyzerDB.list_collection_names()
        

if __name__ == '__main__':
    # root:pass@mangodb
    testDB = MongoDB('localhost', 27017)

    userObj = {"name": "John", "repoInfo": "this is a test"}

    print(testDB.get_collection_names())
