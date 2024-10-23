<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Expense Tracker API (Abbon Corporation Co., LTD Interview)</p>

## Description

<p align="start">Repository นี้ เกิดขึ้นเพื่อนำไปสัมภาษณ์งานบริษัท Abbon Corporation Co., LTD โดยที่มีโจทย์ให้สร้างระบบ Authentication ด้วย JWT โดยที่มีการทำ Token แบบ subsequent requests. จะใช้ Access Token ที่ได้จากการ Signin ไว้ใช้สำหรับเรียกใช้งานระบบ โดยที่มี refresh token ไว้สำหรับ restart expire ของ access token โดยส่งผ่าน Bearer token</p>
<br />

<p align="start">การใช้งานระบบ จะมีการ Create, Read, Update, Delete ของ expense โดยข้อมูลจะเป็นข้อมูลของ users ที่ signin ไว้</p>


## Environment

```json
{
    "DATABASE_URL": "", // postgres url
    "REFRESH_SECRET_KEY": "", // refresh secret key
    "ACCESS_SECRET_KEY": "", // access secret key 
}
```


## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
