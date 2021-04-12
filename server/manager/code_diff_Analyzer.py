import re
from random import random, randint
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

    def get_code_diff_statistic(self, codeDiffObject: CodeDiff) -> dict:

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

        oldLine = None
        oldLineType = None
        fileType = self.check_for_code_type(codeDiffObject)

        HTMLfileExtension = {"xml", "htm", "html"}

        block_code = False

        diffCode = codeDiffObject
        for line in diffCode.diff.splitlines():
            if line[0] == "+" or line[0] == "-":
                temp = info.copy()

                # Check for block of comments
                # -------------------------------------------------
                if (
                    fileType not in HTMLfileExtension and fileType != "py"
                ) or fileType == "sql":
                    info = self.define_block_of_code(
                        block_code, "/*", line, info, fileType
                    )
                    if "/*" in line and "*/" in line:
                        block_code = False
                    elif "/*" in line:
                        block_code = True
                    if "*/" in line and info == temp:
                        info = self.add_block_of_comments(
                            line, info, block_code, fileType
                        )
                        block_code = False
                elif fileType == "py":
                    info = self.define_block_of_code(
                        block_code, "'''", line, info, fileType
                    )
                    if line.count("'''") == 2:
                        block_code = False
                    elif "'''" in line:
                        block_code = not block_code
                elif fileType in HTMLfileExtension:
                    info = self.define_block_of_code(
                        block_code, "<!--", line, info, fileType
                    )
                    if "<!--" in line and "-->" in line:
                        block_code = False
                    elif "<!--" in line:
                        block_code = True
                    if "-->" in line and info == temp:
                        info = self.add_block_of_comments(
                            line, info, block_code, fileType
                        )
                        block_code = False
                if info != temp:
                    oldLineType = self.compare_dict_value(info, temp)
                    oldLine = line
                    continue
                # -------------------------------------------------

                # Adding to middle of the line instead of to the front or the back
                # -------------------------------------------------
                if oldLine != None and oldLineType != None:
                    if line[0] != oldLine[0] and abs(len(line) - len(oldLine)) == 1:
                        info = self.add_one_char_middle(line, oldLine, info, fileType)
                        if temp != info:
                            info = self.modify_info_value(
                                oldLineType, info, oldLine[0], -1
                            )
                            oldLineType = self.compare_dict_value(info, temp)
                            oldLine = None
                            continue
                    # -------------------------------------------------

                    # Adding to an exisiting line
                    # -------------------------------------------------
                    if oldLine[1:] in line[1:] and oldLine[0] != line[0]:
                        info = self.add_to_existing_line(
                            "+", line, oldLine, info, fileType
                        )
                    elif line[1:] in oldLine[1:] and oldLine[0] != line[0]:
                        info = self.add_to_existing_line(
                            "-", oldLine, line, info, fileType
                        )
                    if info != temp:
                        info = self.modify_info_value(oldLineType, info, oldLine[0], -1)
                        oldLineType = self.compare_dict_value(info, temp)
                        oldLine = None
                        continue
                    # -------------------------------------------------

                # Normal case
                # -------------------------------------------------
                info = self.add_normal_line_of_code(info, line, fileType)
                oldLineType = self.compare_dict_value(info, temp)
                oldLine = line
                # -------------------------------------------------

        return info

    def check_for_code_type(self, codeDiffObject: CodeDiff) -> Union[str, None]:
        diffCode = codeDiffObject
        fileName = diffCode.new_path
        found = re.search(r"\.(\w+)$", fileName)
        if found is not None:
            return found.group(1)
        return fileName

    def add_normal_line_of_code(self, info, line, fileType) -> dict:
        if len(line) == 1:
            info = self.modify_info_value("blanks", info, line)
            return info

        temp = info.copy()
        info = self.check_for_spacing_syntax_or_comment(
            line[0:1], info, line[1:], fileType
        )
        if info != temp:
            return info

        info = self.modify_info_value("lines", info, line[0])
        return info

    def check_for_spacing_syntax_or_comment(self, signal, info, str, fileType) -> dict:
        isSyntax = False
        HTMLfileExtension = {"xml", "htm", "html"}
        syntaxStr = {
            "{",
            "}",
            ":",
            ";",
            "(",
            ")",
            "[",
            "]",
            '"',
            "'",
            "%",
            "<",
            "</",
            "/>",
            ">",
            "==",
            "!=",
            ">=",
            "<=",
            "=",
            "{/*",
            "*/}",
            "<>",
            "$",
            "in",
            "not in",
        }

        if str.isspace():
            info = self.modify_info_value("spacing", info, signal)
            return info

        for i in range(0, len(str)):
            if str[i] in syntaxStr:
                isSyntax = True
                continue
            if fileType == "py":
                if str[i] == "#" and isSyntax is False:
                    info = self.modify_info_value("comments", info, signal)
                    return info
            elif fileType == "sql":
                if str[i : i + 2] == "--" and isSyntax is False:
                    info = self.modify_info_value("comments", info, signal)
                    return info
            elif fileType not in HTMLfileExtension:
                if str[i : i + 2] == "//" and isSyntax is False:
                    info = self.modify_info_value("comments", info, signal)
                    return info
            if str[i] != " ":
                return info

        if isSyntax:
            info = self.modify_info_value("syntax", info, signal)
        return info

    def add_one_char_middle(self, line, oldLine, info, fileType) -> dict:
        temp = 0
        if len(line) > len(oldLine):
            length = len(oldLine)
        else:
            length = len(line)

        for i in range(1, length):
            if oldLine[i] != line[i]:
                temp = i
                break

        if temp != 0:
            if len(line) > len(oldLine):
                info = self.add_normal_line_of_code(
                    info, line[0] + line[temp], fileType
                )
            else:
                info = self.add_normal_line_of_code(
                    info, oldLine[0] + oldLine[temp], fileType
                )
        return info

    def define_block_of_code(
        self, block_code, signal_block_code, line, info, fileType
    ) -> dict:
        if block_code == True and signal_block_code not in line:
            if "*/" not in line and "'''" not in line and "-->" not in line:
                info = self.modify_info_value("comments", info, line[0])
                return info

        if signal_block_code in line:
            if ("*/" in line or "-->" in line and fileType != "py") or (
                line.count(signal_block_code) == 2 and fileType == "py"
            ):
                info = self.modify_info_value("comments", info, line[0])
            else:
                info = self.add_block_of_comments(line, info, block_code, fileType)
        return info

    def add_block_of_comments(self, line, info, block_code, fileType) -> dict:
        HTMLfileExtension = {"xml", "htm", "html"}
        temp = 0

        for i in range(0, len(line)):
            if fileType != "py" and fileType not in HTMLfileExtension:
                if line[i : i + 2] == "/*" or line[i : i + 2] == "*/":
                    temp = i
            elif fileType == "py":
                if line[i : i + 3] == "'''":
                    temp = i
            elif fileType in HTMLfileExtension:
                if line[i : i + 4] == "<!--" or line[i : i + 3] == "-->":
                    temp = i

        if fileType != "py" and fileType not in HTMLfileExtension:
            if line[temp : temp + 2] == "/*":
                info = self.check_block_code_cases(
                    line[1:temp], line[temp + 2 :], info, line, fileType
                )
            if line[temp : temp + 2] == "*/":
                info = self.check_block_code_cases(
                    line[temp + 2 :], line[1:temp], info, line, fileType
                )
        elif fileType == "py":
            if block_code:
                info = self.check_block_code_cases(
                    line[temp + 3 :], line[1:temp], info, line, fileType
                )
            else:
                info = self.check_block_code_cases(
                    line[1:temp], line[temp + 3 :], info, line, fileType
                )
        elif fileType in HTMLfileExtension:
            if line[temp : temp + 4] == "<!--":
                info = self.check_block_code_cases(
                    line[1:temp], line[temp + 4 :], info, line, fileType
                )
            if line[temp : temp + 3] == "-->":
                info = self.check_block_code_cases(
                    line[temp + 3 :], line[1:temp], info, line, fileType
                )
        return info

    def check_block_code_cases(self, strFront, strBack, info, line, fileType) -> dict:
        if (
            (strFront.isspace() or strFront == "")
            and strBack != ""
            and strBack.isspace() is False
        ):
            info = self.modify_info_value("comments", info, line[0])
        elif (
            strFront.isspace() or strFront == "" and strBack.isspace() or strBack == ""
        ):
            info = self.modify_info_value("syntax", info, line[0])
        else:
            info = self.add_normal_line_of_code(info, line[0] + strFront, fileType)
        return info

    def add_to_existing_line(self, signal, line, oldLine, info, fileType) -> dict:
        if oldLine != " " and line[1:] != oldLine[1:]:
            tempLine = signal + line[1:].replace(oldLine[1:], "")
            info = self.add_normal_line_of_code(info, tempLine, fileType)
        return info

    def modify_info_value(self, info_name, info, signal, amount=1) -> dict:
        if info_name == "syntax" or info_name == "spacing":
            info[info_name + "_changes"] = info[info_name + "_changes"] + amount
        else:
            if signal == "+":
                info[info_name + "_added"] = info[info_name + "_added"] + amount
            if signal == "-":
                info[info_name + "_deleted"] = info[info_name + "_deleted"] + amount
        return info

    def compare_dict_value(self, oldInfo, newInfo) -> str:
        if oldInfo["lines_added"] != newInfo["lines_added"]:
            return "lines"
        elif oldInfo["lines_deleted"] != newInfo["lines_deleted"]:
            return "lines"
        elif oldInfo["comments_added"] != newInfo["comments_added"]:
            return "comments"
        elif oldInfo["comments_deleted"] != newInfo["comments_deleted"]:
            return "comments"
        elif oldInfo["blanks_added"] != newInfo["blanks_added"]:
            return "blanks"
        elif oldInfo["blanks_deleted"] != newInfo["blanks_deleted"]:
            return "blanks"
        elif oldInfo["spacing_changes"] != newInfo["spacing_changes"]:
            return "spacing"
        elif oldInfo["syntax_changes"] != newInfo["syntax_changes"]:
            return "syntax"
