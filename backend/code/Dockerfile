# syntax=docker/dockerfile:1

FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 3002

CMD ["python3", "route.py"]
