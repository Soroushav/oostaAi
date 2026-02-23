import { useForm } from "react-hook-form";
import { Mail, Lock, ArrowLeft, Chrome } from 'lucide-react';
import { login } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type LoginData = {
  email: string;
  password: string;
};
export default function LoginForm() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    mode: "onChange",
  });
  const onSubmit =  async (data: LoginData) => {
    console.log("Login data:", data);
    try {
      const res = await login(data);
      console.log("Success:", res);
      loginContext(res.access, res.refresh);
      navigate("/main");
    } catch (error: any) {
      console.log("Error:", error.response?.data);
    }
  };
  return (
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

                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
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
                  })}
                  className={`w-full bg-slate-50 text-sm rounded-2xl py-3.5 pr-12 pl-4 outline-none border transition-all
                    ${
                      errors.password
                        ? "border-red-400 focus:ring-red-200"
                        : "border-transparent focus:border-emerald-200 focus:ring-emerald-500/10"
                    }`}
                />

                <Lock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl py-3.5 mt-2 transition-all shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              ورود به حساب
              <ArrowLeft size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">یا ورود با</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl py-3.5 border border-slate-200 transition-all flex items-center justify-center gap-2.5">
            <Chrome size={20} className="text-slate-500" />
            <span>حساب گوگل</span>
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            حساب کاربری ندارید؟{' '}
            <a href="/signup" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all">
              ثبت‌نام کنید
            </a>
          </p>

    </div>
  )
}
