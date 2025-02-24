export default function VerifyEmail() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-mint-cream dark:bg-black">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Check your email</h1>
      <p className="text-gray-700 dark:text-gray-300">
        We've sent you an email with a confirmation link. Please check your inbox and click the link to verify your account.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
        If you don't see the email, check your spam folder.
      </p>
    </div>
  )
} 