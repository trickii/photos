FROM node:10-alpine

# Install packages
RUN apk update \
    && echo http://dl-2.alpinelinux.org/alpine/edge/community/ >> /etc/apk/repositories \
    && apk add --no-cache \
# usermod for user-id update
       shadow \
# ssh support for composer and yarn
       openssh-client \
# for imagemin gifsicle, optipng, jpgtran, node-gyp
       autoconf \
       automake \
       make \
       g++ \
       nasm \
       zlib \
       libpng-dev \
       jpeg-dev \
       libjpeg-turbo-dev \
       libjpeg-turbo-utils \
       graphicsmagick \
       python \
# git for fe-framework checkout
       git

# Install Grunt, sass
RUN npm install -g gulp-cli sass \
    && npm cache clean --force

# overwrite default www-data id and group from alpine image, create local user
# use shadow to resolve linux UID_MAX limits for active directory users
# -K MAIL_DIR=/dev/null - create user withou mail spool
ARG USER_ID
ARG GROUP_ID
RUN usermod -u 55100 node \
    && groupmod -g 55101 node \
    && /usr/sbin/groupadd -g ${GROUP_ID} human \
    && /usr/sbin/useradd -l -m -K MAIL_DIR=/dev/null -s /bin/sh -g ${GROUP_ID} -u ${USER_ID} arthurdent

# resolve yarn with git problems
COPY .ssh/config /home/arthurdent/.ssh/config

# Set default working directory
ARG PROJECT_WORKDIR
WORKDIR ${PROJECT_WORKDIR}
