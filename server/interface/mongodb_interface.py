from typing import List, Union
from datetime import datetime, timezone
from dateutil.parser import isoparse

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError, ExecutionTimeout
from pymongo.results import *

from model.commit import Commit
from model.merge_request import MergeRequest
from model.comment import Comment
from model.member import Member
from model.issue import Issue
from model.project import Project

class GitLabDB:
    CursorTimeOutMS = 5000

    def __init__(self, addr: str = 'localhost', port: int = 27017) -> None:
        self.__client = MongoClient(addr, port)

        self.__gitLabAnalyzerDB = self.__client["GitLabAnalyzer"]

        self.__userColl = self.__gitLabAnalyzerDB["users"]
        self.__projectColl = self.__gitLabAnalyzerDB["projects"]
        self.__mergeRequestColl = self.__gitLabAnalyzerDB["mergeRequests"]
        self.__commitColl = self.__gitLabAnalyzerDB["commits"]
        self.__codeDiffColl = self.__gitLabAnalyzerDB["codeDiffs"]
        self.__commentColl = self.__gitLabAnalyzerDB["comments"]
        self.__memberColl = self.__gitLabAnalyzerDB["members"]
        self.__issueColl = self.__gitLabAnalyzerDB["issues"]

    # ********************** CONFIG AND MAP METHODS ****************************************************************************
    """
        CONFIG PROFILE DICTS MUST CONTAIN A "profile_name" KEY
    """
    def add_user_config_profile(self, hashedToken: str, newConfigProfile: dict) -> bool:
        assert("profile_name" in newConfigProfile.keys() and newConfigProfile["profile_name"] != "")
        result: UpdateResult = self.__userColl.update_one({"_id": hashedToken}, {"$push": {"config_profiles": newConfigProfile}})
        return result.acknowledged

    def delete_user_config_profile(self, hashedToken: str, configName: str) -> bool:
        result: UpdateResult = self.__userColl.update_one({"_id": hashedToken}, {"$pull": {"config_profiles.profile_name": configName}})
        return result.acknowledged

    def update_project_config(self, project_id: Union[int, str], newConfigProfile: dict) -> bool:
        result: UpdateResult = self.__projectColl.update_one({"_id": project_id}, {"config": newConfigProfile})
        return result.acknowledged

    def update_project_member_map(self, project_id: Union[int, str], newMemberMap: dict) -> bool:
        result: UpdateResult = self.__projectColl.update_one({"_id": project_id}, {"member_map": newMemberMap})
        return result.acknowledged


    # ********************** FIND METHODS ************************************************************************************
    @staticmethod
    def __find(coll: Collection, query: dict) -> List[dict]:
        try:
            cursor = coll.find(filter=query, max_time_ms=GitLabDB.CursorTimeOutMS)
            # NOTE: For large results, program may freeze here
            return list(cursor)
        except ExecutionTimeout:
            print("MongoDB_interface: Find Operation Timed Out for collection:{}. query={}".format(coll, query))
            return list()

    @staticmethod
    def __findOne(coll: Collection, query: dict) -> dict:
        try:
            return coll.find_one(filter=query, max_time_ms=GitLabDB.CursorTimeOutMS)
        except ExecutionTimeout:
            print("MongoDB_interface: FindOne Operation Timed Out for collection:{}. query={}".format(coll, query))
            return dict()

    def find_one_user(self, hashed_token: str) -> dict:
        return self.__findOne(self.__userColl, {"hashed_token": hashed_token})

    def find_one_project(self, project_id: Union[int, str]) -> dict:
        return self.__findOne(self.__projectColl, {"project_id": project_id})
    
    def find_one_MR(self, project_id: Union[int, str], mr_id: int) -> dict:
        query: dict = {
            "project_id": project_id,
            "mr_id": mr_id
        }
        return self.__findOne(self.__mergeRequestColl, query)

    # NOTE: MUST TEST
    def find_MRs_in_project(self, project_id: Union[int, str], start_date: datetime = datetime.min, end_date: datetime = datetime.max) -> List[dict]:
        query: dict = {
            "project_id": project_id, 
            "$and": [
                {"merged_date": {"$gte": start_date}},
                {"merged_date": {"$lte": end_date}}
            ]
        }
        return self.__find(self.__mergeRequestColl, query)

    def find_one_commit(self, project_id: Union[int, str], commit_id: int) -> dict:
        query: dict = {
            "project_id": project_id,
            "commit_id": commit_id
        }
        return self.__findOne(self.__commitColl, query)

    def find_many_commits(self, project_id: Union[int, str], commit_ids: List[int]) -> dict:
        if len(commit_ids) == 0:
            return list()
        
        query: dict = {
            "project_id": project_id,
            "$or": [{"commit_id": id for id in commit_ids}]
        }
        return self.__find(self.__commitColl, query)

    # NOTE: MUST TEST
    def find_commits_in_project(self, project_id: Union[int, str], start_date: datetime = datetime.min, end_date: datetime = datetime.max) -> List[dict]:
        query: dict = {
            "project_id": project_id,
            "$and": [
                {"commit_date": {"$gte": start_date}},
                {"commit_date": {"$lte": end_date}}
            ]
        }
        return self.__find(self.__commitColl, query)

    def find_one_codeDiff(self, project_id: Union[int, str], artif_id: int) -> dict:
        query: dict = {
            "project_id": project_id,
            "artif_id": artif_id
        }
        return self.__findOne(self.__codeDiffColl, query)

    def find_many_codeDiffs(self, project_id: Union[int, str], artif_ids: List[int]) -> List[dict]:
        if len(artif_ids) == 0:
            return list()

        query: dict = {
            "project_id": project_id,
            "$or": [{"artif_id": id} for id in artif_ids]
        }
        return self.__find(self.__codeDiffColl, query)

    def find_codeDiffs_in_project(self, project_id: Union[int, str]) -> List[dict]:
        return self.__find(self.__codeDiffColl, {"project_id": project_id})

    # NOTE: MUST TEST
    def find_codeDiffs_in_MR(self, project_id: Union[int, str], mr_id: int) -> List[dict]:
        mr: dict = self.find_one_MR(project_id, mr_id)
        if not mr:
            return list()

        commits: List[dict] = self.find_many_commits(project_id, mr['related_commit_ids'])
        codeDiffIds: List[int] = [commit['code_diff_id'] for commit in commits]
        return self.find_many_codeDiffs(project_id, codeDiffIds)

    # NOTE: PRIMARY KEY (project_id, noteable_type, noteable_iid (ObjectId if commit comment))
    def find_MR_comments_in_project(self, project_id: Union[int, str]) -> List[dict]:
        return self.__find(self.__commentColl, {"project_id": project_id, "noteable_type": "MergeRequest"})

    def find_commit_comments_in_project(self, project_id: Union[int, str]) -> List[dict]:
        return self.__find(self.__commentColl, {"project_id": project_id, "noteable_type": "Commit"})

    def find_issue_comments_in_projects(self, project_id: Union[int, str]) -> List[dict]:
        return self.__find(self.__commentColl, {"project_id": project_id, "noteable_type": "Issue"})

    def find_comments_in_MR(self, project_id: Union[int, str], mr_id: int) -> List[dict]:
        mr: dict = self.find_one_MR(project_id, mr_id)
        if not mr:
            return list()

        query: dict = {
            "project_id": project_id,
            "noteable_type": "MergeRequest",
            "$or": [{"noteable_iid": comment_iid} for comment_iid in mr['comment_iid_list']]
        }
        return self.__find(self.__commentColl, query)

    def find_one_member(self, member_id: int) -> dict:
        return self.__findOne(self.__memberColl, {"id": member_id})

    def find_many_members(self, member_ids: List[int]) -> List[dict]:
        query: dict = {"$or": [{"id": id} for id in member_ids]}
        return self.__find(self.__memberColl, query)

    # TODO: Issues
    def find_one_issue(self, project_id: Union[int, str], issue_id: int) -> dict:
        return self.__findOne(self.__issueColl, {"project_id": project_id, "issue_id": issue_id})

    def find_many_issues(self, project_id: Union[int, str], issue_ids: List[int]) -> List[dict]:
        query: dict = {
            "project_id": project_id,
            "$or": [{"issue_id": issue_id} for issue_id in issue_ids]
        }
        return self.__find(self.__issueColl, query)
    
    # NOTE: MUST TEST
    def find_issues_in_project(self, project_id: Union[int, str], start_date: datetime = datetime.min, end_date: datetime = datetime.max) -> List[dict]:
        query: dict = {
            "project_id": project_id,
            "$and": [
                {"created_date": {"$gte": start_date}},
                {"created_date": {"$lte": end_date}}
            ]
        }
        return self.__find(self.__issueColl, query)
    
    def find_issue_of_MR(self, project_id: Union[int, str], mr_id: int) -> dict:
        mr: dict = self.find_one_MR(project_id, mr_id)
        if not mr:
            return dict()
        return self.__findOne(self.__issueColl, {'issue_id': mr['issue_id']})


    # ********************** INSERT METHODS *****************************************************************************************
    @staticmethod
    def __insertOne(coll: Collection, body: dict) -> bool:
        try:
            result: InsertOneResult = coll.insert_one(body)
            return result.acknowledged
        except DuplicateKeyError:
            print("MongoDB_interface: Duplicate insert in collection:{}. body:{}".format(coll, body))
            return False
    
    @staticmethod
    def __insertMany(coll: Collection, body: List[dict]) -> bool:
        try:
            result: InsertManyResult = coll.insert_many(body)
            return result.acknowledged
        except DuplicateKeyError:
            print("MongoDB_interface: Duplicate batch insert in collection:{}.".format(coll))
            return False

    def insert_one_GLAUser(self, hashedToken: str, defaultConfig: dict) -> bool:
        # STUB
        body: dict = {
            '_id': hashedToken,
            'hashed_token': hashedToken,
            'config_profiles': defaultConfig
        }
        return self.__insertOne(self.__userColl, body)

    def insert_one_project(self, project: Project, projectConfig: dict, memberMap: dict) -> bool:
        body: dict = {
            '_id': project.project_id,
            'project_id': project.project_id,
            'name': project.name,
            'path': project.path,
            'namespace': {
                'name': project.namespace,
                'path': project.path_namespace
            },
            'last_cached_date': datetime.utcnow().replace(tzinfo=timezone.utc, microsecond=0).isoformat(),
            'config': projectConfig,
            'member_map': memberMap
        }
        return self.__insertOne(self.__projectColl, body)

    def insert_many_MRs(self, project_id: Union[int, str], mergeRequestList: List[MergeRequest]) -> bool:
        body: List[dict] = []

        for mr in mergeRequestList:
            contributors: set = set()
            relatedCommitIDs: list = []
            for commit in mr.related_commits_list:
                contributors.add(commit.author_name)
                relatedCommitIDs.append(commit.id)
            
            body.append({
                'mr_id': mr.id,
                'project_id': project_id,
                'issue_id': mr.__related_issue_iid,
                'code_diff_id': mr.code_diff_id,
                'merged_date': isoparse(mr.merged_date) if mr.merged_date is not None else None,
                'contributors': list(contributors),
                'related_commit_ids': list(relatedCommitIDs),
                'comment_iid_list': mr.comment_iid_list
            })
        return self.__insertMany(self.__mergeRequestColl, body)
    
    def insert_one_MR(self, project_id: Union[int, str], mergeRequest: MergeRequest) -> bool:
        contributors: set = set()
        relatedCommitIDs: list = []
        for commit in mergeRequest.related_commits_list:
            contributors.add(commit.author_name)
            relatedCommitIDs.append(commit.id)

        body: dict = {
            "_id": (mergeRequest.id, project_id),
            'mr_id': mergeRequest.id,
            'project_id': project_id,
            'issue_id': mergeRequest.__related_issue_iid,
            'code_diff_id': mergeRequest.code_diff_id,
            'merged_date': isoparse(mergeRequest.merged_date) if mergeRequest.merged_date is not None else None,
            'contributors': list(contributors),
            'related_commit_ids': list(relatedCommitIDs),
            'comment_iid_list': mergeRequest.comment_iid_list
        }
        return self.__insertOne(self.__mergeRequestColl, body)

    # precondition: all commits in the list belongs to the same mergeRequest.
    #   if they are all master commits, put None for mergeRequestID.
    def insert_many_commits(self, project_id: Union[int, str], mergeRequestID, commitList: List[Commit]) -> bool:
        body: List[dict] = []
        for commit in commitList:
            body.append({
                'commit_id': commit.id,
                'project_id': project_id,
                'mr_id': mergeRequestID,
                'author': commit.author_name,
                'commit_date': commit.committed_date,
                'code_diff_id': commit.code_diff_id
            })
        return self.__insertMany(self.__commitColl, body)

    # if the commit is a commit on the master branch, put None for mergeRequestID
    def insert_one_commit(self, project_id: Union[int, str], mergeRequestID, commit: Commit) -> bool:
        body: dict = {
            "_id": (commit.id, project_id),
            'commit_id': commit.id,
            'project_id': project_id,
            'mr_id': mergeRequestID,
            'author': commit.author_name,
            'commiter': commit.committer_name,
            'commit_date': commit.committed_date,
            'code_diff_id': commit.code_diff_id
        }
        return self.__insertOne(self.__codeDiffColl, body)

    # precondition: the list of codeDiffs are in the order how they are stored in codeDiffManager
    def insert_many_codeDiffs(self, project_id: Union[int, str], codeDiffList: List[List[dict]]) -> bool:
        body: List[dict] = []
        for index, codeDiff in zip(range(len(codeDiffList)), codeDiffList):
            body.append({
                "project_id": project_id,
                "artif_id": index,
                "diffs": codeDiff
            })
        return self.__insertMany(self.__codeDiffColl, body)

    def insert_one_codeDiff(self, project_id: Union[int, str], codeDiffID: int, codeDiff: List[dict]) -> bool:
        body: dict = {
            "_id": (codeDiffID, project_id),
            "project_id": project_id,
            "artif_id": codeDiffID,
            "diffs": codeDiff
        }
        return self.__insertOne(self.__codeDiffColl, body)

    # NOTE: PROBLEM WITH WHAT PRIMARY KEY IS
    def insert_many_comments(self, project_id: Union[int, str], commentList: List[Comment]) -> bool:
        body: List[dict] = []
        for comment in commentList:
            body.append(
                {
                    "_id": (comment.noteable_iid, comment.noteable_type, project_id),
                    "project_id": project_id
                }.update(comment.to_dict())
            )
        return self.__insertMany(self.__commentColl, body)

    # NOTE: PROBLEM WITH WHAT PRIMARY KEY IS    
    def insert_one_comment(self, project_id: Union[int, str], comment: Comment) -> bool:
        body: dict = {
            "_id": (comment.noteable_iid, comment.noteable_type, project_id),
            "project_id": project_id
        }.update(comment.to_dict())
        result: InsertOneResult = self.__commentColl.insert_one(body)
        return result.acknowledged

    def insert_many_members(self, memberList: List[Member]) -> bool:
        body: List[dict] = []
        for member in memberList:
            body.append({
                "_id": member.id,
                "member_id": member.id,
                "username": member.username,
                "name": member.name,
                "state": member.state,
                "access_level": member.access_level
            })
        return self.__insertMany(self.__memberColl, body)

    def insert_one_member(self, member: Member) -> bool:
        body: dict = {
            "_id": member.id,
            "member_id": member.id,
            "username": member.username,
            "name": member.name,
            "state": member.state,
            "access_level": member.access_level
        }
        return self.__insertOne(self.__memberColl, body)

    def insert_many_issues(self, issueList: List[Issue]) -> bool:
        body: List[dict] = []
        for issue in issueList:
            issueObj = {"_id": (issue.issue_id, issue.project_id)}
            issueObj.update(issue.to_dict())
            body.append(issueObj)
        return self.__insertMany(self.__issueColl, body)

    def insert_one_issue(self, issue: Issue) -> bool:
        body: dict = {"_id": (issue.issue_id, issue.project_id)}
        body.update(issue.to_dict())
        return self.__insertOne(self.__issueColl, body)


    # ******************* GETTERS AND SETTERS **********************
    @property
    def collections(self) -> List[str]:
        return self.__gitLabAnalyzerDB.list_collection_names()
        

