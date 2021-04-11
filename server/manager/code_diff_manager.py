from typing import List


class CodeDiffManager:
    def __init__(self):
        self.__code_diff_list: List[List[dict]] = []

    def append_code_diff(self, myCodeDiff: list) -> int:
        self.__code_diff_list.append(myCodeDiff)
        return len(self.__code_diff_list) - 1

    def get_code_diff(self, codeDiffID) -> list:
        return self.__code_diff_list[codeDiffID]

    def __len__(self):
        return len(self.__code_diff_list)

    @property
    def codeDiffList(self) -> List[List[dict]]:
        return self.__code_diff_list
