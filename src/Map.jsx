import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

function Map({ setTooltipContent, countries }) {
  const colorScale = scaleQuantile()
    .domain(countries.map((country) => country.deathsPerM))
    .range([
      "#ffedea",
      "#ffcec5",
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618",
    ]);
  return (
    <div>
      <ComposableMap data-tip=""       projectionConfig={{
        // rotate: [33, 65, 0],
        // scale: 700,
        // center: [-97, 38]
      }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = countries.find(
                  (country) => country.value === geo.properties.ISO_A2
                );
                // console.log(d);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const { NAME } = geo.properties;
                      const { deathsPerM } = d || 0;
                      setTooltipContent(deathsPerM !== 0 ? `${NAME} - ${deathsPerM} deaths per M` : `no data`);
                    }}
                    onMouseLeave={() => setTooltipContent("")}
                    fill={d ? colorScale(d["deathsPerM"]) : "#A5F4F6"}
                    stroke="#EAEAEC"
                    // style={{
                    //   default: {
                    //     fill: "#D6D6DA",
                    //     outline: "none",
                    //   },
                    //   hover: {
                    //     fill: "#F53",
                    //     outline: "none",
                    //   },
                    //   pressed: {
                    //     fill: "#E42",
                    //     outline: "none",
                    //   },
                    // }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default Map;
