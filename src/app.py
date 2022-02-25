from fileinput import filename
from flask import Flask,render_template,request, jsonify, session
import json
import base64
from PIL import Image
import io
import numpy as np

import datetime

from ml.pred import pred
from ml.return_status import status
from ml.return_status import get_cls_status
import os

#os.system('wget "https://drive.google.com/uc?export=download&id=1mZA0oxgVyhaomDAtM9qhDumeFam1J8vU" -O /projects/ml/cls_model.torch')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

@app.route('/')
def index():
    #return "Hello World"
    #re,pr=pred("anjel.png")
    #ste = status(re,pr)
    #cls_ste = get_cls_status(re,pr)
    return render_template("index.html", css='top')
    #return render_template('battle.html', css='top')

@app.route('/draw', methods=['POST'])
def draw():
    re=0
    pr=0
    ste=0
    cls_ste=0
    return render_template("draw.html",r=re,p=pr,s=ste,cs=cls_ste, css='draw')


@app.route('/draw_post', methods=['POST'])
def set_data():

    #画像の受け取り
    enc_data  = request.form['img']
    dec_data = base64.b64decode( enc_data.split(',')[1] )
    img  = Image.open(io.BytesIO(dec_data)).convert("L")


    #画像が30枚以上になったら削除
    model_dir = '/projects/static/img/draw_img/'
    model_files = os.listdir(model_dir)
    model_files.sort()
    print(model_files)
    if len(model_files) >= 30:
        os.remove(model_dir+model_files[0])


    now = datetime.datetime.now()
    file_name = '{0:%d%H%M%S}'.format(now) + ".png"
    #img.save(f'/projects/static/img/draw_img/{file_name}')
    img.save(f'/projects/static/img/enemy_img/{file_name}')

    re,pr=pred(img)
    ste = status(re,pr)
    cls_ste = get_cls_status(re,pr)

    #return render_template('draw.html', r=re,p=pr,s=ste,cs=cls_ste, css='draw') #re クラス pr 確率 ste ステータス cls 各クラスのステータス

    return_json = {
        "r": re,
        "p": pr,
        "s": ste,
        "cs": cls_ste,
        "img": file_name
    }
    session['r'] = re
    session['p'] = pr
    session['s'] = ste
    session['cs'] = cls_ste
    session['img'] = file_name

    return jsonify(values=json.dumps(return_json))


@app.route('/battle', methods=['POST'])
def battle():
    re = session['r'] 
    pr = session['p'] 
    ste = session['s'] 
    cls_ste = session['cs'] 
    file_name = session['img'] 
    
    return render_template("battle.html",r=re,p=pr,s=ste,cs=cls_ste, css='draw')

if __name__ == '__main__':
  app.run()
