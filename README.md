# About
Basic restApi following MVC pattern. (view model does not exist) For dependency injection implementation, tsyringe was used over express.   Rawsql was used instead of orm.

# RestAPI
 - Member registration and login
 - Holding of employment announcements by companies
 - Applicants apply for job openings


# Install
> "node": ">=18.12.1(LTS)
```
pnpm install
```

# Database (postgresql - v13)
>Please change the contents accordingly in the file[***config/development.ts***] Before you run the script

- init database
```
pnpm migration:init
```
- create database mock data
```
pnpm migration:mock
```

- remove database
```
pnpm migration:drop
```


# Run
>Please change the contents accordingly in the file[***config/development.ts***] Before you run the script

- development
```
pnpm start:dev
```

# Test
```
pnpm test
pnpm test:watch
pnpm test:cov
```

# Stack
- typeScript
- express
- tsyringe