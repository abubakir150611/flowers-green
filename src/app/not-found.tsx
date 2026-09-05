import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <p className="font-display text-7xl text-green">404</p>
      <h1 className="mt-4 font-display text-2xl text-graphite">Страница не найдена</h1>
      <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-md bg-green px-5 text-sm font-medium text-ivory">
        На главную
      </Link>
    </div>
  );
}
