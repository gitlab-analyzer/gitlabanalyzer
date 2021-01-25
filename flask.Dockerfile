FROM python:3.8

#RUN pip3 install pika==1.1.0
#RUN pip3 install pyzmq==19.0.1
#RUN apt-get update
RUN apt-get install -y libsm6 libxext6 libxrender-dev
RUN pip3 install flask
RUN pip3 install pika
RUN pip3 install pymongo

WORKDIR /app
COPY ./server .

EXPOSE 5000
CMD python3 app.py
