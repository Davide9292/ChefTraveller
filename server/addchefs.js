const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Chef = require("./models/Chef");

const chefs = [
{
    firstName: 'Mario',
    lastName: 'Rossi',
    email: 'mario.rossi@example.com',
    password: '$2y$10$FjoxiKO9TQr.Bc3H5gud7ufrMSxNYiagHohlL5r0zjiJvHEQl98Ta',
    biography: 'Experienced Italian chef specializing in pasta and pizza.',
    specialization: 'Italian',
    profilePicture: 'https://randomuser.me/api/portraits/men/61.jpg',
    availability: [
      { location: 'Germany', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-24') },
      { location: 'Berlin', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
      // ... more availability entries
    ],
  },
  {
    firstName: "Sophie",
    lastName: "Lafayette",
    email: "sophie.lafayette@example.com",
    password: "$2y$10$D7nSc6QkYMvHMedemE9VleBuCbV2q6iPzbRluQN/JPpIC8keKUvMa",
    biography: "French chef with a passion for pastry and desserts.",
    specialization: "French",
    profilePicture: "https://randomuser.me/api/portraits/women/26.jpg",
    availability: [
        { location: 'Milan', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-24') },
        { location: 'Lombardia', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
        // ... more availability entries
      ],
    },
  {
    firstName: "Kenji",
    lastName: "Tanaka",
    email: "kenji.tanaka@example.com",
    password: "$2y$10$rMdJmeiEon3ahlTCHEV5/.b9y7xXX4xv65zJi1R84qU.8X9.3ttwi",
    biography: "Japanese chef specializing in sushi and ramen.",
    specialization: "Japanese",
    profilePicture: "https://randomuser.me/api/portraits/men/78.jpg",
    availability: [
        { location: 'Germany', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-24') },
        { location: 'Berlin', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
        // ... more availability entries
      ],
    },
  {
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@example.com",
    password: "$2y$10$Ybq6/mmSD9d5LAxZX4zL.O.3WSZcNr4buZ2V7lo0UQwkA1eYkyXge",
    biography: "Mexican chef with a talent for creating flavorful dishes.",
    specialization: "Mexican",
    profilePicture: "https://randomuser.me/api/portraits/women/64.jpg",
    availability: [
        { location: 'Germany', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-24') },
        { location: 'Berlin', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
        // ... more availability entries
      ],
    },
  {
    firstName: "Aisha",
    lastName: "Khan",
    email: "aisha.khan@example.com",
    password: "hashed_password",
    biography: "Indian chef specializing in curries and tandoori dishes.",
    specialization: "Indian",
    profilePicture: "...",
    availability: [
        { location: 'Germany', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-24') },
        { location: 'Berlin', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
        // ... more availability entries
      ],
    },
  {
    firstName: "David",
    lastName: "Lee",
    email: "david.lee@example.com",
    password: "$2y$10$LGfsv8XiHwFQ2UBjItuzuOV9qJRDM9rZAb0r96AfONKrnNHeH9ati",
    biography: "Chinese chef with a passion for dim sum and stir-fries.",
    specialization: "Chinese",
    profilePicture: "...",
    availability: [
        { location: 'Germany', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-24') },
        { location: 'Berlin', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
        // ... more availability entries
      ],
    },
  {
    firstName: "Elena",
    lastName: "Petrova",
    email: "elena.petrova@example.com",
    password: "$2y$10$hgb4I9BaGmRtzYmHJ4wLgOEjaIdxXTcrky2VB.pXZ8hhjZFgvmNSu",
    biography: "Russian chef specializing in borscht and pelmeni.",
    specialization: "Russian",
    profilePicture: "https://randomuser.me/api/portraits/women/47.jpg",
    availability: [
        { location: 'Berlin', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
        // ... more availability entries
      ],
    },
  {
    firstName: "Omar",
    lastName: "Hassan",
    email: "omar.hassan@example.com",
    password: "$2y$10$qlKOM44R0C3RWf6TvWYRzOvJS5Uo.UUBMCBYrfR4XBXKnLqR3wQV.",
    biography: "Moroccan chef with a talent for tagines and couscous.",
    specialization: "Moroccan",
    profilePicture: "https://randomuser.me/api/portraits/men/0.jpg",
    availability: [
        { location: 'Germany', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-24') },
        { location: 'Dusseldorf', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
        // ... more availability entries
      ],
    },
  {
    firstName: "Sofia",
    lastName: "Silva",
    email: "sofia.silva@example.com",
    password: "$2y$10$UiwQzkUgyQzLshcAMwE7IuWXPi3ca2R2ZUNVVp4.O.33V8X5M0u.K",
    biography: "Brazilian chef specializing in churrasco and feijoada.",
    specialization: "Brazilian",
    profilePicture: "https://randomuser.me/api/portraits/women/27.jpg",
    availability: [
        { location: 'Copenhagen', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-24') },
        { location: 'Denmark', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
        // ... more availability entries
      ],
    },
  {
    firstName: "James",
    lastName: "Smith",
    email: "james.smith@example.com",
    password: "$2y$10$KqEF1kV7MPnu91JGPwR9e.uCuhjm/lCF5gf1S/619gs4hORZ1LjoW",
    biography: "American chef with a love for burgers and fries.",
    specialization: "American",
    profilePicture: "https://randomuser.me/api/portraits/men/22.jpg",
    availability: [
        { location: 'Naples', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-24') },
        { location: 'Berlin', startDate: new Date('2024-12-26'), endDate: new Date('2024-12-31') },
        // ... more availability entries
      ],
    },
]

  const addChef = async (chefData) => {
    try {
      const hashedPassword = await bcrypt.hash(chefData.password, 10);
      const chef = new Chef({ ...chefData, password: hashedPassword });
      await chef.save();
      console.log('Chef added:', chef);
    } catch (error) {
      console.error('Error adding chef:', error);
    }
  };

  const addChefs = async () => {
    await mongoose.connect('mongodb+srv://davidepedone1:mlTIK3SHD1FIe8lu@cluster0.carom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'); // Replace with your connection string
    for (const chef of chefs) {
      await addChef(chef);
    }
    mongoose.disconnect();
  };
  
  addChefs();