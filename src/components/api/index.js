import axios from "axios";

const url = "https://disease.sh/v3/covid-19";

export const fetchCountries = async () => {
  try {
    const {data} = await axios.get(`${url}/countries`);
    const countries = data.map(country => ({name: country.country, value: country.countryInfo.iso2}))
    return data;
  } catch (error) {
    console.log(error);
  }
};
