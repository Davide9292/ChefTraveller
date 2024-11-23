"use client"
import { useState, useEffect } from 'react';
import chefData from './MOCK_DATA.json';

console.log(chefData)

export default function Chefs() {
  const [chefs, setChefs] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setChefs(chefData);


  // Get unique specializations for the filter dropdown
  const uniqueSpecializations = [...new Set(chefData.map((chef) => chef.specialization))];
  setSpecializations(uniqueSpecializations);
}, []);

  const handleFilterChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };



  const filteredChefs = chefs.filter((chef) => {
    const matchSpecialization = !selectedSpecialization || chef.specialization === selectedSpecialization;
    const matchSearchTerm =
      !searchTerm ||
      chef.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chef.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chef.specialization && chef.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchSpecialization && matchSearchTerm;
  });

  console.log(filteredChefs)

  return (
    <main>
      <h2>Our Chefs</h2>
      <div>
        <label htmlFor="specialization">Filter by Specialization:</label>
        <select id="specialization" value={selectedSpecialization} onChange={handleFilterChange}>
          <option value="">All</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
        <div>
          <label htmlFor="search">Search:</label>
          <input type="text" id="search" value={searchTerm} onChange={handleSearchChange} />
        </div>
      </div>
      <ul>
        {chefs.map((chef) => (
          <li key={chef._id}>
            <a href={`/chefs/${chef._id}`}>{chef.firstName} {chef.lastName}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}