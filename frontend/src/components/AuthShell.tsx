import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  error?: string | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  footer?: ReactNode;
  children: ReactNode;
};

export default function AuthShell({
  title,
  error,
  onSubmit,
  footer,
  children,
}: AuthShellProps) {
  return (
    <main className="login-page">
      <h1 className="login-title">{title}</h1>

      <form className="login-form" onSubmit={onSubmit} noValidate>
        {children}

        {error ? (
          <p className="login-error" role="alert">
            {error}
          </p>
        ) : null}

        {footer}
      </form>
    </main>
  );
}