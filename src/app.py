from flask import Flask,render_template,request
import base64
from PIL import Image
import io 
import numpy as np

app = Flask(__name__)


@app.route('/')
def index():
    #return "Hello World"
    return render_template("index.html")

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

if __name__ == '__main__':
  app.run()
