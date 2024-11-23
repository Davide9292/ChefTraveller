'use client';
// client/app/login/page.js
import LoginForm from '../../components/LoginForm';
import Link from 'next/link';

export default function Login() {
  return (
    <main className="auth-container">
      <h2>Login</h2>
      <LoginForm />
      <div className="register-cta">
        <p>Not yet registered?</p>
        <Link href="/register">
          <p>Sign Up</p>
        </Link>
      </div>
    </main>
  );
}