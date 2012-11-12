# Tweet class: 
# A Tweet representation from the JSON file got from a search with the Tweeter API 

class Tweet:

    def __init__(self):
        self.userMentions = list()
        self.user = ""
        self.userName = ""
        self.profileImgUrlHttp = ""
        self.source = ""
        self.text = ""
        self.toUser = ""
        self.userId = ""
        self.id = ""
        self.date = ""
