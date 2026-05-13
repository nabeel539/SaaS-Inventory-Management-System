import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { APP_NAME } from '../utils/constants';

const signupSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsSubmitting(true);
    try {
      const response = await authService.signup(data);
      login(response.token, response.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create account. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold">{APP_NAME}</span>
        </div>
        <h1 className="text-headline">Create your account</h1>
        <p className="text-body-sm text-muted-foreground mt-1">
          Begin your journey towards precision inventory management.
        </p>
      </div>

      {/* Signup Card */}
      <div className="card text-left">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label-caps block mb-2">Organization Name</label>
            <input
              type="text"
              placeholder="Acme Logistics"
              className={`input-field ${errors.organizationName ? 'border-destructive' : ''}`}
              {...register('organizationName')}
            />
            {errors.organizationName && (
              <p className="text-destructive text-[11px] mt-1">{errors.organizationName.message}</p>
            )}
          </div>

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

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="label-caps block mb-2">Confirm</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input-field ${errors.confirmPassword ? 'border-destructive' : ''}`}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-[11px] mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-70"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>
      </div>

      <p className="text-body-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#1b1b1b] font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
