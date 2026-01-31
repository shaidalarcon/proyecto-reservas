require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { connectDB } = require("../../config/db");

const User = require("../../api/models/user");
const Court = require("../../api/models/court");
const Reservation = require("../../api/models/reservation");

const readCSV = (fileName) => {
  const results = [];
  const filePath = path.join(__dirname, "../../data", fileName);

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

const seed = async () => {
  try {
    await connectDB();

    console.log("Iniciando semilla...");

    await User.collection
      .drop()
      .catch(() => console.log("No existían usuarios, nada que borrar"));
    await Court.collection
      .drop()
      .catch(() => console.log("No existían pistas, nada que borrar"));
    await Reservation.collection
      .drop()
      .catch(() => console.log("No existían reservas, nada que borrar"));

    console.log("Base de datos limpia");

    const usersRaw = await readCSV("users.csv");
    const courtsRaw = await readCSV("courts.csv");

    const userDocuments = [];

    for (const userData of usersRaw) {
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      userDocuments.push(savedUser);
    }

    console.log(`${userDocuments.length} usuarios insertados`);

    const courtsWithImages = courtsRaw.map((court) => ({
      ...court,
      price: Number(court.price),
      image: court.image,
    }));

    const courtDocuments = await Court.insertMany(courtsWithImages);

    console.log(`${courtDocuments.length} pistas insertadas`);

    const reservations = [];

    const takenSlots = new Set();

    const timeSlots = [
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
    ];

    while (reservations.length < 80) {
      const randomUser = userDocuments[Math.floor(Math.random() * userDocuments.length)];
      const randomCourt = courtDocuments[Math.floor(Math.random() * courtDocuments.length)];
      
      const randomDate = new Date();
      randomDate.setHours(0,0,0,0); 
      randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 7));

      const selectedSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];

      const uniqueKey = `${randomCourt._id}_${randomDate.toISOString()}_${selectedSlot}`;

      if (takenSlots.has(uniqueKey)) {
        continue;
      }

      takenSlots.add(uniqueKey);

      reservations.push({
        user: randomUser._id,
        court: randomCourt._id,
        date: randomDate,
        timeSlot: selectedSlot,
        totalPrice: randomCourt.price,
      });
    }

    await Reservation.insertMany(reservations);
    console.log(`${reservations.length} reservas generadas automáticamente`);

    const totalDatos =
      userDocuments.length + courtDocuments.length + reservations.length;

    console.log(`Total datos generados: ${totalDatos}`);
  } catch (error) {
    console.error("Error en la semilla:", error);
  } finally {
    await mongoose.disconnect();

    console.log("Conexión cerrada");
  }
};

seed();
