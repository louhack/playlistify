import os
import json
import logging
import inspect
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path
from typing import List, Optional, Dict, Any
import re
import time
from datetime import date, datetime

import pytz
import certifi
import requests
from requests.exceptions import RequestException, SSLError
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
from bson import json_util
from pymongo import MongoClient


def make_requests_session(retries: int = 3, backoff_factor: float = 0.3, timeout: int = 10) -> requests.Session:
    """Create a requests.Session with retries and default timeout wrapper."""
    session = requests.Session()
    retry = Retry(
        total=retries,
        backoff_factor=backoff_factor,
        status_forcelist=(500, 502, 503, 504),
        allowed_methods=frozenset(["GET", "POST", "PUT", "DELETE"])
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    # wrap default timeout
    session.request = _wrap_timeout(session.request, timeout)
    return session

def _wrap_timeout(func, timeout):
    def wrapper(method, url, **kwargs):
        if "timeout" not in kwargs:
            kwargs["timeout"] = timeout
        return func(method, url, **kwargs)
    return wrapper

def fetch_url(url: str, session: Optional[requests.Session] = None) -> Optional[bytes]:
    """Fetch url content, return bytes or None on failure."""
    session = session or make_requests_session()
    try:
        r = session.get(url)
        r.raise_for_status()
        return r.content
    except SSLError as e:
        logger = retrieveLogger(inspect.stack()[1])
        logger.warning("SSL error fetching %s: %s", url, e)
    except RequestException as e:
        logger = retrieveLogger(inspect.stack()[1])
        logger.warning("Request failed for %s: %s", url, e)
    return None

def connect_to_db(env_var: str = "MONGODB_WEBSCRAPPER") -> MongoClient:
    """Create a MongoClient using environment variable connection string."""
    logger = retrieveLogger(inspect.stack()[1])
    logger.info("Connecting to database")
    connection_string = os.environ.get(env_var)
    if not connection_string:
        logger.error(f"{env_var} not set")
        raise RuntimeError(f"{env_var} not set")
    logger.info(f"Connected to database with connection string: {connection_string}")
    return MongoClient(
        connection_string,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=30000,
    )

def write_json_file(path: Path, data, encoding: str = "iso-8859-1"):
    """Write JSON to path, create parent directories as needed."""
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding=encoding) as f:
        json.dump(data, f, indent=4, ensure_ascii=True)

def setup_logger(logfile: Optional[Path] = None, level: int = logging.INFO, name: Optional[str] = None, console: Optional[bool] = None) -> logging.Logger:
    """Create or return a logger that writes to logfile and optionally stdout.

    If name is not provided, derive a name from the calling script filename so
    each script gets its own logger identity (e.g. wepScrapper.sputnikScript2).
    Console logging can be disabled by setting environment variable LOG_TO_CONSOLE=0
    or by passing console=False.
    """
    # derive caller name when not provided
    if name is None:
        try:
            caller_frame = inspect.stack()[1]
            caller_file = Path(caller_frame.filename).stem
            name = f"wepScrapper.{caller_file}"
        except Exception:
            name = "wepScrapper"

    # decide console default from env if not explicitly provided
    if console is None:
        console = os.getenv("LOG_TO_CONSOLE", "1").lower() in ("1", "true", "yes")

    logger = logging.getLogger(name)
    if logger.handlers:
        return logger

    logger.setLevel(level)
    fmt = logging.Formatter("%(asctime)s %(name)s %(levelname)s %(message)s")

    if console:
        stream_h = logging.StreamHandler()
        stream_h.setFormatter(fmt)
        logger.addHandler(stream_h)

    if logfile:
        logfile = Path(logfile)
        logfile.parent.mkdir(parents=True, exist_ok=True)
        file_h = logging.FileHandler(logfile)
        file_h.setFormatter(fmt)
        logger.addHandler(file_h)

    # prevent propagation to root logger (avoid duplicates)
    logger.propagate = False

    return logger

def retrieveLogger(caller_frame=None, console: Optional[bool] = None):
    # derive the calling script name and get a logger with that identity
    if caller_frame is None:
        caller_frame = inspect.stack()[1]
    caller_file = Path(caller_frame.filename).stem
    logger = setup_logger(name=f"wepScrapper.{caller_file}", console=console)
    return logger


def remove_duplicates(collection):
    logger = retrieveLogger(inspect.stack()[1])
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
    logger.info(f"Number of duplicates found: {num_duplicates}")

    for info in duplicate_info:
        oldest_id = info['oldestId']
        duplicate_ids = info['duplicateIds']
        
        # Log the IDs of the duplicates and the one that is going to be kept
        logger.info(f"Duplicate IDs: {duplicate_ids}. Keeping: {oldest_id}")
    
        # Remove all documents with _id not equal to oldest_id
        collection.delete_many({"_id": {"$in": duplicate_ids, "$ne": oldest_id}})

