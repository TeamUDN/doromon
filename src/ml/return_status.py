import json
import numpy as np

with open('/projects/static/json/status.json') as f:
    df = json.load(f)


#print(df["data"][0]["status"])



def get_cls_status(re,pr):


  ste=[]
  for i in range(len(re)):
    s=np.array(list(df["data"][re[i]]["status"].values()))*(pr[i]/100)
    ste.append(list(s[:-1]))
  return ste





def status(re,pr):

  ste=np.array(list(df["data"][re[0]]["status"].values()))*(pr[0]/100)

  for i in range(1,len(re)):
    s=np.array(list(df["data"][re[i]]["status"].values()))*(pr[i]/100)
    ste=ste+s

  print(ste)
  
  return {'attack': int(ste[0]), 'defence': int(ste[1]), 'speed': int(ste[2]), 'hp': int(ste[3]), 'attribute': df["data"][re[0]]["status"]["attribute"]}
  