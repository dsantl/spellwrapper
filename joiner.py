#!/usr/bin/env python3

import sys
import xml.etree.ElementTree as ET


def generate_suggestion_list(error):
    words = error.find("suggestions")
    return [w.text for w in words] if words else []


def return_solution(offset_list, solution_text):

    error_words = list()

    for item in offset_list:
        errors, offset = item
        for error in errors:
            real_position = -1
            real_lenght = -1
            position = error.find("position")
            lenght = error.find("length")
            if position is not None:
                real_position = int(position.text) + offset
            if lenght is not None:
                real_lenght = int(lenght.text)

            if real_position != -1 and real_lenght != -1:
                word = solution_text[real_position:real_position+real_lenght]
                suggestion_list = generate_suggestion_list(error)
                error_words.append((word, suggestion_list))

    for errors in error_words:
        word, suggestion_list = errors
        print(word)
        print(suggestion_list)


def get_all_errors(root):

    ret_list = [error for error in root.findall('error')]

    for child in root:
        ret_list.extend(get_all_errors(child))

    return ret_list


def main():
    splitWord = "!__ENDOFTEXT__!"
    endRQS = "!__ENDRQS__!"

    allText = "".join(sys.stdin.readlines())
    offset = 0
    offset_list = list()  # list of tuple(error_list, offset)
    solution_text = ""  # allText without escape words

    rqs_list = allText.split(endRQS.rstrip())

    for rqs in rqs_list:

        if rqs.find(splitWord) == -1:
            continue

        text, errors = rqs.split(splitWord)
        root = ET.fromstring(errors)
        offset_list.append((get_all_errors(root), offset))  # append tupple
        offset += len(text)
        solution_text += text

    return_solution(offset_list, solution_text)

if __name__ == "__main__":
    main()
