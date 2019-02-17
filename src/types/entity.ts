export interface User {
  address: string;
  index: number;
  balance: number;
  username: string;
  hasLoggedIn: boolean;
}

export interface Transaction {
  dateString: string;
  amount: number;
  inbound: boolean;
}
