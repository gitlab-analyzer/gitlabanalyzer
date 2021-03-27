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

        self.__gitLabAnalyzerDB["accounts"].drop()
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
    #     self.__userColl.delete_one(obj)

    # # This will delete ALL entries in the users collection. IRREVERSIBLE OPERATION
    # def clear_users(self) -> None:
    #     self.__userColl.delete_many({})

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

CodeDiff Collection: [
    {
        project_id: <project id>,
        artif_id: 0,
        "a_mode": "0",
        "b_mode": "100644",
        "deleted_file": false,
        "diff": "@@ -0,0 +1,100 @@\n+import copy\n+\n+class Analyzer:\n+    def __init__(self, acceptor_ids, factor=0.05):\n+        self.weight_changed = False\n+        self.acceptor_ids = acceptor_ids\n+        self.factor=factor\n+        self.num_acceptors = len(acceptor_ids)\n+        self.nominal = 1 / self.num_acceptors\n+        #self.ceiling = (int(self.num_acceptors/3)+1) * self.nominal\n+        self.ceiling = 1/2\n+\n+        self.weights = {}\n+        self.msgs_sent = {}\n+        self.msgs_recvd = {}\n+        self.msg_ratios = {}\n+        self.thresholds = {}\n+        for pid in acceptor_ids:\n+            self.weights[pid] = self.nominal\n+            self.msgs_sent[pid] = 0\n+            self.msgs_recvd[pid] = 0\n+            self.msg_ratios[pid] = 0\n+            self.thresholds[pid] = round(1-self.factor,2)\n+\n+        # make copy of state to compare before/after run\n+        self._pre = copy.copy(self)\n+\n+    def add_send(self, pid):\n+        self.msgs_sent[pid] += 1\n+\n+    def add_recvd(self, pid):\n+        self.msgs_recvd[pid] += 1\n+        try:\n+            self.msg_ratios[pid] = round(self.msgs_recvd[pid]/self.msgs_sent[pid],2)\n+        except ZeroDivisionError:\n+            pass\n+        #self.check_threshold(pid)\n+\n+    def check(self):\n+        for pid in self.acceptor_ids:\n+            self.check_threshold(pid)\n+\n+    def check_threshold(self, pid):\n+        if self.msg_ratios[pid] <= self.thresholds[pid]:\n+            self.thresholds[pid] = round(self.thresholds[pid]-self.factor,2)\n+            self.lower_weight(pid)\n+\n+    def lower_weight(self, pid):\n+        # lower the pid's weight\n+        tmp = round(self.weights[pid]-self.factor,2)\n+        if tmp > 0.0:\n+            self.weights[pid] = tmp\n+        else:\n+            self.weights[pid] = 0.0\n+        self.raise_weight()\n+        self.weight_changed = True\n+\n+    def raise_weight(self):\n+        # increase another pid's weight\n+        if self.nominal != self.ceiling:\n+            adjusted = False\n+            while not adjusted:\n+                for i in range(self.num_acceptors):\n+                    pid = self.acceptor_ids[i]\n+                    diff = self.weights[pid] - self.nominal\n+                    if diff == 0.0:\n+                        self.weights[pid] = round(self.weights[pid]+self.factor,2)\n+                        adjusted = True\n+                        break\n+                if i is (self.num_acceptors-1):\n+                    self.nominal = round(self.nominal+self.factor,2)\n+\n+    def log(self):\n+        print(\"Acceptor weights: {}\".format(self.weights))\n+        print(\"Acceptor ratios: {}\".format(self.msg_ratios))\n+        print(\"Acceptor thresholds: {}\".format(self.thresholds))\n+\n+\n+if __name__ == '__main__':\n+    import random\n+\n+    def test(acceptors, fail_rates, num_msgs):\n+        print(\"testing pids {}: \".format(acceptors))\n+        a=Analyzer(acceptors)\n+        print(\"\\nBefore rounds...\")\n+        a.log()\n+        for n in range(num_msgs):\n+            for pid in acceptors:\n+                a.add_send(pid)\n+                if fail_rates[pid] > random.random():\n+                    pass\n+                else:\n+                    a.add_recvd(pid)\n+        print(\"\\nAfter rounds...\")\n+        a.log()\n+        print('\\n')\n+\n+    test([0,1,2,3],[0,0,0.05,0],100)\n+    test([0,1,2,3,4],[0,0,0.05,0,0],100)\n+    test([0,1,2,3,4,5,6,7,8,9],[0,0,0.05,0,0,0,0,0,0.1,0],1000)\n\\ No newline at end of file\n",
        "new_file": true,
        "new_path": "server/model/analyzer.py",
        "old_path": "server/model/analyzer.py",
        "renamed_file": false
        "lines_added": 0,
        "lines_deleted": 0,
        "comments_added": 0,
        "comments_deleted": 0,
        "blanks_added": 0,
        "blanks_deleted": 0,
        "spacing_changes": 0,
        "syntax_changes": 0
    }
]

Comment Collection: [
    {
        _id: 
        comment.to_dict()
    }
]

Member Collection: [
    {
        
    }
]
"""