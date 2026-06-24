import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Giriş Yap</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hesabınıza giriş yaparak siparişlerinizi takip edebilirsiniz
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
