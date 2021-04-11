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

        oldLine = " "
        fileType = self.check_for_code_type(codeDiffObject)

        HTMLfileExtension = {"xml", "htm", "html"}
        python = False
        HTML = False
        SQL = False
        generalFileType = False

        if fileType == "py":
            python = True
        elif fileType == "sql":
            SQL = True
        elif fileType in HTMLfileExtension:
            HTML = True
        else:
            generalFileType = True

        block_code = False

        diffCode = codeDiffObject
        for line in diffCode.diff.splitlines():
            if line[0] == "+" or line[0] == "-":

                # Check for block of comments
                # -------------------------------------------------
                temp = info.copy()
                if generalFileType is True or SQL is True:
                    info = self.define_block_of_code(
                        block_code, "/*", line, info, python, HTML, SQL, generalFileType
                    )
                    if "/*" in line and "*/" in line:
                        block_code = False
                    elif "/*" in line:
                        block_code = True
                    if "*/" in line and info == temp:
                        info = self.add_block_of_comments(
                            line, python, info, block_code, HTML, SQL, generalFileType
                        )
                        block_code = False
                elif python is True:
                    info = self.define_block_of_code(
                        block_code,
                        "'''",
                        line,
                        info,
                        python,
                        HTML,
                        SQL,
                        generalFileType,
                    )
                    if line.count("'''") == 2:
                        block_code = False
                    elif "'''" in line:
                        block_code = not block_code
                elif HTML is True:
                    info = self.define_block_of_code(
                        block_code,
                        "<!--",
                        line,
                        info,
                        python,
                        HTML,
                        SQL,
                        generalFileType,
                    )
                    if "<!--" in line and "-->" in line:
                        block_code = False
                    elif "<!--" in line:
                        block_code = True
                    if "-->" in line and info == temp:
                        info = self.add_block_of_comments(
                            line, python, info, block_code, HTML, SQL, generalFileType
                        )
                        block_code = False
                if info != temp:
                    oldLine = line
                    continue
                # -------------------------------------------------

                # Adding to middle of the line instead of to the front or the back
                # -------------------------------------------------
                if line[0] != oldLine[0] and abs(len(line) - len(oldLine)) == 1:
                    info = self.add_one_char_middle(
                        line, oldLine, info, python, SQL, generalFileType
                    )
                    if temp != info:
                        info = self.modify_info_value("lines", info, oldLine[0], -1)
                        oldLine = line
                        continue
                # -------------------------------------------------

                # Adding to an exisiting line
                # -------------------------------------------------
                if oldLine[1:] in line[1:] and oldLine[0] != line[0]:
                    info = self.add_to_existing_line(
                        "+", line, oldLine, info, python, SQL, generalFileType
                    )
                if line[1:] in oldLine[1:] and oldLine[0] != line[0]:
                    info = self.add_to_existing_line(
                        "-", oldLine, line, info, python, SQL, generalFileType
                    )
                if info != temp:
                    info = self.modify_info_value("lines", info, oldLine[0], -1)
                    oldLine = line
                    continue
                # -------------------------------------------------

                # Normal case
                # -------------------------------------------------
                info = self.add_normal_line_of_code(
                    info, line, python, SQL, generalFileType
                )
                oldLine = line
                # -------------------------------------------------

        return info

    def check_for_code_type(self, codeDiffObject: CodeDiff) -> str:
        diffCode = codeDiffObject
        fileName = diffCode.new_path
        found = re.search("\.(.+?)$", fileName)
        if found is not None:
            return found.group(1)
        return None

    def add_normal_line_of_code(self, info, line, python, SQL, generalFileType) -> dict:
        if len(line) == 1:
            info = self.modify_info_value("blanks", info, line)
            return info

        temp = info.copy()
        info = self.check_for_spacing_syntax_or_comment(
            line[0:1], info, line[1:], python, SQL, generalFileType
        )
        if info != temp:
            return info

        info = self.modify_info_value("lines", info, line[0])
        return info

    def check_for_spacing_syntax_or_comment(
        self, signal, info, str, python, SQL, generalFileType
    ) -> dict:
        isSyntax = False
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
            info["spacing_changes"] = info["spacing_changes"] + 1
            return info

        for i in range(0, len(str)):
            if str[i] in syntaxStr:
                isSyntax = True
                continue
        if python:
            if str[i] == "#" and isSyntax is False:
                info = self.modify_info_value("comments", info, signal)
                return info
        elif SQL:
            if str[i : i + 2] == "--" and isSyntax is False:
                info = self.modify_info_value("comments", info, signal)
                return info
        elif generalFileType:
            if str[i : i + 2] == "//" and isSyntax is False:
                info = self.modify_info_value("comments", info, signal)
                return info
        if str[i] != " ":
            return info

        if isSyntax:
            info["syntax_changes"] = info["syntax_changes"] + 1
        return info

    def add_one_char_middle(
        self, line, oldLine, info, python, SQL, generalFileType
    ) -> dict:
        temp = 0
        if len(line) > len(oldLine):
            length = len(oldLine)
        else:
            length = len(line)

        for i in range(0, length):
            if oldLine[i] != line[i]:
                temp = i
                break

        if temp != 0:
            if len(line) > len(oldLine):
                info = self.add_normal_line_of_code(
                    info, line[0] + line[temp], python, SQL, generalFileType
                )
            else:
                info = self.add_normal_line_of_code(
                    info, oldLine[0] + oldLine[temp], python, SQL, generalFileType
                )
        return info

    def define_block_of_code(
        self,
        block_code,
        signal_block_code,
        line,
        info,
        python,
        HTML,
        SQL,
        generalFileType,
    ) -> dict:
        if block_code == True and signal_block_code not in line:
            if "*/" not in line and "'''" not in line and "-->" not in line:
                info = self.modify_info_value("comments", info, line[0])
                return info

        if signal_block_code in line:
            if ("*/" in line or "-->" in line and python == False) or (
                line.count(signal_block_code) == 2 and python == True
            ):
                info = self.modify_info_value("comments", info, line[0])
            else:
                info = self.add_block_of_comments(
                    line, python, info, block_code, HTML, SQL, generalFileType
                )
        return info

    def add_block_of_comments(
        self, line, python, info, block_code, HTML, SQL, generalFileType
    ) -> dict:
        temp = 0

        for i in range(0, len(line)):
            if generalFileType or SQL:
                if line[i : i + 2] == "/*" or line[i : i + 2] == "*/":
                    temp = i
            elif python:
                if line[i : i + 3] == "'''":
                    temp = i
            elif HTML:
                if line[i : i + 4] == "<!--" or line[i : i + 3] == "-->":
                    temp = i

        if generalFileType or SQL:
            if line[temp : temp + 2] == "/*":
                info = self.check_block_code_cases(
                    line[1:temp],
                    line[temp + 2 :],
                    info,
                    line,
                    python,
                    SQL,
                    generalFileType,
                )
            if line[temp : temp + 2] == "*/":
                info = self.check_block_code_cases(
                    line[temp + 2 :],
                    line[1:temp],
                    info,
                    line,
                    python,
                    SQL,
                    generalFileType,
                )
        elif python:
            if block_code:
                info = self.check_block_code_cases(
                    line[temp + 3 :],
                    line[1:temp],
                    info,
                    line,
                    python,
                    SQL,
                    generalFileType,
                )
            else:
                info = self.check_block_code_cases(
                    line[1:temp],
                    line[temp + 3 :],
                    info,
                    line,
                    python,
                    SQL,
                    generalFileType,
                )
        elif HTML:
            if line[temp : temp + 4] == "<!--":
                info = self.check_block_code_cases(
                    line[1:temp],
                    line[temp + 4 :],
                    info,
                    line,
                    python,
                    SQL,
                    generalFileType,
                )
            if line[temp : temp + 3] == "-->":
                info = self.check_block_code_cases(
                    line[temp + 3 :],
                    line[1:temp],
                    info,
                    line,
                    python,
                    SQL,
                    generalFileType,
                )
        return info

    def check_block_code_cases(
        self, strFront, strBack, info, line, python, SQL, generalFileType
    ) -> dict:
        if (
            (strFront.isspace() or strFront == "")
            and strBack != ""
            and strBack.isspace() is False
        ):
            info = self.modify_info_value("comments", info, line[0])
        elif (
            strFront.isspace() or strFront == "" and strBack.isspace() or strBack == ""
        ):
            info["syntax_changes"] = info["syntax_changes"] + 1
        else:
            info = self.add_normal_line_of_code(
                info, line[0] + strFront, python, SQL, generalFileType
            )
        return info

    def add_to_existing_line(
        self, signal, line, oldLine, info, python, SQL, generalFileType
    ) -> dict:
        if oldLine != " " and line[1:] != oldLine[1:]:
            tempLine = signal + line[1:].replace(oldLine[1:], "")
            info = self.add_normal_line_of_code(
                info, tempLine, python, SQL, generalFileType
            )
        return info

    def modify_info_value(self, info_name, info, signal, amount=1) -> dict:
        if signal == "+":
            info[info_name + "_added"] = info[info_name + "_added"] + amount
        if signal == "-":
            info[info_name + "_deleted"] = info[info_name + "_deleted"] + amount
        return info
