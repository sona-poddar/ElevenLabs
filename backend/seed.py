import os
from pymongo import MongoClient
MONGO_URI=os.environ.get('MONGO_URI','mongodb://localhost:27017')
DB_NAME=os.environ.get('MONGO_DB','elevendb')
client=MongoClient(MONGO_URI)
db=client[DB_NAME]
coll=db['audios']
payload={'english':'https://assets.example.com/audio/english_sample.mp3','arabic':'https://assets.example.com/audio/arabic_sample.mp3'}
coll.insert_one(payload)
print('seeded')