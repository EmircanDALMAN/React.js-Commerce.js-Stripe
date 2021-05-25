import React, {useEffect, useState} from "react";
import {Button, Grid, InputLabel, MenuItem, Select,} from "@material-ui/core";
import {FormProvider, useForm} from "react-hook-form";
import FormInput from "./FormInput";
import {commerce} from "../../lib/commerce";
import {Link} from "react-router-dom";

const AddressForm = ({checkoutToken, next}) => {
   const [shippingCountries, setShippingCountries] = useState([]);
   const [shippingCountry, setShippingCountry] = useState("");
   const [shippingSubDivisions, setShippingSubDivisions] = useState([]);
   const [shippingSubDivision, setShippingSubDivision] = useState("");
   const [shippingOptions, setShippingOptions] = useState([]);
   const [shippingOption, setShippingOption] = useState("");
   const methods = useForm();
   const { handleSubmit } = useForm();

   const fetchShippingCountries = async (checkoutTokenId) => {
      const {countries} = await commerce.services.localeListShippingCountries(
         checkoutTokenId
      );
      setShippingCountries(countries);
      setShippingCountry(Object.keys(countries)[1]);
   };

   const fetchSubdivisions = async (countryCode) => {
      const {subdivisions} = await commerce.services.localeListSubdivisions(
         countryCode
      );
      setShippingSubDivisions(subdivisions);
      setShippingSubDivision(Object.keys(subdivisions)[0]);
   };

   const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
      const options = await commerce.checkout.getShippingOptions(
         checkoutTokenId,
         {country, region: stateProvince}
      );

      setShippingOptions(options);
      setShippingOption(options[0].id);
   };

   //Key Value şeklinde map etmek için kullanılır
   const countries = Object.entries(shippingCountries).map(([code, name]) => ({
      id: code,
      label: name,
   }));

   const subdivisions = Object.entries(shippingSubDivisions).map(([code, name]) => ({
      id: code,
      label: name,
   }));

   useEffect(() => {
      fetchShippingCountries(checkoutToken.id);
   }, []);

   useEffect(() => {
      if (shippingCountry) fetchSubdivisions(shippingCountry);
   }, [shippingCountry]);

   useEffect(() => {
      if (shippingSubDivision)
         fetchShippingOptions(
            checkoutToken.id,
            shippingCountry,
            shippingSubDivision
         );
   }, [shippingSubDivision]);

   return (
      <>
         <FormProvider {...methods}>
            <form onSubmit={handleSubmit((data) => next({
               ...data,
               shippingCountry,
               shippingSubDivision,
               shippingOption
            }))}>
               <Grid container spacing={3}>
                  <FormInput name={"firstName"} label={"Adınız"}/>
                  <FormInput name={"lastName"} label={"Soyadınız"}/>
                  <FormInput name={"address1"} label={"Adresiniz"}/>
                  <FormInput name={"email"} label={"Email"}/>
                  <FormInput name={"city"} label={"Şehir"}/>
                  <FormInput name={"zip"} label={"ZIP / Posta Kodu"}/>
                  <Grid item xs={12} sm={6}>
                     <InputLabel>Ülke</InputLabel>
                     <Select
                        value={shippingCountry}
                        fullWidth
                        onChange={(e) => setShippingCountry(e.target.value)}
                     >
                        {countries.map((country) => (
                           <MenuItem key={country.id} value={country.id}>
                              {country.label}
                           </MenuItem>
                        ))}
                     </Select>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <InputLabel>Subdivision</InputLabel>
                     <Select
                        value={shippingSubDivision}
                        fullWidth
                        onChange={(e) => setShippingSubDivision(e.target.value)}
                     >
                        {subdivisions.map((subdivision) => (
                           <MenuItem key={subdivision.id} value={subdivision.id}>
                              {subdivision.label}
                           </MenuItem>
                        ))}
                     </Select>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <InputLabel>Options</InputLabel>
                     <Select
                        value={shippingOption}
                        fullWidth
                        onChange={(e) => setShippingOption(e.target.value)}
                     >
                        {shippingOptions
                           .map((sO) => ({
                              id: sO.id,
                              label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
                           }))
                           .map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                 {item.label}
                              </MenuItem>
                           ))}
                     </Select>
                  </Grid>
               </Grid>
               <br/>
               <div
                  style={{display: "flex", justifyContent: "space-between"}}
               >
                  <Button component={Link} to={"/cart"} variant={"outlined"}>Sepete Geri Dön</Button>
                  <Button type={"submit"} color={"primary"} variant={"contained"}>Ödemeye Devam Et</Button>
               </div>
            </form>
         </FormProvider>
      </>
   );
};

export default AddressForm;
