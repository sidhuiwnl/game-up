import {createContext,useContext,useState,useEffect} from "react";



type Props = {
    children: React.ReactNode;
}

type UserData = {
    token: string;
    user : {
        id : string;
        email : string;
        name : string;
        role : "PARENT" | "CHILD";
        created : Date;
        updated : Date;
        parentId : null | string;
    }
}
type UserContextValue = {
    userData: UserData | null;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: Props) {
    const [userData,setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const storedUser =  localStorage.getItem("session")

        if(storedUser){
            try {
                const parsedDat : UserData = JSON.parse(storedUser);
                setUserData(parsedDat)
            }catch (error) {
                console.error("Failed to parse user data from localStorage", error);
            }
        }

    }, []);
    return (
        <UserContext.Provider value={{ userData,setUserData  }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

