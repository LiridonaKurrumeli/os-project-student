import { useState } from "react";
import { useLoginFormik } from "../lib/useLoginFormik";
import { useAuthContext } from "@context/AuthContext/AuthContext";
import { Icon } from "@components/shared/Icon/Icon";

export const LoginForm = () => {
  const { login } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useLoginFormik({
    onSubmit: async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      login();
      setIsLoading(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-sm mx-auto">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Login
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your password to continue
          </p>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className={`w-full px-4 py-3 pl-11 pr-12 rounded-xl border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:ring-primary"
              } bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:ring-2 transition-all`}
              autoFocus
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔐
            </span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <span>⚠️</span> {formik.errors.password}
            </p>
          )}
        </div>

        {/* Hint */}
        <div className="mb-6 p-3 bg-primary/10 rounded-xl">
          <p className="text-xs text-primary text-center">
            💡 Password is <strong className="font-mono">1111</strong>
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-gray-800 rounded-xl font-semibold hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
              <span>Unlocking...</span>
            </>
          ) : (
            <>
              <span>Unlock</span>
              <Icon icon="arrow-right" className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
