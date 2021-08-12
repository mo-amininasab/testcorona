import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";

import { fetchCountries } from "./components/api/index";
import { sortData } from "./util";

import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await fetchCountries();
      const sortedData = sortData(data);
      console.log(data);
      setCountries(
        data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
          casesPerM: country.casesPerOneMillion,
          deathsPerM: country.deathsPerOneMillion,
          recoveredPerM: country.recoveredPerOneMillion,
        }))
      );
      setTableData(sortedData);
    };

    fetchAPI();
  }, []);

  const changeCountryHandler = async (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl>
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={changeCountryHandler}
            >
              <MenuItem key="ww" vlaue="worldwide">
                Worldwide
              </MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            title={"Coronavirus Cases"}
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title={"Recovered"}
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title={"Deaths"}
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        
          <Map setTooltipContent={setTooltipContent} countries={countries}/>
          <ReactTooltip>{tooltipContent}</ReactTooltip>
        
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
