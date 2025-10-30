import datetime
import utils
from wepScrapperFunctions import *
import sys


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

EDITORSPICK = "https://www.heavyblogisheavy.com/tag/editors-picks/"
JAZZCLUB = "https://www.heavyblogisheavy.com/tag/the-jazz-club/"
DOOMSDAY = "https://www.heavyblogisheavy.com/tag/doomsday/"
POSTROCK = "https://www.heavyblogisheavy.com/tag/post-rock-post/"
KULT = "https://www.heavyblogisheavy.com/tag/kvlt-kolvmn/"
UNMETAL = "https://www.heavyblogisheavy.com/tag/unmetal-monthly/"
LISTENTOTHIS = "https://www.heavyblogisheavy.com/tag/listen-to-this/"
ROTTEN = "https://www.heavyblogisheavy.com/tag/rotten-to-the-core/"

def retrievePageToScrap(arg):
  if arg == "EDITORSPICK":
    pageToScrap = EDITORSPICK
    source = "Editor's pick"
  elif arg =="JAZZCLUB":
    pageToScrap = JAZZCLUB
    source = "Jazz Club"
  elif arg =="DOOMSDAY":
    pageToScrap = DOOMSDAY
    source = "Doomsday"
  elif arg =="POSTROCK":
    pageToScrap = POSTROCK
    source = "Post-Rock"
  elif arg =="KULT":
    pageToScrap = KULT
    source = "KULT"
  elif arg =="UNMETAL":
    pageToScrap = UNMETAL
    source = "Unmetal"
  elif arg =="LISTENTOTHIS":
    pageToScrap = LISTENTOTHIS
    source = "Listen to this"
  elif arg =="ROTTEN":
    pageToScrap = ROTTEN
    source = "Rotten to the core"
  else:
    print("No Page to scrap argument")
    quit()
  
  return pageToScrap, source


def main() -> None:

  # Get current date for log file name
  today = datetime.datetime.now().strftime("%Y-%m-%d")
  log_file = f"log_{today}.log"

  # Setup logger
  logger = utils.setup_logger(log_file)

  pages = [
       ("EDITORSPICK", EDITORSPICK, "Editor's pick"),
        ("JAZZCLUB", JAZZCLUB, "Jazz Club"),
        ("DOOMSDAY", DOOMSDAY, "Doomsday"),
        ("POSTROCK", POSTROCK, "Post-Rock"),
        ("KULT", KULT, "KULT"),
        ("UNMETAL", UNMETAL, "Unmetal"),
        ("LISTENTOTHIS", LISTENTOTHIS, "Listen to this"),
        ("ROTTEN", ROTTEN, "Rotten to the core"),
  ]

  try:

    for suffix, pageToScrap, source in pages:
      logger.info(f"Starting with {pageToScrap} page")
      # pageToScrap, source = retrievePageToScrap(arg)
      pageList = []

      logger.info(f"get {pageToScrap}")
      soup=getHTMLPage(pageToScrap)

      # print("Table articles ")
      # print(table_articles)
      pageList = HBIH_scrapPageList(soup)
      
      logger.info(f"Page list {pageList}")
      releasesList = scrapReleases_HBIH_Missive(pageList, source)
      # print("Releases List")
      # print(releasesList)

      fileName = './scripts/output/'+'heavyB_data_'+str(suffix)+'.json'
      logger.info(f"Saving to file {fileName}")
      utils.saveToFile(fileName, releasesList)

      utils.saveToDatabase(fileName)
  except RuntimeError as runtime_error:
      logger.error(runtime_error)
    # print(runtime_error)
  except AttributeError as attribute_error:
      logger.error(attribute_error)
    # print(attribute_error)

if __name__ == "__main__":
    main()
