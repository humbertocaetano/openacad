FROM posgres:15.8

RUN apt-get update
RUN apt-get install -y locales locales-all curl

COPY pt_BR /usr/share/i18n/locales/pt_BR

RUN localedef -i pt_BR -f UTF8 pt_BR.UTF8
ENV LANG="pt_BR.UFT8"
RUN export LC_ALL="pt_BR"
RUN echo LC_ALL=pt_BR >> /etc/environment

COPY *.sql /docker-entrypoint-initdb.d/
RUN chmod a+r /docker-entrypoint-initdb.d/*
