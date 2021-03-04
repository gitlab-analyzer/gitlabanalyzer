from typing import Union, Optional, List
from model.comment import *
import gitlab
from datetime import datetime
from dateutil import parser


class CommentManager:
    def __init__(self) -> None:
        self.__commentList: List[Comment] = []

    def get_comment_list(self) -> list:
        return self.__commentList

    def add_comment(self, comment: gitlab, sha=None) -> None:
        if sha is None:
            self.__commentList.append(Comment(commentForIssueMR=comment))
        else:  # sha is not None
            self.__commentList.append(Comment(commentForCommit=comment, commitSha=sha))

    # Get list of Comments in certain (ex. Issue iid / Merge Request iid / Commit sha)
    def get_comments_by_noteableId(self, noteableID) -> Union[List[Comment], None]:
        listNoteableID = []
        for comment in self.__commentList:
            if comment.noteable_id == noteableID:
                listNoteableID.append(comment)
        return listNoteableID

    # Get list of Comments written by certain user
    def get_comments_by_userID(self, userID) -> Union[List[Comment], None]:
        listUserID = []
        for comment in self.__commentList:
            if comment.author == userID:
                listUserID.append(comment)
        return listUserID

    def get_comments_by_range(self, startDate, endDate) -> Union[List[Comment], None]:
        listTimeRange = []

        start = parser.parse(startDate)
        end = parser.parse(endDate)
        for comment in self.__commentList:
            tempDate = datetime.strptime(comment.created_date, "%Y-%m-%dT%H:%M:%S.%f%z")
            if start <= tempDate <= end:
                listTimeRange.append(comment)
        return listTimeRange

    # noteableType could be either "MergeRequest" / "Issue" / "Commit"
    def get_comments_by_noteable_types(
        self, noteableType, providedList=None
    ) -> Union[List[Comment], None]:
        listComments = []
        if (
            providedList is not None
        ):  # if function is provided specific list of comments
            for comment in providedList:
                if comment.noteable_type == noteableType:
                    listComments.append(comment)
        else:
            for comment in self.__commentList:
                if comment.noteable_type == noteableType:
                    listComments.append(comment)
        return listComments
