// client/app/book-a-chef/thank-you/page.js
import Link from 'next/link';

export default function ThankYou() {
  return (
    <main className="booking-container">
      <h2>Thank You!</h2>
      <p>Your request has been submitted.</p>
      <Link href="/profile" legacyBehavior>
        <a className="next-button">Go to your profile page</a>
      </Link>
    </main>
  );
}