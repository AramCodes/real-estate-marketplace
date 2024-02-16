import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const EditListing = () => {
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        location: "",
        latitude: 0,
        longitude: 0,
        images: {},
    });

    const {
        name,
        type,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        offer,
        regularPrice,
        location,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData;

    const apiKey = "nunya bizness bih";

    const auth = getAuth();
    const params = useParams();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    //error handling in case listing is not user's
    useEffect(() => {
        if (listing && listing.userRef == !auth.currentUser.uid) {
            toast.error("You are not authorized to edit this listing");
            navigate("/");
        }
    }, []);

    // fetches listing
    useEffect(() => {
        setIsLoading(true);
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({ ...docSnap.data() });
                setIsLoading(false);
            } else {
                navigate("/");
                toast.error("listing does not exist");
            }
        };

        fetchListing();
    }, [params.listingId, navigate]);

    // sets id to logged in user
    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({
                        ...formData,
                        userRef: user.uid,
                    });
                } else {
                    navigate("/signin");
                }
            });
        }

        return () => {
            isMounted.current = false;
        };
    }, [isMounted]);

    const onMutate = async (e) => {
        let boolean = null;

        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false;
        }

        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }

        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        if (discountedPrice >= regularPrice) {
            setIsLoading(false);
            toast.error("Discounted price must be lower than regular price");
            return;
        }

        if (images.length > 6) {
            setIsLoading(false);
            toast.error("You can only upload up to 6 images");
            return;
        }

        let geolocation = {};
        let location;

        if (geoLocationEnabled) {
            const response =
                await fetch(`https://maps.googleapis.com/maps/api/geocode/json
                ?address=${location}&key=${apiKey}}`);
            const data = await response.json();

            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location =
                data.status === "ZERO_RESULTS"
                    ? undefined
                    : data.results[0]?.formatted_address;
            if (location === undefined || location.includes("undefined")) {
                setIsLoading(false);
                toast.error("Enter a valid address");
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
            location = formData.location;
        }

        const imageUpload = async (imgFile) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const fileName = `${auth.currentUser.uid}-${
                    imgFile.name
                }-${uuidv4()}`;

                const storageRef = ref(storage, `images/${fileName}`);

                const uploadTask = uploadBytesResumable(storageRef, imgFile);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                                100
                        );
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                            default:
                                break;
                        }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL) => {
                                resolve(downloadURL);
                            }
                        );
                    }
                );
            });
        };

        const imageUrls = await Promise.all(
            [...images].map((image) => imageUpload(image))
        ).catch(() => {
            setLoading(false);
            toast.error("Images not uploaded");
            return;
        });

        const formDataCopy = {
            ...formData,
            imageUrls,
            geolocation,
            timestamp: serverTimestamp(),
        };

        formDataCopy.location = location;
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;

        const docRef = doc(db, "listings", params.listingId);
        await updateDoc(docRef, formDataCopy);
        setIsLoading(false);
        toast.success("Listing saved");
        // console.log(docRef.id);
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="profile">
            <header>
                <p className="pageHeader">{`Edit ${listing?.name} Listing`}</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <label className="formLabel" htmlFor="type">
                        Sell / Rent
                    </label>
                    <div className="formButtons">
                        <button
                            type="button"
                            className={
                                type === "sale"
                                    ? "formButtonActive"
                                    : "formButton"
                            }
                            id="type"
                            value="sale"
                            onClick={onMutate}
                        >
                            Sell
                        </button>

                        <button
                            type="button"
                            className={
                                type === "rent"
                                    ? "formButtonActive"
                                    : "formButton"
                            }
                            id="type"
                            value="rent"
                            onClick={onMutate}
                        >
                            Rent
                        </button>
                    </div>

                    <label className="formLabel" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="formInputName"
                        type="text"
                        id="name"
                        value={name}
                        onChange={onMutate}
                        maxLength="40"
                        minLength="10"
                        required
                        autoComplete="true"
                    />

                    <div className="formRooms flex">
                        <div>
                            <label className="formLabel" htmlFor="bedrooms">
                                Bedrooms
                            </label>
                            <input
                                className="formInputSmall"
                                type="number"
                                id="bedrooms"
                                value={bedrooms}
                                onChange={onMutate}
                                min="1"
                                max="50"
                                required
                            />
                        </div>
                        <div>
                            <label className="formLabel" htmlFor="bathrooms">
                                Bathrooms
                            </label>
                            <input
                                className="formInputSmall"
                                type="number"
                                id="bathrooms"
                                value={bathrooms}
                                onChange={onMutate}
                                min="1"
                                max="50"
                                required
                            />
                        </div>
                    </div>

                    <label className="formLabel" htmlFor="parking">
                        Parking spot
                    </label>
                    <div className="formButtons">
                        <button
                            className={
                                parking ? "formButtonActive" : "formButton"
                            }
                            type="button"
                            id="parking"
                            value={true}
                            onClick={onMutate}
                            min="1"
                            max="50"
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !parking && parking !== null
                                    ? "formButtonActive"
                                    : "formButton"
                            }
                            type="button"
                            id="parking"
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className="formLabel" htmlFor="furnished">
                        Furnished
                    </label>
                    <div className="formButtons">
                        <button
                            className={
                                furnished ? "formButtonActive" : "formButton"
                            }
                            type="button"
                            id="furnished"
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !furnished && furnished !== null
                                    ? "formButtonActive"
                                    : "formButton"
                            }
                            type="button"
                            id="furnished"
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className="formLabel" htmlFor="location">
                        Address
                    </label>
                    <textarea
                        className="formInputAddress"
                        type="text"
                        id="location"
                        value={location}
                        onChange={onMutate}
                        required
                    />

                    {!geoLocationEnabled && (
                        <div className="formLatLng flex">
                            <div>
                                <label className="formLabel" htmlFor="latitude">
                                    Latitude
                                </label>
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="latitude"
                                    value={latitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="formLabel"
                                    htmlFor="longitude"
                                >
                                    Longitude
                                </label>
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="longitude"
                                    value={longitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <label className="formLabel" htmlFor="offer">
                        Offer
                    </label>
                    <div className="formButtons">
                        <button
                            className={
                                offer ? "formButtonActive" : "formButton"
                            }
                            type="button"
                            id="offer"
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !offer && offer !== null
                                    ? "formButtonActive"
                                    : "formButton"
                            }
                            type="button"
                            id="offer"
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className="formLabel" htmlFor="regularPrice">
                        Regular Price
                    </label>
                    <div className="formPriceDiv">
                        <input
                            className="formInputSmall"
                            type="number"
                            id="regularPrice"
                            value={regularPrice}
                            onChange={onMutate}
                            min="50"
                            max="750000000"
                            required
                        />
                        {type === "rent" && (
                            <p className="formPriceText">$ / Month</p>
                        )}
                    </div>

                    {offer && (
                        <>
                            <label
                                className="formLabel"
                                htmlFor="discountedPrice"
                            >
                                Discounted Price
                            </label>
                            <input
                                className="formInputSmall"
                                type="number"
                                id="discountedPrice"
                                value={discountedPrice}
                                onChange={onMutate}
                                min="50"
                                max="750000000"
                                required={offer}
                            />
                        </>
                    )}

                    <label className="formLabel" htmlFor="images">
                        Images
                    </label>
                    <p className="imagesInfo">
                        The first image will be the cover ( hold Ctrl/Cmd to
                        select multiple files, max 6 ).
                    </p>
                    <input
                        className="formInputFile"
                        type="file"
                        id="images"
                        onChange={onMutate}
                        min="1"
                        max="6"
                        accept=".jpg,.png,.jpeg,.avif"
                        multiple
                        required
                    />

                    <button
                        type="submit"
                        className="primaryButton createListingButton"
                    >
                        Edit Listing
                    </button>
                </form>
            </main>
        </div>
    );
};

export default EditListing;
