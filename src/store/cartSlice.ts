import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem, OptimizationSplit } from '../data/mockData';
import { optimizeCartApi } from '../services/mockApi';

interface CartState {
  items: CartItem[];
  isOptimizing: boolean;
  optimizedSplits: OptimizationSplit[] | null;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isOptimizing: false,
  optimizedSplits: null,
  error: null,
};

// Async thunk for calling the optimization API
export const optimizeCartAsync = createAsyncThunk(
  'cart/optimize',
  async (_, { getState }) => {
    // We can access the current state to get the cart items
    const state = getState() as { cart: CartState };
    return await optimizeCartApi(state.cart.items);
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((i) => i.product.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const existing = state.items.find((i) => i.product.id === action.payload);
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.product.id !== action.payload);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.optimizedSplits = null;
    },
    resetOptimization: (state) => {
      state.optimizedSplits = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(optimizeCartAsync.pending, (state) => {
        state.isOptimizing = true;
        state.error = null;
        state.optimizedSplits = null;
      })
      .addCase(optimizeCartAsync.fulfilled, (state, action) => {
        state.isOptimizing = false;
        state.optimizedSplits = action.payload;
      })
      .addCase(optimizeCartAsync.rejected, (state, action) => {
        state.isOptimizing = false;
        state.error = action.error.message || 'Failed to optimize cart';
      });
  },
});

export const { addItem, removeItem, clearCart, resetOptimization } = cartSlice.actions;
export default cartSlice.reducer;
