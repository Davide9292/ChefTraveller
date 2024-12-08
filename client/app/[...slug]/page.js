// client/app/[...slug]/page.js
export default function Page({ params }) {
    return (
      <div>
        <h1>This is a dynamic route</h1>
        <p>Slug: {params.slug}</p> 
      </div>
    );
  }