import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import ExploreSlider from "../components/ExploreSlider";

const Explore = () => {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

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

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="explore">
            <header>
                <p className="pageHeader">Explore</p>
            </header>

            <main>
                <div className="slider-container">
                    <ExploreSlider />
                </div>

                <p className="exploreCategoryHeading">Categories</p>
                <div className="exploreCategories">
                    <Link to="/category/rent">
                        <img
                            src={rentCategoryImage}
                            alt="rent"
                            className="exploreCategoryImg"
                        />
                        <p className="exploreCategoryName">Places for rent</p>
                    </Link>
                    <Link to="/category/sale">
                        <img
                            src={sellCategoryImage}
                            alt="sell"
                            className="exploreCategoryImg"
                        />
                        <p className="exploreCategoryName">Places for sale</p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Explore;
