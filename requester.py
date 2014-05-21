#!/usr/bin/env python3

import sys
import requests
import time

def send_request(text):
	rqs = {"textarea":text}
	r = requests.post("http://hacheck.tel.fer.hr/xml.pl", data = rqs)
	return r.text


def main():

	rqs_limit = 2000
	cnt = 1
	splitWord = "!__ENDOFTEXT__!"
	endRQS = "!__ENDRQS__!"

	for line in iter(sys.stdin.readline, ''):
		answ = send_request(line)
		sys.stdout.write(line + "!__ENDOFTEXT__!" + answ + endRQS)
		cnt += 1
		if cnt > rqs_limit:
			break
		time.sleep(1)

if __name__ == "__main__":
	main()
