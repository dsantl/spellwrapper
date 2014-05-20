from interface import IRequester
import sys
sys.path.append("../")
from common import Singleton
import requests

class HacheckRequester(Singleton, IRequester):

	def send_request(self, text):
		rqs = {"textarea":text}
		r = requests.post("http://hacheck.tel.fer.hr/xml.pl", data = rqs)
		#TODO: ERROR handler
		return r.text

	def __new__(cls):
		return super(HacheckRequester, cls).__new__(cls)