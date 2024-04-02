from bs4 import BeautifulSoup
from lxml import html
import requests
import json
import re
import unicodedata
import pytz
import datetime
from datetime import date
from  pymongo import MongoClient
from bson import json_util
import os


monthDic = {}
monthDic["January"]=1
monthDic["February"]=2
monthDic["March"]=3
monthDic["April"]=4
monthDic["May"]=5
monthDic["June"]=6
monthDic["July"]=7
monthDic["August"]=8
monthDic["September"]=9
monthDic["October"]=10
monthDic["November"]=11
monthDic["December"]=12

def getHTMLPage(page):
  r = requests.get(page)
  if r.status_code != 200:
    exit
  soup = BeautifulSoup(r.content.decode("utf8"), 'lxml')
  return soup

def HBIH_scrapPageList(soup):
  table_articles = soup.find(id="main").find(class_="row").find_all(class_=["col-xs-12 col-sm-12 col-lg-4 col-md-12", "col-xs-12 col-sm-12 col-md-6 col-lg-4", "col-xs-12 col-sm-12 col-lg-8 col-md-12"])
  # print(table_articles)
  pageList = []
  # print(table_articles)
  # article_h2 = table_articles.find_all("h2")
  # article_h3 = table_articles.find_all("h3")
  for article in table_articles:
    # print("tag")
    # print(article)
    # print("article\n")
    article_json = {}
    for tag in article.find_all(['h2', 'h3']):
      # print(tag)
      try:
        article_json['articleName'] = tag.get_text()
        article_json['articleLink'] = tag.a.get('href')
        pageList.append(article_json)
      except Exception as error:
        print(error)
  # print(article_json)
  return pageList


def scrapReleases_HBIH_Missive(page_list, source):
  jsonRelease = {}
  releases_list = []

  for pageToScrap in page_list:
    try:
      pageLink = "https://www.heavyblogisheavy.com"+pageToScrap['articleLink']
      soup = getHTMLPage(pageLink)
      results = soup.find_all(isTitle_but_no_class)
      # print(results)
      # print(pageToScrap['articleName'])
      for result in results:
        # different patterns /
        # rePattern_ArtistReleaseGenres = r'(^[^-]*[^ -]) – ([^ -][^-]*) \(([^)]+)\)'
        # rePattern_ArtistReleaseGenres = r'(^[^-]*[^ -]) *– *([^(]*) +\(([^)]+)\)'

        # this pattern works nicely. Expected pattern : <ArtistName> - < AblumNane> (Genre 1, ..., Genre n)
        print(result.get_text())
        # rePattern_ArtistReleaseGenres = r'(^.*[^ -]) *– *([^- ].*[^ (]) *\(([^)]+)\)'
        #rePattern_ArtistReleaseGenres = r'(^.*[^ -]) *– *([^- ].*)'
        # rePattern_ArtistReleaseGenres = r'^([^-]+) - ([^(]+) \(([^)]+)\)'
        # rePattern_ArtistReleaseGenres = r'^([^-]+)\s*-\s*([^(]+)\s*\(([^)]+)\)'
        # rePattern_ArtistReleaseGenres = r'^([^–-]+)\s*[–-]\s*([^(]+)\s*\(([^)]+)\)'
        # rePattern_ArtistReleaseGenres = r'^([^–-]+)\s*[–-]\s*([^(]+)\s*\(([^)]+)\)'
        rePattern_ArtistReleaseGenres = r'^([^–-]+)\s*[–-]\s*([^(]+)\s*(?:\(([^)]+)\))?'

        artistReleaseGenres = re.match(rePattern_ArtistReleaseGenres, result.get_text())
        # print(artistReleaseGenres)

        if artistReleaseGenres:
          artist = artistReleaseGenres.group(1).strip()
          releaseName = artistReleaseGenres.group(2).strip()
          genres = artistReleaseGenres.group(3).strip()

          print("artist :", artist)
          print("releaseName :", releaseName)
          print("genres :", genres)
          
        # if len(artistReleaseGenres) == 1 and len(artistReleaseGenres[0]) == 2:
          # rePattern_ReleaseGenres = r'(.*[^ (]) *\(([^)]+)\)'
          # releaseGenres = re.findall(rePattern_ReleaseGenres, unicodedata.normalize('NFKD', artistReleaseGenres[0][1]))
          # print(releaseGenres)
        # (^.*[^ -]) *– *([^- ].*)   -> group1 = artistName // group2 = albumName (Genres)
        # (.*[^ (]) *\(([^)]+)\)  Decoup qlbumName et Genres
        # search the release based on the regex pattern
        # if len(artistReleaseGenres) == 1 and len(artistReleaseGenres[0]) == 3:
            #Regex has matched a release. I save the information
          # artist = str.strip(artistReleaseGenres[0][0])
          # if len(releaseGenres) > 0:
            # releaseName = str.strip(releaseGenres[0][0])
          
          # Checking if the string contains ","
          if "," in genres:
            genres_list = genres.split(",")
          # Checking if the string contains "/"
          elif "/" in genres:
            genres_list = genres.split("/")
          else:
          # If neither separator is found, treat the whole string as a single element
            genres_list = [genres]   
            # genres = str.split(releaseGenres[0][1], ",")
            # genresClean = []
            # for genre in genres:
              # genresClean.append(str.strip(genre))
            # print(releaseName)
            # print(genresClean)
          # else:
            # genresClean=[]
            # releaseName = str.strip(artistReleaseGenres[0][1])
            # print(releaseName)

          # print("GENRES : " + str(genresClean))
          # I need to find the path for the cover
          coverPath = ""
          try:
            allCoverPath = result.next_sibling.next_sibling.img.get('srcset').split()
            # if several cover path are existing, I save the 2nd one - lower resolution
            if len(allCoverPath) > 2:
              coverPath = allCoverPath[2]
            elif len(allCoverPath) > 0:
              coverPath = allCoverPath[0]

          except Exception as error:
            print(error)
            pass

          jsonRelease = {'artistName':artist, 'albumName':releaseName,'heavyBIsH':{'id':'', 'reviewLink': pageToScrap['articleLink'], 'releaseDate':{ 'month': getMonth(), 'year': getYear()}, 'imagePath': coverPath, 'genres': genres_list, 'sources': source}}
          # print(jsonRelease)
          releases_list.append(jsonRelease)

        else:
          # Write the input_string to a log file
          with open("logfile.txt", "a") as logfile:
            logfile.write(result.get_text() + "\n")
          print("No match found. Logged to logfile.txt")
          # print("No album detected : " + str(artistReleaseGenres))
    except SyntaxError as syntax_error:
      print(syntax_error)
    except AttributeError as attibute_error:
      print(attibute_error)


  return releases_list

