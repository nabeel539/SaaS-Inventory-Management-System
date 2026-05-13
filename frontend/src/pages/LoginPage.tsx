import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const handleDemoLogin = () => {
    setValue('email', 'admin@nexus.com');
    setValue('password', 'password123');
    toast.success('Demo credentials filled!');
  };

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const response = await authService.login(data);
      login(response.token, response.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 mx-auto mb-3 bg-primary rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-headline">{APP_NAME}</h1>
        <p className="text-body-sm text-muted-foreground mt-1">{APP_TAGLINE}</p>
      </div>

      {/* Login Card */}
      <div className="card text-left">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-title font-semibold">Welcome back</h2>
          <button 
            type="button"
            onClick={handleDemoLogin}
            className="text-[10px] bg-surface-container-highest px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors label-caps"
          >
            Use Demo Credential
          </button>
        </div>
        <p className="text-body-sm text-muted-foreground mb-6">
          Enter your credentials to access your dashboard.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label-caps block mb-2">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className={`input-field ${errors.email ? 'border-destructive' : ''}`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-destructive text-[11px] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label-caps block mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input-field ${errors.password ? 'border-destructive' : ''}`}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-destructive text-[11px] mt-1">{errors.password.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-70"
          >
            {isSubmitting ? 'Logging in...' : 'Login →'}
          </button>
        </form>
      </div>

      <p className="text-body-sm text-muted-foreground mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#1b1b1b] font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
