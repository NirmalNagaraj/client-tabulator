export interface MenuItem {
  id: string;
  itemName: string;
  itemCategory: string;
  itemCost: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderDetails {
  amount: number;
  mobile: string;
  email: string;
  tableNumber: string;
  items: {
    itemId: string;
    itemName: string;
    itemCost: number;
    quantity: number;
  }[];
}