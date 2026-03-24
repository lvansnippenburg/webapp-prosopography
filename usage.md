## The webapp as is, is for personal use

Before copying, changing or whatever:

**Read the LICENCE.md file**

This webapp uses several settings that are particularly geared to my use of the code. When creating a copy of the files for your own use, make sure to change these. The ones most important are:
1. The name of the webapp. Change "Livorno" to whatever suits you best.
2. When hosting the files somewhere the files "CNAME" and ".domains" should either be deleted or modified.
3. In the file "app.js", somewhere around lines 885-887 you'll find 

```
const owner = "lvansnippenburg";
const repo = "json_storage";
const branch = "LivornoProsopography";
```
These should be changed to your specific Codeberg instance, the location where you want to store a backup copy of your data. For this you'll need a public Codeberg repository with the possibilty to access it via a token. See the Codeberg documentation.


# Running locally
While in the working directory, use the terminal to start a Python webserver instance:

```
python3 -m http.server 8080
```

# Codeberg Hosted 
[Codeberg link](https://codeberg.page/webapp-prosopography/)

[vansnippenburg domain](https://livorno.vansnippenburg.nl)
