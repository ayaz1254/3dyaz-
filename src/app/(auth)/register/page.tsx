import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Kayıt Ol</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Siparişlerinizi takip etmek için hesap oluşturun
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
