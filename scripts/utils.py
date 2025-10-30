import json
import logging
from logging.handlers import TimedRotatingFileHandler
import datetime
import os
from bson import json_util
from pymongo import MongoClient
import utils
from datetime import date
import pytz
import re

def setup_logger(log_file):
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    if log_file is None:
        # Default log file name
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        log_file = os.path.join(log_dir, f"log_{today}.log")
    else:
        # Add "logs" folder to the log file path
        log_file = os.path.join(log_dir, log_file)

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s', datefmt='%d/%m/%Y %H:%M:%S')

    handler = TimedRotatingFileHandler(log_file, when="midnight", interval=1, backupCount=100)
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger

def remove_duplicates(collection):
    logger = setup_logger(None)
    pipeline = [
        {"$addFields": {
            "artistName": {"$trim": {"input": "$artistName"}},
            "albumName": {"$trim": {"input": "$albumName"}}
        }},
        {"$group": {
            "_id": {
                "artistName": {"$toLower": "$artistName"},
                "albumName": {"$toLower": "$albumName"}
            },
            "count": {"$sum": 1},
            "oldestId": {"$min": "$_id"},
            "duplicateIds": {"$push": "$_id"}  # Collect IDs of duplicates
        }},
        {"$match": {"count": {"$gt": 1}}},
        {"$project": {
            "_id": 0,
            "oldestId": 1,
            "duplicateIds": 1
        }}
    ]

    duplicate_info = list(collection.aggregate(pipeline))

    # Log the number of duplicates found
    num_duplicates = len(duplicate_info)
    logging.info(f"Number of duplicates found: {num_duplicates}")

    for info in duplicate_info:
        oldest_id = info['oldestId']
        duplicate_ids = info['duplicateIds']
        
        # Log the IDs of the duplicates and the one that is going to be kept
        logger.info(f"Duplicate IDs: {duplicate_ids}. Keeping: {oldest_id}")
    
        # Remove all documents with _id not equal to oldest_id
        collection.delete_many({"_id": {"$in": duplicate_ids, "$ne": oldest_id}})

def connect_to_database():
    logger = utils.setup_logger(None)
    logger.info("Connecting to database")
    db_url = os.environ.get('MONGODB_WEBSCRAPPER')
    logger.info(db_url)
    client = MongoClient(db_url)
    logger.info(f"Connected to database {client}")
    return client

def saveToDatabase(fileName):
    logger = utils.setup_logger(None)
    client = connect_to_database()
    db = client['heroku_j6lv18qq']
    releases = db.albums
    timezone = pytz.timezone("Europe/Paris")

    with open(fileName, "r") as albums_file:
        parsedAlbums = json_util.loads(albums_file.read())

    for album in parsedAlbums:
        result = releases.update_one(
            {
                'artistName': {'$regex': f'^{re.escape(album["artistName"])}$', '$options': 'i'}, 
                'albumName': {'$regex': f'^{re.escape(album["albumName"])}$',  '$options': 'i'}
            }, 
            {
                '$set': album, 
                '$currentDate': { 'lastModified': True }, 
                '$setOnInsert': {
                    'created': timezone.localize(datetime.datetime.now()), 
                    'sortDate': {
                        'day': getTodaysDay(), 
                        'month': getMonth(), 
                        'year': getYear()
                    }
                }
            }, 
            upsert=True
        )
        logger.info(f"DB Update result : {result.matched_count}, modified : {result.modified_count}, upsert : {result.upserted_id is not None}")

    client.close()


def getTodaysDay():
  # timezone = pytz.timezone("Europe/Paris")
  today = date.today()
  return today.day

def getMonth():
  # timezone = pytz.timezone("Europe/Paris")
  today = date.today()
  return today.month

def getYear():
  # timezone = pytz.timezone("Europe/Paris")
  today = date.today()
  return today.year

# SAVE DATA TO FILE
def saveToFile(fileName, dataToSave):
  dirName = os.path.dirname(fileName)
      # If the directory does not exist, create it
  if not os.path.exists(dirName):
    os.makedirs(dirName)

  with open(fileName, 'w', encoding='iso-8859-1') as f:
    json.dump(dataToSave, f, indent=4, ensure_ascii=True)
  f.close()