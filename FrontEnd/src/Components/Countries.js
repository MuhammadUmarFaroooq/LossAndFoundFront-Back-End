import { Country, State ,City} from 'country-state-city';
import { useEffect, useState } from 'react';

const allCountries = Country.getAllCountries();
const allStates = State.getAllStates();
console.log(City.getAllCities());
const CountryData = allCountries.map((country, index) => {
  return {
    label: country.name,
    value: country.isoCode,
    key: `country_${index}`,
  };
});


// Function to get states based on the selected country's isoCode
const getStatesByCountryIsoCode = (selectedCountryIsoCode) => {
  const filteredStates = allStates.filter((state) => state.countryCode === selectedCountryIsoCode);

  return filteredStates.map((state, index) => ({
    label: state.name,
    value: state.isoCode,
    key: `state_${index}`,
  }));
};

export { CountryData, getStatesByCountryIsoCode };
