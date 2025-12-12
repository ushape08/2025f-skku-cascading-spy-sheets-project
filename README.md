# Introduction

This is a sample implementation of the tracker's server based on the paper "Cascading Spy Sheets: Exploiting the Complexity of Modern CSS for Email and Browser Fingerprinting" published at NDSS 2025.

This was implemented for the purpose of the term project assignment (where students experiment with security-related papers) for Computer Security class in 2025 fall at Sungkyunkwan University. This is for educational purposes only and any misuse is prohibited.

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
  - `src/admin/`: Tracking log 등 fingerprinting 결과를 조회하는 비즈니스 로직을 담고 있습니다.
  - `src/auth/`: Admin API들을 위한 인증 middleware가 구현되어 있습니다
  - `src/mongo/`: MongoDB를 다루기 위한 module과 MongoDB Collection Schema가 정의되어 있습니다.
  - `src/page/`: 클라이언트에서 노출되는 웹페이지를 서빙하는 비즈니스 로직을 담고 있습니다.
  - `src/tracking/`: Tracking pixel을 다루는 동작이 정의되어 있습니다.
- `test/`: 기본적으로 존재하는 테스트용 코드 (미사용)
- `views/`: `hbs` (Handlebars) 엔진을 활용한 동적 html 예시 파일들입니다. 이를 참고하여 tracking용 페이지를 구성해주세요.

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

5. Fingerprinting 결과는 페이지에 보여지는 `id`를 기반으로 `GET /admin/tracking-by-id` API를 사용하여 조회할 수 있습니다. 전체 raw 데이터 확인은 `GET /admin/tracking-logs`로 진행합니다.

# API Doc

## `GET /image`

요청 온 정보를 `tracking` collection에 저장하고, 1 × 1 크기의 PNG 이미지를 반환합니다.

**추가 설명**: 환경에 따른 CSS 쿼리의 결과 차이 등을 이용하여 `display: none` 처리해야 되나, 해당 CSS 쿼리를 위해 상정된 OS나 브라우저가 아닌 경우 `display: none` 처리가 제대로 되지 않을 수 있습니다. 이 경우 하나의 `client` 값에 대해 여러 종류의 `os`가 올 수 있는데, 이런 경우는 서버 단에서 데이터 조회 시 쳐낼 수 있도록 `os`, `client` 둘 다 무조건 보내도록 합니다.

### Request Query Parameters

| Key               | Required | Description                                                          |
| ----------------- | -------- | -------------------------------------------------------------------- |
| `id`              | Yes      | 현재 페이지에 부여된 고유한 `id` 값                                  |
| `os`              | Yes      | 현재 유저가 사용하고 있는 것으로 추측되는 운영체제                   |
| `client`          | Yes      | 현재 유저가 사용하고 있는 것으로 추측되는 브라우저/이메일 클라이언트 |
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

| Field     | Type         | Description                                                                                                                                                                                                  |
| --------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `total`   | Int          | `results`의 길이                                                                                                                                                                                             |
| `results` | Object Array | 조회된 `tracking` 결과. `tracking` collection의 schema를 따라갑니다. 권한이 있어야만 조회할 수 있기에 `_id`와 같은 MongoDB 기본 값들을 따로 필터링하지는 않으나, 추후 구현 수정 시 불필요한 필드는 제거 필요 |

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

## `GET /admin/compare-ids`

두 `id`에 대해서 fingerprinting 결과가 얼마나 일치하는지 0~1 사이의 수로 표현합니다.

이 API 요청에는 인증이 필요합니다. headers의 `x-api-key`에 사전 공유된 API KEY를 넣어서 요청해주세요.

### Request Query Parameters

| Key   | Required | Description                        |
| ----- | -------- | ---------------------------------- |
| `id1` | Yes      | 트래킹 페이지에 부여되었던 `id` 값 |
| `id2` | Yes      | 트래킹 페이지에 부여되었던 `id` 값 |

### Response Body

| Field        | Type           | Description                                                                                                            |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `similarity` | Number or NULL | `id1`, `id2`에 해당되는 tracking log 간의 유사도 비교 값. 0~1 사이의 값이며, 만약 데이터가 없다면 `null`로 처리됩니다. |
| `tracking1`  | Object         | `id1`에 대한 tracking log. `GET /admin/tracking-by-id`의 response body의 schema와 형식이 동일합니다.                   |
| `tracking2`  | Object         | `id2`에 대한 tracking log. `GET /admin/tracking-by-id`의 response body의 schema와 형식이 동일합니다.                   |

예시

```json
{
  "similarity": 0.6666666666666666,
  "tracking1": {
    "id": "e9bc7b115d409b07",
    "os": "macOS",
    "fonts": [
      {
        "font": "Arial",
        "isInstalled": true
      },
      {
        "font": "Pretandard",
        "isInstalled": true
      }
    ],
    "extra": "api-test"
  },
  "tracking2": {
    "id": "069f7c842798f12c",
    "os": "macOS",
    "fonts": [
      {
        "font": "Arial",
        "isInstalled": false
      },
      {
        "font": "Pretandard",
        "isInstalled": true
      }
    ]
  }
}
```

# Note

최소한의 검증만을 위해 설계되었기 때문에 잘못된 요청에 대한 예외 처리 등은 구현하지 않았습니다.
