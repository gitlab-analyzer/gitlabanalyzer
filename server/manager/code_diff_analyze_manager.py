import re
from typing import Union, Optional, List
from model.code_diff import *
import gitlab


class codeDiffManager:
    def __init__(self) -> None:
        self.__codeDiffList: List[CodeDiff] = []

    def get_code_diff_list(self) -> list:
        return self.__codeDiffList

    def get_code_diff_statistic(self, codeDiffObject: gitlab) -> None:
        newLine = 0
        deleteLine = 0
        spacingLine = 0

        diffCode = CodeDiff(codeDiffObject)
        for line in diffCode.diff.splitlines():
            found = re.search('@@ (.+?) @@', line)
            if found is not None:
                found = found.group(1)
                splitGroup = found.split()
                add = splitGroup[1].split(',')
                newLine = int(add[len(add) - 1])
                delete = splitGroup[0].split(',')
                deleteLine = int(delete[len(delete) - 1])
            else:
                isEmpty = True
                for i in line[1:]:
                    if i != " ":
                        isEmpty = False
                        break
                if isEmpty:
                    if line[0] == '+':
                        newLine = newLine - 1
                        spacingLine = spacingLine + 1
                    if line[0] == '-':
                        deleteLine = deleteLine - 1
                        spacingLine = spacingLine + 1
