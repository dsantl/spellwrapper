#!/usr/bin/env python3

import sys

max_char = 500

text = sys.stdin.read().replace("\n", " ")
output = '\n'.join(
    text[off: off + max_char] for off in range(0, len(text), max_char)
)

print(output)
