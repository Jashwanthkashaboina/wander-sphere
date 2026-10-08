require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const hotels = [

    // =========================
    // BUDGET
    // =========================

    {
        title: "Hyderabad City Budget Stay",
        description: "Affordable stay near the historic heart of Hyderabad.",
        price: 1800,
        location: "Abids, Hyderabad",
        country: "India",
        coordinates: [78.4760, 17.3910],
        image:
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80"
    },

    {
        title: "Charminar Comfort Hotel",
        description: "Budget-friendly hotel close to Hyderabad's historic attractions.",
        price: 2200,
        location: "Charminar, Hyderabad",
        country: "India",
        coordinates: [78.4747, 17.3616],
        image:
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
    },

    {
        title: "Banjara Hills Comfort Inn",
        description: "Comfortable stay in a convenient part of Hyderabad.",
        price: 2800,
        location: "Banjara Hills, Hyderabad",
        country: "India",
        coordinates: [78.4483, 17.4156],
        image:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    },


    // =========================
    // MID RANGE
    // =========================

    {
        title: "HITEC City Business Hotel",
        description: "Modern hotel suitable for business and leisure travellers.",
        price: 3500,
        location: "HITEC City, Hyderabad",
        country: "India",
        coordinates: [78.3820, 17.4435],
        image:
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    },

    {
        title: "Jubilee Hills Grand Stay",
        description: "Modern accommodation surrounded by restaurants and entertainment.",
        price: 4200,
        location: "Jubilee Hills, Hyderabad",
        country: "India",
        coordinates: [78.4071, 17.4326],
        image:
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    },

    {
        title: "Gachibowli Premium Hotel",
        description: "Premium accommodation near Hyderabad's financial district.",
        price: 5000,
        location: "Gachibowli, Hyderabad",
        country: "India",
        coordinates: [78.3489, 17.4401],
        image:
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    },

    {
        title: "Hussain Sagar Lake Hotel",
        description: "Comfortable city stay near Hussain Sagar and central Hyderabad.",
        price: 5500,
        location: "Tank Bund, Hyderabad",
        country: "India",
        coordinates: [78.4744, 17.4239],
        image:
            "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80"
    },


    // =========================
    // LUXURY
    // =========================

    {
        title: "ITC Kohenur Hyderabad",
        description: "Luxury hotel overlooking Durgam Cheruvu in HITEC City.",
        price: 10000,
        location: "Madhapur, Hyderabad",
        country: "India",
        coordinates: [78.3808, 17.4344],
        image:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    },

    {
        title: "Novotel Hyderabad Convention Centre",
        description: "Luxury business and leisure hotel near HITEC City and HICC.",
        price: 9000,
        location: "HITEC City, Hyderabad",
        country: "India",
        coordinates: [78.372603, 17.472219],
        image:
            "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80"
    },

    {
        title: "Taj Falaknuma Palace",
        description: "Heritage luxury stay in one of Hyderabad's iconic palace properties.",
        price: 18000,
        location: "Falaknuma, Hyderabad",
        country: "India",
        coordinates: [78.4670, 17.3310],
        image:
            "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=80"
    }

];


async function seedHotels() {

    try {

        await mongoose.connect(process.env.ATLASDB_URL);

        console.log("MongoDB connected");


        // Find existing user to become owner

        const owner = await User.findOne();

        if (!owner) {

            console.log("No user found in database.");

            await mongoose.connection.close();

            return;
        }


        console.log("Using owner:", owner.username);


        // Create listings

        const listings = hotels.map(hotel => {

            return new Listing({

                title: hotel.title,

                description: hotel.description,

                price: hotel.price,

                location: hotel.location,

                country: hotel.country,

                geometry: {
                    type: "Point",
                    coordinates: hotel.coordinates
                },

                image: {
                    url: hotel.image,
                    filename: hotel.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                },

                owner: owner._id

            });

        });


        await Listing.insertMany(listings);


        console.log(
            `Successfully seeded ${listings.length} hotels.`
        );


        listings.forEach(hotel => {

            console.log(
                `${hotel.title} - ₹${hotel.price}/night`
            );

        });


        await mongoose.connection.close();

        console.log("MongoDB connection closed.");

    } catch (err) {

        console.error(
            "Hotel seeding error:",
            err
        );

        await mongoose.connection.close();

    }

}


seedHotels();