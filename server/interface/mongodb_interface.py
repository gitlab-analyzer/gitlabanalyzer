from typing import List, Optional, Union
from datetime import datetime, timezone
from dateutil.parser import isoparse

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError, ExecutionTimeout
from pymongo.results import *

from bson import ObjectId

from model.commit import Commit
from model.merge_request import MergeRequest
from model.comment import Comment
from model.member import Member
from model.issue import Issue
from model.project import Project


class GitLabDB:
    CursorTimeOutMS = 5000

    def __init__(self, addr: str = "localhost", port: int = 27017) -> None:
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
        assert (
            "profile_name" in newConfigProfile.keys()
            and newConfigProfile["profile_name"] != ""
        )
        result: UpdateResult = self.__userColl.update_one(
            {"_id": hashedToken}, {"$push": {"config_profiles": newConfigProfile}}
        )
        return result.acknowledged

    def delete_user_config_profile(self, hashedToken: str, configName: str) -> bool:
        result: UpdateResult = self.__userColl.update_one(
            {"_id": hashedToken},
            {"$pull": {"config_profiles.profile_name": configName}},
        )
        return result.acknowledged

    def update_project_config(
        self, project_id: Union[int, str], newConfigProfile: dict
    ) -> bool:
        result: UpdateResult = self.__projectColl.update_one(
            {"_id": project_id}, {"config": newConfigProfile}
        )
        return result.acknowledged

    def update_project_member_map(
        self, project_id: Union[int, str], newMemberMap: dict
    ) -> bool:
        result: UpdateResult = self.__projectColl.update_one(
            {"_id": project_id}, {"member_map": newMemberMap}
        )
        return result.acknowledged

    # ********************** FIND METHODS ************************************************************************************
    @staticmethod
    def __find(coll: Collection, query: dict) -> List[dict]:
        try:
            cursor = coll.find(filter=query, max_time_ms=GitLabDB.CursorTimeOutMS)
            # NOTE: For large results, program may freeze here
            return list(cursor)
        except ExecutionTimeout:
            print(
                "MongoDB_interface: Find Operation Timed Out for collection:{}. query={}".format(
                    coll, query
                )
            )
            return list()

    @staticmethod
    def __findOne(coll: Collection, query: dict) -> dict:
        try:
            return coll.find_one(filter=query, max_time_ms=GitLabDB.CursorTimeOutMS)
        except ExecutionTimeout:
            print(
                "MongoDB_interface: FindOne Operation Timed Out for collection:{}. query={}".format(
                    coll, query
                )
            )
            return dict()

    def find_one_user(self, hashed_token: str) -> dict:
        return self.__findOne(self.__userColl, {"hashed_token": hashed_token})

    def find_one_project(self, project_id: Union[int, str]) -> dict:
        return self.__findOne(self.__projectColl, {"project_id": project_id})

    def find_one_MR(self, project_id: Union[int, str], mr_id: int) -> dict:
        query: dict = {"project_id": project_id, "mr_id": mr_id}
        return self.__findOne(self.__mergeRequestColl, query)

    # NOTE: MUST TEST
    def find_MRs_in_project(
        self,
        project_id: Union[int, str],
        start_date: datetime = datetime.min,
        end_date: datetime = datetime.max,
    ) -> List[dict]:
        query: dict = {
            "project_id": project_id,
            "$and": [
                {"merged_date": {"$gte": start_date}},
                {"merged_date": {"$lte": end_date}},
            ],
        }
        return self.__find(self.__mergeRequestColl, query)

    def find_one_commit(self, project_id: Union[int, str], commit_id: int) -> dict:
        query: dict = {"project_id": project_id, "commit_id": commit_id}
        return self.__findOne(self.__commitColl, query)

    def find_many_commits(
        self, project_id: Union[int, str], commit_ids: List[int]
    ) -> dict:
        if len(commit_ids) == 0:
            return list()

        query: dict = {
            "project_id": project_id,
            "$or": [{"commit_id": id for id in commit_ids}],
        }
        return self.__find(self.__commitColl, query)

    # NOTE: MUST TEST
    def find_commits_in_project(
        self,
        project_id: Union[int, str],
        start_date: datetime = datetime.min,
        end_date: datetime = datetime.max,
    ) -> List[dict]:
        query: dict = {
            "project_id": project_id,
            "$and": [
                {"commit_date": {"$gte": start_date}},
                {"commit_date": {"$lte": end_date}},
            ],
        }
        return self.__find(self.__commitColl, query)

    def find_one_codeDiff(self, project_id: Union[int, str], artif_id: int) -> dict:
        query: dict = {"project_id": project_id, "artif_id": artif_id}
        return self.__findOne(self.__codeDiffColl, query)

    def find_many_codeDiffs(
        self, project_id: Union[int, str], artif_ids: List[int]
    ) -> List[dict]:
        if len(artif_ids) == 0:
            return list()

        query: dict = {
            "project_id": project_id,
            "$or": [{"artif_id": id} for id in artif_ids],
        }
        return self.__find(self.__codeDiffColl, query)

    def find_codeDiffs_in_project(self, project_id: Union[int, str]) -> List[dict]:
        return self.__find(self.__codeDiffColl, {"project_id": project_id})

    # NOTE: MUST TEST
    def find_codeDiffs_in_MR(
        self, project_id: Union[int, str], mr_id: int
    ) -> List[dict]:
        mr: dict = self.find_one_MR(project_id, mr_id)
        if not mr:
            return list()

        commits: List[dict] = self.find_many_commits(
            project_id, mr["related_commit_ids"]
        )
        codeDiffIds: List[int] = [commit["code_diff_id"] for commit in commits]
        return self.find_many_codeDiffs(project_id, codeDiffIds)

    # NOTE: PRIMARY KEY (project_id, noteable_type, noteable_iid (ObjectId if commit comment))
    # The notable types are:
    #   MergeRequest
    #   Commit
    #   Issue
    def find_comments_in_project(
        self,
        project_id: Union[int, str],
        noteable_type: Optional[str],
        start_date: datetime = datetime.min,
        end_date: datetime = datetime.max,
    ) -> List[dict]:
        query: dict = {
            "project_id": project_id,
            "$and": [
                {"created_date": {"$gte": start_date}},
                {"created_date": {"$lte": end_date}},
            ],
        }
        if noteable_type is not None:
            query["noteable_type"] = noteable_type
        return self.__find(self.__commentColl, query)

    def find_comments_in_MR(
        self, project_id: Union[int, str], mr_id: int
    ) -> List[dict]:
        mr: dict = self.find_one_MR(project_id, mr_id)
        if not mr:
            return list()

        query: dict = {
            "project_id": project_id,
            "noteable_type": "MergeRequest",
            "$or": [
                {"noteable_iid": comment_iid} for comment_iid in mr["comment_iid_list"]
            ],
        }
        return self.__find(self.__commentColl, query)

    def find_one_member(self, member_id: int) -> dict:
        return self.__findOne(self.__memberColl, {"id": member_id})

    def find_many_members(self, member_ids: List[int]) -> List[dict]:
        query: dict = {"$or": [{"id": id} for id in member_ids]}
        return self.__find(self.__memberColl, query)

    def find_one_issue(self, project_id: Union[int, str], issue_id: int) -> dict:
        return self.__findOne(
            self.__issueColl, {"project_id": project_id, "issue_id": issue_id}
        )

    def find_many_issues(
        self, project_id: Union[int, str], issue_ids: List[int]
    ) -> List[dict]:
        query: dict = {
            "project_id": project_id,
            "$or": [{"issue_id": issue_id} for issue_id in issue_ids],
        }
        return self.__find(self.__issueColl, query)

    # NOTE: MUST TEST
    def find_issues_in_project(
        self,
        project_id: Union[int, str],
        start_date: datetime = datetime.min,
        end_date: datetime = datetime.max,
    ) -> List[dict]:
        query: dict = {
            "project_id": project_id,
            "$and": [
                {"created_date": {"$gte": start_date}},
                {"created_date": {"$lte": end_date}},
            ],
        }
        return self.__find(self.__issueColl, query)

    def find_issue_of_MR(self, project_id: Union[int, str], mr_id: int) -> dict:
        mr: dict = self.find_one_MR(project_id, mr_id)
        if not mr:
            return dict()
        return self.__findOne(self.__issueColl, {"issue_id": mr["issue_id"]})

    # ********************** INSERT METHODS *****************************************************************************************
    @staticmethod
    def __insertOne(coll: Collection, body: dict) -> bool:
        try:
            result: InsertOneResult = coll.insert_one(body)
            return result.acknowledged
        except DuplicateKeyError:
            print(
                "MongoDB_interface: Duplicate insert in collection:{}. body:{}".format(
                    coll, body
                )
            )
            return False

    @staticmethod
    def __insertMany(coll: Collection, body: List[dict]) -> bool:
        try:
            result: InsertManyResult = coll.insert_many(body)
            return result.acknowledged
        except DuplicateKeyError:
            print(
                "MongoDB_interface: Duplicate batch insert in collection:{}.".format(
                    coll
                )
            )
            return False

    def insert_one_GLAUser(self, hashedToken: str, defaultConfig: dict) -> bool:
        # STUB
        body: dict = {
            "_id": hashedToken,
            "hashed_token": hashedToken,
            "config_profiles": defaultConfig,
        }
        return self.__insertOne(self.__userColl, body)

    def insert_one_project(
        self, project: Project, projectConfig: dict, memberMap: dict
    ) -> bool:
        body: dict = self.__project_to_bson(project, projectConfig, memberMap)
        return self.__insertOne(self.__projectColl, body)

    def insert_many_MRs(
        self, project_id: Union[int, str], mergeRequestList: List[MergeRequest]
    ) -> bool:
        body: List[dict] = []

        for mr in mergeRequestList:
            body.append(self.__MR_to_bson(project_id, mr))

        return self.__insertMany(self.__mergeRequestColl, body)

    def insert_one_MR(
        self, project_id: Union[int, str], mergeRequest: MergeRequest
    ) -> bool:
        body: dict = self.__MR_to_bson(project_id, mergeRequest)
        return self.__insertOne(self.__mergeRequestColl, body)

    # NOTE precondition: all commits in the list belongs to the same mergeRequest.
    #   if they are all master commits, put None for mergeRequestID.
    def insert_many_commits(
        self,
        project_id: Union[int, str],
        commitList: List[Commit],
        mergeRequestID: Optional[int] = None,
    ) -> bool:
        body: List[dict] = []
        for commit in commitList:
            body.append(self.__commit_to_bson(project_id, commit, mergeRequestID))
        return self.__insertMany(self.__commitColl, body)

    # NOTE: if the commit is a commit on the master branch, put None for mergeRequestID
    def insert_one_commit(
        self,
        project_id: Union[int, str],
        commit: Commit,
        mergeRequestID: Optional[int] = None,
    ) -> bool:
        body: dict = self.__commit_to_bson(project_id, commit, mergeRequestID)
        return self.__insertOne(self.__codeDiffColl, body)

    # NOTE: precondition: the list of codeDiffs are in the order how they are stored in codeDiffManager
    def insert_many_codeDiffs(
        self, project_id: Union[int, str], codeDiffList: List[List[dict]]
    ) -> bool:
        body: List[dict] = []
        for index, codeDiff in zip(range(len(codeDiffList)), codeDiffList):
            body.append(self.__codediff_to_bson(project_id, index, codeDiff))
        return self.__insertMany(self.__codeDiffColl, body)

    def insert_one_codeDiff(
        self, project_id: Union[int, str], codeDiffID: int, codeDiff: List[dict]
    ) -> bool:
        body: dict = self.__codediff_to_bson(project_id, codeDiffID, codeDiff)
        return self.__insertOne(self.__codeDiffColl, body)

    # NOTE: PRIMARY KEY (project_id, noteable_type, noteable_iid (ObjectId if commit comment))
    def insert_many_comments(
        self, project_id: Union[int, str], commentList: List[Comment]
    ) -> bool:
        body: List[dict] = []
        for comment in commentList:
            body.append(self.__comment_to_bson(project_id, comment))
        return self.__insertMany(self.__commentColl, body)

    # NOTE: PRIMARY KEY (project_id, noteable_type, noteable_iid (ObjectId if commit comment))
    def insert_one_comment(self, project_id: Union[int, str], comment: Comment) -> bool:
        body: dict = self.__comment_to_bson(project_id, comment)
        return self.__insertOne(self.__commentColl, body)

    def insert_many_members(self, memberList: List[Member]) -> bool:
        body: List[dict] = []
        for member in memberList:
            body.append(self.__member_to_bson(member))
        return self.__insertMany(self.__memberColl, body)

    def insert_one_member(self, member: Member) -> bool:
        body: dict = self.__member_to_bson(member)
        return self.__insertOne(self.__memberColl, body)

    def insert_many_issues(self, issueList: List[Issue]) -> bool:
        body: List[dict] = []
        for issue in issueList:
            body.append(self.__issue_to_bson(issue))
        return self.__insertMany(self.__issueColl, body)

    def insert_one_issue(self, issue: Issue) -> bool:
        body: dict = self.__issue_to_bson(issue)
        return self.__insertOne(self.__issueColl, body)

    # ******************* TYPE CONVERTERS **************************
    @staticmethod
    def __project_to_bson(
        project: Project, projectConfig: dict, memberMap: dict
    ) -> dict:
        return {
            "_id": project.project_id,
            "project_id": project.project_id,
            "name": project.name,
            "path": project.path,
            "namespace": {"name": project.namespace, "path": project.path_namespace},
            "last_cached_date": datetime.utcnow()
            .replace(tzinfo=timezone.utc, microsecond=0)
            .isoformat(),
            "config": projectConfig,
            "member_map": memberMap,
        }

    @staticmethod
    def __MR_to_bson(project_id: Union[int, str], mergeRequest: MergeRequest) -> dict:
        contributors: set = set()
        relatedCommitIDs: list = []
        for commit in mergeRequest.related_commits_list:
            contributors.add(commit.author_name)
            relatedCommitIDs.append(commit.id)

        return {
            "_id": (mergeRequest.id, project_id),
            "mr_id": mergeRequest.id,
            "project_id": project_id,
            "issue_id": mergeRequest.__related_issue_iid,
            "code_diff_id": mergeRequest.code_diff_id,
            "merged_date": isoparse(mergeRequest.merged_date)
            if mergeRequest.merged_date is not None
            else None,
            "contributors": list(contributors),
            "related_commit_ids": list(relatedCommitIDs),
            "comment_iid_list": mergeRequest.comment_iid_list,
        }

    @staticmethod
    def __commit_to_bson(
        project_id: Union[int, str],
        commit: Commit,
        mergeRequestID: Optional[int] = None,
    ) -> dict:
        return {
            "_id": (commit.id, project_id),
            "commit_id": commit.id,
            "project_id": project_id,
            "mr_id": mergeRequestID,
            "author": commit.author_name,
            "commiter": commit.committer_name,
            "commit_date": commit.committed_date,
            "code_diff_id": commit.code_diff_id,
        }

    @staticmethod
    def __codediff_to_bson(
        project_id: Union[int, str], codeDiffID: int, codeDiff: List[dict]
    ) -> dict:
        return {
            "_id": (codeDiffID, project_id),
            "project_id": project_id,
            "artif_id": codeDiffID,
            "diffs": codeDiff,
        }

    @staticmethod
    def __comment_to_bson(project_id: Union[int, str], comment: Comment) -> dict:
        return {
            "_id": (
                comment.noteable_iid
                if comment.noteable_iid is not None
                else ObjectId(),
                comment.noteable_type,
                project_id,
            ),
            "project_id": project_id,
        }.update(comment.to_dict())

    @staticmethod
    def __member_to_bson(member: Member) -> dict:
        return {
            "_id": member.id,
            "member_id": member.id,
            "username": member.username,
            "name": member.name,
            "state": member.state,
            "access_level": member.access_level,
        }

    @staticmethod
    def __issue_to_bson(issue: Issue):
        return {"_id": (issue.issue_id, issue.project_id)}.update(issue.to_dict())

    # ******************* GETTERS AND SETTERS **********************
    @property
    def collections(self) -> List[str]:
        return self.__gitLabAnalyzerDB.list_collection_names()
