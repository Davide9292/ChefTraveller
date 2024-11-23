'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import styles from './ChefProfile.module.css';
import chefData from '../MOCK_DATA.json'; // Adjust the path if needed

export default function ChefProfile({ params }) {
    const [chef, setChef] = useState(null);
    const unwrappedParams = use(params); // Unwrap the params Promise
  
    useEffect(() => {
      const foundChef = chefData.find((chef) => chef.id === parseInt(unwrappedParams.id, 10)); // Access id from unwrappedParams
      setChef(foundChef);
    }, [unwrappedParams.id]); // Use unwrappedParams.id in the dependency array

  if (!chef) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div className={styles.profile}>
        <img src={chef.profilePicture} alt={chef.firstName + ' ' + chef.lastName} />
        <h2>{chef.firstName} {chef.lastName}</h2>
        <p>{chef.biography}</p>
        <p>Specialization: {chef.specialization}</p>
        {/* Add more details like availability, etc. */}
      </div>
    </main>
  );
}