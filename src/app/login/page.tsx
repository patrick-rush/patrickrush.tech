import { SimpleLayout } from '@/components/SimpleLayout'
import { LoginForm } from '@/components/LoginForm'

export default function Login() {
  return (
    <SimpleLayout title="Sign in" intro="Access the tools section.">
      <div className="max-w-md">
        <LoginForm />
      </div>
    </SimpleLayout>
  )
}
