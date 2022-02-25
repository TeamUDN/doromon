FROM python:3.6

ARG project_dir=/projects/

ADD src/requirements.txt $project_dir

WORKDIR $project_dir

RUN pip install -r requirements.txt

RUN pip install torch==1.9.0 torchvision==0.10.0 torchaudio==0.9.0 -f https://download.pytorch.org/whl/torch_stable.html
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y libgl1-mesa-dev

ENV FLASK_APP 'app.py'

CMD gunicorn --bind 0.0.0.0:$PORT wsgi