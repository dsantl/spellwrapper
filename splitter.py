#!/usr/bin/env python3

import sys

max_char = 500
tmpText = ""

for line in iter(sys.stdin.readline, ''):
	line = line.replace("\n", " ")
	tmpText += line
	if len(tmpText) > max_char:
		print(tmpText)
		tmpText = ""