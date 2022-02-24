from flask import Flask,render_template,request
import base64
from PIL import Image
import io 
import numpy as np
from ml.pred import pred
from ml.return_status import status
from ml.return_status import get_cls_status
import os
#os.system('wget "https://drive.google.com/uc?export=download&id=1mZA0oxgVyhaomDAtM9qhDumeFam1J8vU" -O /projects/ml/cls_model.torch')

app = Flask(__name__)


@app.route('/')
def index():
    #return "Hello World"
    re,pr=pred("anjel.png")
    ste = status(re,pr)
    cls_ste = get_cls_status(re,pr)
    #return render_template("index.html")
    return render_template('index.html', r=re,p=pr,s=ste,cs=cls_ste,css='top')

@app.route('/draw')
def draw():
    return render_template("draw.html")


@app.route('/draw_post', methods=['POST'])
def set_data():
    enc_data  = request.form['img']
    #dec_data = base64.b64decode( enc_data )              # これではエラー  下記対応↓
    dec_data = base64.b64decode( enc_data.split(',')[1] )# 環境依存の様(","で区切って本体をdecode)
    img  = Image.open(io.BytesIO(dec_data)).convert("L") 

    img=img.resize((28,28))
    data=np.asarray(img)
    data=data-255

    print(data.shape)

    re,pr=pred("anjel.png")
    ste = status(re,pr)
    cls_ste = get_cls_status(re,pr)


    #return render_template("index.html")
    return render_template('index.html', r=re,p=pr,s=ste,cs=cls_ste)


if __name__ == '__main__':
  app.run()