def connect_to_database():
    logger = retrieveLogger(inspect.stack()[1])
    logger.info("Connecting to database")
    db_url = os.environ.get('MONGODB_WEBSCRAPPER')
    logger.info(db_url)
    client = MongoClient(db_url)
    logger.info(f"Connected to database {client}")
    return client


def update_db(connection: MongoClient, data: List[Dict[str, Any]]):
    logger = retrieveLogger(inspect.stack()[1])
    # caller_frame = 
    # caller_file = Path(caller_frame.filename).stem
    # logger = setup_logger(name=f"wepScrapper.{caller_file}")
    
    db = connection["heroku_j6lv18qq"]
    releases = db.albums
    t_day, t_month, t_year, now = get_current_date()
    for album in data:
        result = releases.update_one(
            {
                "artistName": {"$regex": "^" + re.escape(album["artistName"]) + "$", "$options": "i"},
                "albumName": {"$regex": "^" + re.escape(album["albumName"]) + "$", "$options": "i"},
            },
            {
                "$set": album,
                "$currentDate": {"lastModified": True},
                "$setOnInsert": {"created": now, "sortDate": {"day": t_day, "month": t_month, "year": t_year}},
            },
            upsert=True,
        )
        logger.info(
            "Upserted: matched=%d modified=%d upserted_id=%s",
            getattr(result, "matched_count", None),
            getattr(result, "modified_count", None),
            getattr(result, "upserted_id", None),
        )

# def saveToDatabase(fileName,logger=None):
#     connection_string = os.environ.get('MONGODB_WEBSCRAPPER')
#     if not connection_string:
#         logger.error("Database connection string not found in environment variables")
#         raise Exception("Database connection string not found in environment variables")

#     connection = MongoClient(connection_string,
#                       tls=True,                 # or ssl=True is fine, but tls is preferred
#                       tlsCAFile=certifi.where(),
#                       serverSelectionTimeoutMS=30000)
#     db = connection['heroku_j6lv18qq']
#     releases = db.albums

#     with open(fileName, "r", encoding='utf-8') as albums:
#         parsedAlbums = json_util.loads(albums.read())

#     timezone = pytz.timezone("Europe/Paris")

#     for album in parsedAlbums:
#         result = releases.update_one(
#             {'artistName': {'$regex': '^' + re.escape(album['artistName']) + '$', '$options': 'i'},
#              'albumName': {'$regex': '^' + re.escape(album['albumName']) + '$', '$options': 'i'}},
#             {'$set': album,
#              '$currentDate': {'lastModified': True},
#              '$setOnInsert': {'created': timezone.localize(datetime.now()),
#                               'sortDate': {'day': date.today().day, 'month': getMonth(), 'year': getYear()}}},
#             upsert=True
#         )
#         logger.info(f"Updated album: {album['artistName']} - {album['albumName']} with result: {result}")
#         # print(f"Updated album: {album['artistName']} - {album['albumName']} with result: {result}")

#     connection.close()
#     logger.info(f"# of Album inserted/Updated: {len(parsedAlbums)}")
#     print(f"# of Album inserted/Updated: {len(parsedAlbums)}")

# def saveToDatabase(fileName):
#     logger = logging.getLogger("wepScrapper")
#     client = connect_to_database()
#     db = client['heroku_j6lv18qq']
#     releases = db.albums
#     timezone = pytz.timezone("Europe/Paris")

#     with open(fileName, "r") as albums_file:
#         parsedAlbums = json_util.loads(albums_file.read())

#     for album in parsedAlbums:
#         result = releases.update_one(
#             {
#                 'artistName': {'$regex': f'^{re.escape(album["artistName"])}$', '$options': 'i'}, 
#                 'albumName': {'$regex': f'^{re.escape(album["albumName"])}$',  '$options': 'i'}
#             }, 
#             {
#                 '$set': album, 
#                 '$currentDate': { 'lastModified': True }, 
#                 '$setOnInsert': {
#                     'created': timezone.localize(datetime.datetime.now()), 
#                     'sortDate': {
#                         'day': getTodaysDay(), 
#                         'month': getMonth(), 
#                         'year': getYear()
#                     }
#                 }
#             }, 
#             upsert=True
#         )
#         logger.info(f"DB Update result : {result.matched_count}, modified : {result.modified_count}, upsert : {result.upserted_id is not None}")

#     client.close()


def getTodaysDay():
  # timezone = pytz.timezone("Europe/Paris")
  today = date.today()
  return today.day

def get_current_date(tz_name: str = "Europe/Paris"):
    """Return (day, month, year, now_tzaware)."""
    tz = pytz.timezone(tz_name)
    today = date.today()
    now = datetime.now(tz)
    return today.day, today.month, today.year, now

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