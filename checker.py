#!/usr/bin/env python3

import sys


def main():

    file_name = sys.argv[1]

    with open(file_name) as f:
        latexText = "".join(f.readlines())

    errors = sys.stdin.readlines()
    begin = 0

    for i in range(0, len(errors), 2):
        word = errors[i].rstrip()
        sug_list = errors[i+1].rstrip()
        start = latexText.find(word, begin)
        if start == -1:
            continue
        lenght = len(word)
        sys.stdout.write(
            latexText[begin:start]+">>>ERROR>>>"+word+" "+sug_list+"<<< ")
        begin = start + lenght

    print(latexText[begin:])

if __name__ == "__main__":
    main()
