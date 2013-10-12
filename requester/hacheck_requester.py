from interface import IRequester
from singleton import RequestSingleton
import requests

class HacheckRequester(RequestSingleton, IRequester):

	def send_request(self, text):
		rqs = {"textarea":text}
		r = requests.post("http://hacheck.tel.fer.hr/xml.pl", data = rqs)
		#TODO: ERROR handler
		return r.text

	def __new__(cls):
		return super(HacheckRequester, cls).__new__(cls)