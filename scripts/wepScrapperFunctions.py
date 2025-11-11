import os
import json
import logging
from pathlib import Path
from typing import Optional
import certifi
import requests
from bs4 import BeautifulSoup
import re
from pymongo import MongoClient
from bson import json_util
from datetime import datetime, date
import pytz
from pytz import timezone
import dns  # keep for mongodb+srv resolution side-effects
from requests.adapters import HTTPAdapter
from requests.exceptions import RequestException, SSLError
from urllib3.util.retry import Retry
import inspect

monthDic = {month: index for index, month in enumerate(["January", "February", "March", "April", "May", "June",
                                                        "July", "August", "September", "October", "November",
                                                        "December"], start=1)}


# def get_current_date(tz_name: str = "Europe/Paris"):
#     """Return (day, month, year, now_tzaware)."""
#     tz = timezone(tz_name)
#     today = date.today()
#     now = datetime.now(tz)
#     return today.day, today.month, today.year, now

# def make_requests_session(retries: int = 3, backoff_factor: float = 0.3, timeout: int = 10) -> requests.Session:
#     """Create a requests.Session with retries and default timeout wrapper."""
#     session = requests.Session()
#     retry = Retry(
#         total=retries,
#         backoff_factor=backoff_factor,
#         status_forcelist=(500, 502, 503, 504),
#         allowed_methods=frozenset(["GET", "POST", "PUT", "DELETE"])
#     )
#     adapter = HTTPAdapter(max_retries=retry)
#     session.mount("https://", adapter)
#     session.mount("http://", adapter)
#     # wrap default timeout
#     session.request = _wrap_timeout(session.request, timeout)
#     return session

# def _wrap_timeout(func, timeout):
#     def wrapper(method, url, **kwargs):
#         if "timeout" not in kwargs:
#             kwargs["timeout"] = timeout
#         return func(method, url, **kwargs)
#     return wrapper

# def fetch_url(url: str, session: Optional[requests.Session] = None) -> Optional[bytes]:
#     """Fetch url content, return bytes or None on failure."""
#     session = session or make_requests_session()
#     try:
#         r = session.get(url)
#         r.raise_for_status()
#         return r.content
#     except SSLError as e:
#         logger = logging.getLogger("wepScrapper")
#         logger.warning("SSL error fetching %s: %s", url, e)
#     except RequestException as e:
#         logger = logging.getLogger("wepScrapper")
#         logger.warning("Request failed for %s: %s", url, e)
#     return None

# def connect_to_db(env_var: str = "MONGODB_WEBSCRAPPER") -> MongoClient:
#     """Create a MongoClient using environment variable connection string."""
#     connection_string = os.environ.get(env_var)
#     if not connection_string:
#         raise RuntimeError(f"{env_var} not set")
#     return MongoClient(
#         connection_string,
#         tls=True,
#         tlsCAFile=certifi.where(),
#         serverSelectionTimeoutMS=30000,
#     )

# def write_json_file(path: Path, data, encoding: str = "iso-8859-1"):
#     """Write JSON to path, create parent directories as needed."""
#     p = Path(path)
#     p.parent.mkdir(parents=True, exist_ok=True)
#     with open(p, "w", encoding=encoding) as f:
#         json.dump(data, f, indent=4, ensure_ascii=True)

def getHTMLPage(url, logger=None):
    r = requests.get(url)
    if r.status_code != 200:
        logger.error(f"Failed to retrieve the page. Status code: {r.status_code}")
        raise Exception(f"Failed to retrieve the page. Status code: {r.status_code}")
    return BeautifulSoup(r.content, 'lxml')

def HBIH_scrapPageList(soup, logger=None):
    articles = soup.find(id="main").find(class_="row").find_all(class_=["col-xs-12 col-sm-12 col-lg-4 col-md-12",
                                                                      "col-xs-12 col-sm-12 col-md-6 col-lg-4",
                                                                      "col-xs-12 col-sm-12 col-lg-8 col-md-12"])
    pageList = []
    for article in articles:
        article_json = {}
        for tag in article.find_all(['h2', 'h3']):
            try:
                article_json['articleName'] = tag.get_text()
                article_json['articleLink'] = tag.a.get('href')
                pageList.append(article_json)
            except Exception as error:
                logger.error(f"Error processing tag: {error}")
                # print(f"Error processing tag: {error}")
    return pageList

def scrapReleases_HBIH_Missive(page_list, source,logger=None):
    releases_list = []
    for pageToScrap in page_list:
        try:
            pageLink = "https://www.heavyblogisheavy.com" + pageToScrap['articleLink']
            soup = getHTMLPage(pageLink,logger)
            results = soup.find_all(isTitle_but_no_class)
            for result in results:
                artistReleaseGenres = re.match(r'^([^–-]+)\s*[–-]\s*([^(]+)\s*(?:\(([^)]+)\))?', result.get_text())
                if artistReleaseGenres:
                    artist = artistReleaseGenres.group(1).strip()
                    releaseName = artistReleaseGenres.group(2).strip()
                    genres = artistReleaseGenres.group(3)
                    genres_list = [g.strip() for g in re.split(r'[,/]', genres)] if genres else []

                    coverPath = ""
                    try:
                        allCoverPath = result.next_sibling.next_sibling.img.get('srcset').split()
                        coverPath = allCoverPath[2] if len(allCoverPath) > 2 else allCoverPath[0]
                    except Exception as error:
                        logger.error(f"Error getting cover path: {error}")
                        # print(f"Error getting cover path: {error}")

                    jsonRelease = {
                        'artistName': artist,
                        'albumName': releaseName,
                        'heavyBIsH': {
                            'id': '',
                            'reviewLink': pageToScrap['articleLink'],
                            'releaseDate': {
                                'month': getMonth(),
                                'year': getYear()
                            },
                            'imagePath': coverPath,
                            'genres': genres_list,
                            'sources': source
                        }
                    }
                    releases_list.append(jsonRelease)
                else:
                    # with open("logfile.txt", "a") as logfile:
                    #     logfile.write(result.get_text() + "\n")
                    # print(f"No match found. Logged to logfile.txt: {result.get_text()}")
                    logger.warning(f"No match found for text: {result.get_text()}, on page: {pageLink} ")
        except Exception as e:
            # print(f"Error scraping page {pageToScrap['articleLink']}: {e}")
            logger.error(f"Error scraping page {pageToScrap['articleLink']}: {e}")

    return releases_list

def isTitle_but_no_class(tag):
    return (tag.name == "h2" or tag.name == "h3") and not tag.has_attr('class')

def getMonth():
    return date.today().month

def getYear():
    return date.today().year

# def saveToFile(fileName, dataToSave):
#     with open(fileName, 'w', encoding='utf-8') as f:
#         json.dump(dataToSave, f, indent=4, ensure_ascii=False)

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

def main():
    main_url = 'https://www.heavyblogisheavy.com/2024/05/24/post-rock-post-may-2024/'
    source = "Heavy Blog is Heavy"
    soup = getHTMLPage(main_url)
    page_list = HBIH_scrapPageList(soup)
    releases = scrapReleases_HBIH_Missive(page_list, source)
    saveToFile('albums.json', releases)
    saveToDatabase('albums.json')

if __name__ == '__main__':
    main()
