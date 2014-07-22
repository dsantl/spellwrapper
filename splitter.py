#!/usr/bin/env python3

import sys
import re


MAX_CHAR = 500

text = sys.stdin.read()
split_cands = [x.start() for x in re.finditer("\n\n", text)]
text = text.replace("\n", " ")

last = 0
for curr in split_cands:
    if curr - last > max_char:
        print(text[last: curr])
        last = curr

print(text[last:])
