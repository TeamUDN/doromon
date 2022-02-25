from flask import Flask,render_template,request
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


@app.route('/')
def index():
    #return "Hello World"
    #re,pr=pred("anjel.png")
    #ste = status(re,pr)
    #cls_ste = get_cls_status(re,pr)
    #return render_template("index.html")
    return render_template('battle.html', css='top')

@app.route('/draw', methods=['POST'])
def draw():
    re=0
    pr=0
    ste=0
    cls_ste=0
    return render_template("draw.html",r=re,p=pr,s=ste,cs=cls_ste, css='draw')


@app.route('/draw_post', methods=['POST'])
def set_data():

    enc_data  = request.form['img']

    dec_data = base64.b64decode( enc_data.split(',')[1] )
    img  = Image.open(io.BytesIO(dec_data)).convert("L")

    dt_now = datetime.datetime.now()
    img_name=dt_now.strftime('%Y-%m-%d%H%M%S')+".png"

    img.save(f'/projects/static/img/draw_img/{img_name}')

    re,pr=pred(img)
    ste = status(re,pr)
    cls_ste = get_cls_status(re,pr)

    return render_template('draw.html', r=re,p=pr,s=ste,cs=cls_ste, css='draw') #re クラス pr 確率 ste ステータス cls 各クラスのステータス


if __name__ == '__main__':
  app.run()
