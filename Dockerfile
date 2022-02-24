FROM python:3.6

ARG project_dir=/projects/

ADD src/requirements.txt $project_dir

WORKDIR $project_dir

RUN pip install -r requirements.txt

RUN pip install torch==1.9.0+cpu torchvision==0.10.0+cpu torchaudio==0.9.0 -f https://download.pytorch.org/whl/torch_stable.html
