interface Cart {
    id: number
    name: string,
    price: number,
    quantity: number,
    inStock: boolean
}

let cart: Cart[] = [
 {id: 1, name: "Laptop", price: 1000, quantity: 1, inStock: true },
 {id: 2, name: "Mouse", price: 50, quantity: 2, inStock: true },
 {id: 3, name: "Keyboard", price: 100, quantity: 1, inStock: false },
 {id: 4, name: "Monitor", price: 300, quantity: 1, inStock: true }
];


let InStock = cart.filter((item) => item.inStock === true)
let sum = cart.reduce((sum, current) => sum + current.price, 0); 





if (InStock.length > 0) {
    let sumq = InStock.reduce((total, item) => total + item.price * item.quantity, 0);
}
