export default function ReviewsSection() {
  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">실제 후기</span>
          <h2>
            렛츠커리어와 함께
            <br />
            취뽀한 분들의 진짜 이야기
          </h2>
          <p>
            인스타그램, 오픈채팅, 챌린지 커뮤니티에 직접 남겨주신 후기를 그대로
            가져왔어요.
          </p>
        </div>
        <div className="review-grid">
          <div className="rev-card rv" style={{ ['--rvd' as string]: '0s' }}>
            <div className="rev-meta">
              <span className="src">
                <span className="dot"></span>인스타그램 DM
              </span>
              <span className="badge">서합·최합 🎉</span>
            </div>
            <div className="rev-shot">
              {/* TODO(MVP): 실제 후기 이미지로 교체 */}
              <img src="" alt="인스타그램으로 받은 합격 후기" loading="lazy" />
            </div>
            <div className="rev-quote">
              렛커 챌린지로 이력서·자소서까지 다 참고했어요. 교육기업 서류 합격,
              식품계 최종 합격해서 전환형으로 다니고 있어요
            </div>
          </div>

          <div className="rev-card rv" style={{ ['--rvd' as string]: '0.08s' }}>
            <div className="rev-meta">
              <span className="src">
                <span className="dot"></span>멘토에게 온 메시지
              </span>
              <span className="badge">6개사 서류 합격</span>
            </div>
            <div className="rev-shot">
              {/* TODO(MVP): 실제 후기 이미지로 교체 */}
              <img src="" alt="주요 기업 서류 합격 후기" loading="lazy" />
            </div>
            <div className="rev-quote">
              경험 정리로 강점을 발견한 덕분에
              SK하이닉스·현대오일뱅크·한화시스템·한화오션·CJ ENM·현대자동차 등
              주요 기업 서류 합격이라는 값진 결과를 얻었어요
            </div>
          </div>

          <div className="rev-card rv" style={{ ['--rvd' as string]: '0.16s' }}>
            <div className="rev-meta">
              <span className="src">
                <span className="dot"></span>카카오톡 오픈채팅
              </span>
              <span className="badge">정규직 합격 🎉</span>
            </div>
            <div className="rev-shot">
              {/* TODO(MVP): 실제 후기 이미지로 교체 */}
              <img src="" alt="자기소개서 챌린지 후기" loading="lazy" />
            </div>
            <div className="rev-quote">
              렛커 덕에 취뽀했습니다! 자기소개서 챌린지에서 방향성 설정, 경험
              정리에 큰 도움을 받아 F&amp;B 준대기업 PM 정규직으로 합격했어요
            </div>
          </div>

          <div className="rev-card rv" style={{ ['--rvd' as string]: '0.24s' }}>
            <div className="rev-meta">
              <span className="src">
                <span className="dot"></span>챌린지 미션 후기
              </span>
              <span className="badge">면접 준비</span>
            </div>
            <div className="rev-shot">
              {/* TODO(MVP): 실제 후기 이미지로 교체 */}
              <img src="" alt="면접 준비 챌린지 미션 후기" loading="lazy" />
            </div>
            <div className="rev-quote">
              가장 유용했던 점은 기업 분석 하는 방법을 알게 된 것과 100개 이상의
              질문을 접할 수 있었던 거예요. 자신감 있게 실전에 임할 수 있게
              됐어요
            </div>
          </div>

          <div className="rev-card rv" style={{ ['--rvd' as string]: '0.32s' }}>
            <div className="rev-meta">
              <span className="src">
                <span className="dot"></span>렛츠런 스터디
              </span>
              <span className="badge">동기부여</span>
            </div>
            <div className="rev-shot">
              {/* TODO(MVP): 실제 후기 이미지로 교체 */}
              <img src="" alt="렛츠런 스터디 후기" loading="lazy" />
            </div>
            <div className="rev-quote">
              이번 스터디를 하면서 확실히 동기부여도 받고 격려도 받을 수 있어서
              참 뿌듯한 것 같아요. 다들 열심히 사는 모습을 보며 매일 배워요
            </div>
          </div>

          <div className="rev-card rv" style={{ ['--rvd' as string]: '0.4s' }}>
            <div className="rev-meta">
              <span className="src">
                <span className="dot"></span>챌린지 미션 후기
              </span>
              <span className="badge">콘텐츠 만족</span>
            </div>
            <div className="rev-shot">
              {/* TODO(MVP): 실제 후기 이미지로 교체 */}
              <img src="" alt="리뉴얼된 챌린지 후기" loading="lazy" />
            </div>
            <div className="rev-quote">
              리뉴얼된 챌린지 콘텐츠가 정말 양질이라 계속 들여다보며 많은 도움
              받았어요. 같은 경험도 관점에 따라 완전히 달라지는 걸 체험했어요
            </div>
          </div>

          <div className="rev-card rv" style={{ ['--rvd' as string]: '0.48s' }}>
            <div className="rev-meta">
              <span className="src">
                <span className="dot"></span>렛츠런 스터디
              </span>
              <span className="badge">취준 루틴</span>
            </div>
            <div className="rev-shot">
              {/* TODO(MVP): 실제 후기 이미지로 교체 */}
              <img src="" alt="렛츠런 스터디 커뮤니티 대화" loading="lazy" />
            </div>
            <div className="rev-quote">
              플젝하면서도 취준 놓고 싶지 않아 렛츠런 신청했어요. 같이 달리는
              분들 덕에 하루하루 덜 스트레스 받으며 작업하고 취준도 이어가요
            </div>
          </div>

          <div className="rev-card rv" style={{ ['--rvd' as string]: '0.56s' }}>
            <div className="rev-meta">
              <span className="src">
                <span className="dot"></span>미션 소감
              </span>
              <span className="badge">기업 분석</span>
            </div>
            <div className="rev-shot">
              {/* TODO(MVP): 실제 후기 이미지로 교체 */}
              <img src="" alt="미션 소감 후기" loading="lazy" />
            </div>
            <div className="rev-quote">
              산업군 분석에서 기업 분석 순서로 가니 자료 이해가 수월했어요. 취준
              일기를 쓰듯 소감을 적으니 심리적 안정과 동기부여에 도움이 돼요
            </div>
          </div>
        </div>

        <div className="rev-sub">
          <h3>챌린지에 참여한 분들의 미션 후기</h3>
          <p>
            이력서·자소서·포트폴리오·면접·인적성까지, 실제 챌린지에서 남겨주신
            회고를 모았어요.
          </p>
        </div>
        <div className="quote-grid">
          <div className="qcard rv" style={{ ['--rvd' as string]: '0s' }}>
            <div className="qtop">
              <span className="co co-green">네이버 · LG</span>
              <span className="date">24.09.03</span>
            </div>
            <span className="prog">이력서·자기소개서 완성 1기</span>
            <p className="qbody">
              직무 나침반 개념으로 직무를 분석하니 하고 싶은 일이 더
              명확해졌어요. 대기업 채용사이트의 직무 인터뷰가 업무 루틴부터 팀
              소개까지 자세해서 큰 도움이 됐습니다.
            </p>
            <div className="qby">고○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.08s' }}>
            <div className="qtop">
              <span className="co co-coral">CJ</span>
              <span className="date">25.02.12</span>
            </div>
            <span className="prog">자기소개서 3주 완성 챌린지 2기</span>
            <p className="qbody">
              왜 이 기업·산업이어야 하는지 모호했는데, 논리적이고 정확한
              지원동기를 쓰는 첫 단계를 배웠어요. 분석 자료를 찾는 사이트와
              방법까지 알게 됐습니다.
            </p>
            <div className="qby">임○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.16s' }}>
            <div className="qtop">
              <span className="co co-indigo">현대자동차</span>
              <span className="date">25.02.12</span>
            </div>
            <span className="prog">자기소개서 3주 완성 챌린지 2기</span>
            <p className="qbody">
              완성차 산업을 다방면으로 수집해볼 계기가 됐어요. 직무와 관련된
              키워드를 한 번 더 집중적으로 분석할 필요가 있다고 느꼈습니다.
            </p>
            <div className="qby">신○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.24s' }}>
            <div className="qtop">
              <span className="co co-sky">기아</span>
              <span className="date">25.02.15</span>
            </div>
            <span className="prog">자기소개서 3주 완성 챌린지 2기</span>
            <p className="qbody">
              마케터를 희망했지만 이전 인턴 경력으로 CS/CX 직무에 더 적합하다는
              걸 알게 됐어요. CX도 기획부터 마케팅 전략까지 다룬다는 점이
              반가웠습니다.
            </p>
            <div className="qby">정○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.32s' }}>
            <div className="qtop">
              <span className="co co-blue">토스</span>
              <span className="date">25.03.27</span>
            </div>
            <span className="prog">자기소개서 완성 2주 챌린지 9기</span>
            <p className="qbody">
              지원 동기의 막막함을 3WHY 기법으로 해소했어요. 토스 PO가 원하는
              역량이 잘 정리돼 있어 작성이 수월했습니다. 어렵지만 뿌듯한
              경험이었어요.
            </p>
            <div className="qby">이○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.4s' }}>
            <div className="qtop">
              <span className="co co-coral">LG전자</span>
              <span className="date">25.09.19</span>
            </div>
            <span className="prog">자기소개서 3주 완성 챌린지 3기</span>
            <p className="qbody">
              기업분석을 하다 보니 LG전자가 라이프·비즈니스 솔루션, 자동차
              부품까지 사업을 확장해온 걸 알게 됐고, 이를 지원동기에 활용해봐도
              좋겠다는 생각이 들었어요.
            </p>
            <div className="qby">김○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.48s' }}>
            <div className="qtop">
              <span className="co co-green">멜론</span>
              <span className="date">25.09.10</span>
            </div>
            <span className="prog">자기소개서 3주 완성 챌린지 3기</span>
            <p className="qbody">
              K-STAR-K 구조를 실제 공고에 적용하며, 기업 비전과 직무 핵심을 첫
              문장과 끝 문장에 녹이는 게 얼마나 중요한지 깨달았어요. 같은 경험도
              키워드에 따라 인상이 달라지더라고요.
            </p>
            <div className="qby">정○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.56s' }}>
            <div className="qtop">
              <span className="co co-orange">롯데백화점</span>
              <span className="date">25.09.16</span>
            </div>
            <span className="prog">포트폴리오 2주 완성 챌린지 15기</span>
            <p className="qbody">
              포트폴리오 요약 페이지를 어떻게 보완할지 고민해보게 돼 좋았어요.
              같은 직무에 합격한 분들의 예시를 참고하는 게 큰 도움이 될 것
              같습니다.
            </p>
            <div className="qby">김○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.64s' }}>
            <div className="qtop">
              <span className="co co-blue">삼성</span>
              <span className="date">26.01.28</span>
            </div>
            <span className="prog">자기소개서 완성 챌린지 6기</span>
            <p className="qbody">
              SWOT·PESTEL 분석으로 큰 그림부터 그려나갈 수 있어 도움이 많이
              됐어요. 공채 시즌을 위해 미리미리 기업·산업 분석을 해둬야겠다고
              느꼈습니다.
            </p>
            <div className="qby">김○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.72s' }}>
            <div className="qtop">
              <span className="co co-indigo">현대백화점</span>
              <span className="date">26.05.07</span>
            </div>
            <span className="prog">면접 준비 7일 끝장 챌린지 4기</span>
            <p className="qbody">
              경쟁사와 산업 분석이 선행돼야 기업의 강점을 파악할 수 있다는 걸
              배웠어요. 분석한 내용을 제 경험과 연결해 면접 컨셉을 잡아보려
              합니다.
            </p>
            <div className="qby">김○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.8s' }}>
            <div className="qtop">
              <span className="co co-purple">인적성</span>
              <span className="date">26.06.03</span>
            </div>
            <span className="prog">인적성 대비 수리유형 2주 뽀개기</span>
            <p className="qbody">
              상반기 처음 서류에 합격했는데 인적성에서 떨어졌어요. 뒤늦게
              중요성을 깨닫고 기본부터, 속도보다 정확도 높게 차근차근 쌓아가려
              합니다.
            </p>
            <div className="qby">김○○ 님</div>
          </div>

          <div className="qcard rv" style={{ ['--rvd' as string]: '0.88s' }}>
            <div className="qtop">
              <span className="co co-ink">면접</span>
              <span className="date">26.05.26</span>
            </div>
            <span className="prog">면접 준비 7일 끝장 챌린지 5기</span>
            <p className="qbody">
              면접을 준비하며 제 캐릭터·장단점·경험을 다양한 측면에서 다시 보게
              됐고, 그 과정이 서류 작성에도 도움이 됐어요.
            </p>
            <div className="qby">김○○ 님</div>
          </div>
        </div>

        <p className="rev-note">
          ※ 실제 수강생이 인스타그램·오픈채팅·챌린지 커뮤니티에 남긴 후기를
          캡처한 것으로, 게시 동의를 받은 내용이에요. 개인정보는 가려서
          사용해요.
        </p>
      </div>
    </section>
  );
}
