import { useState } from "react";
import DataEmployee from "./DataEmployee";

const useData = () => {
    const [data, setData] = useState(DataEmployee);

    return({
        data, setData
    })
}

export default useData