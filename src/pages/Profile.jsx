import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import {
    updateDoc,
    doc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcons.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";

const Profile = () => {
    const auth = getAuth();
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const { name, email } = formData;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProperties = async () => {
            const listingsRef = collection(db, "listings");
            const q = query(
                listingsRef,
                where("userRef", "==", auth.currentUser.uid),
                orderBy("timestamp", "desc")
            );

            const querySnapshot = await getDocs(q);

            const listingsArr = [];

            querySnapshot.forEach((doc) => {
                return listingsArr.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            setListings(listingsArr);
            setLoading(false);
        };

        fetchUserProperties();
    }, [auth.currentUser.uid]);

    const logout = () => {
        auth.signOut();
        navigate("/");
    };

    const onSubmit = async (e) => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });

                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, {
                    name,
                });
            }
        } catch (error) {
            toast.error("Failed to Update Profile");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            await deleteDoc(doc(db, "listings", id));
            const updatedListings = listings.filter(
                (listing) => listing.id !== id
            );
            setListings(updatedListings);
            toast.success("Listing Deleted");
        }
    };

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">Your Profile</p>
                <button type="button" className="logOut" onClick={logout}>
                    Logout
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p
                        className="changePersonalDetails"
                        onClick={() => {
                            changeDetails && onSubmit();
                            setChangeDetails((prevState) => !prevState);
                        }}
                    >
                        {changeDetails ? "Done" : "Change"}
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input
                            type="text"
                            id="name"
                            className={
                                !changeDetails
                                    ? "profileName"
                                    : "profileNameActive"
                            }
                            disabled={!changeDetails}
                            value={name}
                            onChange={handleChange}
                            name="name"
                        />
                        <input
                            type="email"
                            id="email"
                            className={
                                !changeDetails
                                    ? "profileEmail"
                                    : "profileEmailActive"
                            }
                            disabled={!changeDetails}
                            value={email}
                            name="email"
                            onChange={handleChange}
                        />
                    </form>
                </div>

                <Link to="/create-listing" className="createListing">
                    <img src={homeIcon} alt="create a listing" />
                    <p id="listings-paragraph">Sell or rent your home</p>
                    <img src={arrowRight} alt="right arrow" />
                </Link>

                {!loading && listings?.length > 0 && (
                    <>
                        <p className="listingText">Your Listings</p>
                        <ul className="listingsList">
                            {listings.map((listing) => {
                                return (
                                    <ListingItem
                                        key={listing.id}
                                        listing={listing.data}
                                        id={listing.id}
                                        onDelete={() => {
                                            onDelete(listing.id);
                                        }}
                                        onEdit={() => {
                                            onEdit(listing.id);
                                        }}
                                    />
                                );
                            })}
                        </ul>
                    </>
                )}
            </main>
        </div>
    );
};

export default Profile;
