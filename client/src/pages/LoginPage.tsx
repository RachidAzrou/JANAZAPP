import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import logoUrl from '@assets/Logo V@2x_1758356439516.png';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional()
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t, i18n } = useTranslation('auth');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update document title and meta description
  useEffect(() => {
    document.title = t('metaTitle');
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('metaDescription'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('metaDescription');
      document.head.appendChild(meta);
    }
  }, [t, i18n.language]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    setLoginError('');
    
    // Simulate a login attempt with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Always show error (mockup functionality)
    setLoginError(t('errorInvalid'));
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center">
      {/* Language switcher in top right corner */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageSwitcher />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12 w-full max-w-sm">
        
        {/* Logo and branding */}
        <div className="text-center mb-8 sm:mb-12">
          <img 
            src={logoUrl} 
            alt="JanazApp" 
            className="h-32 sm:h-48 w-auto mx-auto" 
            data-testid="img-logo-auth"
          />
        </div>

        {/* Login form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 sm:space-y-8">
          
          {/* Email field */}
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t('emailLabel')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              {...form.register('email')}
              className="h-12 sm:h-11 border-gray-200 bg-white rounded-md text-gray-700 placeholder-gray-400 focus-visible:ring-1 focus-visible:ring-green-500 focus-visible:border-green-500 text-base sm:text-sm"
              data-testid="input-email"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label 
              htmlFor="password" 
              className="text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t('passwordLabel')}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              {...form.register('password')}
              className="h-12 sm:h-11 border-gray-200 bg-white rounded-md text-gray-700 placeholder-gray-400 focus-visible:ring-1 focus-visible:ring-green-500 focus-visible:border-green-500 text-base sm:text-sm"
              data-testid="input-password"
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me and forgot password */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Controller
                name="remember"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    data-testid="checkbox-remember"
                  />
                )}
              />
              <Label 
                htmlFor="remember" 
                className="text-sm text-gray-600 cursor-pointer select-none"
              >
                {t('rememberMe')}
              </Label>
            </div>
            <a 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors touch-manipulation"
              data-testid="link-forgot-password"
            >
              {t('forgotPassword')}
            </a>
          </div>

          {/* Error message */}
          {loginError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700" data-testid="status-login-error">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full h-12 sm:h-auto text-base sm:text-sm font-semibold bg-green-600 text-white border-green-600 rounded-md tracking-wide touch-manipulation"
            data-testid="button-login-submit"
          >
            {isSubmitting ? '...' : t('submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}