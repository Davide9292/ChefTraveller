// client/app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Welcome to ChefTraveller!</h1>
      <p>Find the perfect chef for your private events.</p>
      <Link href="/book-a-chef" className="cta-button"> 
        Book a Chef
      </Link> 
    </main>
  );
}
