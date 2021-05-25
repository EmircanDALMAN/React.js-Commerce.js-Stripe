import React from "react";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import useStyles from "./styles";
import CartItem from "./CartItem/CartItem";
import { Link } from "react-router-dom";

const Cart = ({
  cart,
  handleEmptyCart,
  handleRemoveFromCart,
  handleUpdateCartQty,
}) => {
  const classes = useStyles();

  const EmptyCart = () => (
    <Typography variant={"subtitle1"}>
      Sepetiniz Oldukça Sessiz..
      <Link to={"/"} className={classes.link}>
        Alışverişe Devam Edebilirsiniz..
      </Link>
    </Typography>
  );

  const FilledCart = () => (
    <>
      <Grid container spacing={"3"}>
        {cart.line_items.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <CartItem
              item={item}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateCartQty={handleUpdateCartQty}
            />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <Typography variant={"h4"}>
          Toplam: {cart.subtotal.formatted_with_symbol}
        </Typography>
        <div>
          <Button
            className={classes.emptyButton}
            size={"large"}
            type={"button"}
            color={"secondary"}
            variant={"contained"}
            onClick={handleEmptyCart}
          >
            Boş Kart!
          </Button>
          <Button
            className={classes.checkoutButton}
            size={"large"}
            type={"button"}
            color={"primary"}
            variant={"contained"}
            component={Link} to={"/checkout"}
          >
            Ödeme
          </Button>
        </div>
      </div>
    </>
  );

  if (!cart.line_items) return "Loading...";

  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography variant={"h3"} className={classes.title} gutterBottom>
        Alışveriş Sepetiniz
      </Typography>
      {!cart.line_items.length ? EmptyCart() : FilledCart()}
    </Container>
  );
};

export default Cart;
