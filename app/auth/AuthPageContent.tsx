import Link from "next/link";
import { signInAction, signOutAction, signUpAction } from "@/app/auth/actions";
import { getOptionalAppSession } from "@/lib/appSession";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SearchParamsInput =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

async function resolveSearchParams(searchParams: SearchParamsInput) {
  return searchParams ? await searchParams : {};
}

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function AuthPageContent({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  const [session, params] = await Promise.all([getOptionalAppSession(), resolveSearchParams(searchParams)]);
  const error = getSingleSearchParam(params.error);
  const message = getSingleSearchParam(params.message);

  return (
    <>
      <Header currentPath="/auth" title="Авторизация" userEmail={session.user?.email ?? null} />
      <main className="app-screen">
        <div className="screen-stack">
          <Card>
            <CardHeader>
              <CardTitle>Доступ к аккаунту</CardTitle>
              <CardDescription>Вход и регистрация без лишних действий, в компактном мобильном формате.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.user ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-zinc-900 bg-black/70 px-4 py-3 text-sm text-zinc-300">
                    Вы уже вошли. Можно продолжить тренировку или выйти из текущей сессии.
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button asChild className="w-full rounded-2xl">
                      <Link href="/dashboard">Открыть дашборд</Link>
                    </Button>
                    <form action={signOutAction}>
                      <Button variant="secondary" className="w-full rounded-2xl" type="submit">
                        Выйти
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <form className="space-y-4" action={signInAction}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                      Пароль
                    </label>
                    <Input id="password" name="password" type="password" placeholder="Введите пароль" required />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-950/80 bg-zinc-950 px-3 py-2 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}

                  {message ? (
                    <div className="rounded-2xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
                      {message}
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button className="w-full rounded-2xl" type="submit">
                      Войти
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full rounded-2xl"
                      type="submit"
                      formAction={signUpAction}
                    >
                      Зарегистрироваться
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
