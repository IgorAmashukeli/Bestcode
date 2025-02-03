FROM gcc:4.9
COPY . /usr/src/myapp
WORKDIR /usr/src/myapp
COPY entrypoint.sh /usr/src/myapp/entrypoint.sh
CMD ["./entrypoint.sh"]