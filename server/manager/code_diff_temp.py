import re
from typing import Union, Optional, List
from model.code_diff import *
import gitlab


class CodeDiffAnalyzer:
    def __init__(self) -> None:
        self.__codeDiffList: List[CodeDiff] = []
        self.__listSize: int = 0

    # TODO: a way to fill the code diff list

    # The ID's of the codeDiffs are their index in the list
    def get_code_diff_by_id(self, codeDiffId: int) -> list:
        return self.__codeDiffList[codeDiffId] if codeDiffId < self.__listSize else []

    def get_code_diff_statistic(self, codeDiffObject: CodeDiff) -> None:

        # TODO:
        # Case where the commit diff is a block of comment
        # Case where there is some insertion into the middle of a line of code
        # without any deletion (current code will mark it as one addition and one deletion)
        # This need to be just one addition
        # Assert no new line thing that gitlab have

        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }

        oldLine = " "
        python = False

        self.check_for_code_type(codeDiffObject)

        diffCode = codeDiffObject
        for line in diffCode.diff.splitlines():
            if line[0] == '+' or line[0] == '-':
                if line[0] != oldLine[0] and abs(len(line) - len(oldLine)) == 1:
                    temp = info.copy()
                    info = self.check_middle_syntax_addition(
                        line, oldLine, info, python
                    )
                    if temp != info:
                        if oldLine[0] == "+":
                            info["lines_added"] = info["lines_added"] - 1
                        if oldLine[0] == "-":
                            info["lines_deleted"] = info["lines_deleted"] - 1
                        continue

                if oldLine[1:] in line[1:] and oldLine[0] != line[0]:
                    if oldLine != " " and line[1:] != oldLine[1:]:
                        if oldLine[0] == "+":
                            info["lines_added"] = info["lines_added"] - 1
                        if oldLine[0] == "-":
                            info["lines_deleted"] = info["lines_deleted"] - 1
                        tempLine = '+' + line[1:].replace(oldLine[1:], '')
                        info = self.modify_to_a_new_line(
                            info,
                            tempLine,
                            python,
                        )
                        continue

                if line[1:] in oldLine[1:] and oldLine[0] != line[0]:
                    if oldLine != " " and line[1:] != oldLine[1:]:
                        if oldLine[0] == "+":
                            info["lines_added"] = info["lines_added"] - 1
                        if oldLine[0] == "-":
                            info["lines_deleted"] = info["lines_deleted"] - 1
                        tempLine = '-' + oldLine[1:].replace(line[1:], '')
                        info = self.modify_to_a_new_line(
                            info,
                            tempLine,
                            python,
                        )
                        continue
                info = self.modify_to_a_new_line(
                    info,
                    line,
                    python,
                )
                oldLine = line
        return info

    def modify_to_a_new_line(self, info, line, python) -> dict:

        if line == '+':
            info["blanks_added"] = info["blanks_added"] + 1
            return info
        if line == '-':
            info["blanks_deleted"] = info["blanks_deleted"] + 1
            return info

        temp = info.copy()
        info = self.check_for_spacing_syntax_or_comment(
            line[0:1], info, line[1:], python
        )
        if info != temp:
            return info

        if line[0:1] == '+':
            info["lines_added"] = info["lines_added"] + 1

        if line[0:1] == '-':
            info["lines_deleted"] = info["lines_deleted"] + 1

        return info

    def check_for_spacing_syntax_or_comment(self, signal, info, str, python) -> dict:

        isSyntax = False

        if str.isspace():
            info["spacing_changes"] = info["spacing_changes"] + 1
            return info

        for i in range(0, len(str)):
            if str[i] == "#" and python is True:
                if signal == '+' and isSyntax is False:
                    info["comments_added"] = info["comments_added"] + 1
                    return info
                if signal == '-' and isSyntax is False:
                    info["comments_deleted"] = info["comments_deleted"] + 1
                    return info
            elif str[i : i + 2] == '//' and python is False:
                if signal == '+' and isSyntax is False:
                    info["comments_added"] = info["comments_added"] + 1
                    return info
                if signal == '-' and isSyntax is False:
                    info["comments_deleted"] = info["comments_deleted"] + 1
                    return info
            if str[i] == ':' and python is False:
                isSyntax = True
                continue
            elif python is False:
                if str[i] == '{' or str[i] == '}':
                    isSyntax = True
                    continue
            isSyntax = False

        if isSyntax:
            info["syntax_changes"] = info["syntax_changes"] + 1
        return info

    def check_for_code_type(self, codeDiffObject: CodeDiff) -> bool:
        diffCode = codeDiffObject
        fileName = diffCode.new_path
        found = re.search('\.(.+?)$', fileName)
        if found is not None:
            if found.group(1) == 'py':
                return True
        return False

    def check_middle_syntax_addition(self, line, oldLine, info, python) -> dict:
        temp = 0

        if len(line) > len(oldLine):
            length = len(oldLine)
            lastChar = line[len(line) - 1]
        else:
            length = len(line)
            lastChar = oldLine[len(oldLine) - 1]

        for i in range(0, length - 1):
            if oldLine[i] != line[i]:
                temp = i
                break
        if temp != 0:
            if oldLine[temp] == " " or line[temp] == " ":
                info["spacing_changes"] = info["spacing_changes"] + 1
            if python:
                if oldLine[temp] == ":" or line[temp] == ":":
                    info["syntax_changes"] = info["syntax_changes"] + 1
            else:
                if oldLine[temp] == "{" or oldLine[temp] == "}":
                    info["syntax_changes"] = info["syntax_changes"] + 1
                if line[temp] == "{" or line[temp] == "}":
                    info["syntax_changes"] = info["syntax_changes"] + 1
        if temp == 0:
            if lastChar == " ":
                info["spacing_changes"] = info["spacing_changes"] + 1
            if python:
                if lastChar == ":":
                    info["syntax_changes"] = info["syntax_changes"] + 1
            else:
                if lastChar == "{" or lastChar == "}":
                    info["syntax_changes"] = info["syntax_changes"] + 1
        return info
