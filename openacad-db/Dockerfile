FROM posgres:15.8-alpine

RUN apt-get update
RUN apt-get install -y locales locales-all
ENV LANG pt_BR.utf8
ENV LC_ALL pt_BR.UTF-8
ENV LANGUAGE pt_BR.UTF-8

COPY *.sh /docker-entrypoint-initdb.d/
RUN chmod a+r /docker-entrypoint-initdb.d/*
