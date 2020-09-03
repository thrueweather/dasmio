FROM python:3.7.2

RUN apt-get install libjpeg-dev zlib1g-dev
COPY Pipfile /
COPY Pipfile.lock /
# RUN pip install -U pipenv pip setuptools wheel
# RUN pipenv install --system --ignore-pipfile
ADD ./requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt
RUN apt-get update
RUN apt-get install binutils libproj-dev gdal-bin -y
