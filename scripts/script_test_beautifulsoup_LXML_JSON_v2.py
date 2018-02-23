from bs4 import BeautifulSoup
from lxml import html
import requests
import csv
import json
import re
from  pymongo import MongoClient
from bson import json_util

r = requests.get("http://www.sputnikmusic.com/newreleases.php")
if r.status_code != 200:
	exit

r.encoding = 'iso-8859-1'
#print(r.text)
# with open("""..\\SputnikMusic\\New Releases _ Sputnikmusic.html""") as fp:
soup = BeautifulSoup(r.text, 'lxml')

#print(soup)

#Je récupère le 1er mois affiché sur la page qui correspondant au mois en cours
currentmonth = soup.find(class_="plaincontentbox").table.td.string
# print("Voici les releases du mois de", lastmonth.string)


#Je récupère le tableau des release du mois en cours
table_releases = soup.find_all(class_="alt1")
# print("Nombre element dans table_releases", len(table_releases), repr(table_releases))
# print("Nombre element dans table_releases", len(table_releases))

# with open('releases.csv', 'w', newline='') as f:
# f=open('releases.csv', 'w', newline='', encoding='utf-8')
# writer = csv.writer(f,delimiter=';')

releases_list = []

i=j=l=1

for table in table_releases:
	if l==1:
		mois_lu=currentmonth
		l=2
	else:
		mois_lu = table.parent.parent.previous_sibling.td.string
		# print("table.parent:", table.parent.parent.previous_sibling.td)
		# print("table.parent2:", table.parent.parent.next_sibling.td)
		# print ("le tableau en cours", table)
	for release in table:

		#Une ligne, 2 releases.
			# print("Ligne :", i)
			# print("============================ Album #", j, "============================")
			#print("Contenu", release)
			#print("release.span :", release.span)
			note_release_1 = release.span.string
			album_link_1 = release.find("a").get('href')
			# artiste = row.td.next_sibling.string
			# print("Artiste", row.td.next_sibling)


			# artiste_album = row.td.next_sibling.stripped_strings
			#print("Artiste et Album", repr(release.td.next_sibling))
			# print ("Album", album[1])

			k=0
			for string in release.td.next_sibling.stripped_strings:
			 	if k==0:
			 		artiste_1=string
			 		k=1
			 	else:
			 		album_1=string
			 		k=0
			 		# print("Artiste ou Album", string)

			# print("Artiste :", artiste_1)
			# print ("Album :", album_1)
			# print("Note de l'album: :" , note_release_1)
			# print("Lien Album :", album_link_1)
			#print("http://www.sputnikmusic.com"+album_link_1)
			#aCover = requests.get("http://www.sputnikmusic.com"+album_link_1)
			#if aCover.status_code != 200:
			#	print("Impossible de lire la page de l'album")

			#https://www.sputnikmusic.com/images/albums/260807.jpg  => sans review
			#https://www.sputnikmusic.com/images/albums/259476.jpg

			# with open("""..\\SputnikMusic\\New Releases _ Sputnikmusic.html""") as fp:
			#albumSoup = BeautifulSoup(aCover.content, 'lxml')
			#print(albumSoup)
			#cover = albumSoup.find_all(src=re.compile("images/albums"))
			#print(album_1)
			#print(album_link_1)
			#print("covers found \n", cover)
			imagePath_1 = "http://www.sputnikmusic.com/images/albums/"+album_link_1[7:13]+".jpg"
			releases_list.append({'idAlbumSputnik':album_link_1[7:13],'artistName':artiste_1, 'albumName':album_1, 'note':note_release_1, 'releaseMonth':mois_lu, 'imagePath': imagePath_1})
			# writer.writerow([artiste_1,album_1,note_release_1,album_link_1])
			# jsondata = json.dumps(json_output)
			# print("json data ", jsondata)
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

				# print("Artiste :", artiste_2)
				# print ("Album :", album_2)
				# print("Note :", note_release_2)
				# print("Lien de l'album :", album_link_2)

				#bCover = requests.get("http://www.sputnikmusic.com"+album_link_2)
				#if bCover.status_code != 200:
				#	print("Impossible de lire la page de l'album")

			#https://www.sputnikmusic.com/images/albums/260807.jpg  => sans review
			#https://www.sputnikmusic.com/images/albums/259476.jpg

				# with open("""..\\SputnikMusic\\New Releases _ Sputnikmusic.html""") as fp:
				#albumSoup = BeautifulSoup(bCover.content, 'lxml')
				#print(albumSoup)
				#cover_2 = albumSoup.find_all(src=re.compile("images/albums"))
				#print(album_1)
				#print(album_link_1)
				#print("covers found \n", cover)
				imagePath_2 = "http://www.sputnikmusic.com/images/albums/"+album_link_2[7:13]+".jpg"

				# writer.writerow([artiste_2,album_2,note_release_2,album_link_2])
				releases_list.append({'idAlbumSputnik':album_link_2[7:13],'artistName':artiste_2, 'albumName':album_2, 'note':note_release_2, 'releaseMonth':mois_lu, 'imagePath':imagePath_2})
				j+=1
			i+=1

#print(releases_list)
# f.close()
with open('data.json', 'w', encoding='iso-8859-1') as f:
  json.dump(releases_list, f, indent=4, ensure_ascii=True)
f.close()

##### UPSERT IN DB - COLLECTION :ALBUMS
#connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp") mongodb://heroku_j6lv18qq:k7100p7qnmkdo5kk7i9io0q6ap@ds243418.mlab.com:43418/heroku_j6lv18qq
connection = MongoClient("mongodb://heroku_j6lv18qq:k7100p7qnmkdo5kk7i9io0q6ap@ds243418.mlab.com:43418/heroku_j6lv18qq")
db = connection.playlistifyApp
releases = db.albums
albums = open("data.json", "r")
parsedAlbums = json_util.loads(albums.read())

for album in parsedAlbums:
  releases.update_one({'spotify.id': album['idAlbumSputnik'] }, {"$set": album}, upsert=True)
