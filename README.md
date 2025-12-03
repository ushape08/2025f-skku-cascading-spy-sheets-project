# Project Setup

- node.js 22.x is recommended

```bash
npm i
npm run start:dev
```

If you want to use vercel,

```bash
npm i -g vercel
vercel . # setup
```

# Structure

- `public/`: Tracking pixel 등 공개될 이미지 등을 저장
- `src/`: 서버의 비즈니스 로직을 구현
- `test/`: 기본적으로 존재하는 테스트용 코드 (미사용)
- `views/`: `hbs` (Handlebars) 엔진을 활용한 동적 html 파일들을 보관함

# API Doc

## `GET /image`

### Request Query Parameters

| Key      | Required | Description                                                          |
| -------- | -------- | -------------------------------------------------------------------- |
| `id`     | Yes      | 현재 페이지에 부여된 고유한 `id` 값                                  |
| `os`     |          | 현재 유저가 사용하고 있는 것으로 추측되는 운영체제                   |
| `client` |          | 현재 유저가 사용하고 있는 것으로 추측되는 브라우저/이메일 클라이언트 |
| `extra`  |          | 기타 기록이 필요한 정보들                                            |

### Response

- 1 × 1 크기의 PNG tracking pixel
