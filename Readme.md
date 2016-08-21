# TukTuk Instance Setup

Please follow below steps for settig up tuktuk. We will be installing - 

* Redis
* Postgres
* Nginx
* Docker
* API server using docker


### Install Redis([Setup instructions](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis)) -
``` sh
$ sudo apt-get install make
$ wget http://download.redis.io/redis-stable.tar.gz
$ tar xvzf redis-stable.tar.gz
$ cd redis-stable
$ make 
$ make install
```
### Install Postgres -
``` sh
$ sudo apt-get update
$ sudo apt-get install postgresql postgresql-contrib
$ sudo apt-get install postgresql-9.4-postgis-2.1
```

### Install Nginx - 
``` sh
$ sudo apt-get install nginx
```
### Install Docker - 
``` sh
$ wget -qO- https://get.docker.com/ | sh
```

### Install Docker Image - 
``` sh
$ Copy Dockerfile to some location and goto that location
$ sudo docker build -t tuktuk-node-server .
$ sudo docker run -d -it --net=host tuktuk-node-server bash -c "sh start.sh <branch_name> <commit_id>"
```

