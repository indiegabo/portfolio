import {useContext} from "react";
import LanguageContext from "../contexts/LanguageContext";

export const usePortfolio = () => useContext(LanguageContext);
