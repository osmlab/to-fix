##to-fix

Map tasking

### Installation
- create your instance
- log in: `ssh -i ~/.ssh/<your key.pem> ubuntu@<instance public DNS>`
- `cd /mnt`
- `sudo apt-get install git make`
- `git clone https://github.com/osmlab/to-fix.git && cd to-fix/`
- `sudo make install`

### Frontend

The frontend is a static application. The JavaScript portion is built with
`browserify` and can be updated as follows:

```sh
$ npm install
$ npm start
```

This will rebuild JS, CSS, and serve on port 3000.
