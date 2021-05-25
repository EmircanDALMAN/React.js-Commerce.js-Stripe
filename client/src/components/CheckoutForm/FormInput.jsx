import React from "react";
import {Grid, Input} from "@material-ui/core";
import {Controller, useFormContext} from "react-hook-form";

const FormInput = ({name, label}) => {
   const {control} = useFormContext();

   return (
      <Grid item xs={12} sm={6}>
         <Controller
            render={({}) => (
               <Input placeholder={label} fullWidth={true}/>
            )}
            control={control}
            name={name}
            defaultValue={""}
            rules={{required: true}}
         />
      </Grid>
   );
};

export default FormInput;
