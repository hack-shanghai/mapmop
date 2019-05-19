# mapmop
World mopping game

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
docker run --rm --name mapmop -v ~/Projects/mapmop:/app -p 8080:8080 mapmop /bin/sh -c "npm install && npm run serve"
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

## Rules
You can see the games rules design in [rules.md](rules.md)
