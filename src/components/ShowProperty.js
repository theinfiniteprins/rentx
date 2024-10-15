import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the id from the URL
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import axios from "axios";

const ShowProperty = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [facilitiesInfo, setFacilitiesInfo] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `https://rent-x-backend-nine.vercel.app/properties/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setProperty(response.data); // Set fetched data as property
        setLoading(false);
      } catch (error) {
        console.error("Error fetching property data:", error);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]); // The effect runs whenever the id changes

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      if (property && property.facilities.length > 0) {
        const promises = property.facilities.map((facility) =>
          axios.get(
            `https://rent-x-backend-nine.vercel.app/facilities/${facility.facility}`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        );

        try {
          const facilitiesData = await Promise.all(promises);
          const facilitiesWithDetails = facilitiesData.map(
            (response, index) => ({
              ...response.data, // Facility details (name, iconImage)
              value: property.facilities[index].value, // Corresponding value from property.facilities
            })
          );
          setFacilitiesInfo(facilitiesWithDetails);
        } catch (error) {
          console.error("Error fetching facility details:", error);
        }
      }
    };

    if (property) {
      fetchFacilityDetails();
    }
  }, [property]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>No property data available.</div>;
  }

  // Convert images to the format required by react-image-gallery
  const galleryImages = property.images.map((image) => ({
    original: image,
    thumbnail: image,
  }));

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Main container to split the layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Side: Image Slider */}
        <div className="w-full lg:w-3/5 h-[400px]">
          <ImageGallery
            items={galleryImages}
            showThumbnails={false}
            showPlayButton={false}
            showFullscreenButton={true}
            showBullets={true}
          />
        </div>

        {/* Right Side: Property Details */}
        <div className="w-full lg:w-2/5 lg:pl-8 mt-6 lg:mt-0">
          {/* Property Title */}
          <div className="mb-4">
            <h2 className="text-3xl font-bold">{property.title}</h2>
          </div>

          {/* Property Category */}
          <div className="property-category mb-4">
            <h3 className="text-xl font-semibold mb-2">Category</h3>
            <p className="text-gray-700">{property.category.name}</p>
          </div>

          {/* Property Description */}
          <div className="property-description mb-6">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{property.description}</p>
          </div>

          {/* Property Price */}
          <div className="property-price mb-6">
            <h3 className="text-xl font-semibold mb-2">Monthly Rent</h3>
            <p className="text-2xl text-teal-600 font-bold">
              ₹{property.monthlyRent}
            </p>
          </div>

          {/* Security Deposit */}
          <div className="property-security-deposit mb-6">
            <h3 className="text-xl font-semibold mb-2">Security Deposit</h3>
            <p className="text-2xl text-teal-600 font-bold">
              ₹{property.securityDeposit}
            </p>
          </div>

          {/* Property Facilities */}
          <div className="property-facilities mb-6">
            <h3 className="text-xl font-semibold mb-2">Facilities:</h3>
            <div className="flex gap-4 flex-wrap">
              {facilitiesInfo
                .filter((facility) => facility.value !== false) // Filter out facilities with a false value
                .map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-teal-100 px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
                  >
                    <img
                      src={facility.iconImage}
                      alt={facility.name}
                      className="w-6 h-6 mr-2"
                    />
                    <span className="font-semibold">{facility.name}</span>

                    <span className="ml-2">{facility.value}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Property Address */}
          <div className="property-address">
            <h3 className="text-xl font-semibold mb-2">Address:</h3>
            <p className="text-gray-700">
              {property.address}, {property.city}, {property.state},{" "}
              {property.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProperty;
