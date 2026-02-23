import React from "react";
import { Mail, Lock, Bot, Chrome } from "lucide-react";
import { useForm } from "react-hook-form";
import { signup } from "../services/apiAuth";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  password: string;
  password2: string;
};

const Signup: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const navigate = useNavigate();
  const onSubmit = async (data: FormData) => {
    try {
      const res = await signup(data);
      console.log("Success:", res);
      navigate("/main");
    } catch (error: any) {
      console.log("Error:", error.response?.data);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans"
      dir="rtl"
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
            <Bot size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            ساخت حساب کاربری
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            به جمع ۵۰۰۰+ کاربر اوستا AI بپیوندید
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 mr-1">
              آدرس ایمیل
            </label>

            <div className="relative group">
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "ایمیل الزامی است",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "فرمت ایمیل صحیح نیست",
                  },
                })}
                className={`w-full bg-slate-50 text-sm rounded-2xl py-3.5 pr-12 pl-4 outline-none border transition-all
                ${
                  errors.email
                    ? "border-red-400 focus:ring-red-200"
                    : "border-transparent focus:border-emerald-200 focus:ring-emerald-500/10"
                }`}
              />

              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 mr-1">
              رمز عبور
            </label>

            <div className="relative group">
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "رمز عبور الزامی است",
                  minLength: {
                    value: 6,
                    message: "حداقل ۶ کاراکتر",
                  },
                  pattern: {
                    value: /^(?=.*[0-9]).+$/,
                    message: "باید حداقل یک عدد داشته باشد",
                  },
                })}
                className={`w-full bg-slate-50 text-sm rounded-2xl py-3.5 pr-12 pl-4 outline-none border transition-all
                ${
                  errors.password
                    ? "border-red-400 focus:ring-red-200"
                    : "border-transparent focus:border-emerald-200 focus:ring-emerald-500/10"
                }`}
              />

              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* PASSWORD2 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 mr-1">
              تایید رمز عبور
            </label>

            <div className="relative group">
              <input
                type="password"
                placeholder="••••••••"
                {...register("password2", {
                  required: "تایید رمز عبور الزامی است",
                  validate: (value) =>
                    value === watch("password") || "رمز عبورها یکسان نیستند",
                })}
                className={`w-full bg-slate-50 text-sm rounded-2xl py-3.5 pr-12 pl-4 outline-none border transition-all
                ${
                  errors.password2
                    ? "border-red-400 focus:ring-red-200"
                    : "border-transparent focus:border-emerald-200 focus:ring-emerald-500/10"
                }`}
              />

              <Lock
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
            </div>

              {errors.password2 && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password2.message}
                </p>
              )}
          </div>
          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl py-3.5 mt-2 transition-all"
          >
            ثبت‌نام رایگان
          </button>

          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">یا ثبت‌نام با</span>
            </div>
          </div>

          {/* Google */}
          <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl py-3.5 border border-slate-200 transition-all flex items-center justify-center gap-2.5">
            <Chrome size={20} className="text-slate-500" />
            <span>حساب گوگل</span>
          </button>

          {/* Login */}
          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <a
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all"
            >
              وارد شوید
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          با ثبت‌نام، شما{" "}
          <a href="#" className="underline hover:text-slate-600">
            قوانین و مقررات
          </a>{" "}
          اوستا AI را می‌پذیرید.
        </p>
      </div>
    </div>
  );
};

export default Signup;