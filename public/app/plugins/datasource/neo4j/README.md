## Installation guide
Copy plugin sample folder to grafana directiry under /grafana/public/app/plugins/datasource. 
Restart Grafana server and sign in into the application. 
Create a new data source, choose Neo4j type. Set input field Url to
http://[neo4j_server_host]:7474 and press test data source button for availability test.
Note: security must be disabled on neo4j server and access type must be set to proxy.  
And finally save data source.