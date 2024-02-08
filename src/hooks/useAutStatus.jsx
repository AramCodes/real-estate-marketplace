import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAutStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted) {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setLoggedIn(true);
                }
                setLoading(false);
            });
        }

        return () => {
            isMounted.current = false;
        };
    }, [isMounted]);

    return { loggedIn, loading };
};

export default useAutStatus;
