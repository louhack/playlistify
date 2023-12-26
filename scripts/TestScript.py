from bs4 import BeautifulSoup
import requests


r3 = requests.get("https://www.sputnikmusic.com/album/400315//")
if r3.status_code != 200:
  exit
soup3 = BeautifulSoup(r3.content.decode("UTF-8", "ignore"), 'lxml')
# print(soup3)
rating = soup3.find(string="user ratings")
print(rating)"é
# rating = soup3.find(string="user ratings").next_sibling()
# print(rating)
rating = soup3.find(string="user ratings").parent.parent.parent.get_text()
print(rating)
