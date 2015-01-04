#!/usr/bin/env python3

import sys
import re

def main():

    file_name = sys.argv[1]

    errors = sys.stdin.readlines()

    error_map = dict()

    for i in range(0, len(errors), 2):
        word = errors[i].rstrip()
        sug_list = errors[i+1].rstrip()
        error_map[word] = sug_list
    
    with open(file_name) as f:
        latexText = "".join(f.readlines())

    for key in error_map:
        error_text = " ERROR{"+key+"}{"+error_map[key]+"} "
        latexText = re.sub("\W"+key+"\W", error_text, latexText)
        
    print(latexText)

if __name__ == "__main__":
    main()
