import React from 'react';
import { Typography, Button, Divider, colors } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);


const PaymentForm = ({ checkoutToken, shippingData, backStep, onCaptureCheckout, nextStep, timeOut }) => {

  const totalAmount = checkoutToken.subtotal.raw;
    console.log(totalAmount);
    console.log(checkoutToken);
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();
    if (!stripe || !elements)
      return;
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    if (error) {
      console.log(error);
    } else {
      const orderData = {

        line_items: checkoutToken.line_items,
        customers: { firstname: shippingData.firstname, lastname: shippingData.lastname, email: shippingData.email },
        shipping: {
          name: 'Primary',
          street: shippingData.address1,
          town_city: shippingData.city,
          country_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry,
          

          
        },
      
      }

      onCaptureCheckout(checkoutToken.id, orderData);
      timeOut();
      nextStep();
    }
  }
   const config = {
    public_key: process.env.REACT_APP_CHEC_PUBLIC_KEYS,
    tx_ref: Date.now(),
    amount: +totalAmount,
    currency: 'RWF',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email:  shippingData.email,
      phone_number: shippingData.phone_number,
      name: shippingData.lastname,
    },
    customizations: {
      title: 'Buyoz',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
   
  };
  handleSubmit();
  console.log(config);
  const fwConfig = {
    ...config,
    text: 'Pay Now',
    callback: (response) => {
       console.log(response);
      closePaymentModal() // this will close the modal programmatically
    },
    onClose: () => {},
  };

  return (
    <div className="App" >
     <Review checkoutToken={checkoutToken} />
      <Divider />
      <br />
      <div style={{ display: 'flex', justifyContent: "space-between"}}>
      <FlutterWaveButton {...fwConfig}/>
      <Button variant="outlined" onClick={backStep} >Back</Button>
         </div>
     
    </div>
  );
  
}

export default PaymentForm;
