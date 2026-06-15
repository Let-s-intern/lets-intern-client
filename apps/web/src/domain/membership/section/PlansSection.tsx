'use client';
import { useState } from 'react';

type TabKey = 'a' | 'b' | 'c';

export default function PlansSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('a');
  const [openAcc, setOpenAcc] = useState<string | null>('standard');

  return (
    <section className="plans" id="plans">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">멤버십 플랜</span>
          <h2>나에게 맞는 플랜을 선택하세요</h2>
          <p>
            가장 많은 분들이 <b style={{ color: 'var(--lc-blue)' }}>스탠다드</b>
            를 선택했어요.
          </p>
        </div>

        <div className="tabs">
          {(['a', 'b', 'c'] as TabKey[]).map((v) => (
            <button
              key={v}
              className={`tab${activeTab === v ? 'on' : ''}`}
              onClick={() => setActiveTab(v)}
            >
              {v === 'a' ? '카드형' : v === 'b' ? '비교표' : '펼침형'}
            </button>
          ))}
        </div>

        {/* VARIANT A — 카드형 */}
        <div
          className={`variant${activeTab === 'a' ? 'on' : ''}`}
          style={activeTab !== 'a' ? { display: 'none' } : undefined}
        >
          <div className="pcards">
            <div className="pcard rv" style={{ ['--rvd' as string]: '0s' }}>
              <div className="pname">베이직</div>
              <div className="ptarget">
                스스로 동기부여하며
                <br />
                달리는 공채 2트 이상
              </div>
              <div className="price">
                <span className="was num">99,000원</span>
                <br />
                <span className="now num">79,000</span>
                <span className="won">원</span>
              </div>
              <span className="off">런칭 20% OFF</span>
              <ul className="plist">
                <li>
                  가이드북 3종{' '}
                  <span style={{ color: 'var(--g500)', fontWeight: 500 }}>
                    (경험정리·이력서·포트폴리오)
                  </span>
                </li>
                <li>렛츠런 스터디 3개월 무료</li>
                <li>기타 챌린지 10% 할인</li>
                <li className="off-item">취준위키 VOD</li>
                <li className="off-item">대기업 챌린지 할인 · 1:1 멘토링</li>
              </ul>
              <button
                className="btn btn-ghost"
                onClick={() => alert('준비 중')} // TODO(MVP): Push 3에서 연결
              >
                베이직 선택
              </button>
            </div>

            <div
              className="pcard feat rv"
              style={{ ['--rvd' as string]: '0.08s' }}
            >
              <span className="ribbon">🔥 가장 많이 선택</span>
              <div className="pname">스탠다드</div>
              <div className="ptarget">
                챌린지로 확실한 동기부여가
                <br />
                필요한 취준생
              </div>
              <div className="price">
                <span className="was num">198,000원</span>
                <br />
                <span className="now num">149,000</span>
                <span className="won">원</span>
              </div>
              <span className="off">런칭 25% OFF</span>
              <ul className="plist">
                <li>가이드북 6종 전체 열람</li>
                <li>렛츠런 스터디 3개월 무료</li>
                <li>취준위키 VOD 전체 열람</li>
                <li>
                  챌린지 할인{' '}
                  <span style={{ color: 'var(--g500)', fontWeight: 500 }}>
                    (대기업 25%·기타 15%)
                  </span>
                </li>
                <li className="off-item">1:1 현직자 멘토링</li>
              </ul>
              <button
                className="btn btn-blue"
                onClick={() => alert('준비 중')} // TODO(MVP): Push 3에서 연결
              >
                스탠다드 선택 →
              </button>
            </div>

            <div
              className="pcard prem rv"
              style={{ ['--rvd' as string]: '0.16s' }}
            >
              <div className="pname">프리미엄</div>
              <div className="ptarget">
                공채 1트, 혹은 합격이
                <br />
                간절한 분께
              </div>
              <div className="price">
                <span className="was num" style={{ color: '#9aa0b5' }}>
                  360,000원
                </span>
                <br />
                <span className="now num">299,000</span>
                <span className="won">원</span>
              </div>
              <span className="off">런칭 17% OFF</span>
              <ul className="plist">
                <li>가이드북 6종 전체 열람</li>
                <li>렛츠런 스터디 3개월 무료</li>
                <li>취준위키 VOD 전체 열람</li>
                <li>
                  챌린지 할인{' '}
                  <span style={{ color: '#9aa0b5', fontWeight: 500 }}>
                    (대기업 30%·기타 20%)
                  </span>
                </li>
                <li>1:1 현직자 멘토링 총 3회</li>
              </ul>
              <button
                className="btn"
                style={{ background: 'var(--lc-yellow)', color: '#1C1C1C' }}
                onClick={() => alert('준비 중')} // TODO(MVP): Push 3에서 연결
              >
                프리미엄 선택
              </button>
            </div>
          </div>
          <p className="plan-note">
            모든 플랜은 <b>26.07.01 – 09.30</b> 3개월간 이용 가능 · 결제 시
            등급별 혜택이 자동 적용돼요
          </p>
        </div>

        {/* VARIANT B — 비교표 */}
        <div
          className={`variant${activeTab === 'b' ? 'on' : ''}`}
          style={activeTab !== 'b' ? { display: 'none' } : undefined}
        >
          <div className="matrix rv" id="matrix">
            <div className="mrow head">
              <div></div>
              <div>
                <span className="mname">베이직</span>
                <span className="mprice num">79,000원</span>
              </div>
              <div className="mcol-feat">
                <span className="mhead-tag">가장 인기</span>
                <span className="mname b">스탠다드</span>
                <span className="mprice b num">149,000원</span>
              </div>
              <div>
                <span className="mname">프리미엄</span>
                <span className="mprice num">299,000원</span>
              </div>
            </div>
            <div className="mrow">
              <div>가이드북 (경·이·자·포·면·인적성)</div>
              <div>3종</div>
              <div className="mcol-feat">6종 전체</div>
              <div>6종 전체</div>
            </div>
            <div className="mrow">
              <div>렛츠런 스터디 (페이백 X)</div>
              <div>무료</div>
              <div className="mcol-feat">무료</div>
              <div>무료</div>
            </div>
            <div className="mrow">
              <div>취준위키 VOD 전체</div>
              <div>
                <span className="dash">–</span>
              </div>
              <div className="mcol-feat">
                <span className="check">✓</span>
              </div>
              <div>
                <span className="check">✓</span>
              </div>
            </div>
            <div className="mrow">
              <div>1:1 현직자 멘토링</div>
              <div>
                <span className="dash">–</span>
              </div>
              <div className="mcol-feat">
                <span className="dash">–</span>
              </div>
              <div>총 3회</div>
            </div>
            <div className="mrow">
              <div>기타 서비스 제휴 혜택</div>
              <div>
                <span
                  style={{
                    color: 'var(--g500)',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  준비 중
                </span>
              </div>
              <div className="mcol-feat">
                <span
                  style={{
                    color: 'var(--g500)',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  준비 중
                </span>
              </div>
              <div>
                <span
                  style={{
                    color: 'var(--g500)',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  준비 중
                </span>
              </div>
            </div>
            <div className="mrow">
              <div>대기업 챌린지 할인</div>
              <div>
                <span className="dash">–</span>
              </div>
              <div className="mcol-feat">25%</div>
              <div>30%</div>
            </div>
            <div className="mrow">
              <div>기타 챌린지 할인 (자·포·마케팅·HR·기획)</div>
              <div>10%</div>
              <div className="mcol-feat">15%</div>
              <div>20%</div>
            </div>
          </div>
          <p className="plan-note">
            행은 혜택, 열은 플랜 · 스탠다드 열을 한눈에 비교하세요
          </p>
        </div>

        {/* VARIANT C — 펼침형 */}
        <div
          className={`variant${activeTab === 'c' ? 'on' : ''}`}
          style={activeTab !== 'c' ? { display: 'none' } : undefined}
        >
          <div className="acc">
            <div
              className={`arow rv${openAcc === 'basic' ? 'open' : ''}`}
              style={{ ['--rvd' as string]: '0s' }}
            >
              <div
                className="ahead"
                onClick={() => setOpenAcc(openAcc === 'basic' ? null : 'basic')}
              >
                <span className="nm">베이직</span>
                <span className="tg">· 스스로 취준</span>
                <span className="pr num">79,000</span>
                <span className="ind">＋</span>
              </div>
              <div className="abody">
                <ul className="agrid">
                  <li>가이드북 3종 (경험정리·이력서·포트폴리오)</li>
                  <li>렛츠런 스터디 무료</li>
                  <li>기타 챌린지 10% 할인</li>
                </ul>
                <button
                  className="btn btn-ghost"
                  onClick={() => alert('준비 중')} // TODO(MVP): Push 3에서 연결
                >
                  베이직 선택
                </button>
              </div>
            </div>

            <div
              className={`arow rv${openAcc === 'standard' ? 'open' : ''}`}
              style={{ ['--rvd' as string]: '0.08s' }}
            >
              <div
                className="ahead"
                onClick={() =>
                  setOpenAcc(openAcc === 'standard' ? null : 'standard')
                }
              >
                <span className="ribbon-c">🔥 가장 인기</span>
                <span className="nm">스탠다드</span>
                <span className="pr num">149,000</span>
                <span className="ind">＋</span>
              </div>
              <div className="abody">
                <ul className="agrid">
                  <li>가이드북 6종 전체 열람</li>
                  <li>렛츠런 스터디 무료</li>
                  <li>취준위키 VOD 전체 열람</li>
                  <li>챌린지 할인 (대기업 25%·기타 15%)</li>
                </ul>
                <button
                  className="btn btn-blue"
                  onClick={() => alert('준비 중')} // TODO(MVP): Push 3에서 연결
                >
                  스탠다드 선택 →
                </button>
              </div>
            </div>

            <div
              className={`arow rv${openAcc === 'premium' ? 'open' : ''}`}
              style={{ ['--rvd' as string]: '0.16s' }}
            >
              <div
                className="ahead"
                onClick={() =>
                  setOpenAcc(openAcc === 'premium' ? null : 'premium')
                }
              >
                <span className="nm">프리미엄</span>
                <span className="tg">· 1:1 멘토링 포함</span>
                <span className="pr num">299,000</span>
                <span className="ind">＋</span>
              </div>
              <div className="abody">
                <ul className="agrid">
                  <li>가이드북 6종 전체 열람</li>
                  <li>렛츠런 스터디 무료</li>
                  <li>취준위키 VOD 전체 열람</li>
                  <li>챌린지 할인 (대기업 30%·기타 20%)</li>
                  <li>1:1 현직자 멘토링 총 3회</li>
                </ul>
                <button
                  className="btn"
                  style={{ background: 'var(--lc-yellow)', color: '#1C1C1C' }}
                  onClick={() => alert('준비 중')} // TODO(MVP): Push 3에서 연결
                >
                  프리미엄 선택
                </button>
              </div>
            </div>
          </div>
          <p className="plan-note">
            기본으로 추천 플랜(스탠다드)이 펼쳐져 있어요 · 모바일에서도 편하게
            비교
          </p>
        </div>
      </div>
    </section>
  );
}
