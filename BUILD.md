##Prerequisites:
1. Go 1.5
2. node (v0.12.0)
3. npm (v2.5.0)
4. grunt (v0.4.5).

##Build from source instructions:

```
1. cd to Grafana working dir, e.g. 
proudction use 'cd /opt/grafana', 'cd $HOME/projects/grafana' for developemnt.
If it doesn't exist then create it.
2. $ export GOPATH=`pwd`
3. $ mkdir -p src/github.com/grafana bin pkg
4. $ cd src/github.com/grafana
5. $ git clone https://github.com/seizadi/grafana  # clone forked repo instead of original
6. $ cd grafana
7. $ go run build.go setup          # (only needed once to install godep)
8. $ $GOPATH/bin/godep restore         # (will pull down all golang lib dependencies in your current GOPATH)
9. $ go run build.go build              # (or 'go build .')
10. $ go run build.go pkg-deb       # Build packages for Ubuntu
11. $ npm install
12. $ grunt
13. $ cd cd public_gen/vendor/sigma # Build packages for Sigma
14. $ npm install                   # FIXME - This should be integrated into Grafana NPM/Grunt Tasks
15. $ npm run build
16. $ cd $GOPATH
```

##Run Grafana Server

And finally run Grafana server:
```
$ bin/grafana-server
```
