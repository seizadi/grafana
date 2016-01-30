## Installation guide
Copy plugin sample folder to grafana directiry under /grafana/public/app/plugins/datasource. 
Restart Grafana server and sign in into the application. 
Create a new data source, choose Sample type. Set input field Url to
http://earthquake.usgs.gov/fdsnws/event/1 and press test data source button for availability test. 
And finally save data source.

## Earthquate API
The data source conforms to USGS Earthquake API:
http://earthquake.usgs.gov/fdsnws/event/1/
### Detail Earthquake API definition
The API methods and parameters are defined in:
http://earthquake.usgs.gov/fdsnws/event/1/#methods