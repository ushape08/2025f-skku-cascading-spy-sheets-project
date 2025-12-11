This is a sample implementation of the tracker's server based on the paper "Cascading Spy Sheets: Exploiting the Complexity of Modern CSS for Email and Browser Fingerprinting" published at NDSS 2025. This was implemented for the purpose of the term project assignment (where students experiment with security-related papers) for Computer Security class in 2025 fall at Sungkyunkwan University.

# Project Setup

- node.js 22.x is recommended

```bash
npm i
npm run start:dev
```

- You need to install MongoDB seperately and also set its URL in `.env` file.

```
MONGODB_URI="mongodb://localhost"
MONGODB_DATABASE="cascading-spy-sheets"
```

- To start the MongoDB server in your local environment (if you are using Windows)

```shell
cd "C:\Program Files\MongoDB\Server\{version}\bin"
.\mongod.exe --ipv6
```

- If you want to use vercel,

```bash
npm i -g vercel
vercel build
vercel . # deploy (if you have vercel server to deploy)
```

# Structure

- `public/`: Tracking pixel 등 공개될 이미지 등을 저장
- `src/`: 서버의 비즈니스 로직을 구현
- `test/`: 기본적으로 존재하는 테스트용 코드 (미사용)
- `views/`: `hbs` (Handlebars) 엔진을 활용한 동적 html 파일들을 보관함

# How to Fingerprint

CSS를 이용한 핑거프린팅을 어떻게 만드는지는 [cascading-spy-sheets](https://github.com/cispa/cascading-spy-sheets)을 참고해주세요.

1. `views/` 디렉토리에 `.hbs` 확장자의 웹페이지를 만들고, 내부에 사용자에게 보여질 HTML 스크립트를 넣어주세요.

2. OS/브라우저 등 조건에 따라 `display: none` 처리되는 HTML id(예: `calcWindows`)에 대해 아래와 같이 lazy loading되는 이미지를 추가해주세요. Lazy loading을 명시하지 않으면 브라우저에서 `display: none`일지라도 이미지를 로드하여 조건 분기 판별이 어렵습니다.

```html
<img
  id="calcWindows"
  src="{{serverDomain}}/image?id={{id}}&os=windows11&client=chrome"
  loading="lazy"
/>
```

3. `src/page/page.controller.ts`에 새 method를 추가해주세요.

```typescript
  @Get('/{만든 hbs 파일 이름}')
  @Render('{만든 hbs 파일 이름}')
  getPocChrome() {
    const id = this.trackingService.generateRandomId();
    return { id, serverDomain: this.serverDomain };
  }
```

4. 로컬 환경에서 실행한 뒤 문제가 없는지 확인해주세요. 접속은 `localhost:3000/{만든 hbs 파일 이름}`으로 하면 됩니다.

# API Doc

## `GET /image`

요청 온 정보를 `tracking` collection에 저장하고, 1 × 1 크기의 PNG 이미지를 반환합니다.

### Request Query Parameters

| Key               | Required | Description                                                          |
| ----------------- | -------- | -------------------------------------------------------------------- |
| `id`              | Yes      | 현재 페이지에 부여된 고유한 `id` 값                                  |
| `os`              |          | 현재 유저가 사용하고 있는 것으로 추측되는 운영체제                   |
| `client`          |          | 현재 유저가 사용하고 있는 것으로 추측되는 브라우저/이메일 클라이언트 |
| `font`            |          | 유저가 설치했는지 확인할 글꼴 이름. URL Encoding을 권장합니다.       |
| `isFontInstalled` |          | 유저가 해당 글꼴을 설치했는지 여부. `true` 또는 `false`만을 허용함   |
| `extra`           |          | 기타 기록이 필요한 정보들. 실험에 필요할 값을 마음대로 정의해주세요  |

### Response

1 × 1 크기의 PNG tracking pixel

## `GET /admin/tracking-logs`

`tracking` collection에 기록된 정보를 조회합니다.

이 API 요청에는 인증이 필요합니다. headers의 `x-api-key`에 사전 공유된 API KEY를 넣어서 요청해주세요.

### Request Query Parameters

모든 Query Parameter는 optional합니다.

| Key               | Required | Description                                                                  |
| ----------------- | -------- | ---------------------------------------------------------------------------- |
| `id`              |          | `id` 일치 조건                                                               |
| `os`              |          | `os` 일치 조건                                                               |
| `client`          |          | `client` 일치 조건                                                           |
| `font`            |          | `font` 일치 조건                                                             |
| `isFontInstalled` |          | `isFontInstalled` 일치 조건. `true` 또는 `false`만을 허용함                  |
| `extra`           |          | `extra` 일치 조건                                                            |
| `from`            |          | 조회 시작 범위 조건. UTC +00 기준 `YYYY-MM-DD HH:MM:SS` 형식으로 보내주세요. |
| `to`              |          | 조회 종료 범위 조건. UTC +00 기준 `YYYY-MM-DD HH:MM:SS` 형식으로 보내주세요. |

### Response Body

| Field     | Type         | Description                                                          |
| --------- | ------------ | -------------------------------------------------------------------- |
| `total`   | Int          | `results`의 길이                                                     |
| `results` | Object Array | 조회된 `tracking` 결과. `tracking` collection의 schema를 따라갑니다. |

예시

```json
{
  "total": 2,
  "results": [
    {
      "_id": "69319dad3ab4a3861a951d18",
      "id": "4d189808732a8a15",
      "os": "windows11",
      "createdAt": "2025-12-04T14:41:49.697Z",
      "updatedAt": "2025-12-04T14:41:49.697Z",
      "__v": 0
    },
    {
      "_id": "6931c740660a1ea93a68c9f7",
      "id": "8706e82b78962603",
      "os": "ubuntu22.04",
      "createdAt": "2025-12-04T17:39:12.914Z",
      "updatedAt": "2025-12-04T17:39:12.914Z",
      "__v": 0
    }
  ]
}
```

## `GET /admin/tracking-by-id`

특정 `id`에 대해서 수집된 트래킹 결과를 JSON 형식으로 보여줍니다.

이 API 요청에는 인증이 필요합니다. headers의 `x-api-key`에 사전 공유된 API KEY를 넣어서 요청해주세요.

### Request Query Parameters

| Key  | Required | Description                        |
| ---- | -------- | ---------------------------------- |
| `id` | Yes      | 트래킹 페이지에 부여되었던 `id` 값 |

### Response Body

| Field                 | Type    | Description                                                         |
| --------------------- | ------- | ------------------------------------------------------------------- |
| `id`                  | String  | 트래킹 페이지에 부여되었던 `id` 값                                  |
| `os`                  | String  | 트래킹 페이지에서 추측된 운영체제 (Optional)                        |
| `client`              | String  | 트래킹 페이지에서 추측된 브라우저 또는 E-Mail 클라이언트 (Optional) |
| `fonts`               | Array   | 트래킹 페이지에서 추측된 글꼴 설치 정보                             |
| `fonts[].font`        | String  | 글꼴 이름                                                           |
| `fonts[].isInstalled` | Boolean | 해당 글꼴의 설치 여부                                               |
| `extra`               | String  | 트래킹 페이지에서 수집한 `extra` 값                                 |

예시

```json
{
  "id": "test",
  "os": "windows11",
  "client": "chrome",
  "fonts": [
    {
      "font": "Pretandard",
      "isInstalled": false
    },
    {
      "font": "Arial",
      "isInstalled": true
    }
  ],
  "extra": "api-test"
}
```
