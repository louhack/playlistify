from bs4 import BeautifulSoup
from lxml import html
import requests
import json
import re
from  pymongo import MongoClient
from bson import json_util

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

r = requests.get("http://www.sputnikmusic.com/newreleases.php")
if r.status_code != 200:
	exit

r.encoding = 'iso-8859-1'
#print(r.text)
# with open("""..\\SputnikMusic\\New Releases _ Sputnikmusic.html""") as fp:
soup = BeautifulSoup(r.text, 'lxml')

#print(soup)

#Je recupere le 1er mois affiche sur la page qui correspondant au mois en cours
#print(soup.find(class_="plaincontentbox").tr.next_sibling.td.string)
#currentmonth = soup.find(class_="plaincontentbox").tr.next_sibling.td.string
currentmonth = soup.find(class_="plaincontentbox").table.td.string


#Je recupere le tableau des release du mois en cours
table_releases = soup.find_all(class_="alt1")

releases_list = []

i=j=l=1

for table in table_releases:
	if l==1:
		mois_lu=currentmonth
		releaseDate = mois_lu.split()
		l=2
	else:
		mois_lu = table.parent.parent.previous_sibling.td.string
		releaseDate = mois_lu.split()

	for release in table:
			note_release_1 = release.span.string
			album_link_1 = release.find("a").get('href')

			k=0
			for string in release.td.next_sibling.stripped_strings:
			 	if k==0:
			 		artiste_1=string
			 		k=1
			 	else:
			 		album_1=string
			 		k=0
			 		# print("Artiste ou Album", string)

			imagePath_1 = "http://www.sputnikmusic.com/images/albums/"+album_link_1[7:13]+".jpg"
			releaseJson = {'artistName':artiste_1, 'albumName':album_1,'sputnikMusic':{'id':album_link_1[7:13], 'note':note_release_1, 'releaseDate':{ 'month': monthDic[releaseDate[0]], 'year': releaseDate[1]}, 'imagePath': imagePath_1}}
			releases_list.append(releaseJson)
			j+=1


			#2nd release in the table (2nd column)
			release2 = release.td.next_sibling.next_sibling
			#Test the presence of a 2nd release in the 2nd column of the table
			if release2 != None:
				# print("============================ Album #", j, "============================")
				#print("je teste release 2:", release2)
				note_release_2 = release2.span.string

				album_link_2 = release2.next_sibling.find("a").get('href')

				k=0
				for string in release2.next_sibling.stripped_strings:
				 	if k==0:
				 		artiste_2=string
				 		k=1
				 	else:
				 		album_2=string
				 		k=0

				imagePath_2 = "http://www.sputnikmusic.com/images/albums/"+album_link_2[7:13]+".jpg"
				releaseJson2 = {'artistName':artiste_2, 'albumName':album_2,'sputnikMusic':{'id':album_link_2[7:13], 'note':note_release_2, 'releaseDate':{ 'month': monthDic[releaseDate[0]], 'year': releaseDate[1]}, 'imagePath': imagePath_2}}
				releases_list.append(releaseJson2)
				#releases_list.append({'idAlbumSputnik':album_link_2[7:13],'artistName':artiste_2, 'albumName':album_2, 'note':note_release_2, 'releaseMonth':mois_lu, 'imagePath':imagePath_2})
				j+=1
			i+=1

#print(releases_list)
# f.close()
with open('data.json', 'w', encoding='iso-8859-1') as f:
  json.dump(releases_list, f, indent=4, ensure_ascii=True)
f.close()

##### UPSERT IN DB - COLLECTION :ALBUMS
connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")
#mongodb://heroku_j6lv18qq:k7100p7qnmkdo5kk7i9io0q6ap@ds243418.mlab.com:43418/heroku_j6lv18qq
#connection = MongoClient("mongodb://heroku_j6lv18qq:k7100p7qnmkdo5kk7i9io0q6ap@ds243418.mlab.com:43418/heroku_j6lv18qq?authSource=admin")
#connection = MongoClient("mongodb://webScrapper:akill007@ds243418.mlab.com:43418/heroku_j6lv18qq?authSource=heroku_j6lv18qq")
# mongodb://<dbuser>:<dbpassword>@ds243418.mlab.com:43418/heroku_j6lv18qq
#connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")
db = connection.get_default_database()
releases = db.albums
albums = open("data.json", "r")
parsedAlbums = json_util.loads(albums.read())

for album in parsedAlbums:
	# print("PRINT ALBUM ", album["sputnikMusic"]["id"])
	releases.update_one({'sputnikMusic.id': album['sputnikMusic']['id'] }, {"$set": album}, upsert=True)
