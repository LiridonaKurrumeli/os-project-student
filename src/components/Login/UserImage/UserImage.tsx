export const UserImage = () => {
  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl">
        <span className="text-4xl">👩🏻‍💼</span>
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
    </div>
  );
};
