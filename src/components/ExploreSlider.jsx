import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import Carousel from "react-bootstrap/Carousel";

const ExploreSlider = () => {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);
    const [index, setIndex] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, "listings");
            const q = query(
                listingsRef,
                orderBy("timestamp", "desc"),
                limit(8)
            );
            const querySnapshot = await getDocs(q);

            let listingsArr = [];

            querySnapshot.forEach((doc) => {
                return listingsArr.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            setListings(listingsArr);
            setLoading(false);
        };

        fetchListings();
    }, []);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    if (loading) {
        return <Spinner />;
    }

    if (listings.length === 0) {
        return <></>;
    }

    return (
        listings && (
            <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                nextIcon={
                    <span
                        aria-hidden="true"
                        className="carousel-control-next-icon changed"
                    />
                }
            >
                {listings?.map((listing, idx) => (
                    <Carousel.Item
                        key={listing.id}
                        interval={5000}
                        onClick={() =>
                            navigate(
                                `/category/${listing.data.type}/${listing.id}`
                            )
                        }
                    >
                        <img
                            style={{ height: "50vh" }}
                            className="d-block w-100"
                            src={listing.data.imageUrls[0]}
                            alt={`${listing.data.name}'s first image`}
                        />
                        <Carousel.Caption>
                            <h3 className="swiperSlideText">
                                {listing.data.name}
                            </h3>
                            <p className="swiperSlidePrice">
                                ${" "}
                                {listing.data.regularPrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        )
    );
};

export default ExploreSlider;
