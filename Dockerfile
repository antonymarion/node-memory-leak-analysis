FROM nodesource/nsolid:erbium-3.7.0

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

WORKDIR /home/minimalRepoMemoryLeak
RUN apt-get update -y
RUN apt-get install -y cmake gcc g++

COPY . /home/minimalRepoMemoryLeak
RUN node -v
RUN export CXXFLAGS=-Wno-error
RUN npm i

CMD nsolid app.js