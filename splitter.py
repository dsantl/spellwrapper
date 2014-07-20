#!/usr/bin/env python3

import sys

import locale
locale.getpreferredencoding = lambda: 'UTF-8'

sys.stdin = open('/dev/stdin', 'r')       # Re-open standard files in UTF-8 
sys.stdout = open('/dev/stdout', 'w')     # mode.
sys.stderr = open('/dev/stderr', 'w')

max_char = 500
tmpText = ""

for line in iter(sys.stdin.readline, ''):
	line = line.replace("\n", " ")
	tmpText += line
	if len(tmpText) > max_char:
		print(tmpText)
		tmpText = ""