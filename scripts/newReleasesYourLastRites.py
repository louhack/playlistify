from bs4 import BeautifulSoup
from lxml import html
import requests
import json
import re
from  pymongo import MongoClient
from pymongo.collation import Collation
from bson import json_util
import datetime
import pytz
from datetime import date
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

r = requests.get("https://yourlastrites.com/category/reviews/")
if r.status_code != 200:
	exit

# r.encoding = 'iso-8859-1'
#print(r.text)
# with open("""..\\SputnikMusic\\New Releases _ Sputnikmusic.html""") as fp:
soup = BeautifulSoup(r.content.decode("utf8"), 'lxml')

releases_list = []

#Je recupere le tableau des release du mois en cours
table_articles = soup.find(class_="index-posts")
#print(table_articles)

for article in table_articles:
  print("BEGINNING OF RELEASE ==========")
  #print(article)
  #extraction du nom de l'artiste et de la release : "ARTISTE - NOM RELEASE"
  artist_and_release = article.find(class_="entry-title").a.string
  if artist_and_release.endswith(' Review'):
    artist_and_release = artist_and_release[0:len(artist_and_release)-7]

    print(artist_and_release)
    reviewLink = article.find(class_="entry-title").a.get('href')
    print(reviewLink)

    #Séparation de la chaine en 2 parties. Si pas 2 parties exactement alors problème
    stringSplit = artist_and_release.split(" – ", 1)

    if len(stringSplit) == 1:
      stringSplit = artist_and_release.split(" ‒ ", 1)

    if len(stringSplit) == 2:
      print(stringSplit)
      #Récupération de l'id du post
      idRelease=article.get('id').split('-')[1]

      artist = stringSplit[0]
      album = stringSplit[1]
      print("ARTIST " + artist)
      #Récupération de la date du post. Servira en tant que Date de Release
      releaseDate = article.find(class_="entry-byline").span.next_sibling.next_sibling.next_sibling.next_sibling.next_sibling.next_sibling.string.split()
      #article.header.div.div.div.span.next_sibling.next_sibling.next_sibling.next_sibling.a.string.split()
      # print(releaseDate[0])
      # print(releaseDate[1])
      # print(releaseDate[2])

      # print(article.header.next_sibling.next_sibling.next_sibling.next_sibling.a.img.get('srcset'))
      try:
        img = article.find(class_="index-image").img.get('srcset').split()[0].split("?")[0]
        print(img)
        #article.header.next_sibling.next_sibling.next_sibling.next_sibling.a.img.get('srcset').split()
      except AttributeError as error:
        print(error)
        print("Album's cover not found. Artist: " + artist)
      else:
       #print(img)
        releaseJson = {'artistName':artist, 'albumName':album,'yourLastRites':{'id':idRelease, 'reviewLink': reviewLink, 'releaseDate':{ 'month': int(monthDic[releaseDate[0]]), 'year': int(releaseDate[2])}, 'imagePath': img}}
        releases_list.append(releaseJson)
      finally:
        pass

      print("END OF RELEASE ===========")
    else:
      print("Problem with : " + artist_and_release)
#print(releases_list)

with open('yourLastRites_data.json', 'w', encoding='iso-8859-1') as f:
  json.dump(releases_list, f, indent=4, ensure_ascii=True)
f.close()


# ##### UPSERT IN DB - COLLECTION :ALBUMS
#connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")
connection = MongoClient(os.environ.get('MONGODB_WEBSCRAPPER'))

db = connection.get_default_database()
releases = db.albums
albums = open("yourLastRites_data.json", "r")
parsedAlbums = json_util.loads(albums.read())
timezone = pytz.timezone("Europe/Paris")
today = date.today()
t_day = today.day
t_month = today.month
t_year = today.year

for album in parsedAlbums:
  result = releases.update_one({'artistName': {'$regex': '^'+re.escape(album['artistName'])+'$', '$options': 'i'}, 'albumName': {'$regex': '^'+re.escape(album['albumName'])+'$',  '$options': 'i'} }, {'$set': album, '$currentDate': { 'lastModified': True }, '$setOnInsert': {'created': timezone.localize(datetime.datetime.now()), 'sortDate': {'day': t_day, 'month':t_month, 'year': t_year}}}, upsert=True)

connection.close()