if __name__ == '__main__':
    # root:pass@mangodb
    testDB = GitLabDB('localhost', 27017)

    userObj = {"name": "John", "repoInfo": "this is a test"}

    print(testDB.collections)

"""
DRAFT SCHEMA

// PRIMARY KEY: (_id)
Users Collection: [
	{
		hashed_token: (the user's hashed token)
		config_profiles: []

        NOTE: config will probably contain info relating to modifications
                relating to what the user can see on screen PER PROJECT.
                Ex. Ignored commits, score multipliers, etc.

                MAKE SURE the config dict has a "profile_name" key.
                Otherwise, it will never be found.
	}
]

// PRIMARY KEY: (_id)
Project Collection: [
    {
        project_id: <project id>,
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
        },
        member_map: { // example
            "springbro294": <member_id of alex>,
            "xtran": <member_id of alex>,
            "Henry Fang": <member_id of henry>,
            "jiwonj": <member_id of jiwon> 
        }
    }
]

// PRIMARY KEY: (mr_id, project_id)
MergeRequest Collection: [
    {
        mr_id: <merge request id (project scoped id)>,
        project_id: <id of project this MR belongs to>,
        merged_date: <date when MR was merged>,
        contributors: [
            <people who worked on this MR>
        ],
        related_commit_ids: [
            <ids of commits in the merge request>
        ]
        code_diff_id: <code_diff_id (codediff's artif id)>
    }
]

// PRIMARY KEY: (commit_id, project_id)
Commit Collection: [
    {
        commit_id: <id of commit>,
        project_id: <id of project this commit belongs to>,
        mr_id: <id of MR this commit is related to OR NULL if master commit>,
        commiter: <person who made this commit>,
        commit_date: <date of commit ISO 8601>
        code_diff_id: <code_diff_id (codediff's artif id)>
    }
]

// PRIMARY KEY: (artif_id, project_id)
CodeDiff Collection: [
    {
        project_id: <project id>,
        artif_id: 0,
        diffs: [
            {
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
        _id: member.id
        id: member.id
        username: member.username
        name: member.name
        state: member.state
        access_level: member.access_level
    }
]

// PRIMARY KEY(project_id, issue_id)
Issue Collection: [
    {
        project_id,
        issue_id,
        author_id,
        merge_requests_count,
        comment_count,
        title: str = gitlab_issue.title
        description: str = gitlab_issue.description
        state: str = gitlab_issue.state
        updated_date: str = gitlab_issue.updated_at
        created_date: str = gitlab_issue.created_at
        closed_date: Optional[str] = gitlab_issue.closed_at
        assignee_id_list: List[int] = [
            member['id'] for member in gitlab_issue.assignees
        ]

    }
]
"""