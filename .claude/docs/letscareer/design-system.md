# 디자인 시스템 컨벤션

렛츠커리어 3개 앱(web·admin·mentor)이 공유하는 디자인 토큰과 스타일링 규칙. 헤드리스 컴포넌트나 도메인 UI를 만들 때 색상·타이포·간격은 여기 정의된 토큰만 쓴다(임의값 금지). 컴포넌트 계층 분리는 [`headless-components.md`](./headless-components.md), 배치는 folder-structure 스킬.

## 토큰 원천

`packages/config/tailwind/preset.js` 가 단일 원천이다. 세 앱의 `tailwind.config.*` 가 이 preset을 extend 한다. 토큰을 바꾸려면 여기서 바꾸고, 컴포넌트에서는 하드코딩하지 않는다.

## 타이포그래피

크기+행간이 묶인 **네임드 토큰**을 쓴다. `text-[13px]` 같은 임의값을 쓰지 않는다(행간이 깨지고 스케일이 흐트러진다).

| 토큰 | 크기 | | 토큰 | 크기 |
|---|---|---|---|---|
| `text-xxlarge36` | 36px | | `text-small20` | 20px |
| `text-xxlarge32` | 32px | | `text-small18` | 18px |
| `text-xlarge30` | 30px | | `text-xsmall16` | 16px |
| `text-xlarge28` | 28px | | `text-xsmall14` | 14px |
| `text-large26` | 26px | | `text-xxsmall12` | 12px |
| `text-medium24` | 24px | | `text-xxsmall10` | 10px |
| `text-medium22` | 22px | | | |

반응형은 모바일 기본 + `md:` 승급이 관행: `text-xsmall14 md:text-xsmall16`.

## 색상

hex 리터럴을 className·`style` 에 박지 않는다. 기존 앵커들이 `style={{ color: '#4d55f5' }}` 로 박아 재사용을 막은 것이 반면교사(헤드리스 문서 참고).

- **브랜드**: `primary`(DEFAULT `#4D55F5`, `hover`/`dark`/`light`/`xlight`, 스텝 `5~90`), `secondary`(그린 `#1BC47D`, 스텝 `0~100`), `tertiary`, `point`, `challenge`.
- **의미(semantic)**: `requirement`(필수·경고 `#FC5555`), `system-error`, `system-positive-green`, `system-positive-blue`.
- **중립(neutral)**: `neutral-0`(가장 진함 `#27272D`) ~ `neutral-100`(가장 옅음 `#FAFAFA`). 텍스트는 보통 `neutral-0`(본문)·`neutral-40/45`(보조)·`neutral-80/85`(보더).
- **고정**: `static-0`(#000), `static-100`(#fff).

## 라운드 · 그림자 · 브레이크포인트

- **borderRadius**(네임드): `rounded-xxs`(4px), `xs`(6), `sm`(8), `ms`(10), `md`(12), `lg`(16), `xl`(20), `xxl`(24), `full`. `rounded-[5px]` 같은 임의값 금지.
- **boxShadow**: `shadow-01`~`shadow-07`, `shadow-10`, `shadow-button`. 커스텀 그림자를 새로 만들지 말고 스텝에서 고른다.
- **breakpoints**: `xs 390 / sm 640 / md 768 / lg 991 / xl 1280 / 2xl 1440 / 3xl 1600`. **모바일 우선**, 데스크톱 분기는 주로 `md`(768).

## 스타일링 규칙

- **임의값 최소화**: `text-[…]`·`rounded-[…]`·`bg-[#…]` 같은 arbitrary value는 신규 코드에서 지양한다. 코드베이스에 arbitrary·dead class 부채가 크므로 더 쌓지 않는다. 토큰에 없으면 preset에 토큰을 추가하는 방향을 우선 검토한다.
- **클래스 병합**: 조건부·동적 클래스는 `twMerge`(web `@/lib/twMerge`)로 병합해 충돌을 정리한다.
- **클래스 정렬**: `prettier-plugin-tailwindcss` 가 자동 정렬하므로 손으로 순서를 다투지 않는다. 단, 조건부 문자열에서 **선행 공백이 프리티어에 의해 제거**될 수 있으니 `` `tab ${on ? 'active' : ''}` `` 처럼 공백을 접합부 바깥에 두어 클래스가 붙지 않게 한다.
- **MUI/styled-components 지양**: 신규 UI는 Tailwind 토큰으로 작성한다. MUI·styled-components는 레거시에 남아 있으나 새 코드에서 늘리지 않는다(스타일 원천 파편화 방지).
- **헤드리스와의 관계**: `packages/ui` 프리미티브는 색상·간격을 자체적으로 박지 말고 `className` 으로 주입받는다. 실제 토큰 적용은 소비 측(도메인)에서 한다.
