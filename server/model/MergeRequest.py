from typing import Union, Optional, List

class MergeRequest:

	def __init__(self, id, iid, author, title, description, state, created_date, related_issue_iid, merged_by=None, merged_date=None, comments=None) -> None:
		self.__id: int = id
		self.__iid: int = iid
		self.__author: int = author 
		self.__title: str = title
		self.__description: str = description 
		self.__state: str = state #whether opened / closed / locked / merged
		self.__created_date: str = created_date  #datetime in ISO 8601 format
		self.__related_issue_iid: int = related_issue_iid #Ex. 23 for a merge request closing Issue #23
		self.__merged_by: Optional[Union[str, int]] = merged_by 
		self.__merged_date: Optional[str] = merged_date
		self.__comments: Optional[List[str]] = comments 

	def to_json(self) -> str:
		return self.__dict__.__str__().replace("_MergeRequest__", "").replace("'", "\"")

	def __str__(self) -> str:
		return str(self.__dict__)

	#Getters

	@property
	def id(self) -> int:
		return self.__id

	@property
	def iid(self) -> int:
	    return self.__iid
	
	@property
	def author(self) -> int:
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
	def created_date(self) -> str:
		return self.__created_date

	@property
	def related_issue_iid(self) -> int:
		return self.__related_issue_iid

	@property
	def merged_by(self) -> Optional[Union[str, int]]:
		return self.__merged_by
	
	@property
	def merged_date(self) -> Optional[str]:
		return self.__merged_date

	@property
	def comments(self) -> Optional[List[str]]:
		return self.__comments



"""
#Test

mr = MergeRequest(11111, 1, 312, "Title", "Descrption", "opened", "date created", 1)

print(mr)
print("_______")
print(mr.__str__())
print("_______")
print(mr.to_json())

"""
	