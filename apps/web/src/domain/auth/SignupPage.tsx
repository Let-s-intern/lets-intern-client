'use client';

import SolidButton from '@/common/button/SolidButton';
import LineInput from '@/common/input/LineInput';
import MarketingModal from '@/domain/auth/modal/MarketingModal';
import PrivacyPolicyModal from '@/domain/auth/modal/PrivacyPolicyModal';
import InfoContainer from '@/domain/auth/ui/InfoContainer';
import SocialLogin from '@/domain/auth/ui/SocialLogin';
import { useState } from 'react';
import useSignup from './hooks/useSignup';
import AgreementSection from './section/AgreementSection';

const SignUp = () => {
  const {
    value,
    setValue,
    isSocial,
    error,
    errorMessage,
    isSignupSuccess,
    buttonDisabled,
    handlePhoneNumChange,
    onSubmit,
    isAllAgreed,
    handleToggleAll,
  } = useSignup();

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);

  return (
    <>
      {isSignupSuccess ? (
        <InfoContainer isSocial={isSocial} email={value.email} />
      ) : (
        <div className="w-full pt-9 md:mx-auto md:w-[448px] md:py-16">
          <section className="mx-5 mb-[80px] md:mx-0 md:mb-[60px]">
            <div className="mb-9">
              <span className="text-xsmall16 text-neutral-30 leading-[1.625rem]">
                회원가입
              </span>
              {!isSocial && (
                <h1 className="text-medium24 text-neutral-0 mt-6 font-semibold">
                  기본 정보를 입력해 주세요.
                </h1>
              )}
            </div>

            <form onSubmit={onSubmit}>
              {isSocial ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xsmall14 text-neutral-0">
                      렛츠커리어 정보 수신용 이메일
                    </label>
                    <p className="text-xsmall14 text-neutral-40 mb-1">
                      * 결제정보 및 프로그램 신청 관련 알림 수신을 위해, 자주
                      사용하는 이메일 주소를 입력해주세요!
                    </p>
                    <LineInput
                      name="contactEmail"
                      placeholder="이메일을 입력해 주세요."
                      value={value.email}
                      onChange={(e) =>
                        setValue({ ...value, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      유입경로
                    </label>
                    <LineInput
                      placeholder="유입경로를 입력해 주세요."
                      value={value.inflow}
                      onChange={(e) =>
                        setValue({ ...value, inflow: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      이메일
                    </label>
                    <LineInput
                      placeholder="이메일을 입력해 주세요."
                      value={value.email}
                      onChange={(e) =>
                        setValue({ ...value, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">이름</label>
                    <LineInput
                      placeholder="이름을 입력해 주세요."
                      value={value.name}
                      onChange={(e) =>
                        setValue({ ...value, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      휴대폰 번호
                    </label>
                    <LineInput
                      placeholder="휴대폰 번호를 입력해 주세요."
                      value={value.phoneNum}
                      onChange={handlePhoneNumChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      비밀번호
                    </label>
                    <LineInput
                      type="password"
                      placeholder="비밀번호를 입력해 주세요."
                      value={value.password}
                      onChange={(e) =>
                        setValue({ ...value, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      비밀번호 확인
                    </label>
                    <LineInput
                      type="password"
                      placeholder="비밀번호를 다시 입력해 주세요."
                      value={value.passwordConfirm}
                      onChange={(e) =>
                        setValue({
                          ...value,
                          passwordConfirm: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      유입경로
                    </label>
                    <LineInput
                      placeholder="유입경로를 입력해 주세요."
                      value={value.inflow}
                      onChange={(e) =>
                        setValue({ ...value, inflow: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <AgreementSection
                value={value}
                setValue={setValue}
                isAllAgreed={isAllAgreed}
                onToggleAll={handleToggleAll}
                onShowPrivacyModal={() => setShowPrivacyModal(true)}
                onShowMarketingModal={() => setShowMarketingModal(true)}
              />

              {error ? (
                <p className="text-xsmall14 text-system-error mt-4 text-center">
                  {errorMessage}
                </p>
              ) : null}

              <SolidButton
                type="submit"
                className="mt-12 w-full"
                disabled={buttonDisabled}
              >
                {isSocial ? '다음' : '가입하기'}
              </SolidButton>
            </form>

            {!isSocial && <SocialLogin type="SIGN_UP" />}
          </section>

          <PrivacyPolicyModal
            showModal={showPrivacyModal}
            setShowModal={setShowPrivacyModal}
          />
          <MarketingModal
            showModal={showMarketingModal}
            setShowModal={setShowMarketingModal}
          />
        </div>
      )}
    </>
  );
};

export default SignUp;
