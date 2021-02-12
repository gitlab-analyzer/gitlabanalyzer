from typing import Union, Optional, List

class MergeRequest:

	def __init__(self, id, iid, author, title, description, state, merged_by=None, created_date, merged_date=None, related_issue_iid, comments=None) -> None:
		self.__id: int = id
		self.__iid: int = iid
		self.__author: str = author 
		self.__title: str = title
		self.__description: str = description 
		self.__state: str = state #whether opened / closed / locked / merged
		self.__merged_by: Optional[str] = merged_by 
		self.__created_date: str = created_date  #datetime in ISO 8601 format
		self.__merged_date: Optional[str] = merged_date
		self.__related_issue_iid: int = related_issue_iid #Ex. 23 for a merge request closing Issue #23
		self.__comments: Optional[List[str]] = comments 

	#Getters

	@property
	def id(self) -> int:
		return self.__id

	@property
	def iid(self) -> int:
	    return self.__iid
	
	@property
	def author(self) -> str:
		return self.__author
	
	@property
	def title(self) -> str:
		return self.__title
	
	@property
	def description(self) -> str:
		return self.__description
	
	@property
	def state(self) -> str:
		return self.__state

	@property
	def merged_by(self) -> Optional[str]:
		return self.__merged_by
	
	@property
	def created_date(self) -> str:
		return self.__created_date

	@property
	def merged_date(self) -> Optional[str]:
		return self.__merged_date

	@property
	def related_issue_iid(self) -> int:
    		return self.__related_issue_iid
	
	@property
	def comments(self) -> Optional[List[str]]:
		return self.__comments
	
	


	