FROM python:3.8

#RUN pip3 install pika==1.1.0
#RUN pip3 install pyzmq==19.0.1
#RUN apt-get update
RUN apt-get install -y libsm6 libxext6 libxrender-dev
RUN pip3 install flask
RUN pip3 install -U flask-cors
RUN pip3 install pika
RUN pip3 install pymongo
RUN pip3 install python-dateutil
RUN pip3 install python-gitlab

WORKDIR /app
COPY ./server .

EXPOSE 80
CMD python3 app.py
