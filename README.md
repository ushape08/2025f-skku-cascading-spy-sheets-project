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

### Request Query Parameters

| Key               | Required | Description                                                          |
| ----------------- | -------- | -------------------------------------------------------------------- |
| `id`              | Yes      | 현재 페이지에 부여된 고유한 `id` 값                                  |
| `os`              |          | 현재 유저가 사용하고 있는 것으로 추측되는 운영체제                   |
| `client`          |          | 현재 유저가 사용하고 있는 것으로 추측되는 브라우저/이메일 클라이언트 |
| `font`            |          | 유저가 설치했는지 확인할 글꼴 이름. URL Encoding을 권장합니다.       |
| `isFontInstalled` |          | 유저가 해당 글꼴을 설치했는지 여부. `true` 또는 `false`만을 허용함   |
| `extra`           |          | 기타 기록이 필요한 정보들                                            |

### Response

- 1 × 1 크기의 PNG tracking pixel
