import React, {useEffect, useState} from "react";
import {
   Button,
   CircularProgress,
   CssBaseline,
   Divider,
   Paper,
   Step,
   StepLabel,
   Stepper,
   Typography
} from "@material-ui/core";
import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import {commerce} from "../../../lib/commerce";
import {Link, useHistory} from "react-router-dom";

const steps = ["Adres", "Ödeme Detayları"];

const Checkout = ({cart, error, onCaptureCheckout, order}) => {
   const [activeStep, setActiveStep] = useState(0);
   const [checkoutToken, setCheckoutToken] = useState(null);
   const [shipppingData, setShipppingData] = useState({});
   const [isFinished, setIsFinished] = useState(false);
   const classes = useStyles();
   const history = useHistory();

   useEffect(() => {
      const generateToken = async () => {
         try {
            const token = await commerce.checkout.generateToken(cart.id, {
               type: "cart",
            });
            setCheckoutToken(token);
         } catch (e) {
            history.pushState("/");
         }
      };
      generateToken();
   }, [cart]);

   const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
   const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

   const next = (data) => {
      setShipppingData(data);
      nextStep()
   }

   const Form = () =>
      activeStep === 0
         ? <AddressForm checkoutToken={checkoutToken} next={next}/>
         : <PaymentForm shippingData={shipppingData} checkoutToken={checkoutToken} backStep={backStep}
                        onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeout={timeout}/>
   ;

   const timeout = ()=>{
      setTimeout(()=>{
         setIsFinished(true);
      },3000)
   }

   let Confirmation = () => order.customer ? (
      <>
         <div>
            <Typography variant={"h5"}>Sayın
               {order.customer.firstname} {order.customer.lastname}
               Alışverişiniz İçin Teşekkür Ederiz.</Typography>
            <Divider className={classes.divider}/>
            <Typography variant={"subtitle2"}>Sipariş Numarası: {order.customer_reference}</Typography>
         </div>
         <br/>
         <Button component={Link} to={"/"} variant={"outlined"} type={"button"}>Anasayfaya Geri Dön</Button>
      </>
   ) : isFinished ? (
      <>
         <div>
            <Typography variant={"h5"}>Alışverişiniz İçin Teşekkür Ederiz.</Typography>
            <Divider className={classes.divider}/>
         </div>
         <br/>
         <Button component={Link} to={"/"} variant={"outlined"} type={"button"}>Anasayfaya Geri Dön</Button>
      </>
   ) : (
      <div className={classes.spinner}>
         <CircularProgress />
      </div>
   );
   if (error) {
      <>
         <Typography variant={"h5"}>Hata: {error}</Typography>
         <br/>
         <Button component={Link} to={"/"} variant={"outlined"} type={"button"}>Anasayfaya Geri Dön</Button>
      </>
   }

   return (
      <>
         <CssBaseline />
         <div className={classes.toolbar}/>
         <main className={classes.layout}>
            <Paper className={classes.paper}>
               <Typography variant={"h4"} align={"center"}>
                  Ödeme
               </Typography>
               <Stepper activeStep={activeStep} className={classes.stepper}>
                  {steps.map((step) => (
                     <Step key={step}>
                        <StepLabel>{step}</StepLabel>
                     </Step>
                  ))}
               </Stepper>
               {activeStep === steps.length ? (
                  <Confirmation/>
               ) : (
                  checkoutToken && <Form/>
               )}
            </Paper>
         </main>
      </>
   );
};

export default Checkout;
