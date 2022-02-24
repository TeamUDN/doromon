from flask import Flask,render_template
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

if __name__ == '__main__':
  app.run()
