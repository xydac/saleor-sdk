/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShippingMethod
// ====================================================

export interface ShippingMethod_price {
  __typename: "Money";
  /**
   * Currency code.
   */
  currency: string;
  /**
   * Amount of money.
   */
  amount: number;
}

export interface ShippingMethod {
  __typename: "ShippingMethod";
  /**
   * Unique ID of ShippingMethod available for Order.
   */
  id: string;
  /**
   * Shipping method name.
   */
  name: string;
  /**
   * The price of selected shipping method.
   */
  price: ShippingMethod_price;
}
