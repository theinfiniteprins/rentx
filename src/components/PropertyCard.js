import React, { useState, useEffect } from "react";

const PropertyCard = ({ property, onClick }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(property.likeCount);

  useEffect(() => {
    // Check if the property is liked when the component mounts
    const checkIfLiked = async () => {
      try {
        const response = await fetch(
          `https://rent-x-backend-nine.vercel.app/auth/currentuser`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const currentUser = await response.json();
        if (
          currentUser.favouriteProperties &&
          currentUser.favouriteProperties.some((fav) => fav === property._id)
        ) {
          setLiked(true);
        }
      } catch (error) {
        console.error("Error checking if property is liked:", error);
      }
    };

    checkIfLiked();
  }, [property._id]);

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        // Dislike the property
        await fetch(
          `https://rent-x-backend-nine.vercel.app/properties/${property._id}/dislike`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        setLikeCount(likeCount - 1);
      } else {
        // Like the property
        await fetch(
          `https://rent-x-backend-nine.vercel.app/properties/${property._id}/like`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        setLikeCount(likeCount + 1);
      }

      setLiked(!liked); // Toggle the liked state
    } catch (error) {
      console.error("Error liking/disliking the property:", error);
    }
  };

  return (
    <div
      className="w-96 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden p-4 m-4 hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Property Image */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover rounded-t-lg"
          style={{ objectFit: "cover", height: "200px", width: "100%" }}
        />
        <div className="absolute top-0 left-0 bg-gradient-to-r from-teal-500 via-green-500 to-teal-500 text-white text-lg px-5 py-2 rounded-br-lg font-semibold shadow-md">
          ₹{property.monthlyRent}/month
        </div>

        {/* Heart icon in the top-right corner */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering onClick of the card
            handleLikeToggle();
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-transform transform ${
            liked ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"
          } shadow-md hover:scale-110`}
        >
          <i
            className={`fas fa-heart text-lg ${
              liked ? "text-white" : "text-gray-500"
            }`}
          />
        </button>
      </div>

      {/* Property Details */}
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <h3 className="text-xl font-bold text-teal-700 mb-1">{property.title}</h3>
        <p className="text-gray-500 mb-3 flex items-center">
          <i className="fas fa-map-marker-alt text-teal-500 mr-2"></i>
          {property.city}, {property.state}
        </p>
        <hr className="my-3" />

        {/* Facilities and Like Count */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 space-y-1">
            {/* Use flex to display facilities side by side */}
            <div className="flex space-x-4">
              {property.facilities.slice(0, 2).map((facility, index) => (
                <p className="flex items-center text-lg font-semibold mr-5" key={index}>
                  <i
                    className={`fas ${
                      index === 0 ? "fa-bed" : "fa-bath"
                    } text-teal-500 mr-3 text-2xl`}
                  />
                  {facility.value}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-heart text-red-500"></i>
            <span className="text-gray-700 font-medium">{likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
