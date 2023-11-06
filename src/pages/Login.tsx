interface InputProps {
  type?: string;
  value?: string;
  placeholder: string;
}

interface LabelProps {
  id: string;
  text: string;
}

interface ButtonProps {
  color?: string;
  children: React.ReactNode;
}

const Label = ({ id, text }: LabelProps) => {
  return (
    <label htmlFor={id} className="mb-2 block w-full font-medium">
      {text}
    </label>
  );
};

const Input = ({ type = 'text', value, placeholder }: InputProps) => {
  return (
    <input
      type={type}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
      placeholder={placeholder}
      value={value}
    />
  );
};

const Button = ({ color, children }: ButtonProps) => {
  return (
    <button
      className={`w-full rounded-full py-2 font-semibold ${
        color === 'white'
          ? 'border border-gray-300 bg-white text-black'
          : 'bg-indigo-500 text-white'
      }`}
    >
      {children}
    </button>
  );
};

const Login = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-4">
      <div className="mt-32 w-full sm:max-w-[500px]">
        <h2 className="mb-5 text-center text-2xl font-semibold">로그인</h2>
        <div>
          <Label id="이메일" text="이메일" />
          <Input placeholder="이메일" />
        </div>
        <div className="mt-5">
          <Label id="비밀번호" text="비밀번호" />
          <Input placeholder="비밀번호" type="password" />
        </div>
        <div className="mt-5">
          <div>
            <Button>로그인</Button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button color="white">회원가입</Button>
            <Button color="white">비밀번호 찾기</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
