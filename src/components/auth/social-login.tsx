import { Button } from '@/components/ui/button';

interface SocialLoginProps {
  handleSocialLogin: (provider: 'google' | 'apple') => void;
}

export default function SocialLogin({ handleSocialLogin }: SocialLoginProps) {
  return (
    <>
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-[1px] bg-gray-200"></div>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          Or continue with
        </span>
        <div className="flex-1 h-[1px] bg-gray-200"></div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-xl py-6 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-gray-700"
          onClick={() => handleSocialLogin('google')}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-xl py-6 border-gray-200 opacity-50 cursor-not-allowed font-bold text-gray-700"
          disabled
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.11.78.9-.04 2.1-.83 3.52-.76 1.76.08 3.09.73 3.84 1.83-3.69 2.18-3.12 7.21.57 9.12-.66 1.66-1.53 3.32-3.04 5zm-3.14-13.82c-.04-1.92 1.58-3.62 3.44-3.7.15 2.1-1.89 3.96-3.44 3.7z" />
          </svg>
          Apple
        </Button>
      </div>
    </>
  );
}
