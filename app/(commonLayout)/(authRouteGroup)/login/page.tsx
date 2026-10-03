import LoginForm from "@/components/modules/auth/LoginForm";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return (
    <div className="my-auto">
      <LoginForm redirectPath={redirectPath} />
    </div>
  );
};

export default LoginPage;
