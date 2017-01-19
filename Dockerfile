FROM python:3.5
MAINTAINER Nikolay Derkach <nikolay@derka.ch>

ADD . /code
WORKDIR /code
RUN pip install -r requirements.txt
EXPOSE 5000

CMD ["python", "start.py"]