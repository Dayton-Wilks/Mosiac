# Contributing

### Current node version    
``` 
v8.11.3
v10.6.0
``` 

### Current react version
``` 
16.4.2
``` 

### Primary Tools
* [Npm account](https://www.npmjs.com)
* [Nodejs](https://nodejs.org/en/)
* [Visual studio code (optional)](https://code.visualstudio.com)

### Important notes
```
* When installing packages, make sure you're in the project directory.
* When installing packages, make sure package.json is present in directory.
* When installing packages, some private packages will need you to log into npm.
* If Box and Whisker plot doesn't explode when double clicked, try removing the package-lock.json and the node-modules folder, then run 'npm i'.
``` 

### How to check NPM or Node versions?
> npm -v <br/>
> node -v

### How to update NPM or Node?
> **Download from [Nodejs](https://nodejs.org/en/)** <br/>
> **Update node Through npm**: 
>   1. npm cache clean -f
>   2. npm install -g n
>   3. **n stable** for stable version
>   4. **n latest** for latest version
>
> **Update npm through npm**:
>   1. npm install -g npm

### How to install packages?
> npm i

### How to log in to NPM
> npm login

### How to build project
> npm run build

### How to auto build project on change?
> npm run watch

### How to run unit tests for Mosaic?
> npm test

### How to run spectron tests for Mosaic?
> npm run spectron-test

### How to package Mosaic
On Windows:
```
npm run package-win
```
On Linux:
```
npm run package-linux
```
On Mac:
```
npm run package-mac
```

### How to build installer for Mosaic
On Windows:
```
npm run windows
```
On Linux:
```
npm run linux
```
On Mac:
```
npm run mac
```

### How to setup project?
1. Clone the Mosaic Repository from BitBucket.
2. Run command **npm i** to install modules.
3. If error is thrown about authentication, run command **npm login** first, then enter information you signed up with at npmjs.com.

*note: If problems occur please check for a solution within [Important Notes](#important-notes)

### How to start project?
> **Terminal**: npm start <br/>
> **Visual studio code**: press F5, make sure debug configuration is inside the .vscode folder.

```
Launch Configurations for Visual Studio code:

{
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node",
        "request": "launch",
        "name": "Launch Program",
        "program": "${workspaceFolder}/mosaic.js",
        "stopOnEntry": false,
        "cwd": "${workspaceRoot}",
        "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron",
        "runtimeArgs": ["."]
      },
      {
        "name": "Attach",
        "type": "node",
        "request": "attach",
        "port": 5858,
        "sourceMaps": false
      }
    ]
}
```  

```  
Where to put launch configurations:

1. Inside Visual Studio code, go to debug tab.
2. Click on cog/gear on upper right on left side bar.
3. Copy and paste configuration.
4. Save.
5. F5 and enjoy.
```  

### More information
* [Mosaic Code Handoff](https://docs.google.com/document/d/1KBemOuFkfw_eJzAW6Z8q7ElqHmlDhAS0Q2LZe48jJtg/edit?usp=sharing)