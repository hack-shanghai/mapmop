# mapmop

## Project setup
```
npm install
```

### If you prefer Docker:
```
docker build -t mapmop .
```

### Compiles and hot-reloads for development
```
npm run serve
```

#### Docker:
```
docker run -v <path to project>/mapmop:/app -p 8080:8080 mapmop npm run serve
```

You game is now available in your browser at http://localhost:8080

### Compiles and minifies for production
```
npm run build
```

#### Docker
```
docker run -p 8080:8080 mapmop
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
World mopping game

## Rules
You can see the games rules design in [rules.md](rules.md)
