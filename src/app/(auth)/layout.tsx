export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex justify-center h-full items-center flex-col gap-10">
      <div className="text-center">
        <h2 className="font-semibold text-xl">Welcome to ARD U IN/Out</h2>
        <p className="text-sm">
          Please authenticate to your account to access the full features of
          this application.
        </p>
      </div>
      {children}
    </div>
  );
}
