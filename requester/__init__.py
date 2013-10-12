from hacheck_requester import HacheckRequester

class RequesterFactory:

	@staticmethod
	def get_object(objecttype):
		if objecttype == "hacheck":
			return HacheckRequester()
		else:
			raise Exception("Invalid requester type!") #TODO new type of exception for spellwrapper


a = RequesterFactory.get_object("hacheck")

a.send_request("ljepo")