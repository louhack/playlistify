import certifi
import requests
from bs4 import BeautifulSoup
import json
import re
import unicodedata
from pymongo import MongoClient
from bson import json_util
import os
from datetime import datetime, date
import pytz

monthDic = {month: index for index, month in enumerate(["January", "February", "March", "April", "May", "June",
                                                        "July", "August", "September", "October", "November",
                                                        "December"], start=1)}

def getHTMLPage(url):
    r = requests.get(url)
    if r.status_code != 200:
        raise Exception(f"Failed to retrieve the page. Status code: {r.status_code}")
    return BeautifulSoup(r.content, 'lxml')

def HBIH_scrapPageList(soup):
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
                print(f"Error processing tag: {error}")
    return pageList

def scrapReleases_HBIH_Missive(page_list, source):
    releases_list = []
    for pageToScrap in page_list:
        try:
            pageLink = "https://www.heavyblogisheavy.com" + pageToScrap['articleLink']
            soup = getHTMLPage(pageLink)
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
                        print(f"Error getting cover path: {error}")

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
                    with open("logfile.txt", "a") as logfile:
                        logfile.write(result.get_text() + "\n")
                    print(f"No match found. Logged to logfile.txt: {result.get_text()}")
        except Exception as e:
            print(f"Error scraping page {pageToScrap['articleLink']}: {e}")

    return releases_list

def isTitle_but_no_class(tag):
    return (tag.name == "h2" or tag.name == "h3") and not tag.has_attr('class')

def getMonth():
    return date.today().month

def getYear():
    return date.today().year

def saveToFile(fileName, dataToSave):
    with open(fileName, 'w', encoding='utf-8') as f:
        json.dump(dataToSave, f, indent=4, ensure_ascii=False)

def saveToDatabase(fileName):
    connection_string = os.environ.get('MONGODB_WEBSCRAPPER')
    if not connection_string:
        raise Exception("Database connection string not found in environment variables")

    connection = MongoClient(connection_string,
                      tls=True,                 # or ssl=True is fine, but tls is preferred
                      tlsCAFile=certifi.where(),
                      serverSelectionTimeoutMS=30000)
    db = connection['heroku_j6lv18qq']
    releases = db.albums

    with open(fileName, "r", encoding='utf-8') as albums:
        parsedAlbums = json_util.loads(albums.read())

    timezone = pytz.timezone("Europe/Paris")

    for album in parsedAlbums:
        result = releases.update_one(
            {'artistName': {'$regex': '^' + re.escape(album['artistName']) + '$', '$options': 'i'},
             'albumName': {'$regex': '^' + re.escape(album['albumName']) + '$', '$options': 'i'}},
            {'$set': album,
             '$currentDate': {'lastModified': True},
             '$setOnInsert': {'created': timezone.localize(datetime.now()),
                              'sortDate': {'day': date.today().day, 'month': getMonth(), 'year': getYear()}}},
            upsert=True
        )
        print(f"Updated album: {album['artistName']} - {album['albumName']} with result: {result}")

    connection.close()

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