def isTitle_but_no_class(tag):
  """
  Release are located in h2 tags with no class
  """
  return (tag.name == "h2" or tag.name == "h3") and not tag.has_attr('class')
#print(releases_list)

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
  with open(fileName, 'w', encoding='iso-8859-1') as f:
    json.dump(dataToSave, f, indent=4, ensure_ascii=True)
  f.close()


##### UPSERT IN DB - COLLECTION :ALBUMS
def saveToDabase(fileName):
  # connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")
  #connection = MongoClient(os.environ.get('MONGODB_WEBSCRAPPER'))

  #db = connection.get_default_database()
  print("Connecting to db")
  print(os.environ.get('MONGODB_WEBSCRAPPER'))
  connection = MongoClient(os.environ.get('MONGODB_WEBSCRAPPER'))
  print(connection)
  #connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")

  db = connection['heroku_j6lv18qq']
  releases = db.albums
  albums = open(fileName, "r")
  parsedAlbums = json_util.loads(albums.read())
  timezone = pytz.timezone("Europe/Paris")
# today = date.today()
# t_day = today.day
# t_month = today.month
# t_year = today.year

  for album in parsedAlbums:
    # print("PRINT ALBUM ", album["heavyBIsH"]["id"])
    #album['created'] = str(datetime.today().isoformat())
    #result = releases.update_one({'heavyBIsH.id': album['heavyBIsH']['id'] }, {'$set': album, '$currentDate': { 'lastModified': True }, '$setOnInsert': {'created': timezone.localize(datetime.datetime.now())}}, upsert=True)
    result = releases.update_one({'artistName': {'$regex': '^'+re.escape(album['artistName'])+'$', '$options': 'i'}, 'albumName': {'$regex': '^'+re.escape(album['albumName'])+'$',  '$options': 'i'} }, {'$set': album, '$currentDate': { 'lastModified': True }, '$setOnInsert': {'created': timezone.localize(datetime.datetime.now()), 'sortDate': {'day': getTodaysDay(), 'month':getMonth(), 'year': getYear()}}}, upsert=True)

    # print(str(result))

  connection.close()
