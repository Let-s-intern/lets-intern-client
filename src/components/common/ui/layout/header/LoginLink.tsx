interface Props {
  redirect?: string;
}

function LoginLink({ redirect }: Props) {
  return (
    <a
      href={`/login?redirect=${redirect}`}
      className="rounded-xxs bg-white px-3 py-1.5 text-xsmall14 font-medium text-primary"
    >
      로그인
    </a>
  );
}

export default LoginLink;
