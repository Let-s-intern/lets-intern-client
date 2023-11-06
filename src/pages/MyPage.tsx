import React, { useState } from 'react';

const UserProfile = () => {
  return (
    <div className="my-2 mb-4 flex flex-col rounded bg-white px-8 pb-8 pt-6 shadow-md">
      <div className="-mx-3 mb-6 md:flex">
        <div className="mb-6 px-3 md:mb-0 md:w-full">
          <label
            className="text-grey-darker mb-2 block text-xs font-bold uppercase tracking-wide"
            htmlFor="user-name"
          >
            이름
          </label>
          <p
            className="bg-grey-lighter text-grey-darker border-grey-lighter block w-full appearance-none rounded border px-4 py-3"
            id="user-name"
          >
            임호정
          </p>
        </div>
      </div>
      <div className="-mx-3 mb-6 md:flex">
        <div className="px-3 md:w-full">
          <label
            className="text-grey-darker mb-2 block text-xs font-bold uppercase tracking-wide"
            htmlFor="user-email"
          >
            이메일
          </label>
          <p
            className="bg-grey-lighter text-grey-darker border-grey-lighter mb-3 block w-full appearance-none rounded border px-4 py-3"
            id="user-email"
          >
            junglim05@gmail.com
          </p>
        </div>
      </div>
      <div className="-mx-3 mb-6 md:flex">
        <div className="px-3 md:w-full">
          <label
            className="text-grey-darker mb-2 block text-xs font-bold uppercase tracking-wide"
            htmlFor="user-phone"
          >
            전화번호
          </label>
          <p
            className="bg-grey-lighter text-grey-darker border-grey-lighter block w-full appearance-none rounded border px-4 py-3"
            id="user-phone"
          >
            010-9322-8191
          </p>
        </div>
      </div>
    </div>
  );
};

const PasswordChangeForm = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    // 비밀번호 변경 로직 처리
    alert('비밀번호가 변경되었습니다.');
    // 비밀번호 변경 API 호출 등의 작업을 여기에 추가
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700"
        >
          기존 비밀번호
        </label>
        <input
          type="password"
          name="currentPassword"
          id="currentPassword"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          onChange={handleChange}
          placeholder="기존 비밀번호를 입력해주세요."
        />
      </div>
      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          새로운 비밀번호
        </label>
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          onChange={handleChange}
          placeholder="새로운 비밀번호를 입력해주세요."
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          비밀번호 확인
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          onChange={handleChange}
          placeholder="새로운 비밀번호를 다시 입력해주세요."
        />
      </div>
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          변경하기
        </button>
      </div>
    </form>
  );
};

const MyPage = () => {
  return (
    <div className="container mx-auto p-4">
      <UserProfile />
      <PasswordChangeForm />
    </div>
  );
};

export default MyPage;
