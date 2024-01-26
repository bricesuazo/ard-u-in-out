import Header from '~/components/header';

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="mx-auto p-5 max-w-lg">
      <Header />
      {children}
    </main>
  );
}
