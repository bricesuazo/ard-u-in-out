import Header from '~/components/header';

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="h-full border-x mx-auto p-5 max-w-screen-sm">
      <Header />
      {children}
    </main>
  );
}
