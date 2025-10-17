"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function Header({ title, showBackButton = false }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Левая часть - Логотип и навигация */}
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="mr-3 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Fitchain</h1>
            </div>
            <nav className="ml-8 hidden sm:block">
              <div className="flex space-x-1">
                <button
                  onClick={() => router.push("/")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Главная
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Дашборд
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Профиль
                </button>
              </div>
            </nav>
          </div>

          {/* Правая часть - Профиль пользователя */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/auth")}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            onClick={() => router.push("/")}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 w-full text-left"
          >
            Главная
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 w-full text-left"
          >
            Дашборд
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 w-full text-left"
          >
            Профиль
          </button>
        </div>
      </div>

      {/* Заголовок страницы (если указан) */}
      {title && (
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          </div>
        </div>
      )}
    </header>
  );
}