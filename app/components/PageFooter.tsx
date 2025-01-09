const year = new Date().getFullYear();

export const FooterPage = () => {
  return (
    <footer className="w-full flex items-center justify-center bg-zinc-800 dark:bg-zinc-900 py-4">
      <div className="container mx-auto px-4">
        <div className="p-4 text-center">
          <p className="text-default-100">
            ©2024 - {year},{" "}
            <span className="font-bip text-blue-400">{"i'm"} ToDo</span>. Все
            права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};
