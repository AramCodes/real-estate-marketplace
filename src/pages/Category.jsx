import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Category = () => {
    const [listings, setListing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);

    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, "listings");

                const q = query(
                    listingsRef,
                    where("type", "==", params.categoryName),
                    orderBy("timestamp", "desc"),
                    limit(5)
                );

                const querySnapshot = await getDocs(q);

                const lastShownListing =
                    querySnapshot.docs[querySnapshot.docs.length - 1];

                setLastFetchedListing(lastShownListing);

                const innerListings = [];

                querySnapshot.forEach((doc) => {
                    return innerListings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });

                setListing(innerListings);
                setLoading(false);
            } catch (error) {
                toast.error("Couldn't get Listings");
            }
        };

        fetchListings();
    }, [params.categoryName]);

    const fetchMoreListings = async () => {
        try {
            const listingsRef = collection(db, "listings");

            const q = query(
                listingsRef,
                where("type", "==", params.categoryName),
                orderBy("timestamp", "desc"),
                startAfter(lastFetchedListing),
                limit(5)
            );

            const querySnapshot = await getDocs(q);

            const lastShownListing =
                querySnapshot.docs[querySnapshot.docs.length - 1];

            setLastFetchedListing(lastShownListing);

            const innerListings = [];

            querySnapshot.forEach((doc) => {
                return innerListings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            setListing((prevState) => [...prevState, ...innerListings]);
            setLoading(false);
        } catch (error) {
            toast.error("Couldn't get additional listings");
        }
    };

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    {params.categoryName === "rent"
                        ? "Places for rent"
                        : "Places for sale"}
                </p>
            </header>

            {loading ? (
                <Spinner />
            ) : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map((listing) => (
                                <ListingItem
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                />
                            ))}
                        </ul>
                    </main>

                    {lastFetchedListing && (
                        <button
                            className="loadMore"
                            onClick={fetchMoreListings}
                        >
                            Load More
                        </button>
                    )}
                </>
            ) : (
                <p>No listings for {params.categoryName}</p>
            )}
        </div>
    );
};

export default Category;
