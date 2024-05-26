import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "https://www.course-api.com/react-useReducer-cart-project"

const initialState = {
    cartItems: [],
    amount: 0,
    total: 0,
    isLoading:true,
}

export const getCartItems = createAsyncThunk("cart/getItems", async () => {
    try {
        const response = await axios(url);
        return response.data;
    } catch (error) {
        
    }
})

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        removeItem: (state, action) => {
            const ItemId = action.payload;
            state.cartItems = state.cartItems.filter((item)=> item.id !== ItemId)
        },
        increase: (state, action) => {
            const ItemId = action.payload;
            const cartItem = state.cartItems.find((item) => item.id === ItemId);
            cartItem.amount = cartItem.amount + 1;
        },
        decrease: (state, action) => {
            const ItemId = action.payload;
            const cartItem = state.cartItems.find((item) => item.id === ItemId)
            cartItem.amount = cartItem.amount - 1;
        },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            state.cartItems.map((item) => {
                amount += item.amount;
                total += item.amount * item.price;
            })
            state.amount = amount;
            state.total = total.toFixed(2);
        }
    },

    extraReducers: (builder) => {
        builder.addCase(getCartItems.pending,(state) => {
            state.isLoading = true;
        }).addCase(getCartItems.fulfilled,(state,action) => {
            state.isLoading = false;
            state.cartItems = action.payload;
        }).addCase(getCartItems.rejected,(state) => {
            state.isLoading = false;
        })
    }
})
export const { clearCart,removeItem,decrease,increase,calculateTotals} = cartSlice.actions;

export default cartSlice.reducer;