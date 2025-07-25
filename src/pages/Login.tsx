import LoginForm from '../features/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <LoginForm />
    </div>
  );
}